import axios from 'axios';
import {IoClose, IoSearchSharp, IoSparklesOutline} from 'react-icons/io5';
import {useCallback, useEffect, useId, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {useNavigate} from 'react-router-dom';

import {IMAGE_W500_URL, POSTER_NO_IMAGE_URL, SEARCH_URL, TMDB_API_KEY} from '../../constants/api.js';
import {UseDebounce} from '../tools/UseDebounce.jsx';
import {useLanguage} from '../Language/LanguageContext.jsx';

import {SearchItem} from './SearchItem.jsx';

import '../../styles/Search.css';

export function SearchBar({autoFocus = false}) {
    const {language, t} = useLanguage();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [status, setStatus] = useState('idle');
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [panelStyle, setPanelStyle] = useState({});
    const rootRef = useRef(null);
    const inputRef = useRef(null);
    const listId = useId();
    const navigate = useNavigate();
    const debouncedQuery = UseDebounce(query.trim(), 300);

    const closeSearch = useCallback(() => {
        setIsOpen(false);
        setActiveIndex(-1);
    }, []);

    const clearQuery = () => {
        setQuery('');
        setResults([]);
        setStatus('idle');
        setActiveIndex(-1);
        inputRef.current?.focus();
    };

    const updatePanelPosition = useCallback(() => {
        const rect = rootRef.current?.getBoundingClientRect();
        if (!rect) return;
        setPanelStyle({top: `${rect.bottom + 8}px`, left: `${rect.left}px`, width: `${rect.width}px`});
    }, []);

    useEffect(() => {
        if (autoFocus) inputRef.current?.focus();
    }, [autoFocus]);

    useEffect(() => {
        const handlePointerDown = (event) => {
            const panel = document.getElementById(listId);
            if (!rootRef.current?.contains(event.target) && !panel?.contains(event.target)) closeSearch();
        };
        document.addEventListener('pointerdown', handlePointerDown);
        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, [closeSearch, listId]);

    useEffect(() => {
        if (!isOpen) return;
        updatePanelPosition();
        window.addEventListener('resize', updatePanelPosition);
        window.addEventListener('scroll', updatePanelPosition, true);
        return () => {
            window.removeEventListener('resize', updatePanelPosition);
            window.removeEventListener('scroll', updatePanelPosition, true);
        };
    }, [isOpen, updatePanelPosition]);

    useEffect(() => {
        if (debouncedQuery.length < 2) {
            setResults([]);
            setStatus('idle');
            return;
        }

        const controller = new AbortController();
        setStatus('loading');
        setActiveIndex(-1);

        axios.get(`${SEARCH_URL}&language=${language}&query=${encodeURIComponent(debouncedQuery)}&api_key=${TMDB_API_KEY}`, {signal: controller.signal})
            .then(({data}) => {
                const items = (data.results || [])
                    .filter((item) => ['movie', 'tv'].includes(item.media_type))
                    .slice(0, 8)
                    .map((item) => ({
                        id: item.id,
                        title: item.title || item.name,
                        type: item.media_type,
                        poster: item.poster_path ? `${IMAGE_W500_URL}${item.poster_path}` : POSTER_NO_IMAGE_URL,
                        year: (item.release_date || item.first_air_date || '').slice(0, 4),
                        rating: item.vote_average,
                    }));
                setResults(items);
                setStatus(items.length ? 'success' : 'empty');
            })
            .catch((error) => {
                if (!axios.isCancel(error)) {
                    setResults([]);
                    setStatus('error');
                }
            });

        return () => controller.abort();
    }, [debouncedQuery, language]);

    const selectResult = (item) => {
        navigate(`/${item.type}/${item.id}`);
        closeSearch();
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            closeSearch();
            inputRef.current?.blur();
            return;
        }
        if (!results.length) return;
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActiveIndex((current) => (current + 1) % results.length);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActiveIndex((current) => current <= 0 ? results.length - 1 : current - 1);
        } else if (event.key === 'Enter' && activeIndex >= 0) {
            event.preventDefault();
            selectResult(results[activeIndex]);
        }
    };

    const showPanel = isOpen && query.trim().length >= 2;
    const panel = showPanel ? createPortal(
        <section id={listId} className="search-results-list" style={panelStyle} aria-live="polite">
            {status === 'loading' && <div className="search-state"><span className="search-spinner" />{t("searching")}</div>}
            {status === 'empty' && <div className="search-state"><IoSparklesOutline /><span>{t("noResultsFor")} <strong>“{query}”</strong></span></div>}
            {status === 'error' && <div className="search-state search-state-error">{t("searchError")}</div>}
            {status === 'success' && <>
                <div className="search-results-heading"><span>{t("searchResults")}</span><span>{results.length} {t("results")}</span></div>
                <ul role="listbox">
                    {results.map((item, index) => <li key={`${item.type}-${item.id}`} role="option" aria-selected={activeIndex === index}>
                        <SearchItem {...item} isActive={activeIndex === index} onSelect={closeSearch} onMouseEnter={() => setActiveIndex(index)} />
                    </li>)}
                </ul>
                <p className="search-keyboard-hint"><kbd>↑</kbd><kbd>↓</kbd> {t("navigateHint")}</p>
            </>}
        </section>,
        document.body
    ) : null;

    return <>
        <div className="search-shell" ref={rootRef}>
            <IoSearchSharp className="search-leading-icon" aria-hidden="true" />
            <input
                ref={inputRef}
                type="search"
                placeholder={t("searchPlaceholder")}
                value={query}
                onChange={(event) => { setQuery(event.target.value); setIsOpen(true); }}
                onFocus={() => { setIsOpen(true); updatePanelPosition(); }}
                onKeyDown={handleKeyDown}
                className="search-input"
                aria-label="Buscar películas y series"
                aria-expanded={showPanel}
                aria-controls={listId}
                aria-autocomplete="list"
                role="combobox"
            />
            {query && <button className="search-clear" type="button" onClick={clearQuery} aria-label={t("clearSearch")}><IoClose /></button>}
        </div>
        {panel}
    </>;
}

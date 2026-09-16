import {useCallback, useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import axios from 'axios';
import {IoCloseCircle, IoSearchSharp, IoSparklesOutline} from 'react-icons/io5';

import {IMAGE_W500_URL, POSTER_NO_IMAGE_URL, SEARCH_URL, TMDB_API_KEY} from '../../constants/api.js';
import {UseDebounce} from '../tools/UseDebounce.jsx';
import {SearchItem} from './SearchItem.jsx';
import '../../styles/Search.css';

export function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [status, setStatus] = useState('idle');
    const [isFocused, setIsFocused] = useState(false);
    const debouncedQuery = UseDebounce(query.trim(), 350);

    const closeSearch = useCallback(() => { setQuery(''); setResults([]); setStatus('idle'); setIsFocused(false); }, []);
    const clearQuery = () => { setQuery(''); setResults([]); setStatus('idle'); };

    useEffect(() => {
        if (debouncedQuery.length < 2) { setResults([]); setStatus('idle'); return; }
        const controller = new AbortController();
        setStatus('loading');
        axios.get(`${SEARCH_URL}&query=${encodeURIComponent(debouncedQuery)}&api_key=${TMDB_API_KEY}`, {signal: controller.signal})
            .then(({data}) => {
                const items = (data.results || []).filter((item) => ['movie', 'tv'].includes(item.media_type)).slice(0, 8).map((item) => ({
                    id: item.id, title: item.title || item.name, type: item.media_type,
                    poster: item.poster_path ? `${IMAGE_W500_URL}${item.poster_path}` : POSTER_NO_IMAGE_URL,
                    year: (item.release_date || item.first_air_date || '').slice(0, 4), rating: item.vote_average,
                }));
                setResults(items); setStatus(items.length ? 'success' : 'empty');
            })
            .catch((error) => { if (!axios.isCancel(error)) { setResults([]); setStatus('error'); } });
        return () => controller.abort();
    }, [debouncedQuery]);

    const openPanel = isFocused && (query.trim().length > 0 || status === 'loading');
    const panel = openPanel ? (() => {
        const rect = document.getElementById('search-bar-anchor')?.getBoundingClientRect();
        const style = rect ? {top: `${rect.bottom + 10}px`, left: `${rect.left}px`, width: `${rect.width}px`} : undefined;
        return createPortal(<section className="search-results-list" style={style} aria-live="polite">
            {status === 'loading' && <div className="search-state"><span className="search-spinner" />Buscando en el catálogo…</div>}
            {status === 'empty' && <div className="search-state"><IoSparklesOutline /><span>No encontramos títulos para <strong>“{query}”</strong>.</span></div>}
            {status === 'error' && <div className="search-state search-state-error">No se pudo realizar la búsqueda. Inténtalo de nuevo.</div>}
            {status === 'success' && <><div className="search-results-heading"><span>Resultados</span><span>{results.length} títulos</span></div><ul>{results.map((item) => <li key={`${item.type}-${item.id}`}><SearchItem {...item} onSelect={closeSearch} /></li>)}</ul></>}
        </section>, document.body);
    })() : null;

    return <><div className="search-shell" id="search-bar-anchor">
        <IoSearchSharp className="search-leading-icon" aria-hidden="true" />
        <input type="search" placeholder="Busca una película o serie" value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setTimeout(() => setIsFocused(false), 150)} onKeyDown={(event) => event.key === 'Escape' && closeSearch()} className="search-input" aria-label="Buscar películas y series" />
        {query && <button className="search-clear" type="button" onMouseDown={(event) => event.preventDefault()} onClick={clearQuery} aria-label="Borrar búsqueda"><IoCloseCircle /></button>}
    </div>{panel}</>;
}

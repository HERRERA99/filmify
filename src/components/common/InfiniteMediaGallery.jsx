import {useCallback, useEffect, useRef, useState} from "react";
import {IoChevronBack, IoChevronDown, IoChevronForward, IoOptionsOutline, IoRefreshOutline} from "react-icons/io5";

import {API_BASE_URL, TMDB_API_KEY} from "../../constants/api.js";
import {useLanguage} from "../Language/LanguageContext.jsx";

import {MediaCard} from "./MediaCard.jsx";

import "../../styles/MediaGrid.css"

const FIRST_PAGE = 1;

function getTmdbRequestOptions(token) {
    if (/^[a-f\d]{32}$/i.test(token)) return {query: `&api_key=${token}`, headers: {accept: "application/json"}};
    if (token.startsWith("eyJ")) return {query: "", headers: {accept: "application/json", Authorization: `Bearer ${token}`}};
    return null;
}

export function InfiniteMediaGallery({title, apiPath, mediaType, filter = false}) {
    const {language, t} = useLanguage();
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(FIRST_PAGE);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortOption, setSortOption] = useState("popularity.desc");
    const containerRef = useRef(null);
    const activeRequest = useRef(null);
    const loadingRef = useRef(false);

    const fetchData = useCallback(async (pageToFetch, replace = false) => {
        const token = TMDB_API_KEY?.trim() || "";
        const auth = getTmdbRequestOptions(token);

        if (!auth) {
            setError(t("credentialInvalid"));
            return;
        }

        if (loadingRef.current && !replace) return;
        if (replace) activeRequest.current?.abort();

        const controller = new AbortController();
        activeRequest.current = controller;
        loadingRef.current = true;
        setLoading(true);
        setError(null);

        const normalizedPath = apiPath.startsWith("/") ? apiPath : `/${apiPath}`;
        const normalizedBase = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
        const url = `${normalizedBase}${normalizedPath}?language=${language}&page=${pageToFetch}&sort_by=${sortOption}&include_adult=false${auth.query}`;

        try {
            const response = await fetch(url, {headers: auth.headers, signal: controller.signal});
            if (!response.ok) {
                if (response.status === 401) throw new Error(t("credentialRejected"));
                throw new Error(`${t("catalogLoadError")} (${response.status})`);
            }

            const data = await response.json();
            const results = Array.isArray(data.results) ? data.results : [];

            setItems((currentItems) => {
                if (replace) return results;
                const currentIds = new Set(currentItems.map((item) => item.id));
                return [...currentItems, ...results.filter((item) => !currentIds.has(item.id))];
            });
            setTotalPages(Math.min(data.total_pages || 1, 500));
            setPage(pageToFetch);
        } catch (requestError) {
            if (requestError.name !== "AbortError") setError(requestError.message || t("catalogLoadError"));
        } finally {
            if (activeRequest.current === controller) {
                activeRequest.current = null;
                loadingRef.current = false;
                setLoading(false);
            }
        }
    }, [apiPath, language, sortOption, t]);

    useEffect(() => {
        setItems([]);
        setPage(FIRST_PAGE);
        setTotalPages(1);
        setError(null);
        fetchData(FIRST_PAGE, true);

        return () => activeRequest.current?.abort();
    }, [fetchData]);

    const retry = () => {
        setItems([]);
        setPage(FIRST_PAGE);
        setTotalPages(1);
        fetchData(FIRST_PAGE, true);
    };

    const goToPage = (nextPage) => {
        if (nextPage === page || nextPage < 1 || nextPage > totalPages || loadingRef.current) return;
        fetchData(nextPage, true);
        containerRef.current?.scrollIntoView({behavior: "smooth", block: "start"});
    };

    const paginationItems = [];
    const startPage = Math.max(1, Math.min(page - 2, totalPages - 4));
    const endPage = Math.min(totalPages, Math.max(5, page + 2));
    for (let pageNumber = startPage; pageNumber <= endPage; pageNumber += 1) paginationItems.push(pageNumber);

    return (
        <div className="media-container" ref={containerRef}>
            <div className="media-header">
                <div className="media-heading-copy">
                    <span className="media-kicker">{t("catalog")}</span>
                    <h1 className="media-title">{title}</h1>
                    <p className="media-subtitle">{t("catalogSubtitle")}</p>
                </div>
                {filter && (
                    <div className="sort-dropdown">
                        <IoOptionsOutline aria-hidden="true" />
                        <label htmlFor={`sort-${mediaType}`} className="sort-label">{t("sort")}</label>
                        <select id={`sort-${mediaType}`} value={sortOption} onChange={(event) => setSortOption(event.target.value)} className="sort-select">
                            <option value="popularity.desc">{t("popular")}</option>
                            <option value="popularity.asc">{t("lessPopular")}</option>
                            <option value={mediaType === "movie" ? "primary_release_date.desc" : "first_air_date.desc"}>{t("newest")}</option>
                            <option value={mediaType === "movie" ? "primary_release_date.asc" : "first_air_date.asc"}>{t("oldest")}</option>
                            <option value="vote_average.desc">{t("topRated")}</option>
                            <option value="vote_count.desc">{t("mostVoted")}</option>
                            <option value={mediaType === "movie" ? "original_title.asc" : "original_name.asc"}>{t("titleAZ")}</option>
                        </select>
                        <IoChevronDown className="sort-chevron" aria-hidden="true" />
                    </div>
                )}
            </div>

            {error && (
                <div className="media-error" role="alert">
                    <div>
                        <p className="media-error-title">{t("couldNotLoad")} {mediaType === "movie" ? t("movies").toLowerCase() : t("series").toLowerCase()}</p>
                        <p>{error}</p>
                    </div>
                    <button type="button" className="media-retry" onClick={retry}><IoRefreshOutline />{t("retry")}</button>
                </div>
            )}

            <div className={`media-grid ${loading && items.length ? "is-loading" : ""}`} aria-busy={loading}>
                {items.map((item) => (
                    <MediaCard key={item.id} posterUrl={item.poster_path} title={item.title || item.name} mediaId={item.id} mediaType={mediaType} />
                ))}
            </div>

            {loading && !items.length && <div className="media-loading"><div className="media-loading-content"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25" fill="none" /><path fill="currentColor" opacity=".75" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" /></svg><span>{mediaType === "movie" ? t("loadingMovies") : t("loadingSeries")}</span></div></div>}

            {totalPages > 1 && !error && (
                <nav className="media-pagination" aria-label="Paginación del catálogo">
                    <button type="button" className="pagination-direction" onClick={() => goToPage(page - 1)} disabled={page === 1 || loading} aria-label={t("previous")}><IoChevronBack /><span>{t("previous")}</span></button>
                    <div className="pagination-pages">
                        {startPage > 1 && <><button type="button" onClick={() => goToPage(1)}>1</button>{startPage > 2 && <span>…</span>}</>}
                        {paginationItems.map((pageNumber) => <button type="button" key={pageNumber} className={pageNumber === page ? "active" : ""} onClick={() => goToPage(pageNumber)} aria-current={pageNumber === page ? "page" : undefined}>{pageNumber}</button>)}
                        {endPage < totalPages && <>{endPage < totalPages - 1 && <span>…</span>}<button type="button" onClick={() => goToPage(totalPages)}>{totalPages}</button></>}
                    </div>
                    <button type="button" className="pagination-direction" onClick={() => goToPage(page + 1)} disabled={page === totalPages || loading} aria-label={t("next")}><span>{t("next")}</span><IoChevronForward /></button>
                </nav>
            )}
            {items.length === 0 && !loading && !error && <div className="media-empty"><p>{t("empty")}</p></div>}
        </div>
    );
}

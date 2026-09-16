import {useCallback, useEffect, useRef, useState} from "react";
import {IoChevronDown, IoOptionsOutline, IoRefreshOutline} from "react-icons/io5";

import {API_BASE_URL, TMDB_API_KEY} from "../../constants/api.js";

import {MediaCard} from "./MediaCard.jsx";

import "../../styles/MediaGrid.css"

const FIRST_PAGE = 1;

function getTmdbRequestOptions(token) {
    if (/^[a-f\d]{32}$/i.test(token)) return {query: `&api_key=${token}`, headers: {accept: "application/json"}};
    if (token.startsWith("eyJ")) return {query: "", headers: {accept: "application/json", Authorization: `Bearer ${token}`}};
    return null;
}

export function InfiniteMediaGallery({title, apiPath, mediaType, filter = false}) {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(FIRST_PAGE);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortOption, setSortOption] = useState("popularity.desc");
    const observerTarget = useRef(null);
    const activeRequest = useRef(null);
    const loadingRef = useRef(false);

    const fetchData = useCallback(async (pageToFetch, replace = false) => {
        const token = TMDB_API_KEY?.trim() || "";
        const auth = getTmdbRequestOptions(token);

        if (!auth) {
            setError("La credencial de TMDB no tiene un formato válido. Añade una API Key v3 o un Read Access Token v4 en VITE_TMDB_API_KEY.");
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
        const url = `${normalizedBase}${normalizedPath}?language=es-ES&page=${pageToFetch}&sort_by=${sortOption}&include_adult=false${auth.query}`;

        try {
            const response = await fetch(url, {headers: auth.headers, signal: controller.signal});
            if (!response.ok) {
                if (response.status === 401) throw new Error("TMDB ha rechazado la credencial configurada (error 401). Revisa VITE_TMDB_API_KEY.");
                throw new Error(`TMDB no ha podido responder (error ${response.status}).`);
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
            if (requestError.name !== "AbortError") setError(requestError.message || "No se ha podido cargar el catálogo.");
        } finally {
            if (activeRequest.current === controller) {
                activeRequest.current = null;
                loadingRef.current = false;
                setLoading(false);
            }
        }
    }, [apiPath, sortOption]);

    useEffect(() => {
        setItems([]);
        setPage(FIRST_PAGE);
        setTotalPages(1);
        setError(null);
        fetchData(FIRST_PAGE, true);

        return () => activeRequest.current?.abort();
    }, [fetchData]);

    useEffect(() => {
        const target = observerTarget.current;
        if (!target || error) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !loadingRef.current && page < totalPages) fetchData(page + 1);
        }, {rootMargin: "240px 0px", threshold: 0.1});

        observer.observe(target);
        return () => observer.disconnect();
    }, [error, fetchData, page, totalPages]);

    const retry = () => {
        setItems([]);
        setPage(FIRST_PAGE);
        setTotalPages(1);
        fetchData(FIRST_PAGE, true);
    };

    return (
        <div className="media-container">
            <div className="media-header">
                <div className="media-heading-copy">
                    <span className="media-kicker">Catálogo Filmify</span>
                    <h1 className="media-title">{title}</h1>
                    <p className="media-subtitle">Explora una selección actualizada y encuentra tu próxima historia.</p>
                </div>
                {filter && (
                    <div className="sort-dropdown">
                        <IoOptionsOutline aria-hidden="true" />
                        <label htmlFor={`sort-${mediaType}`} className="sort-label">Ordenar</label>
                        <select id={`sort-${mediaType}`} value={sortOption} onChange={(event) => setSortOption(event.target.value)} className="sort-select">
                            <option value="popularity.desc">Más populares</option>
                            <option value="popularity.asc">Menos populares</option>
                            <option value={mediaType === "movie" ? "primary_release_date.desc" : "first_air_date.desc"}>Más recientes</option>
                            <option value={mediaType === "movie" ? "primary_release_date.asc" : "first_air_date.asc"}>Más antiguas</option>
                            <option value="vote_average.desc">Mejor valoradas</option>
                            <option value="vote_count.desc">Más votadas</option>
                            <option value={mediaType === "movie" ? "original_title.asc" : "original_name.asc"}>Título (A–Z)</option>
                        </select>
                        <IoChevronDown className="sort-chevron" aria-hidden="true" />
                    </div>
                )}
            </div>

            {error && (
                <div className="media-error" role="alert">
                    <div>
                        <p className="media-error-title">No hemos podido cargar {mediaType === "movie" ? "las películas" : "las series"}</p>
                        <p>{error}</p>
                    </div>
                    <button type="button" className="media-retry" onClick={retry}><IoRefreshOutline />Reintentar</button>
                </div>
            )}

            <div className="media-grid">
                {items.map((item) => (
                    <MediaCard key={item.id} posterUrl={item.poster_path} title={item.title || item.name} mediaId={item.id} mediaType={mediaType} />
                ))}
            </div>

            {!error && (loading || page < totalPages) && (
                <div ref={observerTarget} className="media-loading">
                    {loading ? (
                        <div className="media-loading-content">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25" fill="none" />
                                <path fill="currentColor" opacity=".75" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                            </svg>
                            <span>Cargando más {mediaType === "movie" ? "películas" : "series"}…</span>
                        </div>
                    ) : <div>Continúa para descubrir más</div>}
                </div>
            )}

            {page >= totalPages && totalPages > 1 && !loading && !error && <div className="media-end"><p>Has llegado al final de la galería</p></div>}
            {items.length === 0 && !loading && !error && <div className="media-empty"><p>No se han encontrado resultados.</p></div>}
        </div>
    );
}

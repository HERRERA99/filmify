import {useCallback, useEffect, useRef, useState} from "react";

import {API_BASE_URL, TMDB_API_KEY} from "../../constants/api.js";

import {MediaCard} from "./MediaCard.jsx";
import "../../styles/MediaGrid.css"

export function InfiniteMediaGallery({title, apiPath, mediaType, filter = false}) {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortOption, setSortOption] = useState("popularity.desc");

    // Referencia para el elemento "sentinela" que dispara la carga
    const observerTarget = useRef(null);

    // Si la ruta o el título cambian, reseteamos la lista y la paginación.
    useEffect(() => {
        setItems([]);
        setPage(1);
        setTotalPages(1);
        fetchData(1)
        setError(null);
        // La carga se disparará a través del fetchData en el siguiente useEffect.
    }, [apiPath, title, sortOption]);

    // Función de carga de datos (usa useCallback para ser estable)
    const fetchData = useCallback(async (pageToFetch) => {
        // Obtenemos el token/clave V3 y eliminamos cualquier espacio en blanco accidental
        const token = TMDB_API_KEY.trim();

        // Validación de la clave API V3
        if (!token || token === "TU_CLAVE_API_V3_AQUI") {
            setError("Error de Autenticación: Debes reemplazar 'TU_CLAVE_API_V3_AQUI' con tu clave API V3 de TMDB.");
            return;
        }

        if (loading || pageToFetch > totalPages) return;

        setLoading(true);
        setError(null);

        // Normalización de la URL
        const normalizedPath = apiPath.startsWith('/') ? apiPath : `/${apiPath}`;
        const normalizedBase = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

        // ** CLAVE V3: Construcción de la URL con api_key como parámetro **
        const url = `${normalizedBase}${normalizedPath}?api_key=${token}&language=es-ES&page=${pageToFetch}&sort_by=${sortOption}`;

        console.log(`Cargando página: ${pageToFetch} de ${totalPages}. URL: ${url}`);

        // Manejo de backoff para reintentar en caso de fallo (recomendado para APIs)
        const maxRetries = 3;
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                // ** IMPORTANTE: No se pasa el header Authorization para V3 **
                const response = await fetch(url);

                // Leemos el cuerpo como texto para manejar mejor errores de JSON
                const responseText = await response.text();

                if (!response.ok) {
                    let statusText = `Error HTTP ${response.status}`;

                    // Si hay un error, adjuntamos la respuesta de TMDB
                    if (responseText.length > 0) {
                        statusText += `. Respuesta: ${responseText.substring(0, 150)}...`;
                    }

                    if (response.status === 401) {
                        statusText = `Clave API V3 inválida (Error 401). Verifica tu clave. ${statusText}`;
                    }

                    throw new Error(statusText);
                }

                let data;
                try {
                    // Intentamos parsear el JSON
                    data = JSON.parse(responseText);
                    // eslint-disable-next-line no-unused-vars
                } catch (jsonErr) {
                    // Captura el 'Unexpected end of JSON input'
                    throw new SyntaxError(`Respuesta inválida del servidor (JSON error). Texto recibido: ${responseText.substring(0, 150)}...`);
                }


                // Añadir los nuevos resultados a los existentes
                setItems(prevItems => {
                    // Prevenir duplicados si el scroll fue muy rápido
                    const newUniqueResults = data.results.filter(
                        newItem => !prevItems.some(existingItem => existingItem.id === newItem.id)
                    );
                    return [...prevItems, ...newUniqueResults];
                });

                setTotalPages(data.total_pages);
                setPage(pageToFetch); // Solo actualizamos la página si la carga es exitosa
                setLoading(false);
                return; // Éxito, salimos del bucle de reintentos
            } catch (err) {
                console.error(`Error al cargar datos (Intento ${attempt + 1}):`, err);
                if (attempt < maxRetries - 1) {
                    // Espera exponencial antes de reintentar
                    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
                } else {
                    // Si falla el último intento, mostramos el error
                    setError(`Error al cargar datos: ${err.message}.`);
                    setLoading(false);
                }
            }
        }
    }, [apiPath, loading, totalPages, sortOption]); // Dependencias: path, estado de carga y totalPages


    // Efecto para la inicialización y el observador de intersección (Infinite Scroll)
    useEffect(() => {
        // Carga inicial
        if (items.length === 0 && page === 1 && !loading && !error) {
            fetchData(1);
        }

        // Configuración de IntersectionObserver
        const observer = new IntersectionObserver((entries) => {
            // Solo cargamos si el sentinela está visible, no estamos cargando y aún hay páginas
            if (entries[0].isIntersecting && !loading && page < totalPages) {
                console.log("Sentinel intersectado. Cargando siguiente página...");
                fetchData(page + 1);
            }
        }, {
            // RootMargin puede ayudar a cargar antes de que el usuario llegue al final
            rootMargin: '100px 0px',
            threshold: 0.1
        });

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        // Limpieza: importante para evitar fugas de memoria
        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [fetchData, loading, page, totalPages, items.length, error, sortOption]); // Incluimos 'error' para no intentar si hay un fallo de clave.

    // 🔹 Función para cambiar el orden
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    // Contenido del componente
    return (
        <div className="media-container">
            <div className="media-header">
                <h1 className="media-title">{title}</h1>
                {filter && (
                    <div className="sort-dropdown">
                        <label htmlFor="sort" className="sort-label">Ordenar por:</label>
                        <select
                            id="sort"
                            value={sortOption}
                            onChange={handleSortChange}
                            className="sort-select"
                        >
                            <option value="original_title.asc">Original title (A–Z)</option>
                            <option value="original_title.desc">Original title (Z–A)</option>
                            <option value="popularity.asc">Popularity (ascending)</option>
                            <option value="popularity.desc">Popularity (descending)</option>
                            <option value="revenue.asc">Revenue (ascending)</option>
                            <option value="revenue.desc">Revenue (descending)</option>
                            <option value="primary_release_date.asc">Release date (oldest first)</option>
                            <option value="primary_release_date.desc">Release date (newest first)</option>
                            <option value="vote_average.asc">Rating (ascending)</option>
                            <option value="vote_average.desc">Rating (descending)</option>
                            <option value="vote_count.asc">Vote count (ascending)</option>
                            <option value="vote_count.desc">Vote count (descending)</option>
                        </select>
                    </div>
                )}
            </div>

            {error && (
                <div className="media-error">
                    <p className="font-bold">Error de Carga (401 No Autorizado):</p>
                    <p>{error}</p>
                    <p className="mt-2 text-sm">
                        Por favor, verifica la constante TMDB_API_KEY en el código y asegúrate de que sea tu clave
                        válida de la API de TMDB.
                    </p>
                </div>
            )}

            <div className="media-grid">
                {items.map(item => (
                    <MediaCard
                        key={item.id}
                        posterUrl={item.poster_path}
                        title={item.title || item.name}
                        mediaId={item.id}
                        mediaType={mediaType}
                    />
                ))}
            </div>

            {/* Elemento Sentinel */}
            {(!error && loading || page < totalPages) && (
                <div ref={observerTarget} className="media-loading">
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0..."/>
                            </svg>
                            <span>Cargando más {mediaType === 'movie' ? 'películas' : 'series'}...</span>
                        </div>
                    ) : (
                        <div>Desliza hacia abajo para continuar.</div>
                    )}
                </div>
            )}

            {page >= totalPages && totalPages > 1 && !loading && !error && (
                <div className="media-end">
                    <p className="text-xl font-medium">¡Has llegado al final de la galería!</p>
                </div>
            )}

            {items.length === 0 && !loading && !error && (
                <div className="media-empty">
                    <p className="text-xl font-medium">No se han encontrado resultados.</p>
                </div>
            )}
        </div>
    );

}
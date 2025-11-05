import {useCallback, useEffect, useState} from "react";
import axios from "axios";

import {IMAGE_W500_URL, POSTER_NO_IMAGE_URL, SEARCH_URL, TMDB_API_KEY} from "../constants/api.js";

import {useDebounce} from "./UseDebounce.jsx";
import {SearchItem} from "./SearchItem.jsx";
import "../styles/Search.css"

export function SearchBar() {
    const [query, setQuery] = useState("");
    const debounceQuery = useDebounce(query, 500);
    const [result, setResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Estado para la carga
    const [isFocused, setIsFocused] = useState(false);

    const handleItemSelect = useCallback(() => {
        setQuery("");
        setResult([]);
        setIsFocused(false);
    }, []);

    const handleBlur = () => {
        // Usamos setTimeout para permitir que el click en el SearchItem se ejecute primero
        setTimeout(() => {
            setIsFocused(false);
        }, 150);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setQuery("");
            setResult([]);
            setIsFocused(false);
        }
    };

    useEffect(() => {
        if (!debounceQuery) {
            setResult([]);
            return;
        }

        setIsLoading(true); // Inicia la carga
        const fullUrl = `${SEARCH_URL}&query=${debounceQuery}&api_key=${TMDB_API_KEY}`;

        axios.get(fullUrl).then(
            res => {
                const rawResults = res.data.results;

                const finalResults = rawResults
                    .filter(item => (item.media_type === "tv" || item.media_type === "movie") && (item.poster_path !== null))
                    .map(item => ({
                        id: item.id,
                        name: item.title || item.name,
                        media_type: item.media_type,
                        poster_path: item.poster_path ? IMAGE_W500_URL + item.poster_path : POSTER_NO_IMAGE_URL
                    }));

                setResult(finalResults);
                setIsLoading(false); // Finaliza la carga
            }).catch(
            err => {
                console.error("Error en la búsqueda:", err);
                setIsLoading(false); // Finaliza la carga en caso de error
                setResult([]);
            }
        );
    }, [debounceQuery]);

    return (
        <div className="search-bar-container">
            <input
                type="text"
                placeholder="Search series or movies..."
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                value={query}
                className="search-input"
            />

            {/* Mostrar lista de resultados o mensajes de estado */}
            {(isFocused && (isLoading || result.length > 0)) && (
                <ul className="search-results-list">
                    {isLoading && <p>Cargando resultados...</p>}

                    {!isLoading && result.length > 0 && result.map((item) => (
                        <li key={item.id} className="search-list-item">
                            <SearchItem
                                id={item.id}
                                title={item.name}
                                poster_path={item.poster_path}
                                type={item.media_type}
                                onSelect={handleItemSelect}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
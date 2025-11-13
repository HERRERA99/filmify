import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";

import {
    IMAGE_W500_URL,
    POSTER_NO_IMAGE_URL,
    SEARCH_URL,
    TMDB_API_KEY
} from "../../constants/api.js";
import { UseDebounce } from "../tools/UseDebounce.jsx";

import { SearchItem } from "./SearchItem.jsx";
import "../../styles/Search.css";

export function SearchBar() {
    const [query, setQuery] = useState("");
    const debounceQuery = UseDebounce(query, 500);
    const [result, setResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleItemSelect = useCallback(() => {
        setQuery("");
        setResult([]);
        setIsFocused(false);
    }, []);

    const handleBlur = () => {
        setTimeout(() => setIsFocused(false), 150);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
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

        setIsLoading(true);
        const fullUrl = `${SEARCH_URL}&query=${debounceQuery}&api_key=${TMDB_API_KEY}`;

        axios
            .get(fullUrl)
            .then((res) => {
                const finalResults = res.data.results
                    .filter(
                        (item) =>
                            (item.media_type === "tv" || item.media_type === "movie") &&
                            item.poster_path !== null
                    )
                    .map((item) => ({
                        id: item.id,
                        name: item.title || item.name,
                        media_type: item.media_type,
                        poster_path: item.poster_path
                            ? IMAGE_W500_URL + item.poster_path
                            : POSTER_NO_IMAGE_URL
                    }));

                setResult(finalResults);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Error en la búsqueda:", err);
                setIsLoading(false);
                setResult([]);
            });
    }, [debounceQuery]);

    useEffect(() => {
        if (isFocused) {
            document.body.classList.add("no-horizontal-scroll");
        } else {
            document.body.classList.remove("no-horizontal-scroll");
        }
        return () => {
            document.body.classList.remove("no-horizontal-scroll");
        };
    }, [isFocused]);

    // Render principal del input
    const searchInput = (
        <div className="search-bar-container" id="search-bar-anchor">
            <input
                type="text"
                placeholder="Search series or movies..."
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                value={query}
                className="search-input"
            />
        </div>
    );

    // Render de resultados, pero fuera del header
    const searchResults =
        isFocused && (isLoading || result.length > 0)
            ? (() => {
                const anchor = document.getElementById("search-bar-anchor");
                const rect = anchor ? anchor.getBoundingClientRect() : null;

                const styles = rect
                    ? {
                        position: "fixed",
                        top: rect.bottom + 4 + "px", // justo debajo del input
                        left: rect.left + "px",
                        width: rect.width + "px",
                    }
                    : {};

                return createPortal(
                    <ul className="search-results-list" style={styles}>
                        {isLoading && <p>Cargando resultados...</p>}

                        {!isLoading &&
                            result.map((item) => (
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
                    </ul>,
                    document.body
                );
            })()
            : null;

    return (
        <>
            {searchInput}
            {searchResults}
        </>
    );
}

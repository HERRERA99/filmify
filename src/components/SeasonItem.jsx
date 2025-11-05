import {useEffect, useState} from "react";

import {IMAGE_W500_URL} from "../constants/api.js";

import {EpisodeItem} from "./EpisodeItem.jsx";
import "../styles/SeasonsAndItems.css"

export function SeasonItem({urlSeason}) {
    // Estado para manejar si los episodios están visibles
    const [isVisible, setIsVisible] = useState(false);
    // Estado para guardar la season
    const [season, setSeason] = useState(null);
    // Estado para guardar la lista de episodios cargados
    const [episodes, setEpisodes] = useState([]);
    // Estado para manejar el estado de carga
    const [isLoading, setIsLoading] = useState(false);

    const fetchEpisodes = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(urlSeason);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setSeason(data);
            setEpisodes(data.episodes);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching movie:", error);
        }
    }

    useEffect(() => {
        fetchEpisodes();
    }, []);

    const toggleEpisodes = async () => {
        // Si ya están visibles, solo ocúltalos
        if (isVisible) {
            setIsVisible(false);
            return;
        }

        // Muestra la lista una vez cargada (o si ya estaba cargada)
        setIsVisible(true);
    };

    if (!season) {
        return <div className="season-item-main"><p>Cargando información de la temporada...</p></div>;
    }

    return (
        <>
            <div className="season-item-main">
                {/* Contenedor principal de la temporada, al hacer click se expanden/contraen los episodios */}
                <div className="season-header" onClick={toggleEpisodes} style={{ cursor: 'pointer' }}>
                    <div className="season-poster-wrapper">
                        <img src={`${IMAGE_W500_URL}${season.poster_path}`} alt={`Poster de ${season.name}`} className="season-poster" />
                    </div>
                    <div className="season-details">
                        <h3 className="season-title">
                            {season.name} ({episodes.length} episodios)
                            <span className="toggle-icon">{isVisible ? ' ▼' : ' ►'}</span>
                        </h3>
                        <p className="season-info">
                            {season.air_date}
                        </p>
                        <p className="season-overview">
                            {season.overview || 'Sin descripción disponible.'}
                        </p>
                    </div>
                </div>

                {/* Lista de episodios - solo visible si isVisible es true */}
                {isVisible && (
                    <div className="episode-list-container">
                        {isLoading && <p className="loading-message">Cargando episodios...</p>}

                        {!isLoading && episodes.length > 0 && (
                            <ul className="episode-list">
                                {/* Renderizar cada episodio usando EpisodeItem */}
                                {episodes.map(episode => (
                                    <li key={episode.id} className="episode-list-item">
                                        <EpisodeItem episode={episode} />
                                    </li>
                                ))}
                            </ul>
                        )}

                        {!isLoading && episodes.length === 0 && (
                            <p className="no-episodes-message">No hay episodios disponibles para esta temporada.</p>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}
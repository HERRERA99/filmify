import {useEffect, useState} from "react";

// eslint-disable-next-line import/order
import {IMAGE_W500_URL} from "../../constants/api";

import "../../styles/SeasonsAndItems.css";
import '../../styles/StreamingContainer.css';
import { FaLock } from "react-icons/fa";
import {useNavigate} from "react-router-dom";

export function SeasonItem({urlSeason, serieId, seasonNumber, user}) {
    const isUserLoggedIn = !!user;

    const userPath = isUserLoggedIn ? "/profile" : "/auth";
    const navigate = useNavigate();

    const [episodes, setEpisodes] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [playingEpisode, setPlayingEpisode] = useState(null);

    useEffect(() => {
        fetch(urlSeason)
            .then(res => res.json())
            .then(data => setEpisodes(data.episodes || []))
            .catch(err => console.error(err));
    }, [urlSeason]);

    function handleLoginClick() {
        navigate(userPath);
    }

    return (
        <div className="season-item-main">
            <div className="season-header" onClick={() => setIsOpen(!isOpen)}>
                <div className="season-details">
                    <h3 className="season-title">Temporada {seasonNumber}</h3>
                    <span className="season-info">{episodes.length} Episodios</span>
                </div>
                <div className="toggle-icon">{isOpen ? '▲' : '▼'}</div>
            </div>

            {isOpen && (
                <div className="episode-list-container">
                    <ul className="episode-list">
                        {episodes.map((episode) => {
                            const isPlaying = playingEpisode === episode.episode_number;

                            // 🔒 CAMBIO 1: Verificamos si existe la imagen
                            const hasImage = episode.still_path !== null && episode.still_path !== undefined;

                            return (
                                <li key={episode.id} className="episode-list-item">
                                    <div className={`episode-item-container ${isPlaying ? 'active-video' : ''}`}>

                                        {isPlaying ? (
                                            /* ================================= */
                                            /* 🎥 MODO VIDEO                     */
                                            /* ================================= */
                                            <>
                                                <div className="episode-video-full">
                                                    {user ? (
                                                        <iframe
                                                            //https://multiembed.mov/?video_id=${serieId}&tmdb=1&s=${seasonNumber}&e=${episode.episode_number}
                                                            //https://www.vidking.net/embed/tv/${serieId}/${seasonNumber}/${episode.episode_number}?color=e50914&autoPlay=true&episodeSelector=true
                                                            src={`https://multiembed.mov/?video_id=${serieId}&tmdb=1&s=${seasonNumber}&e=${episode.episode_number}`}
                                                            frameBorder="0"
                                                            allowFullScreen
                                                            title={`Episode ${episode.episode_number}`}
                                                        ></iframe>
                                                    ) : (
                                                        <div className="lock-screen">
                                                            <div className="lock-icon"><FaLock /></div>
                                                            <h3>Exclusive Content</h3>
                                                            <p>This episode is only available to invited users.</p>
                                                            <p>You need guest access to watch this episode.</p>
                                                            <button onClick={handleLoginClick} className="btn-login">
                                                                Log in
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="episode-details mt-video">
                                                    <h4 className="episode-title">
                                                        {episode.episode_number}. {episode.name}
                                                    </h4>
                                                    <p className="episode-overview">
                                                        {episode.overview || "Sin descripción disponible."}
                                                    </p>
                                                    <button
                                                        className="close-video-btn"
                                                        onClick={() => setPlayingEpisode(null)}
                                                    >
                                                        Cerrar Video
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            /* ================================= */
                                            /* 🖼️ MODO NORMAL                    */
                                            /* ================================= */
                                            <>
                                                {/* 🔒 CAMBIO 2: Clase condicional y bloqueo del Click */}
                                                <div
                                                    className={`media-zone ${hasImage ? 'clickable' : 'disabled-zone'}`}
                                                    onClick={() => {
                                                        // Solo ejecuta el play si hay imagen
                                                        if (hasImage) setPlayingEpisode(episode.episode_number);
                                                    }}
                                                >
                                                    <div className="episode-poster-wrapper">
                                                        <img
                                                            src={hasImage ? `${IMAGE_W500_URL}${episode.still_path}` : "https://placehold.co/220x124/333/666?text=Proximamente"}
                                                            alt={episode.name}
                                                            className={`episode-poster ${!hasImage ? 'grayscale-poster' : ''}`}
                                                        />

                                                        {/* 🔒 CAMBIO 3: Solo mostramos el overlay de Play si hay imagen */}
                                                        {hasImage && (
                                                            <div className="play-overlay">
                                                                <div className="play-circle">
                                                                    <svg viewBox="0 0 24 24" fill="currentColor"
                                                                         className="play-icon">
                                                                        <path d="M8 5v14l11-7z"/>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="episode-details">
                                                    <h4 className="episode-title">
                                                        {episode.episode_number}. {episode.name}
                                                    </h4>
                                                    <p className="episode-overview">
                                                        {/* Mensaje alternativo si no hay imagen */}
                                                        {!hasImage
                                                            ? "Este episodio aún no está disponible."
                                                            : (episode.overview || "Sin descripción disponible.")}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
import {useEffect, useId, useState} from "react";
import {FaLock} from "react-icons/fa";
import {IoCalendarClearOutline, IoChevronDown, IoClose, IoPlay, IoTimeOutline} from "react-icons/io5";
import {useNavigate} from "react-router-dom";

import {IMAGE_W500_URL} from "../../constants/api";

import "../../styles/SeasonsAndItems.css";
import "../../styles/StreamingContainer.css";

export function SeasonItem({urlSeason, serieId, seasonNumber, hasAccess, posterPath, overview, episodeCount, airDate}) {
    const navigate = useNavigate();
    const panelId = useId();
    const [episodes, setEpisodes] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [playingEpisode, setPlayingEpisode] = useState(null);

    useEffect(() => {
        if (!isOpen || episodes) return;
        const controller = new AbortController();
        setIsLoading(true);
        setError("");

        fetch(urlSeason, {signal: controller.signal})
            .then((response) => {
                if (!response.ok) throw new Error("No se han podido cargar los episodios.");
                return response.json();
            })
            .then((data) => setEpisodes(data.episodes || []))
            .catch((requestError) => {
                if (requestError.name !== "AbortError") setError(requestError.message);
            })
            .finally(() => setIsLoading(false));

        return () => controller.abort();
    }, [episodes, isOpen, urlSeason]);

    const formattedSeasonDate = airDate ? new Date(airDate).toLocaleDateString("es-ES", {year: "numeric"}) : null;

    return (
        <section className={`season-item-main ${isOpen ? "is-open" : ""}`}>
            <button className="season-header" type="button" onClick={() => setIsOpen((current) => !current)} aria-expanded={isOpen} aria-controls={panelId}>
                <div className="season-cover">
                    {posterPath ? <img src={`${IMAGE_W500_URL}${posterPath}`} alt="" /> : <span>T{seasonNumber}</span>}
                </div>
                <div className="season-details">
                    <span className="season-eyebrow">Temporada {seasonNumber}</span>
                    <h2 className="season-title">Temporada {seasonNumber}</h2>
                    <div className="season-meta">
                        <span>{episodeCount ?? episodes?.length ?? 0} episodios</span>
                        {formattedSeasonDate && <span>{formattedSeasonDate}</span>}
                    </div>
                    {overview && <p className="season-overview">{overview}</p>}
                </div>
                <span className="toggle-icon" aria-hidden="true"><IoChevronDown /></span>
            </button>

            {isOpen && (
                <div className="episode-list-container" id={panelId}>
                    {isLoading && <div className="season-state"><span className="season-spinner" />Cargando episodios…</div>}
                    {error && <div className="season-state season-state-error">{error}</div>}
                    {episodes && !episodes.length && <div className="season-state">Esta temporada todavía no tiene episodios disponibles.</div>}
                    {episodes?.length > 0 && <ol className="episode-list">
                        {episodes.map((episode) => {
                            const isPlaying = playingEpisode === episode.episode_number;
                            const hasImage = Boolean(episode.still_path);
                            const formattedDate = episode.air_date ? new Date(episode.air_date).toLocaleDateString("es-ES", {day: "numeric", month: "short", year: "numeric"}) : null;

                            return <li key={episode.id} className="episode-list-item">
                                <article className={`episode-item-container ${isPlaying ? "active-video" : ""}`}>
                                    {isPlaying ? <>
                                        <div className="episode-video-full">
                                            {hasAccess ? (
                                                <iframe src={`https://multiembed.mov/?video_id=${serieId}&tmdb=1&s=${seasonNumber}&e=${episode.episode_number}`} frameBorder="0" allowFullScreen title={`Episodio ${episode.episode_number}`} />
                                            ) : (
                                                <div className="lock-screen">
                                                    <div className="lock-icon"><FaLock /></div>
                                                    <h3>Contenido exclusivo</h3>
                                                    <p>Este episodio está disponible únicamente para usuarios invitados.</p>
                                                    <p>Introduce tu código de acceso para reproducirlo.</p>
                                                    <button onClick={() => navigate("/auth")} className="btn-login">Introducir código</button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="episode-details mt-video">
                                            <span className="episode-number">Episodio {episode.episode_number}</span>
                                            <h3 className="episode-title">{episode.name || `Episodio ${episode.episode_number}`}</h3>
                                            <p className="episode-overview">{episode.overview || "Sin descripción disponible."}</p>
                                            <button className="close-video-btn" type="button" onClick={() => setPlayingEpisode(null)}><IoClose />Cerrar reproductor</button>
                                        </div>
                                    </> : <>
                                        <button className={`media-zone ${hasImage ? "clickable" : "disabled-zone"}`} type="button" disabled={!hasImage} onClick={() => setPlayingEpisode(episode.episode_number)} aria-label={hasImage ? `Reproducir episodio ${episode.episode_number}: ${episode.name}` : "Episodio no disponible"}>
                                            <div className="episode-poster-wrapper">
                                                <img src={hasImage ? `${IMAGE_W500_URL}${episode.still_path}` : "https://placehold.co/480x270/202020/777?text=Próximamente"} alt="" className={`episode-poster ${!hasImage ? "grayscale-poster" : ""}`} />
                                                {hasImage && <div className="play-overlay"><span className="play-circle"><IoPlay /></span></div>}
                                                <span className="episode-index">{episode.episode_number}</span>
                                            </div>
                                        </button>
                                        <div className="episode-details">
                                            <span className="episode-number">Episodio {episode.episode_number}</span>
                                            <h3 className="episode-title">{episode.name || `Episodio ${episode.episode_number}`}</h3>
                                            <div className="episode-meta">
                                                {formattedDate && <span><IoCalendarClearOutline />{formattedDate}</span>}
                                                {episode.runtime && <span><IoTimeOutline />{episode.runtime} min</span>}
                                            </div>
                                            <p className="episode-overview">{hasImage ? (episode.overview || "Sin descripción disponible.") : "Este episodio todavía no está disponible."}</p>
                                        </div>
                                    </>}
                                </article>
                            </li>;
                        })}
                    </ol>}
                </div>
            )}
        </section>
    );
}

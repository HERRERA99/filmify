import {EPISODE_NO_IMAGE_URL, IMAGE_W500_URL} from "../../constants/api.js";
import {useLanguage} from "../Language/LanguageContext.jsx";
import "../../styles/SeasonsAndItems.css"

export function EpisodeItem({ episode }) {
    const {locale, t} = useLanguage();
    // Si no hay episodio, no se renderiza nada.
    if (!episode) return null;

    // Construir la cadena de duración
    const durationText = episode.runtime ? `(${episode.runtime} minutos)` : '';
    // Formatear la fecha de emisión
    const airDate = episode.air_date ? new Date(episode.air_date).toLocaleDateString(locale) : '';
    // Construir la ruta completa del poster o usar un placeholder
    const posterUrl = episode.still_path ? `${IMAGE_W500_URL}${episode.still_path}` : EPISODE_NO_IMAGE_URL;

    return (
        <div className="episode-item-container">
            <div className="episode-poster-wrapper">
                <img src={posterUrl} alt={`Fotograma de ${episode.name}`} className="episode-poster" />
            </div>
            <div className="episode-details">
                <h4 className="episode-title">
                    E{episode.episode_number}: {episode.name}
                </h4>
                <p className="episode-info">
                    {airDate} {durationText}
                </p>
                <p className="episode-overview">
                    {episode.overview || t("noDescription")}
                </p>
            </div>
        </div>
    )
}

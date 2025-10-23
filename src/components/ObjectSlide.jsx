import {IMAGE_ORIGINAL_URL, IMAGE_W500_URL} from "../constants/api.js";
import "../styles/ObjectSlide.css"

export function ObjectSlide({item}) {
    // Asegúrate de que 'item' existe antes de acceder a sus propiedades
    if (!item || !item.backdrop_path) {
        return <div className="slide-container fallback-bg"></div>; // Muestra un fallback si no hay datos
    }

    const fullImageUrl = `${IMAGE_ORIGINAL_URL}${item.backdrop_path}`;
    const posterImageUrl = `${IMAGE_W500_URL}${item.poster_path}`;

    return (
        <div
            className="slide-container"
            style={{
                backgroundImage: fullImageUrl ? `url(${fullImageUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Capa de oscurecimiento y difuminado */}
            <div className="overlay"></div>
            <div className="gradient-overlay"></div>

            <div className="content-wrapper">
                {/* Contenido de texto a la izquierda */}
                <div className="text-content">
                    <h1 className="movie-title">{item.title || item.name || item.original_title || item.original_name}</h1>
                    <p className="movie-overview">{item.overview}</p>
                    <div className="buttons-container">
                        <button className="trailer-button">Ver tráiler</button>
                    </div>
                </div>

                {/* Póster a la derecha */}
                {posterImageUrl && (
                    <div className="poster-container">
                        <img className="poster-img" src={posterImageUrl} alt={item.title || item.name} />
                    </div>
                )}
            </div>
        </div>
    );
}
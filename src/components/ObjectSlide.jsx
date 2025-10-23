import {IMAGE_ORIGINAL_URL, IMAGE_W500_URL, TMDB_API_KEY, YOUTUBE_URL} from "../constants/api.js";
import "../styles/ObjectSlide.css"
import {useEffect, useState} from "react";
import AnimatedContent from "./AnimatedContent.jsx";
import FadeContent from "./FadeContent.jsx";

export function ObjectSlide({item}) {
    const [trailerUrl, setTrailerUrl] = useState(null);

    // Asegúrate de que 'item' existe antes de acceder a sus propiedades
    if (!item || !item.backdrop_path) {
        return <div className="slide-container fallback-bg"></div>;
    }

    const fullImageUrl = `${IMAGE_ORIGINAL_URL}${item.backdrop_path}`;
    const posterImageUrl = `${IMAGE_W500_URL}${item.poster_path}`;
    const videoUrl = item.media_type === "movie"
        ? `https://api.themoviedb.org/3/movie/${item.id}/videos?api_key=${TMDB_API_KEY}`
        : `https://api.themoviedb.org/3/tv/${item.id}/videos?api_key=${TMDB_API_KEY}`;


    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (!item || !item.id) return;

        const fetchVideos = async () => {
            try {
                const response = await fetch(videoUrl);
                const videoData = await response.json();

                const filteredTrailer = videoData.results.find(video =>
                    video.site === "YouTube" &&
                    video.type === "Trailer"
                );

                if (filteredTrailer) {
                    const youtubeUrl = `https://www.youtube.com/watch?v=${filteredTrailer.key}`;
                    setTrailerUrl(youtubeUrl);
                } else {
                    setTrailerUrl(null);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchVideos();
    }, [item, item.id, item.media_type, videoUrl]);

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
                    <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
                        <h1 className="movie-title">{item.title || item.name || item.original_title || item.original_name}</h1>
                        <p className="movie-overview">{item.overview}</p>
                        <div className="buttons-container">
                            <a
                                href={trailerUrl || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="trailer-button"
                                style={{pointerEvents: trailerUrl ? 'auto' : 'none', opacity: trailerUrl ? 1 : 0.5}}
                            >
                                Ver tráiler
                            </a>
                        </div>
                    </FadeContent>
                </div>

                {/* Póster a la derecha */}
                {posterImageUrl && (
                    <AnimatedContent
                        distance={300}
                        direction="vertical"
                        reverse={true}
                        duration={1.5}
                        ease="power3.out"
                        initialOpacity={0}
                        animateOpacity
                        scale={1}
                        threshold={0.1}
                        delay={0}
                    >
                        <div className="poster-container">
                            <img className="poster-img" src={posterImageUrl} alt={item.title || item.name}/>
                        </div>
                    </AnimatedContent>
                )}
            </div>
        </div>
    );
}
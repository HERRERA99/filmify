import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {FaLock} from "react-icons/fa";

import {useAuth} from "../components/Auth/AuthContext.jsx";
import '../styles/StreamingContainer.css';
import {
    TMDB_API_KEY,
    MOVIE_DETAILS_URL,
    IMAGE_W500_URL,
    IMAGE_ORIGINAL_URL, POSTER_NO_IMAGE_URL, YOUTUBE_URL
} from "../constants/api.js";
import {obtenerTrailerMasAntiguo} from "../constants/utils.js";
import {ObjectDetailsHero} from "../components/common/ObjectDetailsHero.jsx";
import {CreditsSlide} from "../components/common/CreditsSlide.jsx";
import {BasicCategorieCarrousel} from "../components/common/BasicCategorieCarrousel.jsx";
import {useLanguage} from "../components/Language/LanguageContext.jsx";

export function MovieDetails() {
    const {id} = useParams();
    const {hasAccess} = useAuth();
    const {language, t} = useLanguage();

    const [movie, setMovie] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        const loadMovie = async () => {
            setLoading(true);
            setError("");
            try {
                const url = `${MOVIE_DETAILS_URL}${id}?api_key=${TMDB_API_KEY}&language=${language}&append_to_response=videos,similar`;
                const response = await fetch(url, {signal: controller.signal});
                if (!response.ok) throw new Error(`${t("loadDetailError")} (${response.status})`);
                const data = await response.json();
                setMovie(data);
                setTrailer(obtenerTrailerMasAntiguo(data.videos?.results || []));
                setSimilar(data.similar?.results || []);
            } catch (requestError) {
                if (requestError.name !== "AbortError") setError(requestError.message || t("loadDetailError"));
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };
        loadMovie();
        return () => controller.abort();
    }, [id, language, t]);

    function handleLoginClick() {
        navigate('/auth');
    }

    if (loading) return <main className="detail-status"><span className="detail-spinner" /><p>{t("loadingMovies")}</p></main>;
    if (error || !movie) return <main className="detail-status detail-status-error"><h1>{t("loadDetailError")}</h1><p>{error}</p><button type="button" onClick={() => navigate("/films")}>{t("backToCatalog")}</button></main>;

    return (
        <>
            <ObjectDetailsHero
                title={movie.title || movie.original_title}
                overview={movie.overview}
                genres={movie.genres}
                posterUrl={movie.poster_path ?
                    `${IMAGE_W500_URL}${movie.poster_path}` :
                    POSTER_NO_IMAGE_URL
                }
                backgroundImage={movie.backdrop_path ? `${IMAGE_ORIGINAL_URL}${movie.backdrop_path}` : null}
                runtime={movie.runtime}
                first_air_date={movie.release_date}
                rating={movie.vote_average}
                numVotes={movie.vote_count}
                trailerUrl={trailer?.key ? `${YOUTUBE_URL}${trailer.key}` : null}
            />
            <div style={{
                width: '90%',
                maxWidth: '1100px',
                margin: '40px auto',
                aspectRatio: '16/9',
                backgroundColor: '#000',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0px 10px 30px rgba(0,0,0,0.5)'
            }}>
                {hasAccess ? (
                    <iframe
                        //https://www.vidking.net/embed/movie/${id}?color=e50914&autoPlay=true&episodeSelector=true
                        //https://multiembed.mov/?video_id=${id}&tmdb=1
                        src={`https://multiembed.mov/?video_id=${id}&tmdb=1`}
                        frameBorder="0"
                        allowFullScreen
                        style={{width: '100%', height: '100%'}}
                        title="Reproductor de película"
                    ></iframe>
                ) : (
                    <div className="lock-screen">
                        <div className="lock-icon"><FaLock/></div>
                        <h3>{t("exclusive")}</h3>
                        <p>{t("movieRestricted")}</p>
                        <p>{t("enterCodeToPlay")}</p>
                        <button onClick={handleLoginClick} className="btn-login">
                            {t("enterCode")}
                        </button>
                    </div>
                )}
            </div>
            <CreditsSlide
                url={`${MOVIE_DETAILS_URL}${id}/credits?api_key=${TMDB_API_KEY}&language=${language}`}
            />
            <BasicCategorieCarrousel
                title={t("similarMovies")}
                mediaList={similar}
                mediaType={"movie"}
            />
        </>
    )
}

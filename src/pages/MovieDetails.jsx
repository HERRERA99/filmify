import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";

import {
    TMDB_API_KEY,
    MOVIE_DETAILS_URL,
    IMAGE_W500_URL,
    IMAGE_ORIGINAL_URL, SERIE_DETAILS_URL, YOUTUBE_EMBEBED_URL, POSTER_NO_IMAGE_URL, YOUTUBE_URL
} from "../constants/api.js";
import {obtenerTrailerMasAntiguo} from "../constants/utils.js";

import {ObjectDetailsHero} from "../components/common/ObjectDetailsHero.jsx";
import {CreditsSlide} from "../components/common/CreditsSlide.jsx";
import {TrailerInframe} from "../components/common/TrailerInframe.jsx";
import {BasicCategorieCarrousel} from "../components/common/BasicCategorieCarrousel.jsx";

export function MovieDetails() {
    const {id} = useParams();

    const [movie, setMovie] = useState([]);
    const [trailer, setTrailer] = useState([]);
    const [similar, setSimilar] = useState([]);

    const fetchMovie = async () => {
        try {
            const url = `${MOVIE_DETAILS_URL}${id}?api_key=${TMDB_API_KEY}&language=en-US`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setMovie(data);
        } catch (error) {
            console.error("Error fetching movie:", error);
        }
    }

    const fetchVideos = async () => {
        try {
            const url = `${MOVIE_DETAILS_URL}${id}/videos?api_key=${TMDB_API_KEY}&language=en-US`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setTrailer(obtenerTrailerMasAntiguo(data.results));
        } catch (error) {
            console.error("Error fetching movie:", error);
        }
    }

    const fetchSimilar = async () => {
        try {
            const url = `${MOVIE_DETAILS_URL}${id}/similar?api_key=${TMDB_API_KEY}&language=en-US`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setSimilar(data.results);
        } catch (error) {
            console.error("Error fetching movie:", error);
        }
    }

    useEffect(() => {
        fetchMovie();
        fetchVideos();
        fetchSimilar();
    }, [id])

    return (
        <>
            <ObjectDetailsHero
                title={movie.original_title}
                overview={movie.overview}
                genres={movie.genres}
                posterUrl={movie.poster_path ?
                    `${IMAGE_W500_URL}${movie.poster_path}` :
                    POSTER_NO_IMAGE_URL
                }
                backgroundImage={`${IMAGE_ORIGINAL_URL}${movie.backdrop_path}`}
                runtime={movie.runtime}
                first_air_date={movie.release_date}
                rating={movie.vote_average}
                numVotes={movie.vote_count}
                trailerUrl={`${YOUTUBE_URL}${trailer.key}`}
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
                <iframe
                    //https://www.vidking.net/embed/movie/${id}?color=e50914&autoPlay=true&episodeSelector=true
                    //https://multiembed.mov/?video_id=${id}&tmdb=1
                    src={`https://www.vidking.net/embed/movie/${id}?color=e50914&autoPlay=true&episodeSelector=true`}
                    frameBorder="0"
                    allowFullScreen
                    style={{ width: '100%', height: '100%' }}
                    title="Movie Player"
                ></iframe>
            </div>
            <CreditsSlide
                url={`${MOVIE_DETAILS_URL}${id}/credits?api_key=${TMDB_API_KEY}&language=en-US`}
            />
            <BasicCategorieCarrousel
                title={"Similar"}
                mediaList={similar}
                mediaType={"movie"}
            />
        </>
    )
}
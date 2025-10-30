import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    TMDB_API_KEY,
    MOVIE_DETAILS_URL,
    IMAGE_W500_URL,
    IMAGE_ORIGINAL_URL, SERIE_DETAILS_URL, YOUTUBE_EMBEBED_URL
} from "../constants/api.js";
import {ObjectDetailsHero} from "./ObjectDetailsHero.jsx";
import {CreditsSlide} from "./CreditsSlide.jsx";
import {TrailerInframe} from "./TrailerInframe.jsx";
import {obtenerTrailerMasAntiguo} from "../constants/utils.js";
import {BasicCategorieCarrousel} from "./BasicCategorieCarrousel.jsx";

export function MovieDetails() {
    const { id } = useParams();

    const [movie, setMovie] = useState([]);
    const [trailer, setTrailer] = useState([]);
    const [videos, setVideos] = useState([]);
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

            setVideos(data.results);
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
    },[id])

    return (
        <>
            <ObjectDetailsHero
                title={movie.original_title}
                overview={movie.overview}
                genres={movie.genres}
                posterUrl={`${IMAGE_W500_URL}${movie.poster_path}`}
                backgroundImage={`${IMAGE_ORIGINAL_URL}${movie.backdrop_path}`}
                runtime={movie.runtime}
                first_air_date={movie.release_date}
                rating={movie.vote_average}
                numVotes={movie.vote_count}
            />
            {trailer && trailer.key && (
                <TrailerInframe
                    urlTrailer={`${YOUTUBE_EMBEBED_URL}${trailer.key}`}
                />
            )}
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
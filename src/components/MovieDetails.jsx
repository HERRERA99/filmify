import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    TMDB_API_KEY,
    MOVIE_DETAILS_URL,
    IMAGE_W500_URL,
    IMAGE_ORIGINAL_URL,
} from "../constants/api.js";
import {ObjectDetailsHero} from "./ObjectDetailsHero.jsx";
import {CreditsSlide} from "./CreditsSlide.jsx";

export function MovieDetails() {
    const { id } = useParams();

    const [movie, setMovie] = useState([]);

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

    useEffect(() => {
        fetchMovie();
    },[])

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
            />
            <CreditsSlide
                url={`${MOVIE_DETAILS_URL}${id}/credits?api_key=${TMDB_API_KEY}&language=en-US`}
            />
        </>
    )
}
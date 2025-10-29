import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {IMAGE_ORIGINAL_URL, IMAGE_W500_URL, SERIE_DETAILS_URL, TMDB_API_KEY} from "../constants/api.js";
import {ObjectDetailsHero} from "./ObjectDetailsHero.jsx";
import {CreditsSlide} from "./CreditsSlide.jsx";

export function SerieDetails() {
    const {id} = useParams();

    const [serie, setSerie] = useState([]);

    const fetchserie = async () => {
        try {
            const url = `${SERIE_DETAILS_URL}${id}?api_key=${TMDB_API_KEY}&language=en-US`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setSerie(data);

        } catch (error) {
            console.error("Error fetching movie:", error);
        }
    }

    useEffect(() => {
        fetchserie();
    }, [])

    return (
        <>
            <ObjectDetailsHero
                title={serie.original_name}
                overview={serie.overview}
                genres={serie.genres}
                posterUrl={`${IMAGE_W500_URL}${serie.poster_path}`}
                backgroundImage={`${IMAGE_ORIGINAL_URL}${serie.backdrop_path}`}
                number_of_seasons={serie.number_of_seasons}
                first_air_date={serie.first_air_date}
            />
            <CreditsSlide
                url={`${SERIE_DETAILS_URL}${id}/credits?api_key=${TMDB_API_KEY}&language=en-US`}
            />
        </>
    )
}
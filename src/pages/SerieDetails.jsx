import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";

import {useAuth} from "../components/Auth/AuthContext.jsx";
import {
    IMAGE_ORIGINAL_URL,
    IMAGE_W500_URL, MOVIE_DETAILS_URL,
    SERIE_DETAILS_URL,
    TMDB_API_KEY,
    YOUTUBE_EMBEBED_URL, YOUTUBE_URL
} from "../constants/api.js";
import {obtenerTrailerMasAntiguo} from "../constants/utils.js";
import {ObjectDetailsHero} from "../components/common/ObjectDetailsHero.jsx";
import {CreditsSlide} from "../components/common/CreditsSlide.jsx";
import {TrailerInframe} from "../components/common/TrailerInframe.jsx";
import {BasicCategorieCarrousel} from "../components/common/BasicCategorieCarrousel.jsx";
import {SeasonItem} from "../components/serie/SeasonItem.jsx";
import {ContentLock} from "../components/common/ContentLock.jsx";

export function SerieDetails() {
    const {id} = useParams();
    const {user} = useAuth();

    const [serie, setSerie] = useState([]);
    const [trailer, setTrailer] = useState([]);
    const [similar, setSimilar] = useState([]);
    const [seasons, setSeasons] = useState([]);

    const fetchserie = async () => {
        try {
            const url = `${SERIE_DETAILS_URL}${id}?api_key=${TMDB_API_KEY}&language=en-US`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setSerie(data);
            setSeasons(data.seasons);
        } catch (error) {
            console.error("Error fetching movie:", error);
        }
    }

    const fetchVideos = async () => {
        try {
            const url = `${SERIE_DETAILS_URL}${id}/videos?api_key=${TMDB_API_KEY}&language=en-US`;

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
            const url = `${SERIE_DETAILS_URL}${id}/similar?api_key=${TMDB_API_KEY}&language=en-US`;

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
        fetchserie();
        fetchVideos();
        fetchSimilar();
    }, [id])

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
                rating={serie.vote_average}
                numVotes={serie.vote_count}
                trailerUrl={`${YOUTUBE_URL}${trailer.key}`}
            />

            {seasons
                .filter(seasons => seasons.season_number !== 0)
                .map((season) => (
                    <SeasonItem
                        key={season.id}
                        serieId={id}
                        seasonNumber={season.season_number}
                        urlSeason={`${SERIE_DETAILS_URL}${id}/season/${season.season_number}?api_key=${TMDB_API_KEY}&language=en-US`}
                        user={user}
                    />
                ))}

            <CreditsSlide
                url={`${SERIE_DETAILS_URL}${id}/credits?api_key=${TMDB_API_KEY}&language=en-US`}
            />
            <BasicCategorieCarrousel
                title={"Similar"}
                mediaList={similar}
                mediaType={"tv"}
            />
        </>
    )
}
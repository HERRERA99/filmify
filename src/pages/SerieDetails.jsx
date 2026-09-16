import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";

import {useAuth} from "../components/Auth/AuthContext.jsx";
import {
    IMAGE_ORIGINAL_URL,
    IMAGE_W500_URL,
    POSTER_NO_IMAGE_URL,
    SERIE_DETAILS_URL,
    TMDB_API_KEY,
    YOUTUBE_URL
} from "../constants/api.js";
import {obtenerTrailerMasAntiguo} from "../constants/utils.js";
import {ObjectDetailsHero} from "../components/common/ObjectDetailsHero.jsx";
import {CreditsSlide} from "../components/common/CreditsSlide.jsx";
import {BasicCategorieCarrousel} from "../components/common/BasicCategorieCarrousel.jsx";
import {SeasonItem} from "../components/serie/SeasonItem.jsx";
import {useLanguage} from "../components/Language/LanguageContext.jsx";

export function SerieDetails() {
    const {id} = useParams();
    const {hasAccess} = useAuth();
    const {language, t} = useLanguage();

    const [serie, setSerie] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        const loadSerie = async () => {
            setLoading(true);
            setError("");
            try {
                const url = `${SERIE_DETAILS_URL}${id}?api_key=${TMDB_API_KEY}&language=${language}&append_to_response=videos,similar`;
                const response = await fetch(url, {signal: controller.signal});
                if (!response.ok) throw new Error(`${t("loadDetailError")} (${response.status})`);
                const data = await response.json();
                setSerie(data);
                setSeasons(data.seasons || []);
                setTrailer(obtenerTrailerMasAntiguo(data.videos?.results || []));
                setSimilar(data.similar?.results || []);
            } catch (requestError) {
                if (requestError.name !== "AbortError") setError(requestError.message || t("loadDetailError"));
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };
        loadSerie();
        return () => controller.abort();
    }, [id, language, t]);

    if (loading) return <main className="detail-status"><span className="detail-spinner" /><p>{t("loadingSeries")}</p></main>;
    if (error || !serie) return <main className="detail-status detail-status-error"><h1>{t("loadDetailError")}</h1><p>{error}</p><Link to="/series">{t("backToCatalog")}</Link></main>;

    return (
        <>
            <ObjectDetailsHero
                title={serie.name || serie.original_name}
                overview={serie.overview}
                genres={serie.genres}
                posterUrl={serie.poster_path ? `${IMAGE_W500_URL}${serie.poster_path}` : POSTER_NO_IMAGE_URL}
                backgroundImage={serie.backdrop_path ? `${IMAGE_ORIGINAL_URL}${serie.backdrop_path}` : null}
                number_of_seasons={serie.number_of_seasons}
                first_air_date={serie.first_air_date}
                rating={serie.vote_average}
                numVotes={serie.vote_count}
                trailerUrl={trailer?.key ? `${YOUTUBE_URL}${trailer.key}` : null}
            />

            <section className="seasons-section">
                <div className="seasons-section-heading"><span>{t("episodes")}</span><h2>{t("seasons")}</h2></div>
                {seasons.filter(season => season.season_number !== 0).map((season) => (
                    <SeasonItem
                        key={season.id}
                        serieId={id}
                        seasonNumber={season.season_number}
                        urlSeason={`${SERIE_DETAILS_URL}${id}/season/${season.season_number}?api_key=${TMDB_API_KEY}&language=${language}`}
                        hasAccess={hasAccess}
                        posterPath={season.poster_path}
                        overview={season.overview}
                        episodeCount={season.episode_count}
                        airDate={season.air_date}
                    />
                ))}
            </section>

            <CreditsSlide
                url={`${SERIE_DETAILS_URL}${id}/credits?api_key=${TMDB_API_KEY}&language=${language}`}
            />
            <BasicCategorieCarrousel
                title={t("similarSeries")}
                mediaList={similar}
                mediaType={"tv"}
            />
        </>
    )
}

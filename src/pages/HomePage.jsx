import {useEffect, useState} from 'react';

import {TMDB_API_KEY, UPCOMING_MOVIES_URL, POPULAR_SERIES_URL, TOP_RATED_SERIES_URL, TOP_RATED_MOVIES_URL} from "../constants/api.js";
import {TrendingCarrousel} from "../components/home/TrendingCarrousel.jsx";
import {BasicCategorieCarrousel} from "../components/common/BasicCategorieCarrousel.jsx";
import {PageLoader} from "../components/tools/PageLoader.jsx";
import {useLanguage} from "../components/Language/LanguageContext.jsx";

export function HomePage() {
    const {language, t} = useLanguage();
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [popularSeries, setPopularSeries] = useState([]);
    const [topRatedSeries, setTopRatedSeries] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(() => {
        return sessionStorage.getItem("hasSeenLoader") !== "true";
    });
    useEffect(() => {
        const controller = new AbortController();
        let loaderTimeout;
        const fetchList = async (endpoint, setter) => {
            try {
                const response = await fetch(`${endpoint}?api_key=${TMDB_API_KEY}&language=${language}`, {signal: controller.signal});
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                const data = await response.json();
                setter((data.results || []).slice(0, 20));
            } catch (error) {
                if (error.name !== "AbortError") console.error("Error al cargar una sección del inicio:", error);
            }
        };

        const loadAllData = async () => {
            const start = Date.now();
            await Promise.all([
                fetchList(UPCOMING_MOVIES_URL, setUpcomingMovies),
                fetchList(POPULAR_SERIES_URL, setPopularSeries),
                fetchList(TOP_RATED_SERIES_URL, setTopRatedSeries),
                fetchList(TOP_RATED_MOVIES_URL, setTopRatedMovies),
            ]);
            const elapsed = Date.now() - start;
            loaderTimeout = setTimeout(() => {
                setIsPageLoading(false);
                sessionStorage.setItem("hasSeenLoader", "true");
            }, Math.max(0, 1000 - elapsed));
        };

        loadAllData();
        return () => {
            controller.abort();
            clearTimeout(loaderTimeout);
        };
    }, [language]);

    useEffect(() => {
        if (!isPageLoading) {
            const loader = document.querySelector(".page-loader");
            if (loader) {
                loader.classList.add("fade-out");
                setTimeout(() => loader.remove(), 600); // quita el loader del DOM tras el fade
            }
        }
    }, [isPageLoading]);

    if (isPageLoading) {
        return <PageLoader />;
    }

    return (
        <>
            <TrendingCarrousel/>
            {upcomingMovies.length > 0 && (
                <BasicCategorieCarrousel
                    title={t("upcoming")}
                    mediaList={upcomingMovies}
                    viewMoreLink="/movies/upcoming"
                    mediaType="movie"
                />
            )}

            {popularSeries.length > 0 && (
                <BasicCategorieCarrousel
                    title={t("popularSeries")}
                    mediaList={popularSeries}
                    viewMoreLink="/series/popular"
                    mediaType="tv"
                />
            )}

            {topRatedSeries.length > 0 && (
                <BasicCategorieCarrousel
                    title={t("topSeries")}
                    mediaList={topRatedSeries}
                    viewMoreLink="/series/topRated"
                    mediaType="tv"
                />
            )}

            {topRatedMovies.length > 0 && (
                <BasicCategorieCarrousel
                    title={t("topMovies")}
                    mediaList={topRatedMovies}
                    viewMoreLink="/movies/topRated"
                    mediaType="movie"
                />
            )}
        </>
    )
}

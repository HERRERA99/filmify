import React, { useState, useEffect } from 'react';

import {TMDB_API_KEY, UPCOMING_MOVIES_URL, POPULAR_SERIES_URL, TOP_RATED_SERIES_URL, TOP_RATED_MOVIES_URL} from "../constants/api.js";

import {TrendingCarrousel} from "./TrendingCarrousel.jsx";
import {BasicCategorieCarrousel} from "./BasicCategorieCarrousel.jsx";
import {PageLoader} from "./PageLoader.jsx";

export function HomePage() {
    const NUM_ITEMS_SLIDER = 20;
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [popularSeries, setPopularSeries] = useState([]);
    const [topRatedSeries, setTopRatedSeries] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(() => {
        return sessionStorage.getItem("hasSeenLoader") !== "true";
    });


    const fetchUpcomingMovies = async () => {
        try {
            const url = `${UPCOMING_MOVIES_URL}?api_key=${TMDB_API_KEY}&language=en-US`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setUpcomingMovies(data.results.slice(0, NUM_ITEMS_SLIDER));

        } catch (error) {
            console.error("Error fetching upcoming movies:", error);
        }
    };

    const fetchPopularSeries = async () => {
        try {
            const url = `${POPULAR_SERIES_URL}?api_key=${TMDB_API_KEY}&language=en-US`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setPopularSeries(data.results.slice(0, NUM_ITEMS_SLIDER));

        } catch (error) {
            console.error("Error fetching upcoming movies:", error);
        }
    }

    const fetchTopRatedSeries = async () => {
        try {
            const url = `${TOP_RATED_SERIES_URL}?api_key=${TMDB_API_KEY}&language=en-US`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setTopRatedSeries(data.results.slice(0, NUM_ITEMS_SLIDER));

        } catch (error) {
            console.error("Error fetching upcoming movies:", error);
        }
    }

    const fetchTopRatedMovies = async () => {
        try {
            const url = `${TOP_RATED_MOVIES_URL}?api_key=${TMDB_API_KEY}&language=en-US`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setTopRatedMovies(data.results.slice(0, NUM_ITEMS_SLIDER));

        } catch (error) {
            console.error("Error fetching upcoming movies:", error);
        }
    }

    useEffect(() => {
        const loadAllData = async () => {
            const start = Date.now();

            await Promise.all([
                fetchUpcomingMovies(),
                fetchPopularSeries(),
                fetchTopRatedSeries(),
                fetchTopRatedMovies()
            ]);

            const elapsed = Date.now() - start;
            const minDisplayTime = 1000;

            // Asegura que el loader esté visible al menos el tiempo mínimo
            const remaining = Math.max(0, minDisplayTime - elapsed);

            setTimeout(() => {
                setIsPageLoading(false);
                sessionStorage.setItem("hasSeenLoader", "true"); // 👈 Guarda que ya lo vio
            }, remaining);
        };

        loadAllData();
    }, []);

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
                    title="Upcoming movies"
                    mediaList={upcomingMovies}
                    viewMoreLink="/movies/upcoming"
                    mediaType="movie"
                />
            )}

            {popularSeries.length > 0 && (
                <BasicCategorieCarrousel
                    title="Popular series"
                    mediaList={popularSeries}
                    viewMoreLink="/series/popular"
                    mediaType="tv"
                />
            )}

            {topRatedSeries.length > 0 && (
                <BasicCategorieCarrousel
                    title="Top rated series"
                    mediaList={topRatedSeries}
                    viewMoreLink="/series/topRated"
                    mediaType="tv"
                />
            )}

            {topRatedMovies.length > 0 && (
                <BasicCategorieCarrousel
                    title="Top rated movies"
                    mediaList={topRatedMovies}
                    viewMoreLink="/movies/topRated"
                    mediaType="movie"
                />
            )}
        </>
    )
}
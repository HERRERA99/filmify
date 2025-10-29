import {TrendingCarrousel} from "./TrendingCarrousel.jsx";
import {BasicCategorieCarrousel} from "./BasicCategorieCarrousel.jsx";
import React, { useState, useEffect } from 'react';
import {TMDB_API_KEY, UPCOMING_MOVIES_URL, POPULAR_SERIES_URL, TOP_RATED_SERIES_URL, TOP_RATED_MOVIES_URL} from "../constants/api.js";

export function HomePage() {
    const NUM_ITEMS_SLIDER = 20;

    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [isLoadingUpcomingMovies, setIsLoadingUpcomingMovies] = useState(true);

    const [popularSeries, setPopularSeries] = useState([]);
    const [isLoadingPopularSeries, setIsLoadingPopularSeries] = useState(true);

    const [topRatedSeries, setTopRatedSeries] = useState([]);
    const [isLoadingTopRatedSeries, setIsLoadingTopRatedSeries] = useState(true);

    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [isLoadingTopRatedMovies, setIsLoadingTopRatedMovies] = useState(true);

    const fetchUpcomingMovies = async () => {
        setIsLoadingUpcomingMovies(true);
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
        } finally {
            setIsLoadingUpcomingMovies(false);
        }
    };

    const fetchPopularSeries = async () => {
        setIsLoadingPopularSeries(true);
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
        } finally {
            setIsLoadingPopularSeries(false);
        }
    }

    const fetchTopRatedSeries = async () => {
        setIsLoadingTopRatedSeries(true);
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
        } finally {
            setIsLoadingTopRatedSeries(false);
        }
    }

    const fetchTopRatedMovies = async () => {
        setIsLoadingTopRatedMovies(true);
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
        } finally {
            setIsLoadingTopRatedMovies(false);
        }
    }

    useEffect(() => {
        fetchUpcomingMovies();
        fetchPopularSeries();
        fetchTopRatedSeries();
        fetchTopRatedMovies();
    }, []);

    return (
        <>
            <TrendingCarrousel/>

            {isLoadingUpcomingMovies && (
                <div className="text-white text-center py-8">Loading upcoming movies...</div>
            )}

            {!isLoadingUpcomingMovies && upcomingMovies.length > 0 && (
                <BasicCategorieCarrousel
                    title="Upcoming movies"
                    mediaList={upcomingMovies}
                    viewMoreLink="/movies/upcoming"
                    mediaType="movie"
                />
            )}

            {isLoadingPopularSeries && (
                <div className="text-white text-center py-8">Loading popular series...</div>
            )}

            {!isLoadingPopularSeries && popularSeries.length > 0 && (
                <BasicCategorieCarrousel
                    title="Popular series"
                    mediaList={popularSeries}
                    viewMoreLink="/series/popular"
                    mediaType="tv"
                />
            )}

            {isLoadingTopRatedSeries && (
                <div className="text-white text-center py-8">Loading popular series...</div>
            )}

            {!isLoadingTopRatedSeries && topRatedSeries.length > 0 && (
                <BasicCategorieCarrousel
                    title="Top rated series"
                    mediaList={topRatedSeries}
                    viewMoreLink="/series/topRated"
                    mediaType="tv"
                />
            )}

            {isLoadingTopRatedMovies && (
                <div className="text-white text-center py-8">Loading popular series...</div>
            )}

            {!isLoadingTopRatedMovies && topRatedMovies.length > 0 && (
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
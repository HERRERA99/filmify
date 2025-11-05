

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'
import {Header} from "./components/Header.jsx";
import {HomePage} from "./components/HomePage.jsx";
import {MoviessPage} from "./components/MoviessPage.jsx";
import {MovieDetails} from "./components/MovieDetails.jsx";
import {SeriesPage} from "./components/SeriesPage.jsx";
import {SerieDetails} from "./components/SerieDetails.jsx";
import {Footer} from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import {UpcomingMoviesPage} from "./components/UpcomingMoviesPage.jsx";
import {PopularSeriesPage} from "./components/PopularSeriesPage.jsx";
import {TopRatedMoviesPage} from "./components/TopRatedMoviesPage.jsx";
import {TopRatedSeriesPage} from "./components/TopRatedSeriesPage.jsx";

function App() {
  return (
      <Router>
          <ScrollToTop/>
          <div className="app-container">
              <Header />

              <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/films" element={<MoviessPage />} />
                  <Route path="/series" element={<SeriesPage />} />
                  <Route path="/movie/:id" element={<MovieDetails />} />
                  <Route path="/tv/:id" element={<SerieDetails />} />
                  <Route path="/movies/upcoming" element={<UpcomingMoviesPage />} />
                  <Route path="/series/popular" element={<PopularSeriesPage />} />
                  <Route path="/series/topRated" element={<TopRatedSeriesPage />} />
                  <Route path="/movies/topRated" element={<TopRatedMoviesPage />} />
              </Routes>

              <Footer />
          </div>
      </Router>
  );
}

export default App

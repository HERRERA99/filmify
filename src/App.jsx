

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'
import {Header} from "./components/common/Header.jsx";
import {HomePage} from "./pages/HomePage.jsx";
import {MoviessPage} from "./pages/MoviessPage.jsx";
import {MovieDetails} from "./pages/MovieDetails.jsx";
import {SeriesPage} from "./pages/SeriesPage.jsx";
import {SerieDetails} from "./pages/SerieDetails.jsx";
import {Footer} from "./components/common/Footer.jsx";
import ScrollToTop from "./components/tools/ScrollToTop.jsx";
import {UpcomingMoviesPage} from "./pages/UpcomingMoviesPage.jsx";
import {PopularSeriesPage} from "./pages/PopularSeriesPage.jsx";
import {TopRatedMoviesPage} from "./pages/TopRatedMoviesPage.jsx";
import {TopRatedSeriesPage} from "./pages/TopRatedSeriesPage.jsx";
import {AuthPage} from "./pages/AuthPage.jsx";
import {ProfilePage} from "./pages/ProfilePage.jsx";

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
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
              </Routes>

              <Footer />
          </div>
      </Router>
  );
}

export default App

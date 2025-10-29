import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import {Header} from "./components/Header.jsx";
import {HomePage} from "./components/HomePage.jsx";
import {FilmsPage} from "./components/FilmsPage.jsx";
import {MovieDetails} from "./components/MovieDetails.jsx";
import {SeriesPage} from "./components/SeriesPage.jsx";
import {SerieDetails} from "./components/SerieDetails.jsx";
import {Footer} from "./components/Footer.jsx";

function App() {
  return (
      <Router>
          <div className="app-container">
              <Header />

              <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/films" element={<FilmsPage />} />
                  <Route path="/series" element={<SeriesPage />} />
                  <Route path="/movie/:id" element={<MovieDetails />} />
                  <Route path="/tv/:id" element={<SerieDetails />} />
              </Routes>

              <Footer />
          </div>
      </Router>
  );
}

export default App

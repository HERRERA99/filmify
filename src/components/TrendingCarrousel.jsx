import {useEffect, useState} from "react";
import {API_BASE_URL, IMAGE_W500_URL, TMDB_API_KEY} from '../constants/api';
import {ObjectSlide} from "./ObjectSlide.jsx";

export function TrendingCarrousel() {
    const [items, setItems] = useState([]);
    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const TRENDING_URL = `${API_BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}&language=es-ES`;

    const nextSlide = () => {
        setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % items.length);
    };

    /*
    const prevSlide = () => {
    setCurrentMovieIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
    };
     */

    // Función de utilidad para intentar la llamada a la API con reintentos
    const fetchWithRetry = async (url, retries = 3) => {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                console.error(`Fetch attempt ${i + 1} failed for ${url}:`, error.message);
                if (i === retries - 1) throw error; // Lanza el error después del último reintento
                // Espera antes de reintentar
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    };

    useEffect(() => {
        // Comprobamos la clave API
        if (!TMDB_API_KEY) {
            setError("Error: La clave TMDB no está configurada. Asegúrate de tener REACT_APP_TMDB_API_KEY en tu .env");
            setLoading(false);
        }

        const fetchTrendingData = async () => {
            try {
                const data = await fetchWithRetry(TRENDING_URL);
                // Filtra elementos que no tienen póster para una mejor presentación
                const filteredItems = data.results.filter(item => item.poster_path);
                setItems(filteredItems);
            } catch (err) {
                console.error("Fallo al obtener datos de tendencia:", err);
                setError("Lo sentimos, no pudimos cargar el contenido de tendencia.");
            } finally {
                setLoading(false);
            }
        }

        fetchTrendingData();
    }, [TRENDING_URL])

    useEffect(() => {
        const intervalId = setInterval(nextSlide, 1000);
        return () => clearInterval(intervalId);
    }, [items]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 bg-gray-900 text-white p-6 rounded-xl m-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mr-3"></div>
                Cargando contenido...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900 text-white p-4 rounded-xl m-4 text-center">
                <p>⚠️ {error}</p>
            </div>
        );
    }

    return (
        <div className="carrousel-container">
            <div
                key={items[currentMovieIndex].id}
                className="carrousel-item"
            >
                <ObjectSlide
                    item={items[currentMovieIndex]}
                />
            </div>
        </div>
    );
}
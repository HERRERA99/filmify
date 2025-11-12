// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
    // Obtiene el objeto de ubicación actual (pathname, search, hash)
    const { pathname } = useLocation();

    // Este efecto se ejecuta cada vez que 'pathname' cambia (es decir, cada vez que navegas)
    useEffect(() => {
        // Desplaza la ventana al inicio (coordenadas 0, 0)
        window.scrollTo(0, 0);
    }, [pathname]); // Dependencia: re-ejecutar cuando cambia la ruta

    // Un componente de efecto no necesita renderizar nada
    return null;
}

export default ScrollToTop;
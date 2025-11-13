import { useEffect } from "react";

/**
 * Hook que guarda y restaura la posición de scroll de una página.
 * @param {string} key - Identificador único para guardar la posición (ej. "moviesScroll")
 */
export function useScrollMemory(key) {
    useEffect(() => {
        // 🔹 Restaurar la posición previa de scroll al montar
        const savedScroll = sessionStorage.getItem(key) || 0;
        window.scrollTo(0, parseInt(savedScroll, 10));

        // 🔹 Guardar el scroll actual en sessionStorage al desplazarse
        const handleScroll = () => {
            sessionStorage.setItem(key, window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);

        // 🔹 Limpiar el listener al desmontar
        return () => window.removeEventListener("scroll", handleScroll);
    }, [key]);
}
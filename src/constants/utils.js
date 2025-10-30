/**
 * Filtra una lista de videos para encontrar solo los de tipo 'Trailer'
 * y devuelve el que tenga la fecha de publicación más antigua.
 * * @param {Array<Object>} listaVideos - Una lista de objetos de video de la API.
 * @returns {Object | null} El objeto del tráiler más antiguo, o null si no hay trailers.
 */
export function obtenerTrailerMasAntiguo(listaVideos) {
    // 1. Filtrar solo los videos que son de tipo 'Trailer'
    const trailers = listaVideos.filter(video => video.type === "Trailer");

    if (trailers.length === 0) {
        return null; // Devuelve null si no hay trailers
    }

    // 2. Encontrar el trailer con la fecha de publicación más antigua
    // Usamos reduce para iterar y comparar las fechas.
    const trailerMasAntiguo = trailers.reduce((anterior, actual) => {
        // Convertimos las cadenas de fecha a objetos Date para una comparación precisa.
        const fechaAnterior = new Date(anterior.published_at);
        const fechaActual = new Date(actual.published_at);

        // Si la fecha actual es anterior (menor) a la fecha anterior, el actual es el más antiguo.
        return fechaActual < fechaAnterior ? actual : anterior;
    });

    return trailerMasAntiguo;
}
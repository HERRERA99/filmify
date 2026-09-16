import {createContext, useContext, useEffect, useMemo, useState} from "react";

const languages = {
    "es-ES": {short: "ES", label: "Español", locale: "es-ES"},
    "en-US": {short: "EN", label: "English", locale: "en-US"},
    "fr-FR": {short: "FR", label: "Français", locale: "fr-FR"},
};

const messages = {
    "es-ES": {
        home: "Inicio", movies: "Películas", series: "Series", explore: "Explorar", homeHint: "Descubre qué ver hoy", moviesHint: "Todos los largometrajes", seriesHint: "Temporadas para maratonear",
        searchPlaceholder: "Películas y series", searching: "Buscando títulos…", noResultsFor: "No hay resultados para", searchResults: "Películas y series", results: "resultados", searchError: "No se pudo completar la búsqueda. Inténtalo de nuevo.", clearSearch: "Borrar búsqueda",
        catalog: "Catálogo Filmify", catalogSubtitle: "Explora una selección actualizada y encuentra tu próxima historia.", sort: "Ordenar", popular: "Más populares", lessPopular: "Menos populares", newest: "Más recientes", oldest: "Más antiguas", topRated: "Mejor valoradas", mostVoted: "Más votadas", titleAZ: "Título (A–Z)", previous: "Anterior", next: "Siguiente", retry: "Reintentar", loadingMovies: "Cargando películas…", loadingSeries: "Cargando series…", empty: "No se han encontrado resultados.",
        movie: "Película", tv: "Serie", details: "Ver detalles", upcoming: "Próximos estrenos", popularSeries: "Series populares", topSeries: "Series mejor valoradas", topMovies: "Películas mejor valoradas", viewAll: "Ver todo", similarMovies: "Películas similares", similarSeries: "Series similares", cast: "Reparto", trailer: "Ver tráiler", votes: "votos", season: "temporada", seasons: "temporadas",
        episodes: "Episodios", loadingEpisodes: "Cargando episodios…", noEpisodes: "Esta temporada todavía no tiene episodios disponibles.", episodeUnavailable: "Este episodio todavía no está disponible.", noDescription: "Sin descripción disponible.", closePlayer: "Cerrar reproductor", exclusive: "Contenido exclusivo", episodeRestricted: "Este episodio está disponible únicamente para usuarios invitados.", enterCodeToPlay: "Introduce tu código de acceso para reproducirlo.", enterCode: "Introducir código",
        page: "Página", of: "de", loadDetailError: "No se ha podido cargar la ficha.", backToCatalog: "Volver al catálogo", movieRestricted: "Esta película está disponible únicamente para usuarios invitados.", credentialInvalid: "La credencial de TMDB no tiene un formato válido.", credentialRejected: "TMDB ha rechazado la credencial configurada.", catalogLoadError: "No se ha podido cargar el catálogo.", couldNotLoad: "No hemos podido cargar",
        loadingContent: "Cargando contenido…", accessActive: "ACCESO ACTIVO", roomReady: "Tu sala está lista", unlockedUntil: "El visualizador permanecerá desbloqueado hasta el", exploreCatalog: "Explorar catálogo", closeAccess: "Cerrar acceso en este dispositivo", accessFilmify: "ACCESO FILMIFY", unlockViewer: "Desbloquea el visualizador", accessSubtitle: "Introduce el código que te han facilitado para ver películas y episodios.", accessCode: "Código de acceso", verifying: "Verificando…", unlockAccess: "Desbloquear acceso", accessNote: "El acceso se guarda solo en este dispositivo durante 7 días.", rights: "Todos los derechos reservados.", license: "Licencia MIT", manageAccess: "Gestionar acceso", enterAccessCode: "Introducir código de acceso", navigateHint: "para navegar · Enter para abrir", openSearch: "Abrir búsqueda", closeSearch: "Cerrar búsqueda", openMenu: "Abrir menú", closeMenu: "Cerrar menú", playEpisode: "Reproducir episodio", unavailableEpisode: "Episodio no disponible",
    },
    "en-US": {
        home: "Home", movies: "Movies", series: "Series", explore: "Explore", homeHint: "Discover what to watch today", moviesHint: "Browse all movies", seriesHint: "Seasons worth bingeing",
        searchPlaceholder: "Movies and series", searching: "Searching titles…", noResultsFor: "No results for", searchResults: "Movies and series", results: "results", searchError: "The search could not be completed. Try again.", clearSearch: "Clear search",
        catalog: "Filmify catalog", catalogSubtitle: "Explore an updated selection and find your next story.", sort: "Sort", popular: "Most popular", lessPopular: "Least popular", newest: "Newest", oldest: "Oldest", topRated: "Top rated", mostVoted: "Most voted", titleAZ: "Title (A–Z)", previous: "Previous", next: "Next", retry: "Retry", loadingMovies: "Loading movies…", loadingSeries: "Loading series…", empty: "No results found.",
        movie: "Movie", tv: "Series", details: "View details", upcoming: "Upcoming releases", popularSeries: "Popular series", topSeries: "Top-rated series", topMovies: "Top-rated movies", viewAll: "View all", similarMovies: "Similar movies", similarSeries: "Similar series", cast: "Cast", trailer: "Watch trailer", votes: "votes", season: "season", seasons: "seasons",
        episodes: "Episodes", loadingEpisodes: "Loading episodes…", noEpisodes: "This season has no available episodes yet.", episodeUnavailable: "This episode is not available yet.", noDescription: "No description available.", closePlayer: "Close player", exclusive: "Exclusive content", episodeRestricted: "This episode is available to invited users only.", enterCodeToPlay: "Enter your access code to play it.", enterCode: "Enter code",
        page: "Page", of: "of", loadDetailError: "The details could not be loaded.", backToCatalog: "Back to catalog", movieRestricted: "This movie is available to invited users only.", credentialInvalid: "The TMDB credential has an invalid format.", credentialRejected: "TMDB rejected the configured credential.", catalogLoadError: "The catalog could not be loaded.", couldNotLoad: "We could not load",
        loadingContent: "Loading content…", accessActive: "ACCESS ACTIVE", roomReady: "Your screening room is ready", unlockedUntil: "The player will remain unlocked until", exploreCatalog: "Explore catalog", closeAccess: "Close access on this device", accessFilmify: "FILMIFY ACCESS", unlockViewer: "Unlock the player", accessSubtitle: "Enter the code you received to watch movies and episodes.", accessCode: "Access code", verifying: "Verifying…", unlockAccess: "Unlock access", accessNote: "Access is stored on this device for 7 days only.", rights: "All rights reserved.", license: "MIT License", manageAccess: "Manage access", enterAccessCode: "Enter access code", navigateHint: "to navigate · Enter to open", openSearch: "Open search", closeSearch: "Close search", openMenu: "Open menu", closeMenu: "Close menu", playEpisode: "Play episode", unavailableEpisode: "Episode unavailable",
    },
    "fr-FR": {
        home: "Accueil", movies: "Films", series: "Séries", explore: "Explorer", homeHint: "Découvrez quoi regarder", moviesHint: "Tous les longs métrages", seriesHint: "Des saisons à dévorer",
        searchPlaceholder: "Films et séries", searching: "Recherche en cours…", noResultsFor: "Aucun résultat pour", searchResults: "Films et séries", results: "résultats", searchError: "La recherche a échoué. Réessayez.", clearSearch: "Effacer la recherche",
        catalog: "Catalogue Filmify", catalogSubtitle: "Explorez une sélection actualisée et trouvez votre prochaine histoire.", sort: "Trier", popular: "Plus populaires", lessPopular: "Moins populaires", newest: "Plus récents", oldest: "Plus anciens", topRated: "Mieux notés", mostVoted: "Plus votés", titleAZ: "Titre (A–Z)", previous: "Précédent", next: "Suivant", retry: "Réessayer", loadingMovies: "Chargement des films…", loadingSeries: "Chargement des séries…", empty: "Aucun résultat trouvé.",
        movie: "Film", tv: "Série", details: "Voir les détails", upcoming: "Prochaines sorties", popularSeries: "Séries populaires", topSeries: "Séries les mieux notées", topMovies: "Films les mieux notés", viewAll: "Tout voir", similarMovies: "Films similaires", similarSeries: "Séries similaires", cast: "Distribution", trailer: "Voir la bande-annonce", votes: "votes", season: "saison", seasons: "saisons",
        episodes: "Épisodes", loadingEpisodes: "Chargement des épisodes…", noEpisodes: "Cette saison ne contient pas encore d’épisodes.", episodeUnavailable: "Cet épisode n’est pas encore disponible.", noDescription: "Aucune description disponible.", closePlayer: "Fermer le lecteur", exclusive: "Contenu exclusif", episodeRestricted: "Cet épisode est réservé aux utilisateurs invités.", enterCodeToPlay: "Saisissez votre code d’accès pour le lire.", enterCode: "Saisir le code",
        page: "Page", of: "sur", loadDetailError: "Impossible de charger la fiche.", backToCatalog: "Retour au catalogue", movieRestricted: "Ce film est réservé aux utilisateurs invités.", credentialInvalid: "Le format de l’identifiant TMDB n’est pas valide.", credentialRejected: "TMDB a refusé l’identifiant configuré.", catalogLoadError: "Impossible de charger le catalogue.", couldNotLoad: "Impossible de charger",
        loadingContent: "Chargement du contenu…", accessActive: "ACCÈS ACTIF", roomReady: "Votre salle est prête", unlockedUntil: "Le lecteur restera déverrouillé jusqu’au", exploreCatalog: "Explorer le catalogue", closeAccess: "Fermer l’accès sur cet appareil", accessFilmify: "ACCÈS FILMIFY", unlockViewer: "Déverrouiller le lecteur", accessSubtitle: "Saisissez le code reçu pour regarder les films et épisodes.", accessCode: "Code d’accès", verifying: "Vérification…", unlockAccess: "Déverrouiller l’accès", accessNote: "L’accès est conservé uniquement sur cet appareil pendant 7 jours.", rights: "Tous droits réservés.", license: "Licence MIT", manageAccess: "Gérer l’accès", enterAccessCode: "Saisir le code d’accès", navigateHint: "pour naviguer · Entrée pour ouvrir", openSearch: "Ouvrir la recherche", closeSearch: "Fermer la recherche", openMenu: "Ouvrir le menu", closeMenu: "Fermer le menu", playEpisode: "Lire l’épisode", unavailableEpisode: "Épisode indisponible",
    },
};

const LanguageContext = createContext(null);

export function LanguageProvider({children}) {
    const [language, setLanguageState] = useState(() => {
        const saved = localStorage.getItem("filmify-language");
        return languages[saved] ? saved : "es-ES";
    });

    const setLanguage = (nextLanguage) => {
        if (!languages[nextLanguage]) return;
        localStorage.setItem("filmify-language", nextLanguage);
        document.documentElement.lang = nextLanguage.slice(0, 2);
        setLanguageState(nextLanguage);
    };

    useEffect(() => {
        document.documentElement.lang = language.slice(0, 2);
    }, [language]);

    const value = useMemo(() => ({language, locale: languages[language].locale, languages, setLanguage, t: (key) => messages[language][key] ?? messages["es-ES"][key] ?? key}), [language]);
    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// El hook vive junto al proveedor para mantener una única fuente de verdad del idioma.
// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage debe usarse dentro de LanguageProvider");
    return context;
}

import {useEffect, useState} from "react";
import {IoSearchSharp, IoMenu, IoClose, IoKeyOutline, IoHomeOutline, IoFilmOutline, IoTvOutline} from "react-icons/io5";
import {NavLink} from "react-router-dom";

import {useAuth} from "../Auth/AuthContext.jsx";
import {SearchBar} from "../header/SearchBar.jsx";
import {LanguageSelector} from "../Language/LanguageSelector.jsx";
import {useLanguage} from "../Language/LanguageContext.jsx";
import "../../styles/Header.css";


export function Header() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const {hasAccess} = useAuth();
    const {t} = useLanguage();
    const userPath = "/auth";
    const userLabel = hasAccess ? t("manageAccess") : t("enterAccessCode");

    useEffect(() => {
        if (!isNavOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = previousOverflow; };
    }, [isNavOpen]);

    // Función para cerrar ambos modales, por ejemplo al hacer clic en el logo
    const closeAllModals = () => {
        setIsNavOpen(false);
        setIsSearchOpen(false);
    }

    // Función para cerrar solo el menú (usado en los links)
    const closeNav = () => {
        setIsNavOpen(false);
    }

    // Alterna la búsqueda y se asegura de que el menú esté cerrado
    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        setIsNavOpen(false); // Cerramos el nav si abrimos la búsqueda
    }

    // Alterna el menú y se asegura de que la búsqueda esté cerrada
    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
        setIsSearchOpen(false); // Cerramos la búsqueda si abrimos el nav
    }

    // Añadimos clases al header para controlar el layout en móvil
    const headerClasses = `
        main-header
        ${isNavOpen ? 'nav-open' : ''}
        ${isSearchOpen ? 'search-open' : ''}
    `;

    // Componente reutilizable para el icono (sin cambios)
    const UserIconLink = ({className}) => (
        <NavLink
            to={userPath}
            className={({isActive}) => isActive ? `${className} active` : className}
            onClick={closeAllModals}
            aria-label={userLabel}
            // Opcional: Añadir un title para que al pasar el ratón sepa qué hará
            title={userLabel}
        >
            <IoKeyOutline/>
        </NavLink>
    );

    return (
        // Usamos <header> como contenedor principal, sin <Fragment> extra
        <header className={headerClasses}>
            <h1 className="logo">
                <NavLink to="/" onClick={closeAllModals}>FILMIFY</NavLink>
            </h1>

            {/* El contenedor de la searchbar mantiene su clase para el CSS desktop */}
            {/* y gana una clase activa para el CSS móvil */}
            <div className={`search-bar-container ${isSearchOpen ? 'mobile-search-active' : ''}`}>
                <SearchBar autoFocus={isSearchOpen}/>
            </div>

            {/* La navegación también gana una clase activa para el CSS móvil */}
            <nav className={`main-nav ${isNavOpen ? 'mobile-nav-active' : ''}`}>
                <span className="mobile-nav-label">{t("explore")}</span>
                <ul className="nav-list">
                    <li>
                        <NavLink
                            to="/"
                            end
                            className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                            onClick={closeNav} // Cerramos el menú al hacer clic
                        >
                            <IoHomeOutline aria-hidden="true" />
                            <span><strong>{t("home")}</strong><small>{t("homeHint")}</small></span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/films"
                            className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                            onClick={closeNav} // Cerramos el menú al hacer clic
                        >
                            <IoFilmOutline aria-hidden="true" />
                            <span><strong>{t("movies")}</strong><small>{t("moviesHint")}</small></span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/series"
                            className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                            onClick={closeNav} // Cerramos el menú al hacer clic
                        >
                            <IoTvOutline aria-hidden="true" />
                            <span><strong>{t("series")}</strong><small>{t("seriesHint")}</small></span>
                        </NavLink>
                    </li>
                </ul>
            </nav>

            <div className="desktop-user-actions">
                <LanguageSelector />
                <UserIconLink className="user-icon-link"/>
            </div>

            {/* --- BOTONES DE TOGGLE PARA MÓVIL --- */}
            <div className="mobile-toggles">
                <div className="mobile-user-action">
                    <UserIconLink className="mobile-toggle"/>
                </div>

                <LanguageSelector className="language-selector-mobile" />

                <button
                    className="mobile-toggle mobile-search-toggle"
                    onClick={toggleSearch}
                    aria-label={isSearchOpen ? t("closeSearch") : t("openSearch")}
                    aria-expanded={isSearchOpen}
                >
                    {/* Mostramos 'Cerrar' si está abierto, 'Buscar' si está cerrado */}
                    {isSearchOpen ? <IoClose/> : <IoSearchSharp/>}
                </button>

                <button
                    className="mobile-toggle mobile-nav-toggle"
                    onClick={toggleNav}
                    aria-label={isNavOpen ? t("closeMenu") : t("openMenu")}
                    aria-expanded={isNavOpen}
                >
                    {/* Mostramos 'Cerrar' si está abierto, 'Menú' si está cerrado */}
                    {isNavOpen ? <IoClose/> : <IoMenu/>}
                </button>
            </div>

            {/* --- FONDO OSCURO PARA EL MENÚ MÓVIL --- */}
            {isNavOpen && <div className="nav-backdrop" onClick={closeNav}></div>}

        </header>
    );
}

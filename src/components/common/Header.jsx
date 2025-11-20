import {NavLink} from "react-router-dom";

import "../../styles/Header.css"

import {IoSearchSharp, IoMenu, IoClose, IoPersonCircleOutline} from "react-icons/io5";
import {useState} from "react";

import {SearchBar} from "../header/SearchBar.jsx";
import {useAuth} from "../Auth/AuthContext.jsx";


export function Header() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const {user} = useAuth();

    const isUserLoggedIn = !!user;

    const userPath = isUserLoggedIn ? "/profile" : "/auth";
    const userLabel = isUserLoggedIn ? "Mi Perfil" : "Iniciar Sesión";

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
            <IoPersonCircleOutline/>
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
                <SearchBar/>
            </div>

            {/* La navegación también gana una clase activa para el CSS móvil */}
            <nav className={`main-nav ${isNavOpen ? 'mobile-nav-active' : ''}`}>
                <ul className="nav-list">
                    <li>
                        <NavLink
                            to="/"
                            end
                            className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                            onClick={closeNav} // Cerramos el menú al hacer clic
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/films"
                            className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                            onClick={closeNav} // Cerramos el menú al hacer clic
                        >
                            Films
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/series"
                            className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                            onClick={closeNav} // Cerramos el menú al hacer clic
                        >
                            Series
                        </NavLink>
                    </li>
                </ul>
            </nav>

            <div className="desktop-user-actions">
                <UserIconLink className="user-icon-link"/>
            </div>

            {/* --- BOTONES DE TOGGLE PARA MÓVIL --- */}
            <div className="mobile-toggles">
                <div className="mobile-user-action">
                    <UserIconLink className="mobile-toggle"/>
                </div>

                <button
                    className="mobile-toggle mobile-search-toggle"
                    onClick={toggleSearch}
                    aria-label="Toggle search"
                >
                    {/* Mostramos 'Cerrar' si está abierto, 'Buscar' si está cerrado */}
                    {isSearchOpen ? <IoClose/> : <IoSearchSharp/>}
                </button>

                <button
                    className="mobile-toggle mobile-nav-toggle"
                    onClick={toggleNav}
                    aria-label="Toggle navigation"
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

import { NavLink } from "react-router-dom";

import "../styles/Header.css"
import {SearchBar} from "./SearchBar.jsx";

export function Header() {
    return (
        <header className="main-header">
            <h1 className="logo">
                {/* Usamos Link/NavLink para que el logo vuelva a Home */}
                <NavLink to="/">FILMIFY</NavLink>
            </h1>
            <SearchBar/>
            <nav className="main-nav">
                <ul className="nav-list">
                    <li>
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/films"
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        >
                            Films
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/series"
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        >
                            Series
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

import {Link} from "react-router-dom";

export function Header() {
    return (
        <header>
            <h1>Mi App de Películas</h1>
            <nav>
                <Link to="/">Home</Link> |
                <Link to="/films">Films</Link> |
                <Link to="/series">Series</Link>
            </nav>
        </header>
    );
}

/*

 */
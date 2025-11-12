import {Link} from "react-router-dom";
import "../../styles/Search.css"


export function SearchItem({ id, title, poster_path, type, onSelect }) {
    // La ruta será, por ejemplo: /tv/71912 o /movie/1571470
    const detailLink = `/${type}/${id}`;

    return (
        <Link
            to={detailLink}
            title={`Ver detalles de ${title}`}
            className="search-item-link"
            onClick={onSelect}
        >
            <div className="search-item-content">
                <img
                    src={poster_path}
                    alt={title}
                    className="search-item-poster"
                />
                <div className="search-item-info">
                    <p className="search-item-title">
                        {title}
                    </p>
                </div>
            </div>
        </Link>
    )
}
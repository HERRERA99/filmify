import {Link} from 'react-router-dom';
import {IoStar} from 'react-icons/io5';

import '../../styles/Search.css';

export function SearchItem({id, title, poster, type, year, rating, onSelect}) {
    return <Link to={`/${type}/${id}`} className="search-item-link" onClick={onSelect}>
        <img src={poster} alt="" className="search-item-poster" />
        <div className="search-item-info"><p className="search-item-title">{title}</p><div className="search-item-meta"><span>{type === 'movie' ? 'Película' : 'Serie'}</span>{year && <span>{year}</span>}{rating > 0 && <span className="search-rating"><IoStar />{rating.toFixed(1)}</span>}</div></div>
        <span className="search-item-arrow" aria-hidden="true">↗</span>
    </Link>;
}

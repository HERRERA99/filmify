import { Link } from 'react-router-dom';
import {IoArrowForward} from 'react-icons/io5';

import {IMAGE_W500_URL, POSTER_NO_IMAGE_URL} from "../../constants/api.js";
import "../../styles/MediaCard.css";

export function MediaCard({ posterUrl, title, mediaId, mediaType }) {
    const detailLink = `/${mediaType}/${mediaId}`;
    const posterImageUrl = posterUrl ? `${IMAGE_W500_URL}${posterUrl}` : POSTER_NO_IMAGE_URL;

    return (
        <Link
            to={detailLink}
            title={title}
            className="media-card-link"
        >
            <article className="media-card">
                <img
                    src={posterImageUrl}
                    alt={`Póster de ${title}`}
                    className="poster-media-card"
                />
                <div className="media-card-overlay" aria-hidden="true" />
                <div className="media-card-info">
                    <p className="media-card-title">{title}</p>
                    <span className="media-card-action">Ver detalles <IoArrowForward /></span>
                </div>
            </article>
        </Link>
    );
}

import React from 'react';
import { Link } from 'react-router-dom';

import {IMAGE_W500_URL, POSTER_NO_IMAGE_URL} from "../../constants/api.js";
import "../../styles/MediaCard.css";

export function MediaCard({ posterUrl, title, mediaId, mediaType }) {
    const detailLink = `/${mediaType}/${mediaId}`;
    const posterImageUrl = posterUrl ? `${IMAGE_W500_URL}${posterUrl}` : POSTER_NO_IMAGE_URL;

    return (
        <Link
            to={detailLink}
            title={title}
            className="media-card-link no-underline text-white"
        >
            <div className="media-card relative group rounded-lg overflow-hidden shadow-lg transform hover:scale-[1.03] transition-transform duration-300">
                <img
                    src={posterImageUrl}
                    alt={`Póster de ${title}`}
                    className="poster-media-card w-full h-auto object-cover rounded-lg"
                />
                <p className="media-card-title mt-2 text-white text-sm font-semibold text-center">
                    {title}
                </p>
            </div>
        </Link>
    );
}

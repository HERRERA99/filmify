import {IMAGE_W500_URL, POSTER_NO_IMAGE_URL} from "../constants/api.js";

import "../styles/PersonCard.css"
import React from "react";

export function PersonCard({profilePath, name, role}) {
    const profileImageUrl = profilePath ? `${IMAGE_W500_URL}${profilePath}` : POSTER_NO_IMAGE_URL;

    return (
        <>
            <div className="media-card-container">
                <div
                    className="person-card relative group rounded-lg overflow-hidden shadow-lg transform hover:scale-[1.03] transition-transform duration-300">

                    {/* La imagen sigue siendo w-full para rellenar este contenedor */}
                    <img
                        src={profileImageUrl}
                        alt={`Póster de ${name}`}
                        className="poster-person-card w-full h-auto object-cover rounded-lg"
                        // ...
                    />
                </div>

                {/* Título (sigue fuera) */}
                <p className="poster-person-name mt-2 text-white text-sm font-semibold text-center truncate">
                    {name}
                </p>
                <p className="person-card-role mt-2 text-white text-sm font-semibold text-center truncate">
                    {role}
                </p>
            </div>
        </>
    );
}
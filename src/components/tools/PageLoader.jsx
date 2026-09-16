import React from "react";
import "../../styles/PageLoader.css";

export function PageLoader() {
    return (
        <div className="page-loader">
            <div className="spinner"></div>
            <p>Cargando contenido…</p>
        </div>
    );
}

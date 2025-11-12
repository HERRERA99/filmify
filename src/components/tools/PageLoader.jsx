import React from "react";
import "../../styles/PageLoader.css";

export function PageLoader() {
    return (
        <div className="page-loader">
            <div className="spinner"></div>
            <p>Loading content...</p>
        </div>
    );
}
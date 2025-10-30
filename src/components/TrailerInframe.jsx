import "../styles/TrailerInfame.css"

export function TrailerInframe({urlTrailer}) {
    return (
        // New container to control size and centering
        <div className="trailer-section-container">
            <div className="video-responsive">
                <iframe
                    src={urlTrailer}
                    title="Video dinámico de la API"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    )
}
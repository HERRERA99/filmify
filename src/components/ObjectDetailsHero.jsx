import "../styles/ObjectDetailsHero.css"

export function ObjectDetailsHero({title, overview, genres = [], posterUrl, backgroundImage, number_of_seasons, runtime, first_air_date}) {
    const isMovie = runtime != null;

    return (
        <>
            <div
                className="details-container"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="overlay"></div>
                <div className="gradient-overlay"></div>

                <div className="content-details-wrapper">
                    {/* Póster a la derecha */}
                    {posterUrl && (
                        <div className="poster-details-container">
                            <img className="poster-details-img" src={posterUrl} alt={title}/>
                        </div>
                    )}

                    {/* Contenido de texto a la izquierda */}
                    <div className="details-text-content">
                        <h1 className="details-title">{title}</h1>
                        <div className="genres-container">
                            {genres.map((genre) => (
                                <p key={genre.id} className="genre-tag-bordered">{genre.name}</p>
                            ))}
                        </div>
                        {isMovie ? (
                            <p className="duration-info">{first_air_date} | {runtime} min</p>
                        ) : (
                            <p className="duration-info">
                                {first_air_date} | {number_of_seasons} {number_of_seasons === 1 ? 'season' : 'seasons'}
                            </p>
                        )}
                        <p className="details-overview">{overview}</p>
                    </div>
                </div>
            </div>
        </>
    )
}
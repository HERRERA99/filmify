import "../styles/ObjectDetailsHero.css"
import {IMAGE_W500_URL, POSTER_NO_IMAGE_URL} from "../constants/api.js";

export function ObjectDetailsHero({title, overview, genres = [], posterUrl, backgroundImage, number_of_seasons, runtime, first_air_date, rating, numVotes}) {
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
                        <div className="valoration-container">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"/></svg>
                            <p>{rating} / 10 ({numVotes} Votes) </p>
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
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

import { MediaCard } from "./MediaCard.jsx";

import "../../styles/BasicCategorieCarrousel.css";
import 'swiper/css';

export function BasicCategorieCarrousel({ title, mediaList, viewMoreLink, mediaType }) {
    if (!mediaList || mediaList.length === 0) {
        return null;
    }

    return (
            <section className="category-carrousel-section">
            {/* Cabecera de la Sección: Título y Botón Ver Más */}
                <div className="section-header">
                <h2 className="titulo-seccion">
                    {title}
                </h2>
                {viewMoreLink &&  (
                    <Link
                        to={viewMoreLink}
                        className="view-more-button"
                    >
                        Ver todo
                    </Link>
                )}
            </div>

            {/* Carrusel de Posters (Implementado con Swiper) */}
            <div className="category-slider">
                <Swiper
                    // Propiedades clave para el arrastre:
                    grabCursor={true} // Cambia el cursor para indicar arrastre
                    slidesPerView={'auto'} // Muestra tantas slides como quepan
                    spaceBetween={12} // Espacio entre cada slide (equivalente a gap-3)
                    freeMode={true} // Permite el desplazamiento libre y la inercia
                >
                    {mediaList.map((media) => (
                        <SwiperSlide
                            key={media.id}
                            className="category-media-slide"
                        >
                            <MediaCard
                                posterUrl={media.poster_path}
                                title={media.title || media.name}
                                mediaId={media.id}
                                mediaType={mediaType}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}

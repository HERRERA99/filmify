import React from 'react';
import { Link } from 'react-router-dom';

import { MediaCard } from "./MediaCard.jsx";

import "../../styles/BasicCategorieCarrousel.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export function BasicCategorieCarrousel({ title, mediaList, viewMoreLink, mediaType }) {
    if (!mediaList || mediaList.length === 0) {
        return null;
    }

    return (
        <section className="category-carrousel-section my-8">
            {/* Cabecera de la Sección: Título y Botón Ver Más */}
            <div className="section-header flex justify-between items-center mb-4 px-4 sm:px-6">
                <h2 className="titulo-seccion text-2xl md:text-3xl text-white">
                    {title}
                </h2>
                {viewMoreLink &&  (
                    <Link
                        to={viewMoreLink}
                        className="view-more-button text-sm font-semibold transition-colors whitespace-nowrap"
                    >
                        View More
                    </Link>
                )}
            </div>

            {/* Carrusel de Posters (Implementado con Swiper) */}
            <div className="swiper-slide px-4 sm:px-6">
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
                            className="w-36 sm:w-48 lg:w-56"
                            style={{ width: 'auto' }}
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
import {Swiper, SwiperSlide} from "swiper/react";
import React, {useEffect, useState} from "react";
import {PersonCard} from "./PersonCard.jsx";
import "../styles/CreditsSlide.css"

export function CreditsSlide({url}) {
    const [persons, setPersons] = useState([]);

    const fetchPersons = async () => {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setPersons(data.cast);

        } catch (error) {
            console.error("Error fetching credits:", error);
        }
    }

    useEffect(() => {
        fetchPersons();
    }, []);

    return (
        <>
            <section className="cast-carrousel-section my-8">
                {/* Cabecera de la Sección: Título y Botón Ver Más */}
                <div className="cast-section-header flex justify-between items-center mb-4 px-4 sm:px-6">
                    <h2 className="cast-titulo-seccion text-2xl md:text-3xl text-white">
                        Cast
                    </h2>
                </div>
                <div className="swiper-slide px-4 sm:px-6">
                    <Swiper
                        // Propiedades clave para el arrastre:
                        grabCursor={true} // Cambia el cursor para indicar arrastre
                        slidesPerView={'auto'} // Muestra tantas slides como quepan
                        spaceBetween={12} // Espacio entre cada slide (equivalente a gap-3)
                        freeMode={true} // Permite el desplazamiento libre y la inercia
                    >
                        {persons.map((media) => (
                            <SwiperSlide
                                key={media.id}
                                className="w-36 sm:w-48 lg:w-56"
                                style={{width: 'auto'}}
                            >
                                <PersonCard
                                    key={media.id}
                                    profilePath={media.profile_path}
                                    name={media.name}
                                    role={media.character}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>
        </>
    )
}
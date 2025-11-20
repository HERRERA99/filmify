// src/components/common/ContentLock.jsx
import React from 'react';
import '../../styles/StreamingContainer.css';

export function ContentLock() {
    //const navigate = useNavigate();

    const handleLoginClick = () => {
        // Redirigir a tu página de login cuando la tengas creada
        // navigate('/login');
        alert("Funcionalidad de Login próximamente. (Redirigiría a /login)");
    };

    return (
        <div className="lock-screen-container">
            <div className="lock-screen">
                {/* Icono de Candado (SVG simple) */}
                <div className="lock-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </div>

                <h3>Contenido Exclusivo</h3>
                <p>Este título está reservado para miembros registrados.</p>
                <p>Solicita una cuenta para disfrutar del contenido.</p>

                <button className="btn-login" onClick={handleLoginClick}>
                    Iniciar Sesión / Solicitar Acceso
                </button>
            </div>
        </div>
    );
}
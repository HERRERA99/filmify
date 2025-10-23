import React from 'react';
import { IconBrandTwitter, IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react';
import '../styles/Footer.css';

const SimpleAppLogo = ({ size }) => (
    <span style={{ fontSize: size, fontWeight: 'bold' }}>FILMIFY</span>
);

export function Footer() {
    // Obtener el año actual para el copyright
    const currentYear = new Date().getFullYear();

    return (
        <div className="footer-container">
            <div className="footer-inner">
                {/* Contenedor para el logo, copyright y licencia */}
                <div className="logo-copyright-group">
                    <SimpleAppLogo size={28} />
                    <span className="copyright">
                        &copy; {currentYear} FILMIFY. Todos los derechos reservados.
                    </span>
                    <a href="/ruta-a-la-licencia" className="license-link">Licencia MIT</a>
                </div>

                <div className="social-links-group"> {/* Se va a la derecha */}
                    <a
                        href="https://x.com/DevHerrera99"
                        className="social-icon"
                        aria-label="Twitter"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <IconBrandTwitter
                            size={18}
                            stroke={1.5}
                        />
                    </a>

                    <a
                        href="https://github.com/HERRERA99"
                        className="social-icon"
                        aria-label="GitHub"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <IconBrandGithub
                            size={18}
                            stroke={1.5}
                        />
                    </a>

                    <a
                        href="https://www.linkedin.com/in/aitor-angulo-salas-b81356257/"
                        className="social-icon"
                        aria-label="LinkedIn"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <IconBrandLinkedin
                            size={18}
                            stroke={1.5}
                        />
                    </a>
                </div>
            </div>
        </div>
    );
}
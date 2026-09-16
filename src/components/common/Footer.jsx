import {useLanguage} from "../Language/LanguageContext.jsx";

import '../../styles/Footer.css';

const SimpleAppLogo = ({ size }) => (
    <span style={{ fontSize: size, fontWeight: 'bold' }}>FILMIFY</span>
);

export function Footer() {
    const {t} = useLanguage();
    // Obtener el año actual para el copyright
    const currentYear = new Date().getFullYear();

    return (
        <div className="footer-container">
            <div className="footer-inner">
                {/* Contenedor para el logo, copyright y licencia */}
                <div className="logo-copyright-group">
                    <SimpleAppLogo size={28} />
                    <span className="copyright">
                        &copy; {currentYear} FILMIFY. {t("rights")}
                    </span>
                    <a
                        href="https://mit-license.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="license-link"
                    >
                        {t("license")}
                    </a>
                </div>
            </div>
        </div>
    );
}

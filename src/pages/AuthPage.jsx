import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {IoKeyOutline, IoShieldCheckmarkOutline} from 'react-icons/io5';

import {useAuth} from '../components/Auth/AuthContext.jsx';
import {useLanguage} from '../components/Language/LanguageContext.jsx';
import '../styles/AuthPage.css';

export function AuthPage() {
    const {hasAccess, unlock, lock, accessExpiresAt} = useAuth();
    const {locale, t} = useLanguage();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault(); setError(''); setLoading(true);
        try { await unlock(code); navigate('/'); } catch (err) { setError(err.message); } finally { setLoading(false); }
    };
    if (hasAccess) return <main className="access-page"><section className="access-card access-active">
        <IoShieldCheckmarkOutline className="access-icon" /><p className="eyebrow">{t("accessActive")}</p><h2>{t("roomReady")}</h2>
        <p>{t("unlockedUntil")} {new Date(accessExpiresAt).toLocaleDateString(locale)}.</p>
        <button className="auth-submit-btn" onClick={() => navigate('/')}>{t("exploreCatalog")}</button><button className="text-action" onClick={lock}>{t("closeAccess")}</button>
    </section></main>;
    return <main className="access-page"><section className="access-card">
        <div className="access-icon-wrap"><IoKeyOutline className="access-icon" /></div><p className="eyebrow">{t("accessFilmify")}</p><h2>{t("unlockViewer")}</h2>
        <p className="auth-subtitle">{t("accessSubtitle")}</p>
        <form className="auth-form" onSubmit={handleSubmit}><label htmlFor="access-code">{t("accessCode")}</label>
            <input id="access-code" value={code} onChange={(event) => setCode(event.target.value)} placeholder="Ej. FILMIFY-2026" autoComplete="one-time-code" required />
            {error && <p className="form-error" role="alert">{error}</p>}<button className="auth-submit-btn" disabled={loading}>{loading ? t("verifying") : t("unlockAccess")}</button>
        </form><p className="access-note">{t("accessNote")}</p>
    </section></main>;
}

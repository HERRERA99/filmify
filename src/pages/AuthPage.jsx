import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {IoKeyOutline, IoShieldCheckmarkOutline} from 'react-icons/io5';

import {useAuth} from '../components/Auth/AuthContext.jsx';
import '../styles/AuthPage.css';

export function AuthPage() {
    const {hasAccess, unlock, lock, accessExpiresAt} = useAuth();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault(); setError(''); setLoading(true);
        try { await unlock(code); navigate('/'); } catch (err) { setError(err.message); } finally { setLoading(false); }
    };
    if (hasAccess) return <main className="access-page"><section className="access-card access-active">
        <IoShieldCheckmarkOutline className="access-icon" /><p className="eyebrow">ACCESO ACTIVO</p><h2>Tu sala está lista</h2>
        <p>El visualizador permanecerá desbloqueado hasta el {new Date(accessExpiresAt).toLocaleDateString('es-ES')}.</p>
        <button className="auth-submit-btn" onClick={() => navigate('/')}>Explorar catálogo</button><button className="text-action" onClick={lock}>Cerrar acceso en este dispositivo</button>
    </section></main>;
    return <main className="access-page"><section className="access-card">
        <div className="access-icon-wrap"><IoKeyOutline className="access-icon" /></div><p className="eyebrow">ACCESO FILMIFY</p><h2>Desbloquea el visualizador</h2>
        <p className="auth-subtitle">Introduce el código que te han facilitado para ver películas y episodios.</p>
        <form className="auth-form" onSubmit={handleSubmit}><label htmlFor="access-code">Código de acceso</label>
            <input id="access-code" value={code} onChange={(event) => setCode(event.target.value)} placeholder="Ej. FILMIFY-2026" autoComplete="one-time-code" required />
            {error && <p className="form-error" role="alert">{error}</p>}<button className="auth-submit-btn" disabled={loading}>{loading ? 'Verificando…' : 'Desbloquear acceso'}</button>
        </form><p className="access-note">El acceso se guarda solo en este dispositivo durante 7 días.</p>
    </section></main>;
}

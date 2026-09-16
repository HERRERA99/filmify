// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [access, setAccess] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('filmify-access'));
            return saved?.expiresAt > Date.now() ? saved : null;
        } catch { return null; }
    });

    useEffect(() => {
        if (access?.expiresAt <= Date.now()) {
            localStorage.removeItem('filmify-access');
            setAccess(null);
        }
    }, [access]);

    const unlock = async (code) => {
        const response = await fetch('/api/verify-access', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({code}),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || 'No se pudo validar el código.');
        const nextAccess = { expiresAt: data.expiresAt };
        localStorage.setItem('filmify-access', JSON.stringify(nextAccess));
        setAccess(nextAccess);
    };

    const lock = () => {
        localStorage.removeItem('filmify-access');
        setAccess(null);
    };

    const value = useMemo(() => ({
        hasAccess: Boolean(access),
        accessExpiresAt: access?.expiresAt ?? null,
        unlock,
        lock,
    }), [access]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personalizado para usar el contexto fácilmente
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}

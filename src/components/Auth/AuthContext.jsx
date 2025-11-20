// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

import { supabase } from "./supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    // Función auxiliar para chequear el perfil
    const checkUserStatus = async (userId) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error("Error fetching profile:", error);
            return null;
        }
        return data;
    };

    useEffect(() => {
        // 1. Verificar sesión actual al cargar la app
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // 2. Escuchar cambios (login, logout, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Función de Registro
    const signUp = async (email, password, firstName, lastName) => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                },
            },
        });
        if (error) throw error;
        return data;
    }

    // Función de Login manual
    const signIn = async (email, password) => {
        // 1. Intentar loguear en Auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        // 2. Verificar status inmediatamente después del login exitoso
        if (data.user) {
            const profile = await checkUserStatus(data.user.id);
            if (profile && profile.approved !== true) {
                await supabase.auth.signOut();
                throw new Error("Your account is pending approval by an administrator.");
            }
        }
        return data;
    };

    // Función expuesta para obtener los datos
    const value = {
        session,
        user: session?.user,
        signUp,
        signIn, // Usamos nuestra versión modificada de signIn
        signOut: () => supabase.auth.signOut(),
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

// Hook personalizado para usar el contexto fácilmente
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}
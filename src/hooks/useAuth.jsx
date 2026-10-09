
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseService';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {

            setLoading(false);
            return;
        }
        
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        }).catch(() => setLoading(false));

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const configured = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
    const unavailable = () => Promise.resolve({ error: { message: 'Account sign-in is not configured yet. You can explore the demo instead.' } });
    const signUp = (email, password) => configured ? supabase.auth.signUp({ email, password }) : unavailable();
    const signIn = (email, password) => configured ? supabase.auth.signInWithPassword({ email, password }) : unavailable();
    const signOut = () => supabase.auth.signOut();
    const signInWithGoogle = () =>
        configured ? supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/app` },
        }) : unavailable();

    return { user, loading, signUp, signIn, signOut, signInWithGoogle };
};

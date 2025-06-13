import { createContext , useState, useEffect } from "react";
import supabase from "../config/supabaseClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {

        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
            console.log("Initial session:", session);
        };
        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("Auth state changed:", event, session);
            setUser(session?.user || null);
            
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    

    const value = {
        user,
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signUp: (data) => supabase.auth.signUp(data),
        signOut: () => supabase.auth.signOut(),
        resetPassword: (email) => supabase.auth.resetPasswordForEmail(email),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}

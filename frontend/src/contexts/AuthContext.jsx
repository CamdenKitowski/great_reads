import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const API_BASE_URL = 'https://great-reads-backend.vercel.app' // backend project URL
    // const API_BASE_URL = 'http://localhost:3001'; // this is where the backend server is running -- need to change this

    useEffect(() => {
        const getSession = async () => {
            // this access token is the JWT token to authenticate request - it is not my supabase key
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                setUser(null);
                return;
            }
            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/session?access_token=${accessToken}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const { user } = await response.json();
                setUser(user || null);
            } catch (err) {
                console.error('Error fetching session:', err.message);
                setUser(null);
                localStorage.removeItem('access_token');
            }
        };
        getSession();

        // No auth state change listener needed since session is managed server-side
    }, [API_BASE_URL]);
    const signIn = async (data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || 'Sign-in failed');
            }
            const { user, session } = await response.json();
            localStorage.setItem('access_token', session.access_token);
            setUser(user);
            return { data: { user, session }, error: null };
        } catch (err) {
            console.error('Sign-in error:', err.message);
            return { data: null, error: err.message };
        }
    };

    const signUp = async (data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || 'Sign-up failed');
            }
            const { user, session } = await response.json();
            localStorage.setItem('access_token', session.access_token);
            setUser(user);
            return { data: { user, session }, error: null };
        } catch (err) {
            console.error('Sign-up error:', err.message);
            return { data: null, error: err.message };
        }
    };

    const signOut = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/signout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                throw new Error('Sign-out failed');
            }
            localStorage.removeItem('access_token');
            setUser(null);
            return { error: null };
        } catch (err) {
            console.error('Sign-out error:', err.message);
            return { error: err.message };
        }
    };

    const resetPassword = async (email) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || 'Password reset failed');
            }
            const { message } = await response.json(); // Extract message from response
            console.log('Sending message to this email: ', email);
            return { data: { message }, error: null };
        } catch (err) {
            console.error('Password reset error:', err.message);
            return { data: null, error: err.message };
        }
    };

    const updatePassword = async (token, newPassword) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/reset-password-confirm`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });
            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || 'Password update failed');
            }
            const { message } = await response.json();
            return { data: { message }, error: null };
        } catch (err) {
            console.error('Password update error:', err.message);
            return { data: null, error: err.message };
        }
    };

    const value = {
        user,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        API_BASE_URL,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}

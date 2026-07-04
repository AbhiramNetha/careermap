import { createContext, useContext, useEffect, useState } from 'react';
import { auth, onAuthStateChanged, logOut } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsub;
    }, []);

    const handleLogOut = async () => {
        localStorage.removeItem('w2f-premium');
        await logOut();
    };

    const value = { currentUser, logOut: handleLogOut };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

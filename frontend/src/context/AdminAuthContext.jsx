import { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin as apiAdminLogin } from '../services/adminApi';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
    const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken'));
    const [adminUser, setAdminUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('adminUser')); } catch { return null; }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function login(email, password) {
        setLoading(true);
        setError('');
        try {
            const data = await apiAdminLogin(email, password);
            setAdminToken(data.token);
            setAdminUser(data.admin);
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUser', JSON.stringify(data.admin));
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    }

    function logout() {
        setAdminToken(null);
        setAdminUser(null);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
    }

    return (
        <AdminAuthContext.Provider value={{ adminToken, adminUser, login, logout, loading, error, isLoggedIn: !!adminToken }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    return useContext(AdminAuthContext);
}

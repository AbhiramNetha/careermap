import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * Hook that returns a gate function.
 * Call `requireLogin(callback)` before any action that needs auth.
 * If the user is logged in, the callback runs immediately.
 * If not, a toast is shown and the user is redirected to /login.
 */
export function useLoginGate() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    function requireLogin(callback) {
        if (currentUser) {
            return callback();
        }
        toast('Please login to continue', {
            icon: '🔒',
            style: {
                borderRadius: '10px',
                background: 'var(--bg-navbar, #1e293b)',
                color: 'var(--text-primary, #f8fafc)',
                fontWeight: 600,
            },
        });
        navigate('/login', { state: { from: location } });
    }

    return { requireLogin, isLoggedIn: !!currentUser };
}

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wrap any <Route> with <ProtectedRoute> to require authentication.
 * Unauthenticated users are sent to /login.
 * After signing in they are redirected back to the page they tried to open.
 */
export default function ProtectedRoute({ children }) {
    const { currentUser } = useAuth();
    const location = useLocation();

    if (!currentUser) {
        // Save where the user was going so we can redirect after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

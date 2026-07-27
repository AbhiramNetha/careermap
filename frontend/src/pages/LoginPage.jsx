import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthenticationLayout from '../components/auth/AuthenticationLayout';
import LoginForm from '../components/auth/LoginForm';
import { loginWithEmail, signInWithGoogle } from '../firebase';
import posthog from '../posthog.js';

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const from = location.state?.from?.pathname || '/';
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleEmailLogin({ email, password }) {
        setError('');
        setLoading(true);
        try {
            const { user } = await loginWithEmail(email, password);
            posthog.identify(user.uid, { email: user.email, name: user.displayName });
            posthog.capture('user_logged_in', { method: 'email' });
            sessionStorage.setItem('justLoggedInForQuiz', 'true');
            navigate(from, { replace: true });
        } catch (err) {
            posthog.captureException(err, { method: 'email' });
            setError(friendlyError(err.code));
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleLogin() {
        setError('');
        setLoading(true);
        try {
            const { user } = await signInWithGoogle();
            posthog.identify(user.uid, { email: user.email, name: user.displayName });
            posthog.capture('user_logged_in', { method: 'google' });
            sessionStorage.setItem('justLoggedInForQuiz', 'true');
            navigate(from, { replace: true });
        } catch (err) {
            if (err.code !== 'auth/popup-closed-by-user') {
                posthog.captureException(err, { method: 'google' });
                setError(friendlyError(err.code));
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthenticationLayout
            title="Welcome back"
            subtitle="Sign in to continue your career journey"
            bottom={(
                <p className="auth-switch">
                    Don&apos;t have an account?{' '}
                    <Link to="/signup" state={{ from: { pathname: from } }} className="auth-switch-link">Create one</Link>
                </p>
            )}
        >
            <LoginForm
                onEmailLogin={handleEmailLogin}
                onGoogleLogin={handleGoogleLogin}
                onPhoneLogin={() => setError('Phone login UI is ready, but phone auth is not configured yet.')}
                loading={loading}
                error={error}
            />
        </AuthenticationLayout>
    );
}


function friendlyError(code) {
    const map = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/account-exists-with-different-credential':
            'An account already exists with a different sign-in method.',
        'auth/popup-blocked': 'Pop-up was blocked. Please allow pop-ups for this site.',
        'auth/invalid-credential': 'Invalid credentials. Please check and try again.',
    };
    return map[code] ?? `Sign-in failed (${code}). Check browser console for details.`;
}

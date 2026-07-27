import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthenticationLayout from '../components/auth/AuthenticationLayout';
import SignupForm from '../components/auth/SignupForm';
import { signInWithGoogle, signUpWithEmail, updateUserProfile } from '../firebase';
import posthog from '../posthog.js';

export default function SignupPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleEmailSignup({ firstName, lastName, email, password }) {
        setError('');
        setLoading(true);
        try {
            const { user } = await signUpWithEmail(email, password);
            const displayName = `${firstName} ${lastName}`.trim();
            await updateUserProfile(user, { displayName });
            posthog.identify(user.uid, { email: user.email, name: displayName });
            posthog.capture('user_signed_up', { method: 'email' });
            sessionStorage.setItem('justLoggedInForQuiz', 'true');
            navigate(from, { replace: true });
        } catch (err) {
            posthog.captureException(err, { method: 'email' });
            setError(friendlyError(err.code));
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleSignup() {
        setError('');
        setLoading(true);
        try {
            const { user } = await signInWithGoogle();
            posthog.identify(user.uid, { email: user.email, name: user.displayName });
            posthog.capture('user_signed_up', { method: 'google' });
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
            title="Create your account"
            subtitle="Join students finding their best-fit career path"
            bottom={(
                <p className="auth-switch">
                    Already have an account?{' '}
                    <Link to="/login" state={{ from: { pathname: from } }} className="auth-switch-link">Sign in</Link>
                </p>
            )}
        >
            <SignupForm
                onEmailSignup={handleEmailSignup}
                onGoogleSignup={handleGoogleSignup}
                onPhoneSignup={() => setError('Phone signup UI is ready, but phone auth is not configured yet.')}
                loading={loading}
                error={error}
            />
        </AuthenticationLayout>
    );
}

function friendlyError(code) {
    const map = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/account-exists-with-different-credential':
            'An account already exists with a different sign-in method.',
        'auth/popup-blocked': 'Pop-up was blocked. Please allow pop-ups for this site.',
    };
    return map[code] ?? `Sign-in failed (${code}). Check browser console for details.`;
}

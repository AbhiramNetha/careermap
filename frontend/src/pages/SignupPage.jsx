import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    signUpWithEmail,
    updateUserProfile,
    signInWithGoogle,
    signInWithGithub,
    signInWithFacebook,
    signInWithTwitter,
} from '../firebase';

const SOCIAL = [
    {
        id: 'google',
        label: 'Google',
        fn: signInWithGoogle,
        bg: '#ffffff',
        color: '#1f1f1f',
        border: '#dadce0',
        icon: (
            <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.5 1.2 8.9 3.5l6.6-6.6C35.1 2.5 29.9 0 24 0 14.6 0 6.6 5.8 2.8 14.2l7.7 6C12.3 13.5 17.7 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17z" />
                <path fill="#FBBC05" d="M10.5 28.7A14.6 14.6 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.7-6A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l7.9-6z" />
                <path fill="#34A853" d="M24 48c6 0 11-2 14.7-5.4l-7.5-5.8c-2 1.4-4.6 2.2-7.2 2.2-6.3 0-11.7-4.2-13.5-10l-7.9 6C6.5 42.2 14.6 48 24 48z" />
            </svg>
        ),
    },
    {
        id: 'github',
        label: 'GitHub',
        fn: signInWithGithub,
        bg: '#24292e',
        color: '#ffffff',
        border: '#24292e',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
        ),
    },
    {
        id: 'facebook',
        label: 'Facebook',
        fn: signInWithFacebook,
        bg: '#1877f2',
        color: '#ffffff',
        border: '#1877f2',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.026 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.885v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
            </svg>
        ),
    },
    {
        id: 'twitter',
        label: 'X / Twitter',
        fn: signInWithTwitter,
        bg: '#000000',
        color: '#ffffff',
        border: '#000000',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    },
];

/* password-strength helper */
function getStrength(pw) {
    if (!pw) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const map = [
        { level: 0, label: '', color: '' },
        { level: 1, label: 'Weak', color: '#ef4444' },
        { level: 2, label: 'Fair', color: '#f59e0b' },
        { level: 3, label: 'Good', color: '#06b6d4' },
        { level: 4, label: 'Strong', color: '#10b981' },
    ];
    return map[score];
}

export default function SignupPage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const strength = getStrength(password);

    async function handleSignup(e) {
        e.preventDefault();
        setError('');
        if (password !== confirm) { setError('Passwords do not match.'); return; }
        if (!agreed) { setError('Please accept the Terms & Privacy Policy.'); return; }
        setLoading(true);
        try {
            const { user } = await signUpWithEmail(email, password);
            if (name.trim()) await updateUserProfile(user, { displayName: name.trim() });
            navigate('/');
        } catch (err) {
            setError(friendlyError(err.code));
        } finally {
            setLoading(false);
        }
    }

    async function handleSocial(fn) {
        setError('');
        setLoading(true);
        try {
            await fn();
            navigate('/');
        } catch (err) {
            if (err.code !== 'auth/popup-closed-by-user') {
                setError(friendlyError(err.code));
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-orb auth-orb-1" />
            <div className="auth-orb auth-orb-2" />

            <div className="auth-card auth-card--signup">
                {/* header */}
                <div className="auth-card-header">
                    <Link to="/" className="auth-logo">
                        <img src="/logo.png" alt="way2fresher logo" className="auth-logo-img" />
                        way2fresher
                    </Link>
                    <h1 className="auth-title">Create your account</h1>
                    <p className="auth-subtitle">Join 50,000+ students finding their dream career</p>
                </div>

                {/* error */}
                {error && <div className="auth-error">{error}</div>}

                {/* social */}
                <div className="auth-social-grid">
                    {SOCIAL.map(({ id, label, fn, bg, color, border, icon }) => (
                        <button
                            key={id}
                            id={`signup-${id}`}
                            className="auth-social-btn"
                            style={{ '--sb-bg': bg, '--sb-color': color, '--sb-border': border }}
                            onClick={() => handleSocial(fn)}
                            disabled={loading}
                            title={`Sign up with ${label}`}
                        >
                            {icon}
                            <span>{label}</span>
                        </button>
                    ))}
                </div>

                <div className="auth-divider"><span>or create account with email</span></div>

                {/* form */}
                <form className="auth-form" onSubmit={handleSignup}>
                    {/* name */}
                    <div className="auth-field">
                        <label htmlFor="signup-name">Full name</label>
                        <div className="auth-input-wrap">
                            <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            <input
                                id="signup-name"
                                type="text"
                                placeholder="Abhiram Netha"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                autoComplete="name"
                            />
                        </div>
                    </div>

                    {/* email */}
                    <div className="auth-field">
                        <label htmlFor="signup-email">Email address</label>
                        <div className="auth-input-wrap">
                            <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            <input
                                id="signup-email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    {/* password */}
                    <div className="auth-field">
                        <label htmlFor="signup-password">Password</label>
                        <div className="auth-input-wrap">
                            <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <input
                                id="signup-password"
                                type={showPw ? 'text' : 'password'}
                                placeholder="Min. 8 characters"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                minLength={6}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="auth-pw-toggle"
                                onClick={() => setShowPw(v => !v)}
                                tabIndex={-1}
                            >
                                {showPw ? '🙈' : '👁️'}
                            </button>
                        </div>

                        {/* strength bar */}
                        {password && (
                            <div className="auth-strength">
                                <div className="auth-strength-bar">
                                    {[1, 2, 3, 4].map(i => (
                                        <div
                                            key={i}
                                            className="auth-strength-seg"
                                            style={{ background: i <= strength.level ? strength.color : 'rgba(255,255,255,0.1)' }}
                                        />
                                    ))}
                                </div>
                                <span style={{ color: strength.color, fontSize: '0.75rem', fontWeight: 600 }}>
                                    {strength.label}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* confirm */}
                    <div className="auth-field">
                        <label htmlFor="signup-confirm">Confirm password</label>
                        <div className="auth-input-wrap">
                            <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <input
                                id="signup-confirm"
                                type={showPw ? 'text' : 'password'}
                                placeholder="Re-enter password"
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                required
                                autoComplete="new-password"
                                style={{
                                    borderColor: confirm && confirm === password
                                        ? '#10b981'
                                        : confirm
                                            ? '#ef4444'
                                            : undefined,
                                }}
                            />
                        </div>
                    </div>

                    {/* agree */}
                    <label className="auth-checkbox" htmlFor="signup-terms">
                        <input
                            id="signup-terms"
                            type="checkbox"
                            checked={agreed}
                            onChange={e => setAgreed(e.target.checked)}
                        />
                        <span>
                            I agree to the{' '}
                            <a href="#terms" className="auth-switch-link">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#privacy" className="auth-switch-link">Privacy Policy</a>
                        </span>
                    </label>

                    <button
                        id="signup-submit"
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? <span className="auth-spinner" /> : null}
                        {loading ? 'Creating account…' : 'Create Account'}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account?{' '}
                    <Link to="/login" className="auth-switch-link">Sign in</Link>
                </p>
            </div>
        </div>
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

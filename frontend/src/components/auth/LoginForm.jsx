import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
}

export default function LoginForm({
  onEmailLogin,
  onGoogleLogin,
  onPhoneLogin,
  loading,
  error,
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const fieldErrors = useMemo(() => {
    const e = {};
    if (touched.email) {
      if (!email) e.email = 'Email is required.';
      else if (!isValidEmail(email)) e.email = 'Enter a valid email address.';
    }
    if (touched.password && !password) e.password = 'Password is required.';
    return e;
  }, [email, password, touched]);

  async function submit(e) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!email || !password || !isValidEmail(email)) return;
    await onEmailLogin({ email: email.trim(), password });
  }

  return (
    <>
      {error ? <div className="auth-error">{error}</div> : null}

      <div className="auth-provider-grid">
        <button
          type="button"
          className="auth-provider-btn auth-provider-btn--google"
          onClick={onGoogleLogin}
          disabled={loading}
        >
          <span className="auth-provider-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.5 1.2 8.9 3.5l6.6-6.6C35.1 2.5 29.9 0 24 0 14.6 0 6.6 5.8 2.8 14.2l7.7 6C12.3 13.5 17.7 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17z" />
              <path fill="#FBBC05" d="M10.5 28.7A14.6 14.6 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.7-6A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l7.9-6z" />
              <path fill="#34A853" d="M24 48c6 0 11-2 14.7-5.4l-7.5-5.8c-2 1.4-4.6 2.2-7.2 2.2-6.3 0-11.7-4.2-13.5-10l-7.9 6C6.5 42.2 14.6 48 24 48z" />
            </svg>
          </span>
          <span className="auth-provider-label">Continue with Google</span>
        </button>

        <button
          type="button"
          className="auth-provider-btn auth-provider-btn--phone"
          onClick={onPhoneLogin}
          disabled={loading}
        >
          <span className="auth-provider-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.77.6 2.6a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.48-1.12a2 2 0 0 1 2.11-.45c.83.28 1.7.48 2.6.6A2 2 0 0 1 22 16.92z" />
            </svg>
          </span>
          <span className="auth-provider-label">Continue with Phone</span>
        </button>
      </div>

      <div className="auth-divider">
        <span>or sign in with email</span>
      </div>

      <form className="auth-form" onSubmit={submit} noValidate>
        <div className="auth-field">
          <label htmlFor="login-email">Email</label>
          <div className="auth-input-wrap">
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              autoComplete="email"
              required
            />
          </div>
          {fieldErrors.email ? <div className="auth-field-error">{fieldErrors.email}</div> : null}
        </div>

        <div className="auth-field">
          <label htmlFor="login-password">Password</label>
          <div className="auth-input-wrap">
            <input
              id="login-password"
              type={showPw ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="auth-pw-toggle"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? 'Hide' : 'Show'}
            </button>
          </div>
          {fieldErrors.password ? <div className="auth-field-error">{fieldErrors.password}</div> : null}
        </div>

        <div className="auth-row">
          <Link to="/forgot-password" className="auth-link">
            Forgot Password?
          </Link>
        </div>

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? <span className="auth-spinner" /> : null}
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </>
  );
}


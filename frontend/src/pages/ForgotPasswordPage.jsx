import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthenticationLayout from '../components/auth/AuthenticationLayout';
import { requestPasswordReset } from '../firebase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setStatus('');
    setLoading(true);
    try {
      await requestPasswordReset(email.trim());
      setStatus('Password reset email sent. Check your inbox.');
    } catch (err) {
      setError(err?.code ? `Request failed (${err.code}).` : 'Request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthenticationLayout
      title="Reset your password"
      subtitle="We’ll send you a secure reset link."
      bottom={(
        <p className="auth-switch">
          Remembered it?{' '}
          <Link to="/login" className="auth-switch-link">Back to sign in</Link>
        </p>
      )}
    >
      {error ? <div className="auth-error">{error}</div> : null}
      {status ? <div className="auth-success">{status}</div> : null}

      <form className="auth-form" onSubmit={submit}>
        <div className="auth-field">
          <label htmlFor="fp-email">Email</label>
          <div className="auth-input-wrap">
            <input
              id="fp-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
        </div>

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? <span className="auth-spinner" /> : null}
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
    </AuthenticationLayout>
  );
}


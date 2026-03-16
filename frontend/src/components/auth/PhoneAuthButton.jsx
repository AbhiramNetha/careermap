export default function PhoneAuthButton({ onClick, disabled, mode = 'login' }) {
  const label = mode === 'signup' ? 'Sign up with Phone' : 'Continue with Phone';

  return (
    <button
      type="button"
      className="auth-provider-btn auth-provider-btn--phone"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="auth-provider-icon" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.77.6 2.6a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.48-1.12a2 2 0 0 1 2.11-.45c.83.28 1.7.48 2.6.6A2 2 0 0 1 22 16.92z" />
        </svg>
      </span>
      <span className="auth-provider-label">{label}</span>
    </button>
  );
}


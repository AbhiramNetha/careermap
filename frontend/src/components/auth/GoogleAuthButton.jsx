export default function GoogleAuthButton({ onClick, disabled, mode = 'login' }) {
  const label = mode === 'signup' ? 'Sign up with Google' : 'Continue with Google';

  return (
    <button
      type="button"
      className="auth-provider-btn auth-provider-btn--google"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="auth-provider-icon" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path
            fill="#EA4335"
            d="M24 9.5c3.5 0 6.5 1.2 8.9 3.5l6.6-6.6C35.1 2.5 29.9 0 24 0 14.6 0 6.6 5.8 2.8 14.2l7.7 6C12.3 13.5 17.7 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17z"
          />
          <path
            fill="#FBBC05"
            d="M10.5 28.7A14.6 14.6 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.7-6A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l7.9-6z"
          />
          <path
            fill="#34A853"
            d="M24 48c6 0 11-2 14.7-5.4l-7.5-5.8c-2 1.4-4.6 2.2-7.2 2.2-6.3 0-11.7-4.2-13.5-10l-7.9 6C6.5 42.2 14.6 48 24 48z"
          />
        </svg>
      </span>
      <span className="auth-provider-label">{label}</span>
    </button>
  );
}


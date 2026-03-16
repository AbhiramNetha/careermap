import { Link } from 'react-router-dom';
import AnimationPanel from './AnimationPanel';

export default function AuthenticationLayout({
  title,
  subtitle,
  children,
  bottom,
}) {
  return (
    <div className="auth-shell">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      <div className="auth-grid">
        <div className="auth-left">
          <div className="auth-card auth-card--wide">
            <div className="auth-card-header">
              <Link to="/" className="auth-logo" aria-label="Go to home">
                <img src="/logo.png" alt="" className="auth-logo-img" />
                CareerMap India
              </Link>
              <h1 className="auth-title">{title}</h1>
              {subtitle ? <p className="auth-subtitle">{subtitle}</p> : null}
            </div>

            {children}

            {bottom ? <div className="auth-bottom">{bottom}</div> : null}
          </div>
        </div>

        <div className="auth-right" aria-hidden="true">
          <AnimationPanel />
        </div>
      </div>
    </div>
  );
}


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../admin.css';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const { login, loading, error } = useAdminAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        const ok = await login(email, password);
        if (ok) navigate('/admin/dashboard');
    }

    return (
        <div className="admin-login-page">

            <div className="admin-login-card">
                {/* Logo */}
                <div className="admin-login-logo">
                    <div className="admin-logo-icon">
                        <img src="/logo.png" alt="way2fresher logo" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                    </div>
                    <div>
                        <h1 className="admin-login-title">way2fresher</h1>
                        <p className="admin-login-subtitle">Admin Portal</p>
                    </div>
                </div>

                <div className="admin-login-divider" />

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="admin-form-group">
                        <label htmlFor="admin-email">Admin Email</label>
                        <div className="admin-input-wrapper">
                            <span className="admin-input-icon">✉️</span>
                            <input
                                id="admin-email"
                                type="email"
                                autoComplete="email"
                                placeholder="admin@careermap.in"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="admin-form-group">
                        <label htmlFor="admin-password">Password</label>
                        <div className="admin-input-wrapper">
                            <span className="admin-input-icon">🔒</span>
                            <input
                                id="admin-password"
                                type={showPass ? 'text' : 'password'}
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="admin-pass-toggle"
                                onClick={() => setShowPass(v => !v)}
                            >
                                {showPass ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="admin-login-error">
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="admin-login-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="admin-spinner" />
                        ) : (
                            <>🔑 Access Dashboard</>
                        )}
                    </button>
                </form>

                <p className="admin-login-hint">
                    Default: <code>admin@careermap.in</code> / <code>Admin@123</code>
                </p>
            </div>
        </div>
    );
}

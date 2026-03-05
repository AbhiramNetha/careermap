import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { selectedCareers } = useApp();
    const { currentUser, logOut } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await logOut();
            navigate('/');
        } catch (err) {
            console.error('Logout error:', err);
        }
    }

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <span>🗺️</span>
                CareerMap India
            </Link>

            <ul className="navbar-links">
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/careers">Explore Careers</NavLink></li>
                <li><NavLink to="/courses">Courses</NavLink></li>
                <li><NavLink to="/branches">Branch Guide</NavLink></li>
                <li><NavLink to="/quiz">Career Quiz</NavLink></li>
                <li><NavLink to="/compare">Compare</NavLink></li>
                <li>
                    <a
                        href="#about"
                        onClick={e => {
                            e.preventDefault();
                            const el = document.getElementById('about');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                            else { window.location.href = '/#about'; }
                        }}
                    >
                        About
                    </a>
                </li>
            </ul>

            <div className="navbar-actions">
                {selectedCareers.length > 0 && (
                    <button className="compare-badge" onClick={() => navigate('/compare')}>
                        ⚖️ Compare ({selectedCareers.length})
                    </button>
                )}

                {currentUser ? (
                    /* ── logged-in: avatar + logout ── */
                    <div className="navbar-user">
                        <div className="navbar-avatar" title={currentUser.displayName || currentUser.email}>
                            {currentUser.photoURL
                                ? <img src={currentUser.photoURL} alt="avatar" referrerPolicy="no-referrer" />
                                : <span>{(currentUser.displayName || currentUser.email || '?')[0].toUpperCase()}</span>
                            }
                        </div>
                        <button className="btn-logout" onClick={handleLogout}>
                            Sign Out
                        </button>
                    </div>
                ) : (
                    /* ── logged-out: sign-in / sign-up ── */
                    <div className="navbar-auth-links">
                        <NavLink to="/login" className="btn-login-nav">Sign In</NavLink>
                        <NavLink to="/signup" className="btn-quiz-cta">Sign Up</NavLink>
                    </div>
                )}
            </div>
        </nav>
    );
}


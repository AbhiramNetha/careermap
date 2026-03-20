import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
    const { selectedCareers } = useApp();
    const { currentUser, logOut } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [navigate]);

    async function handleLogout() {
        try {
            setIsDropdownOpen(false);
            await logOut();
            navigate('/');
        } catch (err) {
            console.error('Logout error:', err);
        }
    }

    return (
        <div className="global-header-wrapper" style={{ position: 'fixed', top: '1.5rem', left: 0, right: 0, zIndex: 1000, pointerEvents: 'none', display: 'flex', justifyContent: 'center', padding: '0 2rem' }}>

            {/* === MAIN FLOATING NAVBAR PILL === */}
            <nav className="navbar" style={{ pointerEvents: 'auto' }}>
                <Link to="/" className="navbar-logo" aria-label="way2fresher Home" style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="/logo.png" alt="way2fresher logo" className="navbar-logo-img" style={{ height: '40px', width: 'auto', minWidth: '40px', objectFit: 'contain', zIndex: 10 }} />
                </Link>

                <button
                    className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle navigation"
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>

                <div className={`navbar-content ${isMobileMenuOpen ? 'open' : ''}`}>
                    <ul className="navbar-links">
                        <li><NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink></li>
                        <li><NavLink to="/careers" onClick={() => setIsMobileMenuOpen(false)}>Explore Careers</NavLink></li>
                        <li><NavLink to="/courses" onClick={() => setIsMobileMenuOpen(false)}>Courses</NavLink></li>
                        <li><NavLink to="/branches" onClick={() => setIsMobileMenuOpen(false)}>Branch Guide</NavLink></li>
                        <li><NavLink to="/quiz" onClick={() => setIsMobileMenuOpen(false)}>Career Quiz</NavLink></li>
                        <li className="nav-more-dropdown">
                            <span className="nav-more-icon" aria-label="More Options">=</span>
                            <ul className="more-dropdown-menu">
                                <li><NavLink to="/compare" onClick={() => setIsMobileMenuOpen(false)}>Compare</NavLink></li>
                                <li>
                                    <a
                                        href="#about"
                                        onClick={e => {
                                            e.preventDefault();
                                            setIsMobileMenuOpen(false);
                                            const el = document.getElementById('about');
                                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                                            else { window.location.href = '/#about'; }
                                        }}
                                    >
                                        About
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>

                    <div className="navbar-actions">
                        {selectedCareers.length > 0 && (
                            <button className="compare-badge" onClick={() => { setIsMobileMenuOpen(false); navigate('/compare'); }}>
                                ⚖️ Compare ({selectedCareers.length})
                            </button>
                        )}

                        {/* Glassmorphism Theme Toggle was extracted here */}

                        {currentUser ? (
                            /* ── logged-in: avatar dropdown ── */
                            <div className="navbar-user-container" ref={dropdownRef}>
                                <div
                                    className={`navbar-user ${isDropdownOpen ? 'active' : ''}`}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <div className="navbar-avatar">
                                        {currentUser.photoURL
                                            ? <img src={currentUser.photoURL} alt="avatar" referrerPolicy="no-referrer" />
                                            : <span>{(currentUser.displayName || currentUser.email || '?')[0].toUpperCase()}</span>
                                        }
                                    </div>
                                    <span className="navbar-user-name">
                                        {currentUser.displayName || currentUser.email?.split('@')[0]}
                                    </span>
                                    <i className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`}>▾</i>
                                </div>

                                {isDropdownOpen && (
                                    <div className="profile-dropdown">
                                        <div className="dropdown-header">
                                            <p className="dropdown-user-name">{currentUser.displayName || 'User'}</p>
                                            <p className="dropdown-user-email">{currentUser.email}</p>
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                                            <span className="dropdown-item-icon">👤</span>
                                            Profile Settings
                                        </Link>
                                        <div className="dropdown-divider"></div>
                                        <button className="dropdown-item logout-item" onClick={handleLogout}>
                                            <span className="dropdown-item-icon">🚀</span>
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* ── logged-out: sign-in / sign-up ── */
                            <div className="navbar-auth-links" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <NavLink to="/login" className="navbar-links" style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '8px 16px', borderRadius: '999px', transition: 'all 0.3s' }}>Sign In</NavLink>
                                <NavLink to="/signup" className="btn-signup-nav" style={{ fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '10px 22px', background: 'var(--primary)', color: '#fff', borderRadius: '999px', transition: 'all 0.3s', border: 'none', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }}>Sign Up</NavLink>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* ── Glassmorphism Theme Toggle (Extracted Outside Navbar, aligned to Right Edge) ── */}
            <div style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'auto' }}>
                <button
                    className={`theme-toggle ${isDark ? 'theme-toggle--dark' : 'theme-toggle--light'}`}
                    onClick={toggleTheme}
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    aria-label="Toggle dark/light theme"
                >
                    <span className="theme-toggle-track">
                        <span className="theme-toggle-thumb">
                            <span className="theme-toggle-icon">
                                {isDark ? '🌙' : '☀️'}
                            </span>
                        </span>
                    </span>
                </button>
            </div>

        </div>
    );
}

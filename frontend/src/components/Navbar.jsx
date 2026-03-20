import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
    const { selectedCareers } = useApp();
    const { currentUser, logOut } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleNavClick = (targetPath) => {
        setIsMobileMenuOpen(false);
        if (location.pathname === targetPath) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

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
        <>
            <div className="global-header-wrapper" style={{ position: 'fixed', top: '1.5rem', left: 0, right: 0, zIndex: 1000, pointerEvents: 'none', display: 'flex', justifyContent: 'center', padding: '0 2rem' }}>

                {/* === MAIN FLOATING NAVBAR PILL === */}
                <nav className="navbar" style={{ pointerEvents: 'auto' }}>
                    <Link to="/" className="navbar-logo" onClick={() => handleNavClick('/')} aria-label="way2fresher Home" style={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/logo.png" alt="way2fresher logo" className="navbar-logo-img" style={{ height: '60px', width: 'auto', minWidth: '60px', objectFit: 'contain', zIndex: 10 }} />
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
                            <li><NavLink to="/" onClick={() => handleNavClick('/')}>Home</NavLink></li>
                            <li><NavLink to="/careers" onClick={() => handleNavClick('/careers')}>Explore Careers</NavLink></li>
                            <li><NavLink to="/courses" onClick={() => handleNavClick('/courses')}>Courses</NavLink></li>
                            <li><NavLink to="/branches" onClick={() => handleNavClick('/branches')}>Branch Guide</NavLink></li>
                            <li><NavLink to="/quiz" onClick={() => handleNavClick('/quiz')}>Career Quiz</NavLink></li>
                            <li className="nav-more-dropdown">
                                <span className="nav-more-icon" aria-label="More Options">=</span>
                                <ul className="more-dropdown-menu">
                                    <li>
                                        <NavLink to="/compare" onClick={() => handleNavClick('/compare')}>
                                            Compare {selectedCareers.length > 0 && `(${selectedCareers.length})`}
                                        </NavLink>
                                    </li>
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
                                <div className="navbar-auth-links">
                                    <NavLink to="/login" className="btn-login-nav" onClick={() => setIsMobileMenuOpen(false)}>Sign In</NavLink>
                                    <NavLink to="/signup" className="btn-signup-nav" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</NavLink>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </div>

            {/* ── Glassmorphism Theme Toggle (Floating at Bottom Right) ── */}
            <div className="floating-theme-toggle">
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
        </>
    );
}

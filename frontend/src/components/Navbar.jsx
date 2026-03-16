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
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <img src="/logo.png" alt="way2fresher logo" className="navbar-logo-img" />
                way2fresher
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

                <div className="navbar-actions">
                    {selectedCareers.length > 0 && (
                        <button className="compare-badge" onClick={() => { setIsMobileMenuOpen(false); navigate('/compare'); }}>
                            ⚖️ Compare ({selectedCareers.length})
                        </button>
                    )}

                    {/* ── Glassmorphism Theme Toggle ── */}
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
                        <NavLink to="/login" className="btn-login-nav">Sign In</NavLink>
                        <NavLink to="/signup" className="btn-quiz-cta">Sign Up</NavLink>
                    </div>
                )}
            </div>
            </div>
        </nav>
    );
}

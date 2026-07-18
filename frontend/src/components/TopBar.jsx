import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const profileMenuItems = [
  { label: 'My Profile', action: 'profile' },
  { label: 'Settings', action: 'profile' },
  { label: 'Help', action: 'coming_soon' },
  { label: 'Sign Out', action: 'logout' },
];

export default function TopBar({ sidebarHidden = false }) {
  const { currentUser, logOut } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const dropdownRef = useRef(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/careers?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      setIsMenuOpen(false);
      await logOut();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleMenuClick = (action) => {
    setIsMenuOpen(false);
    if (action === 'profile') {
      navigate('/profile');
    } else if (action === 'logout') {
      handleLogout();
    } else {
      triggerToast('This feature is coming soon!');
    }
  };

  return (
    <>
      {/* Toast */}
      {toastMessage && (
        <div className="topbar-toast">
          <span>💡</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <header className={`topbar ${sidebarHidden ? 'topbar--no-sidebar' : ''}`}>
        {sidebarHidden && (
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginRight: '1rem', flexShrink: 0 }}>
            <img src="/logo.png" alt="logo" style={{ height: '32px', objectFit: 'contain' }} />
            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Way2<span style={{ color: 'var(--primary)' }}>Fresher</span>
            </span>
          </Link>
        )}

        {/* Search */}
        <div className="topbar-search">
          <input
            type="search"
            placeholder="Search careers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            className="topbar-search-input"
          />
        </div>

        {/* Right actions */}
        <div className="topbar-actions">
          {/* Notification bell */}


          {/* User avatar / auth */}
          {currentUser ? (
            <div className="topbar-profile" ref={dropdownRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="topbar-avatar-btn"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'avatar'}
                    className="topbar-avatar-img"
                  />
                ) : (
                  <div className="topbar-avatar-fallback">
                    {(currentUser.displayName || currentUser.email || '?')[0].toUpperCase()}
                  </div>
                )}
              </button>

              {isMenuOpen && (
                <div className="topbar-dropdown">
                  <div className="topbar-dropdown-header">
                    <p className="topbar-dropdown-name">{currentUser.displayName || 'User'}</p>
                    <p className="topbar-dropdown-email">{currentUser.email}</p>
                  </div>
                  {profileMenuItems.map(({ label, icon: Icon, action }) => {
                    const isLogout = action === 'logout';
                    return (
                      <button
                        key={label}
                        onClick={() => handleMenuClick(action)}
                        className={`topbar-dropdown-item ${isLogout ? 'topbar-dropdown-item--danger' : ''}`}
                      >
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="topbar-auth-links">
              <Link to="/login" className="topbar-auth-link">Log In</Link>
              <Link to="/signup" className="topbar-auth-link topbar-auth-link--primary">Sign Up</Link>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

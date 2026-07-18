import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

/* ── Navigation data ── */
const mainLinks = [
  { label: 'Home', href: '/' },
  { label: 'Careers', href: '/careers' },
  { label: 'Courses', href: '/courses' },
  { label: 'Quiz', href: '/quiz' },
  { label: 'College Alumni', href: '/alumni' },
];

const opportunityLinks = [
  { label: 'Internships', href: '#', comingSoon: true, msg: 'Internships coming soon!' },
  { label: 'Jobs', href: '#', comingSoon: true, msg: 'Jobs board is coming soon! Partnering with companies.' },
  { label: 'Walk-ins', href: '#', comingSoon: true, msg: 'Walk-ins listing coming soon!' },
];

/* ── Single nav item ── */
function NavItem({ label, href, icon: Icon, active, indent, comingSoon, msg, collapsed, onToast, onClick }) {
  const baseClasses = `sidebar-nav-item ${indent ? 'sidebar-nav-item--indent' : ''} ${active ? 'sidebar-nav-item--active' : ''} ${collapsed ? 'sidebar-nav-item--collapsed' : ''}`;

  if (comingSoon) {
    return (
      <button
        onClick={() => { onToast?.(msg); onClick?.(); }}
        className={`${baseClasses} sidebar-nav-item--locked`}
        title={collapsed ? label : undefined}
      >
        {collapsed ? <span style={{ fontWeight: 800 }}>{label[0]}</span> : null}
        {!collapsed && <span className="sidebar-nav-label">{label}</span>}
      </button>
    );
  }

  return (
    <NavLink
      to={href}
      onClick={onClick}
      className={baseClasses}
      title={collapsed ? label : undefined}
    >
      {collapsed ? <span style={{ fontWeight: 800 }}>{label[0]}</span> : null}
      {!collapsed && <span className="sidebar-nav-label">{label}</span>}
      {!collapsed && active && <span className="sidebar-active-dot" />}
    </NavLink>
  );
}

/* ── Main Sidebar ── */
export default function Sidebar() {
  const { currentUser } = useAuth();
  const { isPremium } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [opportunitiesOpen, setOpportunitiesOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  /* Responsive: detect screen size for collapsed state */
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w <= 768) {
        setIsCollapsed(false); // mobile uses full drawer, not collapsed
      } else if (w <= 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
      // Close mobile drawer on resize up
      if (w > 768) setMobileOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const closeMobile = () => setMobileOpen(false);

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="sidebar-brand">
        <Link to="/" className="sidebar-brand-link" onClick={closeMobile}>
          <img src="/logo.png" alt="way2fresher logo" className="sidebar-brand-logo" />
          {!isCollapsed && (
            <span className="sidebar-brand-text">
              Way2<span className="sidebar-brand-accent">Fresher</span>
            </span>
          )}
        </Link>
      </div>

      {/* Main nav */}
      <nav className="sidebar-nav-section">
        {mainLinks.map((link) => (
          <NavItem
            key={link.href}
            {...link}
            active={isActive(link.href)}
            collapsed={isCollapsed}
            onToast={triggerToast}
            onClick={closeMobile}
          />
        ))}
      </nav>

      {/* Opportunities Dropdown Section */}
      <nav className="sidebar-nav-section" style={{ marginTop: '0.25rem' }}>
        <button
          type="button"
          onClick={() => setOpportunitiesOpen((prev) => !prev)}
          className={`sidebar-nav-item sidebar-nav-item--toggle ${isCollapsed ? 'sidebar-nav-item--collapsed' : ''}`}
          title={isCollapsed ? 'Opportunities' : undefined}
          style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          {isCollapsed ? <span style={{ fontWeight: 800 }}>O</span> : null}
          {!isCollapsed && (
            <>
              <span className="sidebar-nav-label" style={{ flex: 1 }}>Opportunities</span>
            </>
          )}
        </button>
        {opportunitiesOpen && (
          <div className="sidebar-sub-items" style={{ paddingLeft: isCollapsed ? '0' : '1rem' }}>
            {opportunityLinks.map((link) => (
              <NavItem
                key={link.label}
                {...link}
                indent={!isCollapsed}
                active={isActive(link.href)}
                collapsed={isCollapsed}
                onToast={triggerToast}
                onClick={closeMobile}
              />
            ))}
          </div>
        )}
      </nav>

      {/* Premium CTA Button */}
      <div style={{ padding: isCollapsed ? '0.5rem 0.25rem' : '0.75rem 0.25rem' }}>
        <NavLink
          to="/premium"
          onClick={closeMobile}
          title={isCollapsed ? 'PRO Features' : undefined}
          className={({ isActive }) => 
            `sidebar-premium-btn ${isCollapsed ? 'sidebar-premium-btn--collapsed' : 'sidebar-premium-btn--expanded'} ${isActive ? 'active' : ''}`
          }
        >
          {isCollapsed
            ? <span style={{ fontWeight: 800, color: '#fbbf24' }}>P</span>
            : (
              <>
                <span className="sidebar-nav-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fbbf24', flex: 1, textTransform: 'none' }}>PRO Features</span>
              </>
            )
          }
        </NavLink>
      </div>

      {/* Spacer */}
      <div className="sidebar-spacer" />

      {/* User footer */}
      <div className="sidebar-user-footer">
        {currentUser ? (
          <button className="sidebar-user-btn" onClick={() => { navigate('/profile'); closeMobile(); }}>
            <div className="sidebar-user-avatar">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="avatar" />
              ) : (
                <span>{(currentUser.displayName || currentUser.email || '?')[0].toUpperCase()}</span>
              )}
            </div>
            {!isCollapsed && (
              <span className="sidebar-user-name">
                {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
              </span>
            )}
          </button>
        ) : (
          <div className={`sidebar-auth-buttons ${isCollapsed ? 'sidebar-auth-buttons--collapsed' : ''}`}>
            {!isCollapsed ? (
              <>
                <Link to="/login" className="sidebar-btn sidebar-btn--outline" onClick={closeMobile}>Log In</Link>
                <Link to="/signup" className="sidebar-btn sidebar-btn--primary" onClick={closeMobile}>Sign Up</Link>
              </>
            ) : (
              <Link to="/login" className="sidebar-btn sidebar-btn--icon" onClick={closeMobile} title="Log In">
                <span style={{ fontWeight: 800 }}>L</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Toast */}
      {toastMessage && (
        <div className="sidebar-toast">
          <span className="sidebar-toast-icon">💡</span>
          <span className="sidebar-toast-text">{toastMessage}</span>
        </div>
      )}

      {/* Mobile hamburger button */}
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
        style={{ fontSize: '0.8rem', fontWeight: 'bold' }}
      >
        {mobileOpen ? 'Close' : 'Menu'}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="sidebar-mobile-overlay" onClick={closeMobile} />
      )}

      {/* Sidebar */}
      <aside className={`w2f-sidebar ${isCollapsed ? 'w2f-sidebar--collapsed' : ''} ${mobileOpen ? 'w2f-sidebar--open' : ''}`}>
        {sidebarContent}
      </aside>
    </>
  );
}

import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../../admin.css';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLayout() {
    const { adminUser, logout } = useAdminAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    // Force Dark Mode for Admin Panel
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('w2f-theme', 'dark');
        return () => {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('w2f-theme', 'light');
        };
    }, []);

    // Responsive window resizing listener
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const mobile = width <= 1024;
            setIsMobile(mobile);
            // Default open state for desktop, closed for mobile/tablet
            setSidebarOpen(!mobile);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function handleLogout() {
        logout();
        navigate('/admin');
    }

    const navItems = [
        { to: '/admin/dashboard', label: 'Dashboard' },
        { to: '/admin/courses', label: 'Courses' },
        { to: '/admin/analytics', label: 'Analytics' },
    ];

    return (
        <div className={`admin-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            {/* Sidebar mobile overlay click handler */}
            {sidebarOpen && isMobile && (
                <div 
                    className="admin-sidebar-overlay" 
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <div className="admin-sidebar-logo">
                        <img src="/logo.png" alt="way2fresher" className="admin-sidebar-logo-img" />
                        <span className="sidebar-logo-text">way2fresher</span>
                    </div>
                    <button
                        className="sidebar-toggle-btn"
                        onClick={() => setSidebarOpen(v => !v)}
                        title={sidebarOpen ? 'Collapse' : 'Expand'}
                        style={{ fontSize: '1rem', padding: '4px 8px' }}
                    >
                        {sidebarOpen ? '✕' : '☰'}
                    </button>
                </div>

                <div className="admin-sidebar-badge">
                    <span>ADMIN PANEL</span>
                </div>

                <nav className="admin-sidebar-nav">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => {
                                if (isMobile) setSidebarOpen(false);
                            }}
                            className={({ isActive }) =>
                                `admin-nav-item ${isActive ? 'active' : ''}`
                            }
                        >
                            <span className="nav-label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <Link to="/" className="admin-nav-item" target="_blank">
                        <span className="nav-label">View Site</span>
                    </Link>
                    <button className="admin-nav-item admin-logout-btn" onClick={handleLogout}>
                        <span className="nav-label">Logout</span>
                    </button>
                </div>
            </aside>

            <div className="admin-main">
                <header className="admin-topbar">
                    <div className="admin-topbar-left">
                        <button
                            className="mobile-sidebar-toggle"
                            onClick={() => setSidebarOpen(v => !v)}
                            style={{ fontSize: '1.25rem' }}
                        >
                            {sidebarOpen ? '✕' : '☰'}
                        </button>
                        <div className="admin-breadcrumb" id="admin-breadcrumb" />
                    </div>
                    <div className="admin-topbar-right">
                        <div className="admin-topbar-time">
                            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="admin-topbar-user">
                            <div className="admin-topbar-avatar">
                                {adminUser?.email?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <div className="admin-topbar-user-info">
                                <span className="admin-topbar-name">Administrator</span>
                                <span className="admin-topbar-email">{adminUser?.email}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

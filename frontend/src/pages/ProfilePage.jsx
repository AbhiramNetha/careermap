import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { Sun, Moon, Award } from 'lucide-react';

export default function ProfilePage() {
    const { currentUser } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const { isPremium, togglePremium } = useApp();

    return (
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px', minHeight: '80vh' }}>
            <div className="section-header">
                <span className="section-tag">Account</span>
                <h1 className="section-title">Profile Settings</h1>
                <p className="section-subtitle">Manage your account preferences and personal information.</p>
            </div>

            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(20px)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border)',
                padding: '3rem',
                boxShadow: 'var(--shadow-premium)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'var(--gradient-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        color: 'white',
                        overflow: 'hidden',
                        border: '4px solid var(--border)'
                    }}>
                        {currentUser?.photoURL 
                            ? <img src={currentUser.photoURL} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <span>{(currentUser?.displayName || currentUser?.email || '?')[0].toUpperCase()}</span>
                        }
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>
                                {currentUser?.displayName || 'Student'}
                            </h2>
                            {isPremium && (
                                <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: '800',
                                    color: '#fbbf24',
                                    background: 'rgba(251, 191, 36, 0.12)',
                                    border: '1px solid rgba(251, 191, 36, 0.3)',
                                    padding: '2px 8px',
                                    borderRadius: '99px',
                                    letterSpacing: '0.5px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <Award size={12} /> PRO
                                </span>
                            )}
                        </div>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{currentUser?.email}</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '2rem' }}>
                    {/* Account Type Section */}
                    <div className="profile-field">
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
                            Account Type
                        </label>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem',
                            background: isPremium ? 'rgba(251, 191, 36, 0.03)' : 'rgba(255,255,255,0.03)',
                            border: isPremium ? '1px solid rgba(251, 191, 36, 0.2)' : '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                        }}>
                            <div>
                                <span style={{
                                    color: isPremium ? '#fbbf24' : 'var(--text-primary)',
                                    fontWeight: '700',
                                    fontSize: '1rem'
                                }}>
                                    {isPremium ? 'Way2Fresher PRO' : 'Free Account'}
                                </span>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '4px 0 0' }}>
                                    {isPremium ? 'You have full access to all premium navigation pages and tools.' : 'Upgrade to PRO to access Compare, Branch Guide, ATS, and Mock Interviews.'}
                                </p>
                            </div>
                            {isPremium ? (
                                <button
                                    onClick={togglePremium}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs py-2.5 px-4 rounded-lg transition-all hover:scale-[1.02] border border-red-500/20 cursor-pointer"
                                >
                                    Withdraw PRO
                                </button>
                            ) : (
                                <button
                                    onClick={togglePremium}
                                    className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs py-2.5 px-4 rounded-lg transition-all hover:scale-[1.02] shadow-md shadow-amber-500/10 border-none cursor-pointer"
                                >
                                    Upgrade to PRO
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="profile-field">
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
                            Full Name
                        </label>
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}>
                            {currentUser?.displayName || 'Not provided'}
                        </div>
                    </div>

                    <div className="profile-field">
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
                            Email Address
                        </label>
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}>
                            {currentUser?.email}
                        </div>
                    </div>

                    {/* ── Appearance Section ── */}
                    <div className="profile-field">
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
                            Appearance
                        </label>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem 1.25rem',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                {isDark ? (
                                    <Moon size={20} style={{ color: 'var(--primary-light)' }} />
                                ) : (
                                    <Sun size={20} style={{ color: '#f59e0b' }} />
                                )}
                                <div>
                                    <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.95rem' }}>
                                        {isDark ? 'Dark Mode' : 'Light Mode'}
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        {isDark ? 'Easy on the eyes in low light' : 'Bright and clear for daytime use'}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className="appearance-toggle"
                                aria-label="Toggle theme"
                                role="switch"
                                aria-checked={!isDark}
                            >
                                <span className={`appearance-toggle-track ${isDark ? '' : 'appearance-toggle-track--light'}`}>
                                    <span className="appearance-toggle-thumb">
                                        {isDark ? <Moon size={12} /> : <Sun size={12} />}
                                    </span>
                                </span>
                            </button>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                        <button className="btn-filled" style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', width: 'auto' }}>
                            Update Profile
                        </button>
                        <button className="btn-outline" style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', width: 'auto' }}>
                            Change Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

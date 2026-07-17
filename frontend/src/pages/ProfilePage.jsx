import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { Sun, Moon, Award } from 'lucide-react';

export default function ProfilePage() {
    const { currentUser } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const { isPremium, togglePremium } = useApp();

    return (
        <div className="container mx-auto px-4 py-8 md:py-10 min-h-[80vh]">
            <div className="section-header">
                <span className="section-tag">Account</span>
                <h1 className="section-title">Profile Settings</h1>
                <p className="section-subtitle">Manage your account preferences and personal information.</p>
            </div>

            <div 
                className="w-full max-w-[800px] mx-auto p-6 md:p-12"
                style={{
                    background: 'var(--bg-glass)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-premium)'
                }}
            >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 mb-8 md:mb-12 text-center sm:text-left">
                    <div 
                        className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-extrabold text-white overflow-hidden flex-shrink-0"
                        style={{
                            background: 'var(--gradient-primary)',
                            border: '4px solid var(--border)'
                        }}
                    >
                        {currentUser?.photoURL 
                            ? <img src={currentUser.photoURL} alt="profile" className="w-full h-full object-cover" />
                            : <span>{(currentUser?.displayName || currentUser?.email || '?')[0].toUpperCase()}</span>
                        }
                    </div>
                    <div>
                        <div className="flex flex-col sm:flex-row items-center gap-2 mb-1">
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>
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

                <div className="grid gap-6">
                    {/* Account Type Section */}
                    <div className="profile-field">
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
                            Account Type
                        </label>
                        <div 
                            className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl"
                            style={{
                                background: isPremium ? 'rgba(251, 191, 36, 0.03)' : 'rgba(255,255,255,0.03)',
                                border: isPremium ? '1px solid rgba(251, 191, 36, 0.2)' : '1px solid var(--border)',
                            }}
                        >
                            <div>
                                <span style={{
                                    color: isPremium ? '#fbbf24' : 'var(--text-primary)',
                                    fontWeight: '700',
                                    fontSize: '1rem'
                                }}>
                                    {isPremium ? 'Way2Fresher PRO' : 'Free Account'}
                                </span>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '4px 0 0', lineHeight: 1.4 }}>
                                    {isPremium ? 'You have full access to all premium navigation pages and tools.' : 'Upgrade to PRO to access Compare, Branch Guide, ATS, and Mock Interviews.'}
                                </p>
                            </div>
                            {isPremium ? (
                                <button
                                    onClick={togglePremium}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs py-2.5 px-4 rounded-lg transition-all border border-red-500/20 cursor-pointer w-full md:w-auto text-center flex-shrink-0"
                                >
                                    Withdraw PRO
                                </button>
                            ) : (
                                <button
                                    onClick={togglePremium}
                                    className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs py-2.5 px-4 rounded-lg transition-all shadow-md shadow-amber-500/10 border-none cursor-pointer w-full md:w-auto text-center flex-shrink-0"
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
                        <div className="p-4 rounded-xl text-left" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                            {currentUser?.displayName || 'Not provided'}
                        </div>
                    </div>

                    <div className="profile-field">
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
                            Email Address
                        </label>
                        <div className="p-4 rounded-xl text-left" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                            {currentUser?.email}
                        </div>
                    </div>

                    {/* Appearance Section */}
                    <div className="profile-field">
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
                            Appearance
                        </label>
                        <div 
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl"
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border)',
                            }}
                        >
                            <div className="flex items-center gap-3">
                                {isDark ? (
                                    <Moon size={20} style={{ color: 'var(--primary-light)', flexShrink: 0 }} />
                                ) : (
                                    <Sun size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />
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
                                className="appearance-toggle flex-shrink-0 self-start sm:self-auto"
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

                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <button className="btn-filled w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold">
                            Update Profile
                        </button>
                        <button className="btn-outline w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold">
                            Change Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

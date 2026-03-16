import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function ProfilePage() {
    const { currentUser } = useAuth();
    const { isDark } = useTheme();

    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '80vh' }}>
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
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                            {currentUser?.displayName || 'Student'}
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }}>{currentUser?.email}</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '2rem' }}>
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

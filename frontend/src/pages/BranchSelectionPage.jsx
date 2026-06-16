import { useNavigate } from 'react-router-dom';

const BRANCHES = [
    { id: 'CSE', name: 'CSE', fullName: 'Computer Science Engineering', icon: '💻', color: '#6366f1', desc: 'Software, Data, AI/ML careers' },
    { id: 'ECE', name: 'ECE', fullName: 'Electronics & Communication', icon: '📡', color: '#8b5cf6', desc: 'Electronics, Embedded, Telecom careers' },
    { id: 'Mechanical', name: 'Mechanical', fullName: 'Mechanical Engineering', icon: '⚙️', color: '#f59e0b', desc: 'Core Mech, PSU, Manufacturing careers' },
    { id: 'Civil', name: 'Civil', fullName: 'Civil Engineering', icon: '🏗️', color: '#10b981', desc: 'Infrastructure, Govt, Construction careers' },
    { id: 'EEE', name: 'EEE', fullName: 'Electrical & Electronics', icon: '⚡', color: '#06b6d4', desc: 'Power sector, PSU, Automation careers' },
];

export default function BranchSelectionPage() {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '4rem 0 6rem' }}>
            <div className="container">
                <div className="section-header">
                    <div className="section-tag">Branch Guide</div>
                    <h1 className="section-title">
                        Career Paths by <span className="gradient-text">Engineering Branch</span>
                    </h1>
                    <p className="section-subtitle">
                        Your branch determines your starting advantage. Explore what's possible for your stream.
                    </p>
                </div>

                <div className="branch-grid">
                    {BRANCHES.map(branch => (
                        <div
                            key={branch.id}
                            className="branch-card"
                            onClick={() => navigate(`/branches/${branch.id}`)}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = branch.color + '60';
                                e.currentTarget.style.boxShadow = `0 8px 30px ${branch.color}25`;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = '';
                                e.currentTarget.style.boxShadow = '';
                            }}
                        >
                            <div className="branch-icon">{branch.icon}</div>
                            <div className="branch-name">{branch.name}</div>
                            <div className="branch-fullname">{branch.fullName}</div>
                            <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: branch.color, fontWeight: 600 }}>
                                {branch.desc}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{
                    marginTop: '4rem',
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))',
                    border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '3rem',
                    textAlign: 'center',
                }}>
                    <h3 style={{ fontFamily: 'Poppins', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                        Not Sure Which Branch Suits You? 🤔
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Our career quiz considers your branch + interests to find your perfect path
                    </p>
                    <button className="btn-primary" onClick={() => navigate('/quiz')}>
                        ✨ Take the 7-Question Quiz
                    </button>
                </div>
            </div>
        </div>
    );
}

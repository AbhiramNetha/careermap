import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchCareerById } from '../services/api';
import { useApp } from '../context/AppContext';

export default function CareerDetailPage() {
    const { id } = useParams(); // 'id' contains the career slug
    const navigate = useNavigate();
    const { addToCompare, selectedCareers } = useApp();

    const [career, setCareer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        fetchCareerById(id)
            .then(res => setCareer(res.data.data))
            .catch(() => setError('Career not found'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <div className="loader-container"><div className="loader" /><div className="loader-text">Loading career details...</div></div>;
    }

    if (error || !career) {
        return (
            <div className="not-found-container">
                <h1>404</h1>
                <h2>Career not found</h2>
                <button className="btn-primary" onClick={() => navigate('/careers')}>Browse All Careers</button>
            </div>
        );
    }

    const alreadyInCompare = selectedCareers.find(c => c.id === career.id || c.slug === career.slug);
    const riskColor = career.riskLevel === 'Low' ? '#10b981' : career.riskLevel === 'High' ? '#ef4444' : '#f59e0b';

    return (
        <div className="career-detail-page" style={{ padding: '2rem 0 6rem' }}>
            <div className="container">
                <div className="breadcrumb" style={{ marginBottom: '2rem' }}>
                    <Link to="/">Home</Link> <span>/</span>
                    <Link to="/careers">Careers</Link> <span>/</span>
                    <span style={{ color: 'var(--text-primary)' }}>{career.title}</span>
                </div>

                {/* Hero Section */}
                <div className="career-hero" style={{ marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                                <span className="chip chip-purple">{career.category}</span>
                                {career.isTrending && <span className="chip chip-yellow">Trending</span>}
                            </div>
                            <h1 style={{ fontFamily: 'Poppins', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
                                {career.title}
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '700px' }}>
                                {career.description}
                            </p>
                        </div>

                        {/* Quick Stats Panel */}
                        <div style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '1.5rem',
                            minWidth: '280px',
                            boxShadow: 'var(--shadow-md)',
                        }}>
                            {[
                                ['Salary Range', career.salaryRange || 'N/A'],
                                ['Demand Level', career.demandLevel || 'N/A'],
                                ['Risk Level', career.riskLevel || 'N/A'],
                                ['Exam Route', career.examRoute || 'Direct/Skills'],
                                ['Duration', career.duration || 'N/A'],
                                ['Capital Needed', career.capitalNeeded || 'None'],
                            ].map(([label, value]) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '0.88rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                                    <span style={{ fontWeight: 600 }}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                        <button
                            className="btn-primary"
                            onClick={() => navigate('/careers')}
                        >
                            Back to Explore
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() => alreadyInCompare ? navigate('/compare') : addToCompare(career)}
                        >
                            {alreadyInCompare ? '✓ Added to Compare' : 'Add to Compare'}
                        </button>
                    </div>
                </div>

                <div className="career-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Skills Section */}
                    <div className="detail-section" style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.75rem',
                    }}>
                        <div className="detail-section-title" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '1.25rem' }}>Recommended Skills & Tools</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {career.skills && career.skills.length > 0 ? (
                                career.skills.map(skill => (
                                    <span key={skill} className="skill-tag" style={{
                                        background: 'rgba(99,102,241,0.08)',
                                        border: '1px solid rgba(99,102,241,0.2)',
                                        color: 'var(--primary-light)',
                                        padding: '6px 12px',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.85rem',
                                        fontWeight: 500,
                                    }}>{skill}</span>
                                ))
                            ) : (
                                <span style={{ color: 'var(--text-muted)' }}>No specific skills listed.</span>
                            )}
                        </div>
                    </div>

                    {/* Branch Compatibility Section */}
                    <div className="detail-section" style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.75rem',
                    }}>
                        <div className="detail-section-title" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '1.25rem' }}>B.Tech Branch Compatibility</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {career.branches && career.branches.length > 0 ? (
                                career.branches.includes('ALL') ? (
                                    <span className="chip chip-green" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>All Engineering Branches Eligible</span>
                                ) : (
                                    career.branches.map(b => (
                                        <span key={b} className="chip chip-purple" style={{
                                            fontSize: '0.85rem',
                                            padding: '6px 12px',
                                            cursor: 'pointer',
                                        }} onClick={() => navigate(`/branches/${b}`)}>{b}</span>
                                    ))
                                )
                            ) : (
                                <span style={{ color: 'var(--text-muted)' }}>No specific branch eligibility details listed.</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Info Note on Roadmap */}
                <div style={{
                    marginTop: '2.5rem',
                    background: 'rgba(245,158,11,0.05)',
                    border: '1px solid rgba(245,158,11,0.15)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                }}>
                    <div>
                        <div style={{ fontWeight: 600, color: '#f59e0b', fontSize: '0.95rem' }}>Looking for a step-by-step roadmap?</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            Our team is currently building structured month-by-month learning roadmaps for the new career paths. Keep an eye out for updates!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchCareerById } from '../services/api';
import { useApp } from '../context/AppContext';

export default function CareerDetailPage() {
    const { id } = useParams();
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

    const salaryData = [
        { label: 'Fresher', min: career.salary?.fresherMin || 0, max: career.salary?.fresherMax || 0 },
        { label: '3 Years', min: career.salary?.threeYearsMin || 0, max: career.salary?.threeYearsMax || 0 },
        { label: '5 Years', min: career.salary?.fiveYearsMin || 0, max: career.salary?.fiveYearsMax || 0 },
    ];

    const alreadyInCompare = selectedCareers.find(c => c.id === career.id);
    const riskColor = career.riskLevel === 'Low' ? '#10b981' : career.riskLevel === 'High' ? '#ef4444' : '#f59e0b';
    const categoryLabel = {
        private: '💼 Private Sector', government: '🏛️ Government',
        'higher-studies': '🎓 Higher Studies', entrepreneurship: '🚀 Entrepreneurship',
    }[career.category] || career.category;

    return (
        <div className="career-detail-page">
            <div className="container">
                <div className="breadcrumb" style={{ marginBottom: '2rem' }}>
                    <Link to="/">Home</Link> <span>/</span>
                    <Link to="/careers">Careers</Link> <span>/</span>
                    <span style={{ color: 'var(--text-primary)' }}>{career.name}</span>
                </div>

                {/* Hero Section */}
                <div className="career-hero" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                                <span className="chip chip-purple">{categoryLabel}</span>
                                {career.isTrending && <span className="chip chip-yellow">🔥 Trending</span>}
                            </div>
                            <h1 style={{ fontFamily: 'Poppins', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
                                {career.name}
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '600px' }}>
                                {career.overview}
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <div style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '1.5rem',
                            minWidth: '240px',
                        }}>
                            {[
                                ['💰 Starting Salary', career.salary?.fresher],
                                ['📈 Demand Level', career.demandLevel],
                                ['⚡ Risk Level', career.riskLevel],
                                ['🏆 Growth Potential', career.growthPotential],
                                ['🧘 Work-Life Balance', career.workLifeBalance],
                                ['⏰ Prep Time', career.preparationTime],
                            ].map(([label, value]) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
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
                            onClick={() => navigate(`/roadmap/${career.id}`)}
                        >
                            🗺️ View Full Roadmap
                        </button>
                        <button
                            className={`btn-secondary ${alreadyInCompare ? '' : ''}`}
                            onClick={() => alreadyInCompare ? navigate('/compare') : addToCompare(career)}
                        >
                            {alreadyInCompare ? '✓ Added to Compare' : '⚖️ Add to Compare'}
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    {/* Salary Chart */}
                    <div className="detail-section">
                        <div className="detail-section-title">💰 Salary Progression (India)</div>
                        <div style={{ height: '220px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={salaryData} barGap={8}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}L`} />
                                    <Tooltip
                                        contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f1f5f9' }}
                                        formatter={(val, name) => [`${val} LPA`, name === 'min' ? 'Min' : 'Max']}
                                    />
                                    <Bar dataKey="min" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="max" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginTop: '1rem' }}>
                            {[
                                { label: 'Fresher', val: career.salary?.fresher },
                                { label: '3 Years', val: career.salary?.threeYears },
                                { label: '5 Years', val: career.salary?.fiveYears },
                            ].map(s => (
                                <div key={s.label} style={{ textAlign: 'center' }}>
                                    <div style={{ fontWeight: 700, color: '#10b981', fontSize: '0.9rem' }}>{s.val}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="detail-section">
                        <div className="detail-section-title">🛠️ Required Skills</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {career.skills?.map(skill => (
                                <span key={skill} className="skill-tag">{skill}</span>
                            ))}
                        </div>
                    </div>

                    {/* Who Should Choose */}
                    <div className="detail-section">
                        <div className="detail-section-title">👤 Who Should Choose This?</div>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {career.whoShouldChoose?.map((item, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    <span style={{ color: '#10b981', flexShrink: 0 }}>✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Risk & Other Metrics */}
                    <div className="detail-section">
                        <div className="detail-section-title">📊 Career Metrics</div>
                        {[
                            { label: 'Risk Level', value: career.riskLevel, color: riskColor },
                            { label: 'Competition', value: career.competitionLevel, color: 'var(--primary-light)' },
                            { label: 'Stability', value: career.stabilityLevel, color: '#10b981' },
                            { label: 'Growth Potential', value: career.growthPotential, color: '#f59e0b' },
                            { label: 'Study Required', value: career.studyRequired ? 'Yes' : 'No', color: 'var(--text-secondary)' },
                            { label: 'Study Duration', value: career.studyDuration || 'N/A', color: 'var(--text-secondary)' },
                        ].map(m => (
                            <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{m.label}</span>
                                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: m.color }}>{m.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Eligible Branches */}
                <div className="detail-section" style={{ marginTop: '1.5rem' }}>
                    <div className="detail-section-title">🎓 Branch Compatibility</div>
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                        <div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#10b981', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>✅ Direct Fit</div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {career.eligibleBranches?.map(b => (
                                    <span key={b} className="chip chip-green" style={{ cursor: 'pointer' }} onClick={() => navigate(`/branches/${b}`)}>{b}</span>
                                ))}
                            </div>
                        </div>
                        {career.moderateBranches?.length > 0 && (
                            <div>
                                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>⚠️ Needs Transition</div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {career.moderateBranches?.map(b => (
                                        <span key={b} className="chip chip-yellow" style={{ cursor: 'pointer' }} onClick={() => navigate(`/branches/${b}`)}>{b}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Roadmap Preview */}
                {career.roadmap && career.roadmap.length > 0 && (
                    <div className="detail-section" style={{ marginTop: '1.5rem' }}>
                        <div className="detail-section-title" style={{ justifyContent: 'space-between' }}>
                            <span>🗺️ 12-Month Roadmap Preview</span>
                            <button className="btn-sm btn-filled" onClick={() => navigate(`/roadmap/${career.id}`)}>
                                View Full Roadmap →
                            </button>
                        </div>
                        <div className="timeline">
                            {career.roadmap.slice(0, 3).map((step, i) => (
                                <div className="timeline-item" key={i}>
                                    <div className="timeline-dot" />
                                    <div className="timeline-month">{step.month}</div>
                                    <div className="timeline-content">
                                        {step.skills?.length > 0 && (
                                            <>
                                                <h4>Skills</h4>
                                                <ul>{step.skills.map(s => <li key={s}>{s}</li>)}</ul>
                                            </>
                                        )}
                                        {step.projects?.length > 0 && (
                                            <>
                                                <h4 style={{ marginTop: '8px' }}>Projects</h4>
                                                <ul>{step.projects.map(p => <li key={p}>{p}</li>)}</ul>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => navigate(`/roadmap/${career.id}`)}>
                            View Complete Roadmap →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

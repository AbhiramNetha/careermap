import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fetchCareersByBranch } from '../services/api';
import { useApp } from '../context/AppContext';

const BRANCH_INFO = {
    CSE: { icon: '💻', fullName: 'Computer Science Engineering', desc: 'CSE graduates have the widest range of career options — from top tech companies to research labs.' },
    ECE: { icon: '📡', fullName: 'Electronics & Communication Engineering', desc: 'ECE opens doors to both core electronics and IT roles, plus government PSU jobs.' },
    Mechanical: { icon: '⚙️', fullName: 'Mechanical Engineering', desc: 'Mechanical engineers are backbone of manufacturing, automotive, and energy sectors.' },
    Civil: { icon: '🏗️', fullName: 'Civil Engineering', desc: 'Civil engineers build India\'s infrastructure — from highways to smart cities.' },
    EEE: { icon: '⚡', fullName: 'Electrical & Electronics Engineering', desc: 'EEE graduates power India\'s energy transition and automation revolution.' },
};

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b'];

function CareerMiniCard({ career, onView, onCompare }) {
    return (
        <div
            style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'var(--transition)',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = '';
                e.currentTarget.style.transform = '';
            }}
            onClick={() => onView(career.id)}
        >
            <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{career.name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{career.subCategory}</div>
            <div style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 600 }}>💰 {career.salary?.fresher}</div>
        </div>
    );
}

export default function BranchDetailPage() {
    const { branch } = useParams();
    const navigate = useNavigate();
    const { addToCompare } = useApp();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchCareersByBranch(branch)
            .then(res => setData(res.data.data))
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, [branch]);

    const info = BRANCH_INFO[branch] || {};

    const categorize = (careers) => {
        const core = careers.filter(c => ['government', 'private'].includes(c.category) && !c.tags?.includes('coding'));
        const it = careers.filter(c => c.tags?.some(t => ['coding', 'tech', 'web', 'data', 'analytics'].includes(t)));
        const govt = careers.filter(c => c.category === 'government');
        const higherStudies = careers.filter(c => c.category === 'higher-studies');
        return { core, it, govt, higherStudies };
    };

    const pieData = data ? [
        { name: 'IT / Tech', value: data.directFit?.filter(c => c.tags?.includes('coding') || c.tags?.includes('analytics')).length || 2 },
        { name: 'Govt / PSU', value: data.directFit?.filter(c => c.category === 'government').length || 2 },
        { name: 'Higher Studies', value: data.directFit?.filter(c => c.category === 'higher-studies').length || 2 },
        { name: 'Entrepreneurship', value: 1 },
    ] : [];

    if (loading) {
        return <div className="loader-container"><div className="loader" /><div className="loader-text">Loading branch guide...</div></div>;
    }

    const allCareers = data ? [...(data.directFit || []), ...(data.moderateFit || [])] : [];

    return (
        <div style={{ padding: '3rem 0 6rem' }}>
            <div className="container">
                {/* Header */}
                <div className="career-hero" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
                        <div>
                            <div className="breadcrumb" style={{ marginBottom: '1rem' }}>
                                <a href="/">Home</a> <span>/</span>
                                <a href="/branches">Branches</a> <span>/</span>
                                <span style={{ color: 'var(--text-primary)' }}>{branch}</span>
                            </div>
                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{info.icon}</div>
                            <h1 style={{ fontFamily: 'Poppins', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                                {info.fullName || branch}
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', lineHeight: 1.7 }}>{info.desc}</p>
                            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <button className="btn-primary" onClick={() => navigate('/quiz')}>✨ Take Career Quiz</button>
                                <button className="btn-secondary" onClick={() => navigate('/careers')}>Explore All Careers</button>
                            </div>
                        </div>

                        {/* Pie Chart */}
                        {pieData.length > 0 && (
                            <div style={{ width: '260px', height: '200px', flexShrink: 0 }}>
                                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>
                                    Career Distribution
                                </div>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, value }) => `${name}`} labelLine={false}>
                                            {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>

                {/* Direct Fit Careers */}
                {data?.directFit?.length > 0 && (
                    <div className="detail-section" style={{ marginBottom: '1.5rem' }}>
                        <div className="detail-section-title">
                            ✅ Direct Fit Careers for {branch}
                            <span style={{ fontSize: '0.78rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '8px' }}>High compatibility without major transitions</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                            {data.directFit.map(career => (
                                <CareerMiniCard
                                    key={career.id}
                                    career={career}
                                    onView={() => navigate(`/careers/${career.id}`)}
                                    onCompare={addToCompare}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Moderate Fit Careers */}
                {data?.moderateFit?.length > 0 && (
                    <div className="detail-section" style={{ marginBottom: '1.5rem' }}>
                        <div className="detail-section-title">
                            ⚠️ Possible with Skill Transition
                            <span style={{ fontSize: '0.78rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '8px' }}>Requires 6–12 months extra preparation</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                            {data.moderateFit.map(career => (
                                <CareerMiniCard
                                    key={career.id}
                                    career={career}
                                    onView={() => navigate(`/careers/${career.id}`)}
                                    onCompare={addToCompare}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Branch-specific guidance */}
                <div className="detail-section">
                    <div className="detail-section-title">🎯 Key Tips for {branch} Students</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                        {getBranchTips(branch).map((tip, i) => (
                            <div key={i} style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                                padding: '1.25rem',
                                display: 'flex',
                                gap: '12px',
                                alignItems: 'flex-start',
                            }}>
                                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{tip.icon}</span>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{tip.title}</div>
                                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{tip.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function getBranchTips(branch) {
    const tips = {
        CSE: [
            { icon: '💻', title: 'Build Projects Early', desc: 'Start personal projects from 2nd year. GitHub portfolio matters more than CGPA for tech companies.' },
            { icon: '🧮', title: 'Master DSA', desc: 'Data Structures & Algorithms are mandatory for FAANG and top Indian tech companies.' },
            { icon: '📊', title: 'Analytics is a strong alternative', desc: 'If not core SDE, Data Analyst/PM roles have less competition and equal salary.' },
        ],
        ECE: [
            { icon: '💡', title: 'IT Switch is Possible', desc: 'ECE students can enter IT with 6-8 months of focused coding practice. Many top companies hire ECE.' },
            { icon: '📡', title: 'Core + GATE is Safe', desc: 'Embedded systems, VLSI, and PSU via GATE are natural ECE career paths with great stability.' },
            { icon: '🔧', title: 'Learn Python', desc: 'Python bridges ECE into Data Science and IoT — highly valuable skill for your profile.' },
        ],
        Mechanical: [
            { icon: '🏭', title: 'PSU via GATE is Top Choice', desc: 'ONGC, BHEL, NTPC via GATE is the most stable path. Start GATE prep from 3rd year.' },
            { icon: '📊', title: 'Excel + Data = New Opportunity', desc: 'Manufacturing data analysis is a growing field. Excel → Python → Data Analyst is achievable.' },
            { icon: '🎓', title: 'Consider MBA via CAT', desc: 'Many top management consultants come from Mechanical background. CAT can transform your career.' },
        ],
        Civil: [
            { icon: '🏛️', title: 'Govt Jobs Are Your Strength', desc: 'SSC JE, UPSC IES and State Govt jobs give Civil engineers excellent stability with social impact.' },
            { icon: '🏗️', title: 'Infrastructure Surge in India', desc: 'India\'s infrastructure boom (smart cities, highways) creates massive private sector demand.' },
            { icon: '🎓', title: 'M.Tech Increases Value', desc: 'Structural/Geotechnical M.Tech from IIT significantly increases earning potential.' },
        ],
        EEE: [
            { icon: '⚡', title: 'Power Sector PSUs are Key', desc: 'NTPC, PGCIL, BHEL actively recruit EEE via GATE. High stability, good pay.' },
            { icon: '🤖', title: 'Automation is the Future', desc: 'PLC/SCADA, Industrial Automation, and Robotics are growing fields for EEE graduates.' },
            { icon: '☀️', title: 'Renewable Energy Boom', desc: 'Solar, wind, and EV sectors are creating massive new opportunities for EEE graduates.' },
        ],
    };
    return tips[branch] || [{ icon: '🎯', title: 'Explore All Options', desc: 'Use our quiz to find the best career match for your profile.' }];
}

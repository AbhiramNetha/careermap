import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fetchCareersByBranch } from '../services/api';

const BRANCH_INFO = {
    CSE: { fullName: 'Computer Science Engineering', desc: 'CSE graduates have the widest range of career options — from top tech companies to research labs.' },
    IT: { fullName: 'Information Technology', desc: 'IT graduates have an extensive range of paths in software, cloud, and digital services.' },
    ECE: { fullName: 'Electronics & Communication Engineering', desc: 'ECE opens doors to both core electronics and IT roles, plus government PSU jobs.' },
    MECH: { fullName: 'Mechanical Engineering', desc: 'Mechanical engineers are backbone of manufacturing, automotive, and energy sectors.' },
    CIVIL: { fullName: 'Civil Engineering', desc: 'Civil engineers build India\'s infrastructure — from highways to smart cities.' },
    EEE: { fullName: 'Electrical & Electronics Engineering', desc: 'EEE graduates power India\'s energy transition and automation revolution.' },
};

const PIE_COLORS = ['#6366f1', '#059669', '#8b5cf6', '#f59e0b'];

function CareerMiniCard({ career, onView }) {
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
            onClick={() => onView(career.slug)}
        >
            <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{career.title}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{career.category}</div>
            {career.salaryRange && <div style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 600 }}>{career.salaryRange}</div>}
        </div>
    );
}

export default function BranchDetailPage({ branchId: branchIdProp, onBack }) {
    const params = useParams();
    const navigate = useNavigate();
    const branch = branchIdProp || params.branch;

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

    const pieData = data ? [
        { name: 'Private Sector', value: data.directFit?.filter(c => c.category === 'Private Sector').length || 0 },
        { name: 'Government', value: data.directFit?.filter(c => c.category === 'Government').length || 0 },
        { name: 'Higher Studies', value: data.directFit?.filter(c => c.category === 'Higher Studies').length || 0 },
        { name: 'Entrepreneurship', value: data.directFit?.filter(c => c.category === 'Entrepreneurship').length || 0 },
    ].filter(item => item.value > 0) : [];

    if (loading) {
        return <div className="loader-container"><div className="loader" /><div className="loader-text">Loading branch guide...</div></div>;
    }

    return (
        <div style={{ padding: '3rem 0 6rem' }}>
            <div className="container">
                {}
                <div className="career-hero" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
                        <div>
                            <div className="breadcrumb" style={{ marginBottom: '1rem' }}>
                                <a href="/">Home</a> <span>/</span>
                                {onBack
                                    ? <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontWeight: 600, padding: 0 }}>Branch Guide</button>
                                    : <a href="/branches">Branches</a>
                                } <span>/</span>
                                <span style={{ color: 'var(--text-primary)' }}>{branch}</span>
                            </div>
                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}></div>
                            <h1 style={{ fontFamily: 'Poppins', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                                {info.fullName || branch}
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', lineHeight: 1.7 }}>{info.desc}</p>
                            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <button className="btn-primary" onClick={() => navigate('/quiz')}>Take Career Quiz</button>
                                <button className="btn-secondary" onClick={() => navigate('/careers')}>Explore All Careers</button>
                            </div>
                        </div>

                        {}
                        {pieData.length > 0 && (
                            <div style={{ width: '260px', height: '200px', flexShrink: 0 }}>
                                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>
                                    Career Distribution
                                </div>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name }) => `${name}`} labelLine={false}>
                                            {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>

                {}
                {data?.directFit?.length > 0 && (
                    <div className="detail-section" style={{ marginBottom: '1.5rem' }}>
                        <div className="detail-section-title">
                            Direct Fit Careers for {branch}
                            <span style={{ fontSize: '0.78rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '8px' }}>High compatibility without major transitions</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                            {data.directFit.map(career => (
                                <CareerMiniCard
                                    key={career.id}
                                    career={career}
                                    onView={(slug) => navigate(`/careers/${slug}`)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Moderate Fit Section */}
                {data?.moderateFit?.length > 0 && (
                    <div className="detail-section" style={{ marginBottom: '1.5rem' }}>
                        <div className="detail-section-title">
                            Possible with Skill Transition
                            <span style={{ fontSize: '0.78rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '8px' }}>Requires 6–12 months extra preparation</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                            {data.moderateFit.map(career => (
                                <CareerMiniCard
                                    key={career.id}
                                    career={career}
                                    onView={(slug) => navigate(`/careers/${slug}`)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {}
                <div className="detail-section">
                    <div className="detail-section-title">Key Tips for {branch} Students</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                        {getBranchTips(branch).map((tip, i) => (
                            <div key={i} style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                                padding: '1.25rem',
                            }}>
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
            { title: 'Build Projects Early', desc: 'Start personal projects from 2nd year. GitHub portfolio matters more than CGPA for tech companies.' },
            { title: 'Master DSA', desc: 'Data Structures & Algorithms are mandatory for FAANG and top Indian tech companies.' },
            { title: 'Analytics is a strong alternative', desc: 'If not core SDE, Data Analyst/PM roles have less competition and equal salary.' },
        ],
        ECE: [
            { title: 'IT Switch is Possible', desc: 'ECE students can enter IT with 6-8 months of focused coding practice. Many top companies hire ECE.' },
            { title: 'Core + GATE is Safe', desc: 'Embedded systems, VLSI, and PSU via GATE are natural ECE career paths with great stability.' },
            { title: 'Learn Python', desc: 'Python bridges ECE into Data Science and IoT — highly valuable skill for your profile.' },
        ],
        Mechanical: [
            { title: 'PSU via GATE is Top Choice', desc: 'ONGC, BHEL, NTPC via GATE is the most stable path. Start GATE prep from 3rd year.' },
            { title: 'Excel + Data = New Opportunity', desc: 'Manufacturing data analysis is a growing field. Excel → Python → Data Analyst is achievable.' },
            { title: 'Consider MBA via CAT', desc: 'Many top management consultants come from Mechanical background. CAT can transform your career.' },
        ],
        Civil: [
            { title: 'Govt Jobs Are Your Strength', desc: 'SSC JE, UPSC IES and State Govt jobs give Civil engineers excellent stability with social impact.' },
            { title: 'Infrastructure Surge in India', desc: 'India\'s infrastructure boom (smart cities, highways) creates massive private sector demand.' },
            { title: 'M.Tech Increases Value', desc: 'Structural/Geotechnical M.Tech from IIT significantly increases earning potential.' },
        ],
        EEE: [
            { title: 'Power Sector PSUs are Key', desc: 'NTPC, PGCIL, BHEL actively recruit EEE via GATE. High stability, good pay.' },
            { title: 'Automation is the Future', desc: 'PLC/SCADA, Industrial Automation, and Robotics are growing fields for EEE graduates.' },
            { title: 'Renewable Energy Boom', desc: 'Solar, wind, and EV sectors are creating massive new opportunities for EEE graduates.' },
        ],
    };
    return tips[branch] || [{ title: 'Explore All Options', desc: 'Use our quiz to find the best career match for your profile.' }];
}

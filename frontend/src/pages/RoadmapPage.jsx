import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchCareerById } from '../services/api';
import { useApp } from '../context/AppContext';
import { RoadmapSkeleton } from '../components/SkeletonLoader';


function buildItemKeys(roadmap) {
    const keys = [];
    roadmap?.forEach((step, si) => {
        ['skills', 'tools', 'projects', 'interviewPrep'].forEach(cat => {
            step[cat]?.forEach((item, ii) => {
                keys.push(`${si}__${cat}__${ii}`);
            });
        });
    });
    return keys;
}

const CATEGORY_META = {
    skills: { label: '🛠️ Skills to Learn', color: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.3)', text: 'var(--primary-light)' },
    tools: { label: '🔧 Tools & Resources', color: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#10b981' },
    projects: { label: '📂 Projects to Build', color: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b' },
    interviewPrep: { label: '🎯 Interview Preparation', color: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.3)', text: '#ec4899' },
};

export default function RoadmapPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCompare } = useApp();

    const [career, setCareer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedSteps, setExpandedSteps] = useState({});
    const [checked, setChecked] = useState({});     

    
    useEffect(() => {
        setLoading(true);
        fetchCareerById(id)
            .then(res => {
                const data = res.data.data;
                setCareer(data);
                
                const init = {};
                data.roadmap?.forEach((_, i) => { init[i] = true; });
                setExpandedSteps(init);
            })
            .catch(() => setError('Roadmap not found'))
            .finally(() => setLoading(false));
    }, [id]);

    
    useEffect(() => {
        if (!id) return;
        try {
            const saved = localStorage.getItem(`roadmap-progress-${id}`);
            if (saved) setChecked(JSON.parse(saved));
        } catch {
            void 0;
        }
    }, [id]);

    
    useEffect(() => {
        if (!id || !career) return;
        try {
            localStorage.setItem(`roadmap-progress-${id}`, JSON.stringify(checked));
        } catch {
            void 0;
        }
    }, [checked, id, career]);

    
    const allKeys = useMemo(() => buildItemKeys(career?.roadmap), [career]);
    const doneCount = useMemo(() => allKeys.filter(k => checked[k]).length, [allKeys, checked]);
    const totalCount = allKeys.length;
    const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

    
    const stepProgress = useMemo(() => {
        const map = {};
        career?.roadmap?.forEach((step, si) => {
            const stepKeys = ['skills', 'tools', 'projects', 'interviewPrep'].flatMap(cat =>
                (step[cat] || []).map((_, ii) => `${si}__${cat}__${ii}`)
            );
            const done = stepKeys.filter(k => checked[k]).length;
            map[si] = { done, total: stepKeys.length };
        });
        return map;
    }, [career, checked]);

    const toggleItem = (key) => {
        setChecked(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleStep = (i) => setExpandedSteps(prev => ({ ...prev, [i]: !prev[i] }));

    const resetProgress = () => {
        if (window.confirm('Reset all progress for this roadmap?')) {
            setChecked({});
        }
    };

    if (loading) {
        return <RoadmapSkeleton />;
    }
    if (error || !career) {
        return (
            <div className="not-found-container">
                <h1>404</h1>
                <h2>Roadmap not found</h2>
                <button className="btn-primary" onClick={() => navigate('/careers')}>Browse Careers</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '3rem 0 6rem' }}>
            <div className="container">

                {/* ── Career Hero ── */}
                <div className="career-hero" style={{ marginBottom: '2rem' }}>
                    <div className="breadcrumb" style={{ marginBottom: '1rem' }}>
                        <Link to="/">Home</Link> <span>/</span>
                        <Link to="/careers">Careers</Link> <span>/</span>
                        <Link to={`/careers/${career.slug}`}>{career.title}</Link> <span>/</span>
                        <span style={{ color: 'var(--text-primary)' }}>Roadmap</span>
                    </div>

                    <h1 style={{ fontFamily: 'Poppins', fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 800, marginBottom: '0.5rem' }}>
                        🗺️ {career.title} Roadmap
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        {career.duration || 'Custom'} structured preparation plan with skills, tools &amp; projects
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {career.duration && <span className="chip chip-purple">⏰ {career.duration}</span>}
                        {career.riskLevel && (
                            <span className={`chip ${career.riskLevel === 'Low' ? 'chip-green' : career.riskLevel === 'High' ? 'chip-red' : 'chip-yellow'}`}>
                                ⚡ {career.riskLevel} Risk
                            </span>
                        )}
                        {career.salaryRange && <span className="chip chip-green">💰 {career.salaryRange}</span>}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                        <button className="btn-primary" onClick={() => navigate(`/careers/${career.slug}`)}>
                            ← View Career Details
                        </button>
                        <button className="btn-secondary" onClick={() => { addToCompare(career); navigate('/compare'); }}>
                            ⚖️ Compare This Career
                        </button>
                    </div>
                </div>

                {}
                {career.roadmap && career.roadmap.length > 0 ? (
                    <>
                        {/* ── Progress Card ── */}
                        <div className="roadmap-progress-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <div>
                                    <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem' }}>
                                        Overall Progress
                                    </span>
                                    <span style={{ marginLeft: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {doneCount} / {totalCount} topics completed
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span className="roadmap-progress-pct">{progress}%</span>
                                    {doneCount > 0 && (
                                        <button
                                            className="btn-ghost-sm"
                                            onClick={resetProgress}
                                            title="Reset all progress"
                                        >
                                            🔄 Reset
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="roadmap-progress-track">
                                <div
                                    className="roadmap-progress-fill"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            {progress === 100 && (
                                <div className="roadmap-complete-banner">
                                    🎉 Congratulations! You've completed the entire roadmap!
                                </div>
                            )}
                        </div>

                        {/* ── Phase Overview chips ── */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '2.5rem' }}>
                            {career.roadmap?.map((step, i) => {
                                const sp = stepProgress[i] || { done: 0, total: 0 };
                                const pct = sp.total > 0 ? Math.round((sp.done / sp.total) * 100) : 0;
                                return (
                                    <div
                                        key={i}
                                        className="phase-chip"
                                        style={{ background: pct === 100 ? 'rgba(16,185,129,0.12)' : 'rgba(99,102,241,0.08)', borderColor: pct === 100 ? 'rgba(16,185,129,0.35)' : 'rgba(99,102,241,0.2)' }}
                                        onClick={() => document.getElementById(`step-${i}`)?.scrollIntoView({ behavior: 'smooth' })}
                                    >
                                        <div style={{ fontWeight: 700, color: pct === 100 ? '#10b981' : 'var(--primary-light)', fontSize: '0.82rem', marginBottom: '4px' }}>
                                            {pct === 100 ? '✅ ' : ''}{step.month}
                                        </div>
                                        <div style={{ height: '4px', borderRadius: '99px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#10b981' : 'var(--gradient-primary)', borderRadius: '99px', transition: 'width 0.4s ease' }} />
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>{sp.done}/{sp.total} done</div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ── Timeline (Checklist) ── */}
                        <div className="timeline">
                            {career.roadmap?.map((step, si) => {
                                const sp = stepProgress[si] || { done: 0, total: 0 };
                                const stepPct = sp.total > 0 ? Math.round((sp.done / sp.total) * 100) : 0;
                                const isComplete = stepPct === 100 && sp.total > 0;

                                return (
                                    <motion.div
                                        id={`step-${si}`}
                                        key={si}
                                        className="timeline-item"
                                        style={{ marginBottom: '2.5rem', position: 'relative' }}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: '-40px' }}
                                        transition={{ duration: 0.5, delay: si * 0.05, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        {/* Enhanced dot with pulse ring for completed */}
                                        <div style={{ position: 'relative', display: 'inline-block' }}>
                                            <div className={`timeline-dot ${isComplete ? 'timeline-dot-done' : ''}`}
                                                style={{
                                                    background: isComplete
                                                        ? 'linear-gradient(135deg,#10b981,#059669)'
                                                        : 'linear-gradient(135deg,#3b82f6,#6366f1)',
                                                    boxShadow: isComplete
                                                        ? '0 0 16px rgba(16,185,129,0.5)'
                                                        : '0 0 12px rgba(99,102,241,0.4)',
                                                }}
                                            />
                                            {isComplete && (
                                                <motion.div
                                                    style={{
                                                        position: 'absolute',
                                                        inset: '-6px',
                                                        borderRadius: '50%',
                                                        border: '2px solid rgba(16,185,129,0.4)',
                                                    }}
                                                    animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                                />
                                            )}
                                        </div>

                                        {/* Step header */}
                                        <div
                                            className="timeline-month"
                                            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                            onClick={() => toggleStep(si)}
                                        >
                                            <span>
                                                {isComplete ? '✅' : '📅'} {step.month}
                                                <span style={{ marginLeft: '0.75rem', fontSize: '0.75rem', fontWeight: 600, color: isComplete ? '#10b981' : 'var(--text-muted)' }}>
                                                    {sp.done}/{sp.total}
                                                </span>
                                            </span>
                                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                                {expandedSteps[si] ? '▼ collapse' : '▶ expand'}
                                            </span>
                                        </div>

                                        {/* Mini step progress bar */}
                                        <div style={{ height: '3px', borderRadius: '99px', background: 'rgba(255,255,255,0.06)', marginBottom: '0.75rem', overflow: 'hidden' }}>
                                            <motion.div
                                                style={{ height: '100%', background: isComplete ? '#10b981' : 'var(--gradient-primary)', borderRadius: '99px' }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${stepPct}%` }}
                                                transition={{ duration: 0.6, ease: 'easeOut', delay: si * 0.05 }}
                                            />
                                        </div>

                                        {expandedSteps[si] && (
                                            <motion.div
                                                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                transition={{ duration: 0.35, ease: 'easeOut' }}
                                            >
                                                {['skills', 'tools', 'projects', 'interviewPrep'].map(cat => {
                                                    const items = step[cat];
                                                    if (!items?.length) return null;
                                                    const meta = CATEGORY_META[cat];
                                                    return (
                                                        <div
                                                            key={cat}
                                                            className="timeline-content checklist-card"
                                                            style={{ borderColor: meta.border }}
                                                        >
                                                            <h4 style={{ color: meta.text }}>{meta.label}</h4>
                                                            <ul className="checklist-ul">
                                                                {items.map((item, ii) => {
                                                                    const key = `${si}__${cat}__${ii}`;
                                                                    const done = !!checked[key];
                                                                    return (
                                                                        <li
                                                                            key={key}
                                                                            className={`checklist-item ${done ? 'checklist-item-done' : ''}`}
                                                                            onClick={() => toggleItem(key)}
                                                                            role="checkbox"
                                                                            aria-checked={done}
                                                                            tabIndex={0}
                                                                            onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && toggleItem(key)}
                                                                        >
                                                                            <span className={`check-box ${done ? 'check-box-done' : ''}`}>
                                                                                {done && <span>✓</span>}
                                                                            </span>
                                                                            <span className="checklist-label">{item}</span>
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                        </div>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-xl)',
                        padding: '4rem 2rem',
                        textAlign: 'center',
                        boxShadow: 'var(--shadow-md)',
                        marginBottom: '2rem',
                    }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🗺️</div>
                        <h2 style={{ marginBottom: '0.75rem', fontWeight: 700, fontFamily: 'Poppins' }}>Structured Roadmap Coming Soon!</h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 1.75rem', lineHeight: 1.6, fontSize: '0.92rem' }}>
                            Our team is currently designing the custom month-by-month learning roadmaps for our newly added career paths. You can view the recommended skills and tools on the Career Details page.
                        </p>
                        <button className="btn-primary" onClick={() => navigate(`/careers/${career.slug}`)}>
                            View Career Details
                        </button>
                    </div>
                )}

                {/* ── All Skills Summary ── */}
                <div className="detail-section" style={{ marginTop: '2rem' }}>
                    <div className="detail-section-title">🛠️ All Skills in This Roadmap</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {career.skills?.map(skill => (
                            <span key={skill} className="skill-tag">{skill}</span>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

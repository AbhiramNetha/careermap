import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function QuizResultPage() {
    const navigate = useNavigate();
    const { quizResults, addToCompare } = useApp();

    if (!quizResults || !quizResults.recommendations) {
        return (
            <div className="loader-container">
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤔</div>
                    <h2 style={{ marginBottom: '1rem' }}>No Results Found</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Please complete the career quiz first to see your recommendations.
                    </p>
                    <button className="btn-primary" onClick={() => navigate('/quiz')}>
                        ✨ Take the Quiz
                    </button>
                </div>
            </div>
        );
    }

    const { recommendations, answers } = quizResults;

    const RANK_STYLES = {
        1: { medal: '🥇', gradientText: 'gradient-text-gold', badge: 'rank-1', label: 'Best Match' },
        2: { medal: '🥈', gradientText: 'gradient-text', badge: 'rank-2', label: '2nd Best' },
        3: { medal: '🥉', gradientText: '', badge: 'rank-3', label: '3rd Best' },
    };

    return (
        <div className="results-page">
            <div className="container">
                {}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div className="section-tag">Quiz Results</div>
                    <h1 className="section-title" style={{ marginTop: '1rem' }}>
                        Your <span className="gradient-text">Career Matches</span> Are Ready 🎯
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem' }}>
                        Based on your profile: <strong style={{ color: 'var(--text-primary)' }}>
                            {answers?.branch} • {answers?.interest} Interest • {answers?.riskTolerance} Risk
                        </strong>
                    </p>
                </div>

                {}
                <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
                    {recommendations.map((rec, i) => {
                        const rank = rec.rank;
                        const { medal, badge, label } = RANK_STYLES[rank] || {};
                        const career = rec.career;
                        const barWidth = `${rec.matchPercentage}%`;

                        return (
                            <div key={career.id} className="result-card fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
                                <span className={`result-rank ${badge}`}>{medal} {label}</span>

                                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                    {}
                                    <div style={{ minWidth: '120px' }}>
                                        <div className="match-percentage">{rec.matchPercentage}%</div>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Match Score</div>
                                        <div className="match-bar-container" style={{ marginTop: '12px' }}>
                                            <div className="match-bar-fill" style={{ width: barWidth }} />
                                        </div>
                                    </div>

                                    {/* Recommendation Info */}
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontFamily: 'Poppins', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                                            {career.icon} {career.title}
                                        </h3>
                                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                                            {career.category}
                                        </div>

                                        <div style={{
                                            background: 'rgba(99,102,241,0.08)',
                                            border: '1px solid rgba(99,102,241,0.2)',
                                            borderRadius: 'var(--radius-sm)',
                                            padding: '12px 14px',
                                            fontSize: '0.85rem',
                                            color: 'var(--text-secondary)',
                                            lineHeight: 1.6,
                                            marginBottom: '1rem',
                                            fontStyle: 'italic',
                                        }}>
                                            💡 {rec.explanation}
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                            {career.salaryRange && <span className="chip chip-green">💰 {career.salaryRange}</span>}
                                            {career.riskLevel && (
                                                <span className={`chip ${career.riskLevel === 'Low' ? 'chip-green' : career.riskLevel === 'High' ? 'chip-red' : 'chip-yellow'}`}>
                                                    ⚡ {career.riskLevel} Risk
                                                </span>
                                            )}
                                            {career.demandLevel && <span className="chip chip-purple">📈 {career.demandLevel} Demand</span>}
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            <button
                                                className="btn-sm btn-filled"
                                                onClick={() => navigate(`/careers/${career.slug}`)}
                                            >
                                                📖 View Full Details
                                            </button>
                                            <button
                                                className="btn-sm btn-outline"
                                                onClick={() => { addToCompare(career); navigate('/compare'); }}
                                            >
                                                ⚖️ Add to Compare
                                            </button>
                                            <button
                                                className="btn-sm btn-outline"
                                                onClick={() => navigate(`/roadmap/${career.slug}`)}
                                            >
                                                🗺️ View Roadmap
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {}
                <div style={{ textAlign: 'center', marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button className="btn-secondary" onClick={() => navigate('/quiz')}>
                        🔁 Retake Quiz
                    </button>
                    <button className="btn-primary" onClick={() => navigate('/careers')}>
                        🗺️ Explore All Careers
                    </button>
                    <button className="btn-secondary" onClick={() => navigate('/compare')}>
                        ⚖️ Compare Careers
                    </button>
                </div>
            </div>
        </div>
    );
}

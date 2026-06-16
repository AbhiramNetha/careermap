import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { compareCareers, fetchAllCareers } from '../services/api';

const FIELDS = [
    { key: 'salary', label: '💰 Starting Salary', getter: c => c.salary?.fresher, higher: true },
    { key: 'salary5', label: '💰 5-Year Salary', getter: c => c.salary?.fiveYears, higher: true },
    { key: 'risk', label: '⚡ Risk Level', getter: c => c.riskLevel, lower: true },
    { key: 'demand', label: '📈 Demand Level', getter: c => c.demandLevel, higher: true },
    { key: 'growth', label: '🚀 Growth Potential', getter: c => c.growthPotential, higher: true },
    { key: 'stability', label: '🛡️ Stability', getter: c => c.stabilityLevel, higher: true },
    { key: 'wlb', label: '🧘 Work-Life Balance', getter: c => c.workLifeBalance, higher: true },
    { key: 'prep', label: '⏰ Prep Time', getter: c => c.preparationTime, lower: true },
    { key: 'study', label: '📚 Study Required', getter: c => (c.studyRequired ? 'Yes' : 'No'), lower: true },
    { key: 'comp', label: '🏆 Competition', getter: c => c.competitionLevel, lower: true },
];

const LEVEL_SCORE = { 'Very High': 4, High: 3, Medium: 2, Low: 1, Yes: 1, No: 2 };

function isBest(val, allVals, higher) {
    if (!val || allVals.every(v => v === val)) return false;
    const scored = allVals.map(v => LEVEL_SCORE[v] ?? 0);
    const myScore = LEVEL_SCORE[val] ?? 0;
    return higher ? myScore === Math.max(...scored) : myScore === Math.min(...scored.filter(s => s > 0));
}

export default function ComparePage() {
    const navigate = useNavigate();
    const { selectedCareers, removeFromCompare, addToCompare } = useApp();

    const [comparingData, setComparingData] = useState([]);
    const [allCareers, setAllCareers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAllCareers()
            .then(res => setAllCareers(res.data.data))
            .catch(() => { });
    }, []);

    useEffect(() => {
        if (selectedCareers.length === 0) { setComparingData([]); return; }
        setLoading(true);
        compareCareers(selectedCareers.map(c => c.id))
            .then(res => setComparingData(res.data.data))
            .catch(() => setComparingData(selectedCareers))
            .finally(() => setLoading(false));
    }, [selectedCareers]);

    return (
        <div className="compare-page">
            <div className="container">
                {/* Header */}
                <div className="page-header" style={{ padding: '0 0 3rem', background: 'none', borderBottom: 'none' }}>
                    <div className="section-tag">Comparison Tool</div>
                    <h1 className="section-title" style={{ marginTop: '1rem' }}>
                        Compare Career <span className="gradient-text">Side by Side</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Select up to 3 careers and compare salary, risk, growth & stability
                    </p>
                </div>

                {/* Selected Careers Summary */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    {selectedCareers.map(c => (
                        <div key={c.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: 'rgba(99,102,241,0.12)',
                            border: '1px solid rgba(99,102,241,0.3)',
                            borderRadius: 'var(--radius-md)',
                            padding: '10px 16px',
                        }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</span>
                            <button
                                onClick={() => removeFromCompare(c.id)}
                                style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1 }}
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    {selectedCareers.length < 3 && (
                        <div style={{
                            border: '2px dashed var(--border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '10px 24px',
                            fontSize: '0.85rem',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}>
                            + Add Career to Compare
                        </div>
                    )}
                </div>

                {/* Add careers dropdown */}
                {selectedCareers.length < 3 && allCareers.length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                            Quick add career:
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {allCareers
                                .filter(c => !selectedCareers.find(s => s.id === c.id))
                                .map(c => (
                                    <button
                                        key={c.id}
                                        className="btn-sm btn-outline"
                                        onClick={() => addToCompare(c)}
                                    >
                                        + {c.name}
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                )}

                {/* Comparison Table */}
                {selectedCareers.length < 2 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '5rem 2rem',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-xl)',
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚖️</div>
                        <h2 style={{ marginBottom: '0.75rem' }}>Select At Least 2 Careers</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            Add careers from the Explore page or from career detail pages
                        </p>
                        <button className="btn-primary" onClick={() => navigate('/careers')}>
                            🗺️ Browse Careers
                        </button>
                    </div>
                ) : loading ? (
                    <div className="loader-container"><div className="loader" /></div>
                ) : (
                    <div className="compare-table-wrapper">
                        <table className="compare-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '200px' }}>Metric</th>
                                    {comparingData.map(c => (
                                        <th key={c.id}>
                                            <div style={{ fontWeight: 700 }}>{c.name}</div>
                                            <div style={{ fontWeight: 400, fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>{c.subCategory}</div>
                                            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                                                <button
                                                    className="btn-sm btn-filled"
                                                    onClick={() => navigate(`/careers/${c.id}`)}
                                                    style={{ flex: 1, padding: '4px 8px', fontSize: '0.72rem' }}
                                                >
                                                    Details
                                                </button>
                                                <button
                                                    className="btn-sm btn-outline"
                                                    onClick={() => navigate(`/roadmap/${c.id}`)}
                                                    style={{ flex: 1, padding: '4px 8px', fontSize: '0.72rem' }}
                                                >
                                                    Roadmap
                                                </button>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {FIELDS.map(field => {
                                    const vals = comparingData.map(c => field.getter(c));
                                    return (
                                        <tr key={field.key}>
                                            <td style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.82rem' }}>{field.label}</td>
                                            {comparingData.map((c, i) => {
                                                const val = field.getter(c);
                                                const best = isBest(val, vals, field.higher);
                                                return (
                                                    <td key={c.id} className={best ? 'best-cell' : ''}>
                                                        {val || '—'}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            ✓ = Best option in this category
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

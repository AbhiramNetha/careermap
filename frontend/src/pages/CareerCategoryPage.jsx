import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchAllCareers } from '../services/api';
import { useApp } from '../context/AppContext';

function CareerCard({ career, onCompare, onView }) {
    const riskClass = `risk-${career.riskLevel?.toLowerCase()}`;
    return (
        <div className="career-card fade-in">
            <div className="career-card-header">
                <div>
                    <div className="career-name">{career.name}</div>
                    <div className="career-subcategory">{career.subCategory}</div>
                </div>
                {career.isTrending && <span className="trend-badge">🔥 Trending</span>}
            </div>
            <p className="career-overview">{career.overview}</p>
            <div className="career-meta">
                <span className={`meta-tag ${riskClass}`}>⚡ {career.riskLevel} Risk</span>
                <span className="meta-tag">📊 {career.demandLevel} Demand</span>
                {career.studyRequired
                    ? <span className="meta-tag">📚 Study Required</span>
                    : <span className="meta-tag">✅ No Extra Degree</span>}
            </div>
            <div className="career-salary">💰 Fresher: {career.salary?.fresher}</div>
            <div className="career-card-footer">
                <button className="btn-sm btn-outline" onClick={() => onCompare(career)}>⚖️ Compare</button>
                <button className="btn-sm btn-filled" onClick={() => onView(career.id)}>View Details →</button>
            </div>
        </div>
    );
}

const CATEGORIES = [
    { id: '', label: 'All Careers' },
    { id: 'private', label: '💼 Private Sector' },
    { id: 'government', label: '🏛️ Government' },
    { id: 'higher-studies', label: '🎓 Higher Studies' },
    { id: 'entrepreneurship', label: '🚀 Entrepreneurship' },
];

const RISK_LEVELS = ['', 'Low', 'Medium', 'High'];

export default function CareerCategoryPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { addToCompare } = useApp();

    const [careers, setCareers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        riskLevel: '',
        studyRequired: '',
    });

    useEffect(() => {
        setLoading(true);
        const params = {};
        if (filters.category) params.category = filters.category;
        if (filters.riskLevel) params.riskLevel = filters.riskLevel;
        if (filters.studyRequired !== '') params.studyRequired = filters.studyRequired;
        if (search) params.search = search;

        fetchAllCareers(params)
            .then(res => setCareers(res.data.data))
            .catch(() => setCareers([]))
            .finally(() => setLoading(false));
    }, [filters, search]);

    function setFilter(key, val) {
        setFilters(prev => ({ ...prev, [key]: val }));
    }

    const categoryTitle = CATEGORIES.find(c => c.id === filters.category)?.label || 'All Careers';

    return (
        <div style={{ padding: '0 0 5rem' }}>
            {/* Page Header */}
            <div className="page-header">
                <div className="container">
                    <div className="breadcrumb">
                        <a href="/">Home</a> <span>/</span> Explore Careers
                    </div>
                    <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>
                        Explore <span className="gradient-text">Career Paths</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Browse {careers.length} career paths tailored for Indian B.Tech graduates
                    </p>
                </div>
            </div>

            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }}>
                    {/* Filter Panel */}
                    <div className="filter-panel" style={{ position: 'sticky', top: '90px' }}>
                        <div className="filter-title">🔍 Filter Careers</div>

                        {/* Search */}
                        <div className="filter-group">
                            <input
                                type="text"
                                placeholder="Search careers..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '10px 14px',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.85rem',
                                }}
                            />
                        </div>

                        <div className="filter-group">
                            <div className="filter-label">Category</div>
                            {CATEGORIES.map(c => (
                                <div
                                    key={c.id}
                                    className={`filter-option ${filters.category === c.id ? 'active' : ''}`}
                                    onClick={() => setFilter('category', c.id)}
                                >
                                    <span style={{
                                        width: '8px', height: '8px',
                                        borderRadius: '50%',
                                        background: filters.category === c.id ? 'var(--primary)' : 'var(--border)',
                                        flexShrink: 0,
                                    }} />
                                    {c.label}
                                </div>
                            ))}
                        </div>

                        <div className="filter-group">
                            <div className="filter-label">Risk Level</div>
                            {RISK_LEVELS.map(r => (
                                <div
                                    key={r}
                                    className={`filter-option ${filters.riskLevel === r ? 'active' : ''}`}
                                    onClick={() => setFilter('riskLevel', r)}
                                >
                                    <span style={{
                                        width: '8px', height: '8px',
                                        borderRadius: '50%',
                                        background: filters.riskLevel === r ? 'var(--primary)' : 'var(--border)',
                                        flexShrink: 0,
                                    }} />
                                    {r || 'All Levels'}
                                </div>
                            ))}
                        </div>

                        <div className="filter-group">
                            <div className="filter-label">Study Requirement</div>
                            {[['', 'All'], ['false', '✅ No extra degree'], ['true', '📚 Study required']].map(([val, label]) => (
                                <div
                                    key={val}
                                    className={`filter-option ${filters.studyRequired === val ? 'active' : ''}`}
                                    onClick={() => setFilter('studyRequired', val)}
                                >
                                    <span style={{
                                        width: '8px', height: '8px',
                                        borderRadius: '50%',
                                        background: filters.studyRequired === val ? 'var(--primary)' : 'var(--border)',
                                        flexShrink: 0,
                                    }} />
                                    {label}
                                </div>
                            ))}
                        </div>

                        {(filters.category || filters.riskLevel || filters.studyRequired) && (
                            <button
                                className="btn-sm btn-outline"
                                onClick={() => setFilters({ category: '', riskLevel: '', studyRequired: '' })}
                                style={{ width: '100%', marginTop: '1rem' }}
                            >
                                ✕ Clear Filters
                            </button>
                        )}
                    </div>

                    {/* Career Grid */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                                {loading ? 'Loading...' : `${careers.length} careers found`}
                            </div>
                        </div>

                        {loading ? (
                            <div className="loader-container" style={{ minHeight: '300px' }}>
                                <div className="loader" />
                            </div>
                        ) : careers.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                                <h3 style={{ marginBottom: '0.5rem' }}>No careers found</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters</p>
                            </div>
                        ) : (
                            <div className="careers-grid">
                                {careers.map(career => (
                                    <CareerCard
                                        key={career.id}
                                        career={career}
                                        onCompare={addToCompare}
                                        onView={(id) => navigate(`/careers/${id}`)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

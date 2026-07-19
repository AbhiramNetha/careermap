import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchAllCareers } from '../services/api';
import { useApp } from '../context/AppContext';
import { toast } from 'react-hot-toast';

function CareerCard({ career, onCompare, onView, alreadyInCompare }) {
    const risk = career.riskLevel || (career.category === 'Government' || career.category === 'Higher Studies' ? 'Low' : career.category === 'Entrepreneurship' ? 'High' : 'Medium');
    const riskClass = `risk-${risk.toLowerCase()}`;
    return (
        <div className="career-card fade-in">
            <div className="career-card-header">
                <div>
                    <div className="career-name">{career.title}</div>
                    <div className="career-subcategory">{career.category}</div>
                </div>
                {career.isTrending && <span className="trend-badge">Trending</span>}
            </div>
            <p className="career-overview">{career.description}</p>
            <div className="career-meta">
                <span className={`meta-tag ${riskClass}`}>{risk} Risk</span>
                {career.demandLevel && <span className="meta-tag">{career.demandLevel} Demand</span>}
                {career.examRoute && <span className="meta-tag">{career.examRoute}</span>}
                {career.duration && <span className="meta-tag">{career.duration}</span>}
                {career.capitalNeeded && <span className="meta-tag">Capital: {career.capitalNeeded}</span>}
            </div>
            {career.salaryRange && <div className="career-salary">Salary Range: {career.salaryRange}</div>}
            <div className="career-card-footer">
                <button 
                    className={`btn-sm ${alreadyInCompare ? 'btn-filled' : 'btn-outline'}`} 
                    onClick={onCompare}
                >
                    {alreadyInCompare ? '✓ Compare' : '⚖️ Compare'}
                </button>
                <button className="btn-sm btn-filled" onClick={() => onView(career.slug)}>View Details →</button>
            </div>
        </div>
    );
}

const CATEGORIES = [
    { id: '', label: 'All Careers' },
    { id: 'Private Sector', label: 'Private Sector' },
    { id: 'Government', label: 'Government' },
    { id: 'Higher Studies', label: 'Higher Studies' },
    { id: 'Entrepreneurship', label: 'Entrepreneurship' },
];

const RISK_LEVELS = ['', 'Low', 'Medium', 'High'];

export default function CareerCategoryPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { addToCompare, removeFromCompare, selectedCareers } = useApp();

    const [allCareers, setAllCareers] = useState([]);
    const [filteredCareers, setFilteredCareers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        riskLevel: '',
        studyRequired: '',
    });

    useEffect(() => {
        setLoading(true);
        fetchAllCareers()
            .then(res => {
                setAllCareers(res.data.data || []);
            })
            .catch(() => setAllCareers([]))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        let result = [...allCareers];

        // 1. Category Filter
        if (filters.category) {
            result = result.filter(c => c.category === filters.category);
        }
        
        // 2. Risk Level Filter
        if (filters.riskLevel) {
            result = result.filter(c => {
                const risk = c.riskLevel || (c.category === 'Government' || c.category === 'Higher Studies' ? 'Low' : c.category === 'Entrepreneurship' ? 'High' : 'Medium');
                return risk === filters.riskLevel;
            });
        }
        
        // 3. Study Required Filter
        if (filters.studyRequired !== '') {
            const isStudy = filters.studyRequired === 'true';
            result = result.filter(c => (c.category === 'Higher Studies') === isStudy);
        }
        
        // 4. Search Filter (checks title, description, category, and skills)
        if (search) {
            const query = search.toLowerCase();
            result = result.filter(c => 
                c.title.toLowerCase().includes(query) || 
                (c.description && c.description.toLowerCase().includes(query)) ||
                (c.category && c.category.toLowerCase().includes(query)) ||
                (c.skills && c.skills.some(s => s.toLowerCase().includes(query)))
            );
        }

        setFilteredCareers(result);
    }, [allCareers, filters, search]);

    function setFilter(key, val) {
        setFilters(prev => ({ ...prev, [key]: val }));
    }

    return (
        <div style={{ padding: '0 0 5rem' }}>
            <div className="page-header">
                <div className="container">
                    <div className="breadcrumb">
                        <a href="/">Home</a> <span>/</span> Explore Careers
                    </div>
                    <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>
                        Explore <span className="gradient-text">Career Paths</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Browse {allCareers.length} career paths tailored for Indian graduates across all degree backgrounds
                    </p>
                </div>
            </div>

            <div className="container">
                <div className="career-browse-layout">
                    <div className="filter-panel" style={{ position: 'sticky', top: '90px' }}>
                        <div className="filter-title">Filter Careers</div>

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
                            {[['', 'All'], ['false', 'No extra degree'], ['true', 'Study required']].map(([val, label]) => (
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

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                                {loading ? 'Loading...' : `${filteredCareers.length} careers found`}
                            </div>
                        </div>

                        {loading ? (
                            <div className="loader-container" style={{ minHeight: '300px' }}>
                                <div className="loader" />
                            </div>
                        ) : filteredCareers.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
                                <h3 style={{ marginBottom: '0.5rem' }}>No careers found</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters</p>
                            </div>
                        ) : (
                            <div className="careers-grid">
                                {filteredCareers.map(career => {
                                    const alreadyInCompare = selectedCareers.some(c => c.id === career.id);
                                    return (
                                        <CareerCard
                                            key={career.id}
                                            career={career}
                                            alreadyInCompare={alreadyInCompare}
                                            onCompare={() => {
                                                if (alreadyInCompare) {
                                                    removeFromCompare(career.id);
                                                    toast.success(`Removed ${career.title} from compare`);
                                                } else {
                                                    if (selectedCareers.length >= 3) {
                                                        toast.error('You can compare up to 3 careers at a time.');
                                                    } else {
                                                        addToCompare(career);
                                                        toast.success(`Added ${career.title} to compare. Go to "PRO Features" in the sidebar to view!`);
                                                    }
                                                }
                                            }}
                                            onView={(slug) => navigate(`/careers/${slug}`)}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

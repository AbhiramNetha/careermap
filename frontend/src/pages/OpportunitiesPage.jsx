import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchOpportunities, trackOpportunityClick } from '../services/adminApi';
import { useAuth } from '../context/AuthContext';
import { useLoginGate } from '../hooks/useLoginGate';
import toast from 'react-hot-toast';

export default function OpportunitiesPage() {
    const location = useLocation();
    
    let typeParam = 'job';
    if (location.pathname === '/internships') {
        typeParam = 'internship';
    } else if (location.pathname === '/walkins') {
        typeParam = 'walkin';
    } else if (location.pathname === '/opportunities') {
        typeParam = 'all';
    }

    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [viewTab, setViewTab] = useState('available'); // 'available', 'saved'
    const [expFilter, setExpFilter] = useState('all'); // 'all', 'fresher', 'experienced'
    const { currentUser } = useAuth();
    const { requireLogin } = useLoginGate();

    const [savedIds, setSavedIds] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('w2f-saved-opps') || '[]');
        } catch {
            return [];
        }
    });

    useEffect(() => {
        loadOpportunities();
    }, [location.pathname]);

    async function loadOpportunities() {
        setLoading(true);
        try {
            const params = {};
            if (typeParam !== 'all') params.type = typeParam;
            params.active = 'true';
            const data = await fetchOpportunities(params);
            setOpportunities(data);
        } catch (err) {
            toast.error('Failed to load opportunities: ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    async function doApply(opp) {
        try {
            const oppId = opp._id || opp.id;
            const res = await trackOpportunityClick(oppId, currentUser?.email || 'anonymous');
            window.open(res.applyLink || opp.applyLink, '_blank', 'noopener,noreferrer');
        } catch (err) {
            window.open(opp.applyLink, '_blank', 'noopener,noreferrer');
        }
    }

    function handleApply(opp) {
        requireLogin(() => doApply(opp));
    }

    const toggleSave = (id) => {
        requireLogin(() => {
            let updated;
            if (savedIds.includes(id)) {
                updated = savedIds.filter(x => x !== id);
                toast.success('Opportunity removed from saved list');
            } else {
                updated = [...savedIds, id];
                toast.success('Opportunity saved successfully');
            }
            setSavedIds(updated);
            localStorage.setItem('w2f-saved-opps', JSON.stringify(updated));
        });
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    // Filter opportunities
    const filtered = opportunities.filter(opp => {
        const matchesSearch = opp.title.toLowerCase().includes(search.toLowerCase()) ||
            opp.company.toLowerCase().includes(search.toLowerCase()) ||
            opp.description?.toLowerCase().includes(search.toLowerCase()) ||
            opp.skills?.toLowerCase().includes(search.toLowerCase());

        const oppId = opp._id || opp.id;
        const matchesTab = viewTab === 'available' ? true : savedIds.includes(oppId);

        const oppExp = opp.experienceLevel || 'fresher';
        const matchesExp = (typeParam !== 'job' || expFilter === 'all') ? true : oppExp === expFilter;

        return matchesSearch && matchesTab && matchesExp;
    });

    const fresherJobs = filtered.filter(opp => (opp.experienceLevel || 'fresher') === 'fresher');
    const experiencedJobs = filtered.filter(opp => opp.experienceLevel === 'experienced');

    const renderCard = (opp) => {
        const oppId = opp._id || opp.id;
        const isSaved = savedIds.includes(oppId);

        return (
            <div 
                key={oppId}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--bg-navbar)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '1.25rem 1rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}
            >
                {/* Left text / details */}
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', width: '100%', minWidth: 0 }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, wordBreak: 'break-word', flex: '1 1 180px', minWidth: 0 }}>
                            {opp.title}
                        </h2>
                        {typeParam === 'job' && (
                            <span 
                                style={{ 
                                    fontSize: '0.72rem', 
                                    padding: '2px 8px', 
                                    borderRadius: '99px', 
                                    background: opp.experienceLevel === 'experienced' ? 'rgba(168, 85, 247, 0.12)' : 'rgba(16, 185, 129, 0.12)', 
                                    color: opp.experienceLevel === 'experienced' ? '#a855f7' : '#10b981', 
                                    border: `1px solid ${opp.experienceLevel === 'experienced' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0
                                }}
                            >
                                {opp.experienceLevel === 'experienced' ? '💼 Experienced' : '🎓 Freshers'}
                            </span>
                        )}
                    </div>
                    
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: '8px', wordBreak: 'break-word' }}>
                        {opp.company} , {opp.location} , {formatDate(opp.createdAt)}
                    </div>

                    {opp.skills && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px', maxWidth: '100%' }}>
                            {opp.skills.split(',').map(s => (
                                <span 
                                    key={s} 
                                    style={{ 
                                        fontSize: '0.72rem', 
                                        padding: '3px 10px', 
                                        borderRadius: '99px', 
                                        background: 'var(--border)', 
                                        color: 'var(--text-secondary)',
                                        fontWeight: 500,
                                        wordBreak: 'break-word',
                                        maxWidth: '100%'
                                    }}
                                >
                                    {s.trim()}
                                </span>
                            ))}
                        </div>
                    )}
                    
                    {opp.walkinDate && (
                        <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                            📅 Interview Date: {new Date(opp.walkinDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                    )}
                </div>

                {/* Right buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: '4px' }}>
                    <button
                        onClick={() => toggleSave(oppId)}
                        style={{
                            border: 'none',
                            outline: 'none',
                            background: 'rgba(148, 163, 184, 0.12)',
                            color: 'var(--text-primary)',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                            flex: '1 1 100px',
                            textAlign: 'center'
                        }}
                    >
                        {isSaved ? 'Saved' : 'Save'}
                    </button>
                    <button
                        onClick={() => handleApply(opp)}
                        style={{
                            border: 'none',
                            outline: 'none',
                            background: 'var(--text-primary)',
                            color: 'var(--bg)',
                            padding: '8px 18px',
                            borderRadius: '8px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'opacity 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            flex: '1 1 110px'
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        Apply →
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '1.5rem 0.75rem 4rem 0.75rem', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
                
                {/* Header Selector row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', width: '100%' }}>
                        <h1 style={{ fontSize: 'clamp(1.3rem, 5vw, 1.75rem)', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'capitalize', margin: 0 }}>
                            {typeParam === 'walkin' ? 'Walk-ins' : typeParam === 'internship' ? 'Internships' : 'Jobs'}
                        </h1>
                        
                        {/* Sub-tabs Available / Saved */}
                        <div style={{ display: 'flex', background: 'var(--border)', padding: '3px', borderRadius: '10px', maxWidth: '100%', flexWrap: 'wrap' }}>
                            <button 
                                onClick={() => setViewTab('available')}
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    padding: '5px 14px',
                                    borderRadius: '8px',
                                    fontSize: '0.82rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    background: viewTab === 'available' ? 'var(--bg-navbar)' : 'transparent',
                                    color: viewTab === 'available' ? 'var(--text-primary)' : 'var(--text-muted)',
                                    boxShadow: viewTab === 'available' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                                    transition: 'all 0.2s',
                                }}
                            >
                                Available
                            </button>
                            <button 
                                onClick={() => setViewTab('saved')}
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    padding: '5px 14px',
                                    borderRadius: '8px',
                                    fontSize: '0.82rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    background: viewTab === 'saved' ? 'var(--bg-navbar)' : 'transparent',
                                    color: viewTab === 'saved' ? 'var(--text-primary)' : 'var(--text-muted)',
                                    boxShadow: viewTab === 'saved' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                                    transition: 'all 0.2s',
                                }}
                            >
                                Saved
                            </button>
                        </div>

                        {/* Experience Filter Pills for Jobs */}
                        {typeParam === 'job' && (
                            <div style={{ display: 'flex', background: 'var(--border)', padding: '3px', borderRadius: '10px', maxWidth: '100%', flexWrap: 'wrap', gap: '2px' }}>
                                <button
                                    onClick={() => setExpFilter('all')}
                                    style={{
                                        border: 'none',
                                        outline: 'none',
                                        padding: '5px 10px',
                                        borderRadius: '8px',
                                        fontSize: '0.78rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        background: expFilter === 'all' ? 'var(--bg-navbar)' : 'transparent',
                                        color: expFilter === 'all' ? 'var(--text-primary)' : 'var(--text-muted)',
                                        boxShadow: expFilter === 'all' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    All Jobs
                                </button>
                                <button
                                    onClick={() => setExpFilter('fresher')}
                                    style={{
                                        border: 'none',
                                        outline: 'none',
                                        padding: '5px 10px',
                                        borderRadius: '8px',
                                        fontSize: '0.78rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        background: expFilter === 'fresher' ? 'var(--bg-navbar)' : 'transparent',
                                        color: expFilter === 'fresher' ? 'var(--text-primary)' : 'var(--text-muted)',
                                        boxShadow: expFilter === 'fresher' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    🎓 Freshers
                                </button>
                                <button
                                    onClick={() => setExpFilter('experienced')}
                                    style={{
                                        border: 'none',
                                        outline: 'none',
                                        padding: '5px 10px',
                                        borderRadius: '8px',
                                        fontSize: '0.78rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        background: expFilter === 'experienced' ? 'var(--bg-navbar)' : 'transparent',
                                        color: expFilter === 'experienced' ? 'var(--text-primary)' : 'var(--text-muted)',
                                        boxShadow: expFilter === 'experienced' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    💼 Experienced
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search Bar */}
                <div style={{ marginBottom: '1.5rem', width: '100%', boxSizing: 'border-box' }}>
                    <input 
                        type="text"
                        placeholder="Search opportunities..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            maxWidth: '100%',
                            boxSizing: 'border-box',
                            padding: '10px 14px',
                            background: 'var(--bg-navbar)',
                            border: '1px solid var(--border)',
                            borderRadius: '10px',
                            fontSize: '0.88rem',
                            color: 'var(--text-primary)',
                            outline: 'none',
                        }}
                    />
                </div>

                {/* Content List */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading opportunities...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'var(--bg-navbar)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        No {viewTab === 'saved' ? 'saved' : ''} opportunities found.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
                        {/* Section 1: Freshers Jobs */}
                        {(expFilter === 'all' || expFilter === 'fresher') && fresherJobs.length > 0 && (
                            <div>
                                <h2 style={{ fontSize: 'clamp(1.1rem, 4vw, 1.35rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', wordBreak: 'break-word', flexWrap: 'wrap' }}>
                                    🎓 Freshers Jobs (0 - 1 Year)
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                                    {fresherJobs.map(opp => renderCard(opp))}
                                </div>
                            </div>
                        )}

                        {/* Section 2: Experienced Jobs */}
                        {(expFilter === 'all' || expFilter === 'experienced') && experiencedJobs.length > 0 && (
                            <div>
                                <h2 style={{ fontSize: 'clamp(1.1rem, 4vw, 1.35rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', wordBreak: 'break-word', flexWrap: 'wrap' }}>
                                    💼 Experienced Jobs (1+ Years)
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                                    {experiencedJobs.map(opp => renderCard(opp))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

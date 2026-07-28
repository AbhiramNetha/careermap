import { useState, useEffect } from 'react';
import { fetchOpportunities, createOpportunity, updateOpportunity, deleteOpportunity } from '../../services/adminApi';
import { useAdminAuth } from '../../context/AdminAuthContext';

const BLANK = {
    title: '', company: '', location: '', type: 'job', experienceLevel: 'fresher',
    description: '', requirements: '', salary: '',
    applyLink: '', skills: '', walkinDate: '', isActive: true,
};

const TYPES = [
    { value: 'job', label: 'Job' },
    { value: 'internship', label: 'Internship' },
    { value: 'walkin', label: 'Walk-in' }
];

const EXPERIENCE_LEVELS = [
    { value: 'fresher', label: 'Fresher (0 - 1 Year)' },
    { value: 'experienced', label: 'Experienced (1+ Years)' }
];

export default function AdminOpportunities() {
    const { adminToken } = useAdminAuth();
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingOpportunity, setEditingOpportunity] = useState(null);
    const [form, setForm] = useState(BLANK);
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('');
    const [toast, setToast] = useState('');

    useEffect(() => {
        const bc = document.getElementById('admin-breadcrumb');
        if (bc) bc.textContent = 'Opportunities';
        loadOpportunities();
    }, []);

    async function loadOpportunities() {
        setLoading(true);
        try {
            const data = await fetchOpportunities();
            setOpportunities(data);
        } catch (err) {
            showToast('❌ ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    function showToast(msg) {
        setToast(msg);
        setTimeout(() => setToast(''), 3500);
    }

    function openAdd() {
        setEditingOpportunity(null);
        setForm(BLANK);
        setModalOpen(true);
    }

    function openEdit(opp) {
        setEditingOpportunity(opp);
        setForm({
            title: opp.title,
            company: opp.company,
            location: opp.location,
            type: opp.type,
            experienceLevel: opp.experienceLevel || 'fresher',
            description: opp.description,
            requirements: opp.requirements || '',
            salary: opp.salary || '',
            applyLink: opp.applyLink,
            skills: opp.skills || '',
            walkinDate: opp.walkinDate ? opp.walkinDate.split('T')[0] : '',
            isActive: opp.isActive !== false,
        });
        setModalOpen(true);
    }

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = { 
                ...form, 
                walkinDate: form.type === 'walkin' && form.walkinDate ? form.walkinDate : null 
            };
            if (editingOpportunity) {
                const oppId = editingOpportunity._id || editingOpportunity.id;
                await updateOpportunity(oppId, payload, adminToken);
                showToast('✅ Opportunity updated successfully!');
            } else {
                await createOpportunity(payload, adminToken);
                showToast('✅ Opportunity created successfully!');
            }
            setModalOpen(false);
            loadOpportunities();
        } catch (err) {
            showToast('❌ ' + err.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id) {
        try {
            await deleteOpportunity(id, adminToken);
            showToast('✅ Opportunity deleted!');
            setDeleteId(null);
            loadOpportunities();
        } catch (err) {
            showToast('❌ ' + err.message);
        }
    }

    const filtered = opportunities.filter(opp => {
        const matchSearch = opp.title.toLowerCase().includes(search.toLowerCase()) ||
            opp.company.toLowerCase().includes(search.toLowerCase()) ||
            opp.description?.toLowerCase().includes(search.toLowerCase());
        const matchType = filterType ? opp.type === filterType : true;
        return matchSearch && matchType;
    });

    return (
        <div className="admin-page">
            {toast && <div className="admin-toast">{toast}</div>}

            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Opportunity Management</h2>
                    <p className="admin-page-desc">{opportunities.length} total listings (Jobs, Internships, Walk-ins)</p>
                </div>
                <button className="admin-btn admin-btn-primary" onClick={openAdd} id="add-opp-btn">
                    Add Opportunity
                </button>
            </div>

            <div className="admin-filters">
                <div className="admin-search-box">
                    <span>Search:</span>
                    <input
                        type="text"
                        placeholder="Search by title, company, description…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="admin-select"
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                >
                    <option value="">All Types</option>
                    {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
            </div>

            {loading ? (
                <div className="admin-loading">
                    <div className="admin-spinner-lg" />
                    <p>Loading opportunities…</p>
                </div>
            ) : (
                <div className="admin-courses-grid">
                    {filtered.length === 0 ? (
                        <div className="admin-empty-state-full">
                            <h3>No opportunities found</h3>
                            <p>Post your first job or internship to get started</p>
                            <button className="admin-btn admin-btn-primary" onClick={openAdd}>Add Opportunity</button>
                        </div>
                    ) : (
                        filtered.map(opp => (
                            <div key={opp._id || opp.id} className={`admin-course-card ${!opp.isActive ? 'inactive-card' : ''}`}>
                                <div className="admin-course-card-header">
                                    <div className="admin-course-badges">
                                        <span className="admin-tag admin-tag-cat" style={{ textTransform: 'capitalize' }}>{opp.type}</span>
                                        {opp.salary && <span className="admin-tag admin-tag-featured">{opp.salary}</span>}
                                        <span className={`admin-status ${opp.isActive ? 'active' : 'inactive'}`}>
                                            {opp.isActive ? '● Active' : '● Inactive'}
                                        </span>
                                    </div>
                                    <div className="admin-course-actions">
                                        <button className="edit-btn" onClick={() => openEdit(opp)} title="Edit">Edit</button>
                                        <button className="delete-btn" onClick={() => setDeleteId(opp._id || opp.id)} title="Delete">Delete</button>
                                    </div>
                                </div>
                                <h3 className="admin-course-title" style={{ margin: '0.5rem 0 0.25rem 0' }}>{opp.title}</h3>
                                <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, marginBottom: '0.5rem' }}>{opp.company}</div>
                                <p className="admin-course-desc">{opp.description?.slice(0, 100)}…</p>
                                <div className="admin-course-meta" style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                                    <span className="admin-course-platform">{opp.location}</span>
                                    <span className="admin-course-clicks">{opp.clickCount || 0} clicks</span>
                                </div>
                                {opp.walkinDate && (
                                    <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '0.5rem', fontWeight: 600 }}>
                                        📅 Interview Date: {new Date(opp.walkinDate).toLocaleDateString('en-IN')}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {modalOpen && (
                <div className="admin-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
                    <div className="admin-modal">
                        <div className="admin-modal-header">
                            <h3>{editingOpportunity ? 'Edit Opportunity' : 'Add Opportunity'}</h3>
                            <button className="admin-modal-close" onClick={() => setModalOpen(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSave} className="admin-modal-form">
                            <div className="admin-form-row2">
                                <div className="admin-form-group">
                                    <label>Role / Title *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Associate Software Engineer"
                                        value={form.title}
                                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label>Company *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Google India"
                                        value={form.company}
                                        onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="admin-form-row2">
                                <div className="admin-form-group">
                                    <label>Location *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Hyderabad / Remote"
                                        value={form.location}
                                        onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label>Opportunity Type</label>
                                    <select
                                        value={form.type}
                                        onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                                    >
                                        {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label>Target Candidate Experience Level *</label>
                                <select
                                    value={form.experienceLevel}
                                    onChange={e => setForm(f => ({ ...f, experienceLevel: e.target.value }))}
                                >
                                    {EXPERIENCE_LEVELS.map(exp => <option key={exp.value} value={exp.value}>{exp.label}</option>)}
                                </select>
                            </div>

                            <div className="admin-form-group">
                                <label>Description *</label>
                                <textarea
                                    placeholder="Roles and responsibilities…"
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Requirements</label>
                                <textarea
                                    placeholder="Skills, eligibility criteria, education requirements…"
                                    value={form.requirements}
                                    onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))}
                                    rows={2}
                                />
                            </div>

                            <div className="admin-form-row2">
                                <div className="admin-form-group">
                                    <label>Salary / Stipend</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. ₹6 - ₹8 LPA, or ₹15,000/mo"
                                        value={form.salary}
                                        onChange={e => setForm(f => ({ ...f, salary: e.target.value }))}
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label>Apply Link / Email *</label>
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        value={form.applyLink}
                                        onChange={e => setForm(f => ({ ...f, applyLink: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="admin-form-row2">
                                <div className="admin-form-group">
                                    <label>Skills / Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. React, Node.js, Python"
                                        value={form.skills}
                                        onChange={e => setForm(f => ({ ...f, skills: e.target.value }))}
                                    />
                                </div>
                                {form.type === 'walkin' && (
                                    <div className="admin-form-group">
                                        <label>Interview Date *</label>
                                        <input
                                            type="date"
                                            value={form.walkinDate}
                                            onChange={e => setForm(f => ({ ...f, walkinDate: e.target.value }))}
                                            required={form.type === 'walkin'}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="admin-form-checkbox">
                                <input
                                    type="checkbox"
                                    id="opp-active-chk"
                                    checked={form.isActive}
                                    onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                                />
                                <label htmlFor="opp-active-chk">List this opportunity immediately (Active)</label>
                            </div>

                            <div className="admin-modal-footer">
                                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                                    {saving ? 'Saving…' : 'Save Opportunity'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteId && (
                <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
                    <div className="admin-modal admin-confirm-modal">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to permanently delete this opportunity listing?</p>
                        <div className="admin-modal-footer">
                            <button className="admin-btn admin-btn-secondary" onClick={() => setDeleteId(null)}>
                                Cancel
                            </button>
                            <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(deleteId)}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

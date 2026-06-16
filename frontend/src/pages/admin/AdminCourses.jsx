import { useState, useEffect } from 'react';
import { fetchPublicCourses, createCourse, updateCourse, deleteCourse } from '../../services/adminApi';
import { useAdminAuth } from '../../context/AdminAuthContext';

const BLANK = {
    title: '', description: '', price: '', currency: '₹',
    affiliateLink: '', image: '', category: 'SDE',
    platform: 'Udemy', rating: 4.5, totalStudents: 0,
    isFeatured: false, isActive: true,
};

const CATEGORIES = ['SDE', 'Web Development', 'Data Science', 'Cloud', 'DevOps', 'AI/ML', 'UI/UX', 'Other'];
const PLATFORMS = ['Udemy', 'Coursera', 'YouTube', 'edX', 'LinkedIn Learning', 'NPTEL', 'Other'];

export default function AdminCourses() {
    const { adminToken } = useAdminAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [form, setForm] = useState(BLANK);
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('');
    const [toast, setToast] = useState('');

    useEffect(() => {
        const bc = document.getElementById('admin-breadcrumb');
        if (bc) bc.textContent = 'Courses';
        loadCourses();
    }, []);

    async function loadCourses() {
        setLoading(true);
        try {
            const data = await fetchPublicCourses();
            setCourses(data);
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
        setEditingCourse(null);
        setForm(BLANK);
        setModalOpen(true);
    }

    function openEdit(course) {
        setEditingCourse(course);
        setForm({
            title: course.title,
            description: course.description,
            price: course.price,
            currency: course.currency || '₹',
            affiliateLink: course.affiliateLink,
            image: course.image || '',
            category: course.category,
            platform: course.platform || 'Udemy',
            rating: course.rating || 4.5,
            totalStudents: course.totalStudents || 0,
            isFeatured: course.isFeatured || false,
            isActive: course.isActive !== false,
        });
        setModalOpen(true);
    }

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = { ...form, price: parseFloat(form.price) };
            if (editingCourse) {
                await updateCourse(editingCourse._id, payload, adminToken);
                showToast('✅ Course updated successfully!');
            } else {
                await createCourse(payload, adminToken);
                showToast('✅ Course created successfully!');
            }
            setModalOpen(false);
            loadCourses();
        } catch (err) {
            showToast('❌ ' + err.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id) {
        try {
            await deleteCourse(id, adminToken);
            showToast('✅ Course deleted!');
            setDeleteId(null);
            loadCourses();
        } catch (err) {
            showToast('❌ ' + err.message);
        }
    }

    const filtered = courses.filter(c => {
        const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.description?.toLowerCase().includes(search.toLowerCase());
        const matchCat = filterCat ? c.category === filterCat : true;
        return matchSearch && matchCat;
    });

    return (
        <div className="admin-page">
            {/* Toast notification */}
            {toast && <div className="admin-toast">{toast}</div>}

            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Course Management</h2>
                    <p className="admin-page-desc">{courses.length} course{courses.length !== 1 ? 's' : ''} total</p>
                </div>
                <button className="admin-btn admin-btn-primary" onClick={openAdd} id="add-course-btn">
                    + Add Course
                </button>
            </div>

            {/* Filters */}
            <div className="admin-filters">
                <div className="admin-search-box">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Search courses…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="admin-select"
                    value={filterCat}
                    onChange={e => setFilterCat(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {loading ? (
                <div className="admin-loading">
                    <div className="admin-spinner-lg" />
                    <p>Loading courses…</p>
                </div>
            ) : (
                <div className="admin-courses-grid">
                    {filtered.length === 0 ? (
                        <div className="admin-empty-state-full">
                            <span>📚</span>
                            <h3>No courses found</h3>
                            <p>Add your first course to get started</p>
                            <button className="admin-btn admin-btn-primary" onClick={openAdd}>+ Add Course</button>
                        </div>
                    ) : (
                        filtered.map(course => (
                            <div key={course._id} className={`admin-course-card ${!course.isActive ? 'inactive-card' : ''}`}>
                                <div className="admin-course-card-header">
                                    <div className="admin-course-badges">
                                        <span className="admin-tag admin-tag-cat">{course.category}</span>
                                        {course.isFeatured && <span className="admin-tag admin-tag-featured">⭐ Featured</span>}
                                        <span className={`admin-status ${course.isActive ? 'active' : 'inactive'}`}>
                                            {course.isActive ? '● Active' : '● Inactive'}
                                        </span>
                                    </div>
                                    <div className="admin-course-actions">
                                        <button className="admin-icon-btn edit-btn" onClick={() => openEdit(course)} title="Edit">✏️</button>
                                        <button className="admin-icon-btn delete-btn" onClick={() => setDeleteId(course._id)} title="Delete">🗑️</button>
                                    </div>
                                </div>
                                <h3 className="admin-course-title">{course.title}</h3>
                                <p className="admin-course-desc">{course.description?.slice(0, 100)}…</p>
                                <div className="admin-course-meta">
                                    <span className="admin-course-price">₹{course.price}</span>
                                    <span className="admin-course-platform">📦 {course.platform}</span>
                                    <span className="admin-course-clicks">🖱️ {course.clickCount || 0} clicks</span>
                                </div>
                                {course.affiliateLink && (
                                    <a
                                        href={course.affiliateLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="admin-course-link"
                                    >
                                        🔗 View Link
                                    </a>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Add/Edit Modal */}
            {modalOpen && (
                <div className="admin-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
                    <div className="admin-modal">
                        <div className="admin-modal-header">
                            <h3>{editingCourse ? '✏️ Edit Course' : '+ Add New Course'}</h3>
                            <button className="admin-modal-close" onClick={() => setModalOpen(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSave} className="admin-modal-form">
                            <div className="admin-form-row2">
                                <div className="admin-form-group">
                                    <label>Course Title *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. SDE Preparation Masterclass"
                                        value={form.title}
                                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label>Platform</label>
                                    <select
                                        value={form.platform}
                                        onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
                                    >
                                        {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label>Description *</label>
                                <textarea
                                    placeholder="Describe what students will learn…"
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="admin-form-row3">
                                <div className="admin-form-group">
                                    <label>Price (₹) *</label>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="499"
                                        value={form.price}
                                        onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label>Category *</label>
                                    <select
                                        value={form.category}
                                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="admin-form-group">
                                    <label>Rating</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value={form.rating}
                                        onChange={e => setForm(f => ({ ...f, rating: parseFloat(e.target.value) }))}
                                    />
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label>Affiliate Link *</label>
                                <input
                                    type="url"
                                    placeholder="https://udemy.com/course/..."
                                    value={form.affiliateLink}
                                    onChange={e => setForm(f => ({ ...f, affiliateLink: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Thumbnail Image URL</label>
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    value={form.image}
                                    onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                                />
                            </div>

                            <div className="admin-form-checks">
                                <label className="admin-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={form.isFeatured}
                                        onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                                    />
                                    ⭐ Mark as Featured
                                </label>
                                <label className="admin-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={form.isActive}
                                        onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                                    />
                                    ✅ Active (visible on site)
                                </label>
                            </div>

                            <div className="admin-modal-footer">
                                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                                    {saving ? <span className="admin-spinner" /> : (editingCourse ? '💾 Save Changes' : '➕ Create Course')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteId && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal admin-modal-sm">
                        <div className="admin-modal-header">
                            <h3>🗑️ Delete Course</h3>
                            <button className="admin-modal-close" onClick={() => setDeleteId(null)}>✕</button>
                        </div>
                        <div className="admin-modal-body">
                            <p>Are you sure you want to delete this course? This action cannot be undone.</p>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn admin-btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
                            <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(deleteId)}>🗑️ Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

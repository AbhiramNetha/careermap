import { useEffect, useState } from 'react';
import { fetchPublicCourses, trackCourseClick } from '../services/adminApi';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'SDE', 'Web Development', 'Data Science', 'Cloud', 'DevOps', 'AI/ML', 'UI/UX', 'Other'];

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const { currentUser } = useAuth();

    useEffect(() => {
        fetchPublicCourses({ active: 'true' })
            .then(setCourses)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    async function handleGoToCourse(course) {
        try {
            const result = await trackCourseClick(course._id, currentUser?.email || 'anonymous');
            window.open(result.affiliateLink || course.affiliateLink, '_blank', 'noopener');
        } catch {
            window.open(course.affiliateLink, '_blank', 'noopener');
        }
    }

    const filtered = courses.filter(c => {
        const matchCat = filter === 'All' || c.category === filter;
        const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.description?.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const featured = filtered.filter(c => c.isFeatured);
    const regular = filtered.filter(c => !c.isFeatured);

    return (
        <div className="courses-page">
            {/* Hero */}
            <section className="courses-hero">
                <div className="courses-hero-inner">
                    <span className="courses-hero-badge">📚 Course Discovery</span>
                    <h1 className="courses-hero-title">
                        Find Your Perfect <span className="gradient-text">Course</span>
                    </h1>
                    <p className="courses-hero-sub">
                        Hand-picked courses from top platforms to supercharge your career journey
                    </p>

                    {/* Search */}
                    <div className="courses-search-bar">
                        <span>🔍</span>
                        <input
                            type="text"
                            placeholder="Search courses, topics, platforms…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            <div className="courses-main">
                {/* Category filters */}
                <div className="courses-category-bar">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className={`courses-cat-btn ${filter === cat ? 'active' : ''}`}
                            onClick={() => setFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="courses-loading">
                        <div className="admin-spinner-lg" />
                        <p>Loading courses…</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="courses-empty">
                        <span>😕</span>
                        <h3>No courses found</h3>
                        <p>Try a different category or search term</p>
                    </div>
                ) : (
                    <>
                        {/* Featured */}
                        {featured.length > 0 && filter === 'All' && !search && (
                            <section className="courses-section">
                                <h2 className="courses-section-title">⭐ Featured Courses</h2>
                                <div className="courses-grid courses-grid-featured">
                                    {featured.map(c => (
                                        <CourseCard key={c._id} course={c} onGo={handleGoToCourse} featured />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* All / filtered */}
                        <section className="courses-section">
                            {filter === 'All' && !search && featured.length > 0 && (
                                <h2 className="courses-section-title">All Courses</h2>
                            )}
                            <p className="courses-count">{filtered.length} course{filtered.length !== 1 ? 's' : ''} found</p>
                            <div className="courses-grid">
                                {(filter === 'All' && !search ? regular : filtered).map(c => (
                                    <CourseCard key={c._id} course={c} onGo={handleGoToCourse} />
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}

function CourseCard({ course, onGo, featured = false }) {
    const stars = '★'.repeat(Math.round(course.rating || 4)) + '☆'.repeat(5 - Math.round(course.rating || 4));

    return (
        <div className={`course-card ${featured ? 'course-card-featured' : ''}`}>
            {featured && <div className="course-featured-ribbon">⭐ Featured</div>}

            {course.image ? (
                <div className="course-card-image">
                    <img src={course.image} alt={course.title} loading="lazy" />
                </div>
            ) : (
                <div className={`course-card-thumbnail course-thumb-${(course.category || 'Other').replace(/[\s/]/g, '-').toLowerCase()}`}>
                    <span>{getCategoryEmoji(course.category)}</span>
                </div>
            )}

            <div className="course-card-body">
                <div className="course-card-tags">
                    <span className="course-tag-cat">{course.category}</span>
                    <span className="course-tag-platform">📦 {course.platform}</span>
                </div>

                <h3 className="course-card-title">{course.title}</h3>
                <p className="course-card-desc">{course.description?.slice(0, 110)}…</p>

                <div className="course-card-rating">
                    <span className="course-stars">{stars}</span>
                    <span className="course-rating-num">{(course.rating || 4.5).toFixed(1)}</span>
                    {course.totalStudents > 0 && (
                        <span className="course-students">({course.totalStudents.toLocaleString()} students)</span>
                    )}
                </div>

                <div className="course-card-footer">
                    <div className="course-price">
                        <span className="course-currency">₹</span>
                        <span className="course-amount">{course.price}</span>
                    </div>
                    <button
                        className="course-go-btn"
                        onClick={() => onGo(course)}
                        id={`course-go-${course._id}`}
                    >
                        Go to Course →
                    </button>
                </div>
            </div>
        </div>
    );
}

function getCategoryEmoji(cat) {
    const map = {
        'SDE': '💻', 'Web Development': '🌐', 'Data Science': '📊',
        'Cloud': '☁️', 'DevOps': '⚙️', 'AI/ML': '🤖',
        'UI/UX': '🎨', 'Other': '📚'
    };
    return map[cat] || '📚';
}

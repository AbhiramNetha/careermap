import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAnalyticsSummary, fetchPublicCourses } from '../../services/adminApi';
import { useAdminAuth } from '../../context/AdminAuthContext';
import AdminTrafficChart from '../../components/admin/AdminTrafficChart';

export default function AdminDashboard() {
    const { adminToken } = useAdminAuth();
    const [analytics, setAnalytics] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Update breadcrumb
        const bc = document.getElementById('admin-breadcrumb');
        if (bc) bc.textContent = 'Dashboard';

        async function load() {
            try {
                const [analyticsData, coursesData] = await Promise.all([
                    fetchAnalyticsSummary(adminToken),
                    fetchPublicCourses(),
                ]);
                setAnalytics(analyticsData);
                setCourses(coursesData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [adminToken]);

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="admin-spinner-lg" />
                <p>Loading dashboard…</p>
            </div>
        );
    }

    const stats = analytics?.summary || {};
    const topCourses = analytics?.topCourses || [];

    const statCards = [
        {
            icon: '👥',
            label: 'Total Visitors',
            value: (stats.totalVisitors || 0).toLocaleString(),
            color: 'indigo',
            trend: '+12%',
        },
        {
            icon: '📚',
            label: 'Active Courses',
            value: (analytics?.totalCourses || courses.length || 0).toLocaleString(),
            color: 'violet',
            trend: null,
        },
        {
            icon: '🖱️',
            label: 'Course Clicks',
            value: (stats.totalCourseClicks || 0).toLocaleString(),
            color: 'cyan',
            trend: '+8%',
        },
        {
            icon: '📄',
            label: 'Page Views',
            value: (stats.totalPageViews || 0).toLocaleString(),
            color: 'emerald',
            trend: '+5%',
        },
    ];

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Dashboard Overview</h2>
                    <p className="admin-page-desc">Welcome back, Administrator! Here's what's happening today.</p>
                </div>
                <Link to="/admin/courses" className="admin-btn admin-btn-primary">
                    + Add New Course
                </Link>
            </div>

            {/* Stat cards */}
            <div className="admin-stats-grid">
                {statCards.map((card, i) => (
                    <div key={i} className={`admin-stat-card admin-stat-${card.color}`}>
                        <div className="admin-stat-icon">{card.icon}</div>
                        <div className="admin-stat-body">
                            <div className="admin-stat-value">{card.value}</div>
                            <div className="admin-stat-label">{card.label}</div>
                        </div>
                        {card.trend && (
                            <div className="admin-stat-trend positive">{card.trend} ↑</div>
                        )}
                    </div>
                ))}
            </div>

            {/* Charts + Top Courses */}
            <div className="admin-dashboard-grid">
                {/* Traffic Chart */}
                <div className="admin-card admin-chart-card">
                    <div className="admin-card-header">
                        <h3>📈 Daily Traffic (Last 30 Days)</h3>
                    </div>
                    <AdminTrafficChart dailyData={analytics?.dailyData || []} />
                </div>

                {/* Top clicked courses */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3>🏆 Top Clicked Courses</h3>
                        <Link to="/admin/analytics" className="admin-card-link">View All →</Link>
                    </div>
                    <div className="admin-top-courses">
                        {topCourses.length === 0 ? (
                            <div className="admin-empty-state">
                                <span>🖱️</span>
                                <p>No clicks tracked yet</p>
                            </div>
                        ) : (
                            topCourses.map((c, i) => (
                                <div key={i} className="admin-top-course-row">
                                    <span className="admin-top-rank">{i + 1}</span>
                                    <span className="admin-top-title">{c.title}</span>
                                    <span className="admin-top-clicks">{c.clicks} clicks</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Recent courses */}
            <div className="admin-card admin-recent-courses">
                <div className="admin-card-header">
                    <h3>📚 Recent Courses</h3>
                    <Link to="/admin/courses" className="admin-card-link">Manage All →</Link>
                </div>
                <div className="admin-courses-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Platform</th>
                                <th>Clicks</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.slice(0, 5).map(course => (
                                <tr key={course._id}>
                                    <td className="admin-table-title">{course.title}</td>
                                    <td><span className="admin-tag">{course.category}</span></td>
                                    <td className="admin-table-price">₹{course.price}</td>
                                    <td>{course.platform}</td>
                                    <td>{course.clickCount || 0}</td>
                                    <td>
                                        <span className={`admin-status ${course.isActive ? 'active' : 'inactive'}`}>
                                            {course.isActive ? '● Active' : '● Inactive'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {courses.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="admin-table-empty">No courses yet. <Link to="/admin/courses">Add your first course →</Link></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

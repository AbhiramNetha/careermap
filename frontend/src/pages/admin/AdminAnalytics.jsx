import { useEffect, useState } from 'react';
import { fetchAnalyticsSummary } from '../../services/adminApi';
import { useAdminAuth } from '../../context/AdminAuthContext';
import AdminTrafficChart from '../../components/admin/AdminTrafficChart';

export default function AdminAnalytics() {
    const { adminToken } = useAdminAuth();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState(30);

    useEffect(() => {
        const bc = document.getElementById('admin-breadcrumb');
        if (bc) bc.textContent = 'Analytics';
        load();
    }, [adminToken]);

    async function load() {
        setLoading(true);
        try {
            const data = await fetchAnalyticsSummary(adminToken);
            setAnalytics(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="admin-spinner-lg" />
                <p>Loading analytics…</p>
            </div>
        );
    }

    const { summary = {}, dailyData = [], topCourses = [] } = analytics || {};

    const metricCards = [
        { icon: '👥', label: 'Total Visitors', value: (summary.totalVisitors || 0).toLocaleString(), color: 'indigo' },
        { icon: '📄', label: 'Page Views', value: (summary.totalPageViews || 0).toLocaleString(), color: 'violet' },
        { icon: '🖱️', label: 'Course Clicks', value: (summary.totalCourseClicks || 0).toLocaleString(), color: 'cyan' },
        {
            icon: '📊',
            label: 'Avg. CTR',
            value: summary.totalVisitors
                ? ((summary.totalCourseClicks / summary.totalVisitors) * 100).toFixed(1) + '%'
                : '0%',
            color: 'emerald'
        },
    ];

    // Build last N days from dailyData
    const visitorData = dailyData.slice(-range);

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Analytics</h2>
                    <p className="admin-page-desc">Tracking visitor engagement and course performance</p>
                </div>
                <select
                    className="admin-select"
                    value={range}
                    onChange={e => setRange(Number(e.target.value))}
                >
                    <option value={7}>Last 7 days</option>
                    <option value={14}>Last 14 days</option>
                    <option value={30}>Last 30 days</option>
                </select>
            </div>

            {/* Metric cards */}
            <div className="admin-stats-grid">
                {metricCards.map((card, i) => (
                    <div key={i} className={`admin-stat-card admin-stat-${card.color}`}>
                        <div className="admin-stat-icon">{card.icon}</div>
                        <div className="admin-stat-body">
                            <div className="admin-stat-value">{card.value}</div>
                            <div className="admin-stat-label">{card.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Traffic chart */}
            <div className="admin-card admin-chart-card-full">
                <div className="admin-card-header">
                    <h3>📈 Visitor Traffic — Last {range} Days</h3>
                </div>
                <AdminTrafficChart dailyData={visitorData} />
            </div>

            {/* Top Courses table */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <h3>🏆 Top Performing Courses</h3>
                </div>
                <div className="admin-courses-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Course Title</th>
                                <th>Total Clicks</th>
                                <th>Share</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topCourses.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="admin-table-empty">No click data yet</td>
                                </tr>
                            ) : (
                                topCourses.map((c, i) => {
                                    const totalClicks = topCourses.reduce((a, b) => a + b.clicks, 0);
                                    const pct = totalClicks ? ((c.clicks / totalClicks) * 100).toFixed(1) : 0;
                                    return (
                                        <tr key={i}>
                                            <td>
                                                <span className="admin-rank-badge">{i + 1}</span>
                                            </td>
                                            <td className="admin-table-title">{c.title}</td>
                                            <td>
                                                <strong>{c.clicks}</strong>
                                            </td>
                                            <td>
                                                <div className="admin-progress-bar-wrapper">
                                                    <div className="admin-progress-bar">
                                                        <div
                                                            className="admin-progress-fill"
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                    <span>{pct}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Daily breakdown */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <h3>📅 Daily Breakdown</h3>
                </div>
                <div className="admin-courses-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Visitors</th>
                                <th>Page Views</th>
                                <th>Course Clicks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...visitorData].reverse().slice(0, 14).map((row, i) => (
                                <tr key={i}>
                                    <td>{new Date(row.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</td>
                                    <td>{row.visitors}</td>
                                    <td>{row.pageViews}</td>
                                    <td>{row.courseClicks}</td>
                                </tr>
                            ))}
                            {visitorData.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="admin-table-empty">No daily data yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

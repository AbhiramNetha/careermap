const { DailyStats, CourseClick } = require('../models/Analytics');
const Course = require('../models/Course');

// Track a page visit (called from frontend on each route load)
async function trackVisit(req, res) {
    try {
        const today = new Date().toISOString().split('T')[0];
        await DailyStats.findOneAndUpdate(
            { date: today },
            { $inc: { visitors: 1, pageViews: 1 } },
            { upsert: true, new: true }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Admin: Get full analytics summary
async function getAnalyticsSummary(req, res) {
    try {
        // Last 30 days of daily stats
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const startDate = thirtyDaysAgo.toISOString().split('T')[0];

        const dailyData = await DailyStats.find({ date: { $gte: startDate } }).sort({ date: 1 });

        // Totals from all-time daily stats
        const allStats = await DailyStats.aggregate([
            {
                $group: {
                    _id: null,
                    totalVisitors: { $sum: '$visitors' },
                    totalPageViews: { $sum: '$pageViews' },
                    totalCourseClicks: { $sum: '$courseClicks' },
                }
            }
        ]);

        // Top clicked courses
        const topCourses = await CourseClick.aggregate([
            { $group: { _id: '$courseId', title: { $first: '$courseTitle' }, clicks: { $sum: 1 } } },
            { $sort: { clicks: -1 } },
            { $limit: 5 }
        ]);

        // Total courses
        const totalCourses = await Course.countDocuments({ isActive: true });

        res.json({
            summary: allStats[0] || { totalVisitors: 0, totalPageViews: 0, totalCourseClicks: 0 },
            dailyData,
            topCourses,
            totalCourses,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Admin: get traffic for a date range
async function getTrafficData(req, res) {
    try {
        const { days = 30 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));
        const startStr = startDate.toISOString().split('T')[0];

        const data = await DailyStats.find({ date: { $gte: startStr } }).sort({ date: 1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { trackVisit, getAnalyticsSummary, getTrafficData };

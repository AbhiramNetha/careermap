const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { DailyStats, CourseClick } = require('../models/Analytics');
const Course = require('../models/Course');

// Track a page visit (called from frontend on each route load)
async function trackVisit(req, res) {
    try {
        const today = new Date().toISOString().split('T')[0];
        const [dailyStat] = await DailyStats.findOrCreate({
            where: { date: today },
            defaults: { date: today, visitors: 0, pageViews: 0, courseClicks: 0, newUsers: 0 },
        });
        await dailyStat.increment({ visitors: 1, pageViews: 1 });
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

        const dailyData = await DailyStats.findAll({
            where: { date: { [Op.gte]: startDate } },
            order: [['date', 'ASC']],
        });

        // Totals from all-time daily stats
        const allStats = await DailyStats.findOne({
            attributes: [
                [sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('visitors')), 0), 'totalVisitors'],
                [sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('pageViews')), 0), 'totalPageViews'],
                [sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('courseClicks')), 0), 'totalCourseClicks'],
            ],
            raw: true,
        });

        // Top clicked courses
        const topCourses = await CourseClick.findAll({
            attributes: [
                'courseId',
                [sequelize.fn('MIN', sequelize.col('courseTitle')), 'title'],
                [sequelize.fn('COUNT', '*'), 'clicks'],
            ],
            group: ['courseId'],
            order: [[sequelize.fn('COUNT', '*'), 'DESC']],
            limit: 5,
            raw: true,
        });

        // Total courses
        const totalCourses = await Course.count({ where: { isActive: true } });

        res.json({
            summary: allStats || { totalVisitors: 0, totalPageViews: 0, totalCourseClicks: 0 },
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

        const data = await DailyStats.findAll({
            where: { date: { [Op.gte]: startStr } },
            order: [['date', 'ASC']],
        });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { trackVisit, getAnalyticsSummary, getTrafficData };

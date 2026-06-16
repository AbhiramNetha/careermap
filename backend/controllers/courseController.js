const { Op } = require('sequelize');
const Course = require('../models/Course');

async function getAllCourses(req, res) {
    try {
        const { category, featured, active, search } = req.query;
        const where = {};
        if (category) where.category = category;
        if (featured === 'true') where.isFeatured = true;
        if (active !== undefined) where.isActive = active === 'true';
        if (search) where.title = { [Op.iLike]: `%${search}%` };

        const courses = await Course.findAll({ where, order: [['createdAt', 'DESC']] });
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getCourseById(req, res) {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function createCourse(req, res) {
    try {
        const course = await Course.create(req.body);
        res.status(201).json({ success: true, course });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function updateCourse(req, res) {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) return res.status(404).json({ error: 'Course not found' });
        await course.update(req.body);
        res.json({ success: true, course });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function deleteCourse(req, res) {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) return res.status(404).json({ error: 'Course not found' });
        await course.destroy();
        res.json({ success: true, message: 'Course deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function trackCourseClick(req, res) {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        await course.increment('clickCount', { by: 1 });
        await course.reload();

        // Update daily stats
        const { DailyStats, CourseClick } = require('../models/Analytics');
        const today = new Date().toISOString().split('T')[0];

        const [dailyStat] = await DailyStats.findOrCreate({
            where: { date: today },
            defaults: { date: today, visitors: 0, pageViews: 0, courseClicks: 0, newUsers: 0 },
        });
        await dailyStat.increment('courseClicks', { by: 1 });

        await CourseClick.create({
            courseId: course.id,
            courseTitle: course.title,
            userEmail: req.body.userEmail || 'anonymous',
        });

        res.json({ success: true, affiliateLink: course.affiliateLink });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse, trackCourseClick };

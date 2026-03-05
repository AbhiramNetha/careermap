const Course = require('../models/Course');

async function getAllCourses(req, res) {
    try {
        const { category, featured, active, search } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (featured === 'true') filter.isFeatured = true;
        if (active !== undefined) filter.isActive = active === 'true';
        if (search) filter.title = { $regex: search, $options: 'i' };

        const courses = await Course.find(filter).sort({ createdAt: -1 });
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getCourseById(req, res) {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function createCourse(req, res) {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json({ success: true, course });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function updateCourse(req, res) {
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json({ success: true, course });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function deleteCourse(req, res) {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json({ success: true, message: 'Course deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function trackCourseClick(req, res) {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        course.clickCount += 1;
        await course.save();

        // Update daily stats
        const { DailyStats, CourseClick } = require('../models/Analytics');
        const today = new Date().toISOString().split('T')[0];
        await DailyStats.findOneAndUpdate(
            { date: today },
            { $inc: { courseClicks: 1 } },
            { upsert: true, new: true }
        );
        await CourseClick.create({
            courseId: course._id,
            courseTitle: course.title,
            userEmail: req.body.userEmail || 'anonymous'
        });

        res.json({ success: true, affiliateLink: course.affiliateLink });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse, trackCourseClick };

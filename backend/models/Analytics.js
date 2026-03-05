const mongoose = require('mongoose');

const DailyStatsSchema = new mongoose.Schema({
    date: { type: String, required: true, unique: true }, // YYYY-MM-DD
    visitors: { type: Number, default: 0 },
    pageViews: { type: Number, default: 0 },
    courseClicks: { type: Number, default: 0 },
    newUsers: { type: Number, default: 0 },
}, { timestamps: true });

const CourseClickSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    courseTitle: { type: String },
    clickedAt: { type: Date, default: Date.now },
    userEmail: { type: String, default: 'anonymous' },
    referrer: { type: String, default: '' },
});

module.exports = {
    DailyStats: mongoose.model('DailyStats', DailyStatsSchema),
    CourseClick: mongoose.model('CourseClick', CourseClickSchema),
};

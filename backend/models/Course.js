const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: '₹' },
    affiliateLink: { type: String, required: true },
    image: { type: String, default: '' },
    category: {
        type: String,
        enum: ['SDE', 'Web Development', 'Data Science', 'Cloud', 'DevOps', 'AI/ML', 'UI/UX', 'Other'],
        default: 'Other'
    },
    platform: { type: String, default: 'Udemy' },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    totalStudents: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    clickCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);

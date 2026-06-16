const express = require('express');
const router = express.Router();
const { adminLogin, verifyAdmin } = require('../middleware/adminAuth');
const {
    getAllCourses, getCourseById, createCourse,
    updateCourse, deleteCourse, trackCourseClick
} = require('../controllers/courseController');

// Public
router.post('/admin/login', adminLogin);

// Public – course listing for website visitors
router.get('/courses', getAllCourses);
router.get('/courses/:id', getCourseById);
router.post('/courses/:id/click', trackCourseClick);

// Admin protected CRUD
router.post('/admin/courses', verifyAdmin, createCourse);
router.put('/admin/courses/:id', verifyAdmin, updateCourse);
router.delete('/admin/courses/:id', verifyAdmin, deleteCourse);

module.exports = router;

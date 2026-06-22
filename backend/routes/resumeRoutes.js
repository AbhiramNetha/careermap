const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const userAuth = require('../middleware/userAuth');

// Require authentication for all resume endpoints
router.use(userAuth);

router.route('/')
    .get(resumeController.getUserResumes)
    .post(resumeController.createResume);

router.route('/:id')
    .get(resumeController.getResumeById)
    .put(resumeController.updateResume)
    .delete(resumeController.deleteResume);

module.exports = router;

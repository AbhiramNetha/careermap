const express = require('express');
const router = express.Router();
const { getQuizQuestions, submitQuiz } = require('../controllers/quizController');

router.get('/questions', getQuizQuestions);
router.post('/submit', submitQuiz);

module.exports = router;

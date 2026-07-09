const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/userAuth');
const alumniController = require('../controllers/alumniController');

// All routes require authentication
router.use(userAuth);

router.get('/membership', alumniController.getMembership);
router.get('/colleges/search', alumniController.searchColleges);
router.post('/colleges', alumniController.registerCollege);
router.post('/join', alumniController.joinCollege);
router.get('/directory', alumniController.getDirectory);
router.get('/rooms', alumniController.getRooms);
router.get('/rooms/:roomId/messages', alumniController.getRoomMessages);
router.post('/rooms/:roomId/messages', alumniController.sendRoomMessage);
router.get('/questions', alumniController.getQuestions);
router.post('/questions', alumniController.postQuestion);
router.post('/questions/:questionId/answers', alumniController.postAnswer);
router.post('/answers/:answerId/upvote', alumniController.upvoteAnswer);
router.get('/referrals', alumniController.getReferrals);
router.post('/referrals', alumniController.postReferral);
router.post('/referrals/:requestId/respond', alumniController.respondReferral);
router.put('/referrals/:requestId/status', alumniController.updateReferralStatus);
router.get('/leaderboard', alumniController.getLeaderboard);
router.delete('/membership', alumniController.leaveCollege);

module.exports = router;

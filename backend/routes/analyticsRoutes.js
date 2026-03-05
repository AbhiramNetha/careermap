const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/adminAuth');
const { trackVisit, getAnalyticsSummary, getTrafficData } = require('../controllers/analyticsController');

// Public – track visit from any page load
router.post('/track', trackVisit);

// Admin only
router.get('/summary', verifyAdmin, getAnalyticsSummary);
router.get('/traffic', verifyAdmin, getTrafficData);

module.exports = router;

const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/adminAuth');
const {
    getAllOpportunities, getOpportunityById, createOpportunity,
    updateOpportunity, deleteOpportunity, trackOpportunityClick
} = require('../controllers/opportunityController');

// Public
router.get('/opportunities', getAllOpportunities);
router.get('/opportunities/:id', getOpportunityById);
router.post('/opportunities/:id/click', trackOpportunityClick);

// Admin protected CRUD
router.post('/admin/opportunities', verifyAdmin, createOpportunity);
router.put('/admin/opportunities/:id', verifyAdmin, updateOpportunity);
router.delete('/admin/opportunities/:id', verifyAdmin, deleteOpportunity);

module.exports = router;

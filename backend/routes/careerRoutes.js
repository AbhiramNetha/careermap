const express = require('express');
const router = express.Router();
const {
    getAllCareers,
    getCareerById,
    getCategories,
    getBranches,
    getCareersByBranch,
    compareCareers,
} = require('../controllers/careerController');

router.get('/categories/list', getCategories);
router.get('/branches/list', getBranches);
router.get('/branch/:branchName', getCareersByBranch);
router.post('/compare', compareCareers);
router.get('/', getAllCareers);
router.get('/:id', getCareerById);

module.exports = router;

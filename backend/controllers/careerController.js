const { Op } = require('sequelize');
const Career = require('../models/Career');

/**
 * GET /api/careers
 */
exports.getAllCareers = async (req, res) => {
    try {
        const { category, branch, riskLevel, studyRequired, trending, search } = req.query;
        const where = {};

        if (category) where.category = category;
        if (riskLevel) where.riskLevel = riskLevel;
        if (studyRequired !== undefined) where.studyRequired = studyRequired === 'true';
        if (trending === 'true') where.isTrending = true;
        if (search) where.name = { [Op.iLike]: `%${search}%` };

        if (branch) {
            where[Op.or] = [
                { eligibleBranches: { [Op.contains]: [branch] } },
                { moderateBranches: { [Op.contains]: [branch] } },
            ];
        }

        const careers = await Career.findAll({
            where,
            attributes: { exclude: ['roadmap', 'quizScoring'] },
        });

        res.json({ success: true, count: careers.length, data: careers });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET /api/careers/:id
 */
exports.getCareerById = async (req, res) => {
    try {
        const career = await Career.findByPk(req.params.id);
        if (!career) return res.status(404).json({ success: false, message: 'Career not found' });
        res.json({ success: true, data: career });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET /api/careers/categories/list
 */
exports.getCategories = async (req, res) => {
    try {
        const categories = [
            { id: 'private', name: 'Private Sector Jobs', icon: '💼', description: 'Corporate careers in IT, Analytics, Core Engineering & management roles', color: '#6366f1' },
            { id: 'higher-studies', name: 'Higher Studies', icon: '🎓', description: 'M.Tech via GATE, MBA via CAT, MS Abroad for advanced qualifications', color: '#8b5cf6' },
            { id: 'government', name: 'Government Jobs', icon: '🏛️', description: 'PSU, SSC JE, UPSC, and other government sector opportunities', color: '#059669' },
            { id: 'entrepreneurship', name: 'Entrepreneurship', icon: '🚀', description: 'Build your own startup or freelance business using your engineering skills', color: '#f59e0b' },
        ];
        res.json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET /api/careers/branches/list
 */
exports.getBranches = async (req, res) => {
    try {
        const branches = ['CSE', 'ECE', 'Mechanical', 'Civil', 'EEE'];
        const branchDetails = branches.map(b => ({
            id: b, name: b,
            fullName: {
                CSE: 'Computer Science Engineering',
                ECE: 'Electronics & Communication Engineering',
                Mechanical: 'Mechanical Engineering',
                Civil: 'Civil Engineering',
                EEE: 'Electrical & Electronics Engineering',
            }[b],
        }));
        res.json({ success: true, data: branchDetails });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET /api/careers/branch/:branchName
 */
exports.getCareersByBranch = async (req, res) => {
    try {
        const { branchName } = req.params;

        const directFit = await Career.findAll({
            where: { eligibleBranches: { [Op.contains]: [branchName] } },
            attributes: { exclude: ['roadmap', 'quizScoring'] },
        });

        const moderateFit = await Career.findAll({
            where: {
                moderateBranches: { [Op.contains]: [branchName] },
                [Op.not]: { eligibleBranches: { [Op.contains]: [branchName] } },
            },
            attributes: { exclude: ['roadmap', 'quizScoring'] },
        });

        res.json({
            success: true,
            branch: branchName,
            data: { directFit, moderateFit, total: directFit.length + moderateFit.length },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * POST /api/careers/compare
 */
exports.compareCareers = async (req, res) => {
    try {
        const { careerIds } = req.body;
        if (!careerIds || careerIds.length < 2 || careerIds.length > 3) {
            return res.status(400).json({ success: false, message: 'Provide 2-3 career IDs to compare' });
        }
        const careers = await Career.findAll({ where: { id: { [Op.in]: careerIds } } });
        if (careers.length < 2) {
            return res.status(404).json({ success: false, message: 'Some careers not found' });
        }
        res.json({ success: true, data: careers });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

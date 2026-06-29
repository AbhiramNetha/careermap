const { Op } = require('sequelize');
const Career = require('../models/Career');

/**
 * GET /api/careers
 * Supports: ?category=Government&demand=High&branch=CSE&trending=true&search=...
 */
exports.getAllCareers = async (req, res) => {
    try {
        const { category, demand, branch, trending, search } = req.query;
        const where = {};

        if (category) where.category = category;
        if (demand) where.demandLevel = demand;
        if (trending === 'true') where.isTrending = true;
        if (search) where.title = { [Op.iLike]: `%${search}%` };

        if (branch) {
            // Match careers whose branches JSONB array contains this branch OR 'ALL'
            where[Op.or] = [
                { branches: { [Op.contains]: [branch] } },
                { branches: { [Op.contains]: ['ALL'] } },
            ];
        }

        const careers = await Career.findAll({
            where,
            order: [
                ['isTrending', 'DESC'],
                ['demandLevel', 'DESC'],
                ['title', 'ASC'],
            ],
        });

        res.json({ success: true, total: careers.length, data: careers });
    } catch (err) {
        console.error('GET /api/careers error:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET /api/careers/categories/list
 * Returns category metadata with counts from DB
 */
exports.getCategories = async (req, res) => {
    try {
        const categoryMeta = {
            'Private Sector': { icon: '💼', color: '#6366f1' },
            'Government': { icon: '🏛️', color: '#059669' },
            'Higher Studies': { icon: '🎓', color: '#8b5cf6' },
            'Entrepreneurship': { icon: '🚀', color: '#f59e0b' },
        };

        const categories = await Career.findAll({
            attributes: [
                'category',
                [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
            ],
            group: ['category'],
            raw: true,
        });

        const data = categories.map(c => ({
            id: c.category,
            name: c.category,
            icon: categoryMeta[c.category]?.icon || '📁',
            color: categoryMeta[c.category]?.color || '#6366f1',
            count: parseInt(c.count, 10),
        }));

        res.json({ success: true, data });
    } catch (err) {
        console.error('GET /api/careers/categories error:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET /api/careers/branches/list
 */
exports.getBranches = async (req, res) => {
    try {
        const branches = ['CSE', 'IT', 'ECE', 'MECH', 'CIVIL', 'EEE'];
        const branchDetails = branches.map(b => ({
            id: b,
            name: b,
            fullName: {
                CSE: 'Computer Science Engineering',
                IT: 'Information Technology',
                ECE: 'Electronics & Communication Engineering',
                MECH: 'Mechanical Engineering',
                CIVIL: 'Civil Engineering',
                EEE: 'Electrical & Electronics Engineering',
            }[b],
        }));
        res.json({ success: true, data: branchDetails });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET /api/careers/:slug
 * Find career by slug (string) or by numeric id
 */
exports.getCareerBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        // Try slug first, then numeric id
        let career = await Career.findOne({ where: { slug } });
        if (!career && !isNaN(slug)) {
            career = await Career.findByPk(parseInt(slug, 10));
        }

        if (!career) {
            return res.status(404).json({ success: false, message: 'Career not found' });
        }

        res.json({ success: true, data: career });
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

        // Careers that directly list this branch
        const directFit = await Career.findAll({
            where: {
                [Op.or]: [
                    { branches: { [Op.contains]: [branchName] } },
                    { branches: { [Op.contains]: ['ALL'] } },
                ],
            },
            order: [['isTrending', 'DESC'], ['demandLevel', 'DESC']],
        });

        res.json({
            success: true,
            branch: branchName,
            data: {
                directFit,
                moderateFit: [],
                total: directFit.length,
            },
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

        // Support both slugs and numeric IDs
        const slugs = careerIds.filter(id => isNaN(id));
        const numericIds = careerIds.filter(id => !isNaN(id)).map(Number);

        const conditions = [];
        if (slugs.length > 0) conditions.push({ slug: { [Op.in]: slugs } });
        if (numericIds.length > 0) conditions.push({ id: { [Op.in]: numericIds } });

        const careers = await Career.findAll({
            where: conditions.length > 1 ? { [Op.or]: conditions } : conditions[0],
        });

        if (careers.length < 2) {
            return res.status(404).json({ success: false, message: 'Some careers not found' });
        }
        res.json({ success: true, data: careers });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

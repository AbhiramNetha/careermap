const Resume = require('../models/Resume');

/**
 * GET /api/resumes
 * Retrieve all resumes for the authenticated user
 */
exports.getUserResumes = async (req, res) => {
    try {
        const resumes = await Resume.findAll({
            where: { userId: req.userId },
            order: [['updatedAt', 'DESC']]
        });
        res.json({ success: true, count: resumes.length, data: resumes });
    } catch (err) {
        console.error('Error fetching user resumes:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

/**
 * GET /api/resumes/:id
 * Retrieve a specific resume by ID
 */
exports.getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            where: { id: req.params.id, userId: req.userId }
        });
        if (!resume) {
            return res.status(404).json({ success: false, error: 'Resume not found' });
        }
        res.json({ success: true, data: resume });
    } catch (err) {
        console.error('Error fetching resume:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

/**
 * POST /api/resumes
 * Create a new resume
 */
exports.createResume = async (req, res) => {
    try {
        const { title, template, styles, data } = req.body;
        const resume = await Resume.create({
            userId: req.userId,
            title: title || 'My Resume',
            template: template || 'minimalist',
            styles: styles || {
                fontFamily: 'Inter',
                fontSize: '11pt',
                lineHeight: '1.4',
                primaryColor: '#0f172a'
            },
            data: data || {}
        });
        res.status(201).json({ success: true, data: resume });
    } catch (err) {
        console.error('Error creating resume:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

/**
 * PUT /api/resumes/:id
 * Update an existing resume
 */
exports.updateResume = async (req, res) => {
    try {
        const { title, template, styles, data } = req.body;
        const resume = await Resume.findOne({
            where: { id: req.params.id, userId: req.userId }
        });

        if (!resume) {
            return res.status(404).json({ success: false, error: 'Resume not found' });
        }

        // Update fields if provided
        if (title !== undefined) resume.title = title;
        if (template !== undefined) resume.template = template;
        if (styles !== undefined) resume.styles = styles;
        if (data !== undefined) resume.data = data;

        await resume.save();
        res.json({ success: true, data: resume });
    } catch (err) {
        console.error('Error updating resume:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

/**
 * DELETE /api/resumes/:id
 * Delete a specific resume
 */
exports.deleteResume = async (req, res) => {
    try {
        const result = await Resume.destroy({
            where: { id: req.params.id, userId: req.userId }
        });

        if (result === 0) {
            return res.status(404).json({ success: false, error: 'Resume not found or unauthorized' });
        }

        res.json({ success: true, message: 'Resume deleted successfully' });
    } catch (err) {
        console.error('Error deleting resume:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

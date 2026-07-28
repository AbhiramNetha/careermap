const { Op } = require('sequelize');
const Opportunity = require('../models/Opportunity');

async function getAllOpportunities(req, res) {
    try {
        const { type, active, search, experienceLevel } = req.query;
        const where = {};
        if (type) where.type = type;
        if (experienceLevel) where.experienceLevel = experienceLevel;
        if (active !== undefined) where.isActive = active === 'true';
        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { company: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const opportunities = await Opportunity.findAll({ where, order: [['createdAt', 'DESC']] });
        res.json(opportunities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getOpportunityById(req, res) {
    try {
        const opportunity = await Opportunity.findByPk(req.params.id);
        if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });
        res.json(opportunity);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function createOpportunity(req, res) {
    try {
        const opportunity = await Opportunity.create(req.body);
        res.status(201).json({ success: true, opportunity });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function updateOpportunity(req, res) {
    try {
        const opportunity = await Opportunity.findByPk(req.params.id);
        if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });
        await opportunity.update(req.body);
        res.json({ success: true, opportunity });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function deleteOpportunity(req, res) {
    try {
        const opportunity = await Opportunity.findByPk(req.params.id);
        if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });
        await opportunity.destroy();
        res.json({ success: true, message: 'Opportunity deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function trackOpportunityClick(req, res) {
    try {
        const opportunity = await Opportunity.findByPk(req.params.id);
        if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });

        await opportunity.increment('clickCount', { by: 1 });
        await opportunity.reload();

        res.json({ success: true, applyLink: opportunity.applyLink });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getAllOpportunities,
    getOpportunityById,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    trackOpportunityClick
};

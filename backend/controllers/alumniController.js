const { Op } = require('sequelize');
const College = require('../models/College');
const CollegeMember = require('../models/CollegeMember');
const ChatRoom = require('../models/ChatRoom');
const ChatMessage = require('../models/ChatMessage');
const AnonymousQuestion = require('../models/AnonymousQuestion');
const QuestionAnswer = require('../models/QuestionAnswer');
const ReferralRequest = require('../models/ReferralRequest');
const ReferralResponse = require('../models/ReferralResponse');

// Check user's college membership
exports.getMembership = async (req, res) => {
    try {
        const member = await CollegeMember.findOne({ where: { userId: req.userId } });
        if (!member) {
            return res.json({ success: true, joined: false });
        }
        const college = await College.findByPk(member.collegeId);
        return res.json({ success: true, joined: true, member, college });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Search colleges
exports.searchColleges = async (req, res) => {
    try {
        const { q } = req.query;
        const whereClause = q ? {
            [Op.or]: [
                { name: { [Op.iLike]: `%${q}%` } },
                { domain: { [Op.iLike]: `%${q}%` } }
            ]
        } : {};
        const colleges = await College.findAll({ where: whereClause, order: [['name', 'ASC']] });
        return res.json({ success: true, colleges });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Register a college (by TPO/Admin)
exports.registerCollege = async (req, res) => {
    try {
        const { name, slug, domain, logoUrl, bannerUrl, role, batchYear, branch } = req.body;

        // Check if slug or domain already registered
        const existing = await College.findOne({
            where: { [Op.or]: [{ slug }, { domain }] }
        });
        if (existing) {
            return res.status(400).json({ success: false, error: 'College domain or slug already registered.' });
        }

        // Create college
        const college = await College.create({ name, slug, domain, logoUrl, bannerUrl });

        // Add creator as member (Admin role)
        const member = await CollegeMember.create({
            userId: req.userId,
            collegeId: college.id,
            role: role || 'admin',
            verificationMethod: 'domain',
            batchYear,
            branch
        });

        // Initialize standard chat rooms
        const standardRooms = [
            { name: '💬 General Chat', type: 'general' },
            { name: '💼 Placement Updates', type: 'placements' },
            { name: '🎒 Internship Leads', type: 'internships' },
            { name: '🎓 Higher Studies', type: 'higher-studies' },
            { name: '🏛️ Govt Jobs Prep', type: 'government' },
            { name: '🚀 Startup Discussion', type: 'startup' }
        ];

        for (const room of standardRooms) {
            await ChatRoom.create({
                collegeId: college.id,
                name: room.name,
                type: room.type
            });
        }

        return res.status(201).json({ success: true, college, member });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Join an existing college
exports.joinCollege = async (req, res) => {
    try {
        const { collegeId, role, batchYear, branch, currentCompany, currentRole, availabilityTags, email } = req.body;

        const college = await College.findByPk(collegeId);
        if (!college) {
            return res.status(404).json({ success: false, error: 'College not found.' });
        }

        // Domain verification if college email domain provided
        let verified = true;
        if (email) {
            const emailDomain = email.split('@')[1];
            if (emailDomain.toLowerCase() !== college.domain.toLowerCase()) {
                return res.status(400).json({ success: false, error: `Invalid email domain. Must end with @${college.domain}` });
            }
        }

        // Check if already a member of any college
        const existingMember = await CollegeMember.findOne({ where: { userId: req.userId } });
        if (existingMember) {
            return res.status(400).json({ success: false, error: 'You have already joined a college network.' });
        }

        const member = await CollegeMember.create({
            userId: req.userId,
            collegeId: college.id,
            role: role || 'student',
            verificationMethod: email ? 'domain' : 'manual',
            verifiedAt: new Date(),
            batchYear,
            branch,
            currentCompany: currentCompany || '',
            currentRole: currentRole || '',
            availabilityTags: availabilityTags || []
        });

        return res.status(201).json({ success: true, member, college });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Get college directory
exports.getDirectory = async (req, res) => {
    try {
        const member = await CollegeMember.findOne({ where: { userId: req.userId } });
        if (!member) {
            return res.status(403).json({ success: false, error: 'Access denied. Join college network first.' });
        }

        const { search, role, branch } = req.query;

        const whereClause = { collegeId: member.collegeId };
        if (role) whereClause.role = role;
        if (branch) whereClause.branch = branch;

        if (search) {
            whereClause[Op.or] = [
                { currentCompany: { [Op.iLike]: `%${search}%` } },
                { currentRole: { [Op.iLike]: `%${search}%` } },
                { branch: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const members = await CollegeMember.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });

        return res.json({ success: true, members });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Get chat rooms
exports.getRooms = async (req, res) => {
    try {
        const member = await CollegeMember.findOne({ where: { userId: req.userId } });
        if (!member) {
            return res.status(403).json({ success: false, error: 'Access denied.' });
        }

        const rooms = await ChatRoom.findAll({
            where: { collegeId: member.collegeId },
            order: [['createdAt', 'ASC']]
        });
        return res.json({ success: true, rooms });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Get room messages
exports.getRoomMessages = async (req, res) => {
    try {
        const member = await CollegeMember.findOne({ where: { userId: req.userId } });
        if (!member) {
            return res.status(403).json({ success: false, error: 'Access denied.' });
        }

        const { roomId } = req.params;
        const messages = await ChatMessage.findAll({
            where: { roomId },
            order: [['createdAt', 'ASC']],
            limit: 100
        });

        return res.json({ success: true, messages });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Send room message
exports.sendRoomMessage = async (req, res) => {
    try {
        const member = await CollegeMember.findOne({ where: { userId: req.userId } });
        if (!member) {
            return res.status(403).json({ success: false, error: 'Access denied.' });
        }

        const { roomId } = req.params;
        const { content, senderName, senderAvatar } = req.body;

        const message = await ChatMessage.create({
            roomId,
            senderId: req.userId,
            senderName: senderName || 'Alumni Member',
            senderAvatar: senderAvatar || '',
            content
        });

        return res.status(201).json({ success: true, message });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Ask Alumni Q&A
exports.getQuestions = async (req, res) => {
    try {
        const member = await CollegeMember.findOne({ where: { userId: req.userId } });
        if (!member) return res.status(403).json({ success: false, error: 'Access denied.' });

        const questions = await AnonymousQuestion.findAll({
            where: { collegeId: member.collegeId },
            order: [['createdAt', 'DESC']]
        });

        const questionsWithAnswers = [];
        for (const q of questions) {
            const answers = await QuestionAnswer.findAll({
                where: { questionId: q.id },
                order: [['upvotes', 'DESC'], ['createdAt', 'ASC']]
            });
            questionsWithAnswers.push({
                ...q.toJSON(),
                answers
            });
        }

        return res.json({ success: true, questions: questionsWithAnswers });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

exports.postQuestion = async (req, res) => {
    try {
        const member = await CollegeMember.findOne({ where: { userId: req.userId } });
        if (!member) return res.status(403).json({ success: false, error: 'Access denied.' });

        const { content } = req.body;
        const question = await AnonymousQuestion.create({
            collegeId: member.collegeId,
            content
        });

        return res.status(201).json({ success: true, question, answers: [] });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

exports.postAnswer = async (req, res) => {
    try {
        const member = await CollegeMember.findOne({ where: { userId: req.userId } });
        if (!member) return res.status(403).json({ success: false, error: 'Access denied.' });

        const { questionId } = req.params;
        const { content, senderName } = req.body;

        const answer = await QuestionAnswer.create({
            questionId,
            alumnusId: req.userId,
            alumnusName: senderName || 'Alumni Member',
            alumnusRole: member.currentRole || 'Alumnus',
            alumnusCompany: member.currentCompany || member.branch,
            content
        });

        return res.status(201).json({ success: true, answer });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

exports.upvoteAnswer = async (req, res) => {
    try {
        const { answerId } = req.params;
        const answer = await QuestionAnswer.findByPk(answerId);
        if (!answer) return res.status(404).json({ success: false, error: 'Answer not found.' });

        answer.upvotes += 1;
        await answer.save();

        return res.json({ success: true, answer });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Referral Board
exports.getReferrals = async (req, res) => {
    try {
        const member = await CollegeMember.findOne({ where: { userId: req.userId } });
        if (!member) return res.status(403).json({ success: false, error: 'Access denied.' });

        const requests = await ReferralRequest.findAll({
            where: { collegeId: member.collegeId },
            order: [['createdAt', 'DESC']]
        });

        const requestsWithResponses = [];
        for (const reqObj of requests) {
            const responses = await ReferralResponse.findAll({
                where: { requestId: reqObj.id },
                order: [['createdAt', 'ASC']]
            });
            requestsWithResponses.push({
                ...reqObj.toJSON(),
                responses
            });
        }

        return res.json({ success: true, requests: requestsWithResponses });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

exports.postReferral = async (req, res) => {
    try {
        const member = await CollegeMember.findOne({ where: { userId: req.userId } });
        if (!member) return res.status(403).json({ success: false, error: 'Access denied.' });

        const { targetCompany, targetRole, description, studentName } = req.body;
        const request = await ReferralRequest.create({
            collegeId: member.collegeId,
            studentId: req.userId,
            studentName: studentName || 'Student Member',
            targetCompany,
            targetRole,
            description,
            status: 'open'
        });

        return res.status(201).json({ success: true, request, responses: [] });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

exports.respondReferral = async (req, res) => {
    try {
        const member = await CollegeMember.findOne({ where: { userId: req.userId } });
        if (!member) return res.status(403).json({ success: false, error: 'Access denied.' });

        const { requestId } = req.params;
        const { message, senderName } = req.body;

        const response = await ReferralResponse.create({
            requestId,
            alumnusId: req.userId,
            alumnusName: senderName || 'Alumni Member',
            message
        });

        // Auto move status to in_progress
        const request = await ReferralRequest.findByPk(requestId);
        if (request && request.status === 'open') {
            request.status = 'in_progress';
            await request.save();
        }

        return res.status(201).json({ success: true, response });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

exports.updateReferralStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body; // 'open' | 'in_progress' | 'fulfilled'

        const request = await ReferralRequest.findByPk(requestId);
        if (!request) return res.status(404).json({ success: false, error: 'Referral request not found.' });

        request.status = status;
        await request.save();

        return res.json({ success: true, request });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Leaderboard
exports.getLeaderboard = async (req, res) => {
    try {
        const member = await CollegeMember.findOne({ where: { userId: req.userId } });
        if (!member) return res.status(403).json({ success: false, error: 'Access denied.' });

        // Fetch all alumni members
        const alumni = await CollegeMember.findAll({
            where: { collegeId: member.collegeId, role: 'alumnus' }
        });

        const list = [];
        for (const al of alumni) {
            // Count answers
            const answerCount = await QuestionAnswer.count({ where: { alumnusId: al.userId } });
            // Count referrals offered
            const referralCount = await ReferralResponse.count({ where: { alumnusId: al.userId } });

            // Calculate points: answers = 10 pts, referrals = 30 pts
            const points = (answerCount * 10) + (referralCount * 30);

            list.push({
                userId: al.userId,
                branch: al.branch,
                currentCompany: al.currentCompany,
                currentRole: al.currentRole,
                answerCount,
                referralCount,
                points
            });
        }

        // Sort by points desc
        list.sort((a, b) => b.points - a.points);

        return res.json({ success: true, leaderboard: list });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Leave college space (delete membership)
exports.leaveCollege = async (req, res) => {
    try {
        const member = await CollegeMember.findOne({ where: { userId: req.userId } });
        if (!member) {
            return res.status(404).json({ success: false, error: 'You are not a member of any college network.' });
        }
        await member.destroy();
        return res.json({ success: true, message: 'Successfully left the college space.' });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};


const QuizQuestion = require('../models/Quiz');
const Career = require('../models/Career');
const { Op } = require('sequelize');
const { calculateQuizResults } = require('../services/scoringService');

/**
 * GET /api/quiz/questions
 */
exports.getQuizQuestions = async (req, res) => {
    try {
        const questions = await QuizQuestion.findAll({ order: [['step', 'ASC']] });
        res.json({ success: true, count: questions.length, data: questions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * POST /api/quiz/submit
 * Body: { degree, ...dynamicAnswers }
 */
exports.submitQuiz = async (req, res) => {
    try {
        const { degree } = req.body;

        // Validate required field
        if (!degree) {
            return res.status(400).json({ success: false, message: 'Missing required field: degree' });
        }

        const answers = req.body;

        // Run scoring engine
        const topResults = calculateQuizResults(answers);

        // Fetch career data for top results
        const careerIds = topResults.map(r => r.careerId);
        const careers = await Career.findAll({
            where: { slug: { [Op.in]: careerIds } }, // FIX: Query by slug instead of auto-incrementing id
            attributes: { exclude: ['quizScoring'] },
        });

        // Build response with match data
        const recommendations = topResults.map(result => {
            const career = careers.find(c => c.slug === result.careerId); // FIX: Compare slug instead of id
            if (!career) return null;

            // Generate explanation
            const explanation = generateExplanation(result.careerId, answers, result.matchPercentage);

            return {
                career,
                matchPercentage: result.matchPercentage,
                explanation,
                rank: topResults.indexOf(result) + 1,
            };
        }).filter(Boolean);

        res.json({
            success: true,
            answers,
            recommendations,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * Generate human-readable explanation for a recommendation
 */
function generateExplanation(careerId, answers, matchPct) {
    const explanations = {
        'data-scientist': `With your analytical mindset and preferences, Data Science is a ${matchPct > 75 ? 'perfect' : 'good'} fit.`,
        'software-developer': `Your strong technical foundation and interest in software make Software Development a ${matchPct > 75 ? 'top choice' : 'solid option'}.`,
        'full-stack-developer': `Your passion for web development and software engineering matches Full Stack Development perfectly.`,
        'freelancer-remote-developer': `Your love for coding and high risk tolerance make remote freelancing a great fit.`,
        'ms-computer-science': `Your academic drive and interest in computer science align well with an MS in CS.`,
        'gaming-ar-vr-startup': `Your interest in creative tech and high risk appetite make game development a compelling choice.`,
        'mba-iim-xlri': `Your strong alignment with business strategy and leadership makes a top MBA your best path.`,
        'product-manager': `Your problem-solving skills and strategic mindset fit Product Management perfectly.`,
        'technical-consultant': `Your communication skills and interest in consulting make this technical consulting role ideal.`,
        'rbi-grade-b': `Your preference for stability and business/finance interests suit RBI Grade B Officer perfectly.`,
        'pgdm': `Your interest in business and corporate management aligns with a Post Graduate Diploma.`,
        'edtech-startup': `Your entrepreneurial mindset and passion for education make EdTech startups a great choice.`,
        'banking-po': `Your preference for stability and interest in banking make Banking PO an excellent career choice.`,
        'professional-certifications': `Pursuing professional finance certifications (like CFA) fits your career aspirations.`,
        'fintech-startup': `Your interest in financial markets and high risk appetite match FinTech startups perfectly.`,
        'ssc-cgl-officer': `Your preference for public service and stable career growth aligns with SSC CGL.`,
        'business-analyst': `Your data analysis and corporate finance interests fit Business Analyst perfectly.`,
        'isro-scientist': `Your science background and interest in space research make ISRO Scientist a dream match.`,
        'drdo-scientist': `Your technical skills and desire to work in national defence research fit DRDO perfectly.`,
        'phd-india': `Your passion for academic research and teaching matches a PhD program in India.`,
        'phd-abroad': `Your desire for global research exposure matches a PhD abroad.`,
        'government-lecturer': `Your passion for classroom teaching and academia aligns with a Government Lecturer role.`,
        'ms-data-science-ai': `Your interests in analytics and AI make an MS in Data Science/AI a strong match.`,
        'ias-ips-ifs-officer': `Your dream of civil services and public leadership aligns with IAS/IPS/IFS.`,
        'ui-ux-designer': `Your creative design skills and psychology interests fit UI/UX Design perfectly.`,
        'content-creator': `Your writing, design, and creative skills make content creation/YouTubing a very strong match.`,
        'social-impact-tech': `Your desire to solve social problems using technology aligns with a Tech NGO venture.`,
        'llb-law': `Your analytical background and interest in regulation/legal systems make patent or tech law a unique fit.`,
        'freelance-agency': `Your creative skills and entrepreneurial drive fit running a freelance agency perfectly.`,
        'psu-engineer': `Your technical engineering skills and search for job security align with a PSU career.`,
        'mtech-iit-nit': `Your desire for deeper technical research aligns with M.Tech via GATE.`,
        'ms-abroad': `Your global career aspirations make MS Abroad a very compelling path.`,
        'ssc-je': `Your engineering specialization and search for stable government work match SSC JE.`,
        'saas-startup': `Your technical coding skills and high risk appetite match SaaS startups perfectly.`,
    };

    return explanations[careerId] || `Based on your profile, ${careerId.replace(/-/g, ' ')} scores a ${matchPct}% match with your preferences.`;
}

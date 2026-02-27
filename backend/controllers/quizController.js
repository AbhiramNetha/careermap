const QuizQuestion = require('../models/Quiz');
const Career = require('../models/Career');
const { calculateQuizResults } = require('../services/scoringService');

/**
 * GET /api/quiz/questions
 */
exports.getQuizQuestions = async (req, res) => {
    try {
        const questions = await QuizQuestion.find().sort('step');
        res.json({ success: true, count: questions.length, data: questions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * POST /api/quiz/submit
 * Body: { branch, interest, riskTolerance, salaryExpectation, studyPreference, workLifeBalance, financialCondition }
 */
exports.submitQuiz = async (req, res) => {
    try {
        const { branch, interest, riskTolerance, salaryExpectation, studyPreference, workLifeBalance, financialCondition } = req.body;

        // Validate required fields
        const required = ['branch', 'interest', 'riskTolerance', 'salaryExpectation', 'studyPreference', 'workLifeBalance', 'financialCondition'];
        const missing = required.filter(f => !req.body[f]);
        if (missing.length > 0) {
            return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });
        }

        const answers = { branch, interest, riskTolerance, salaryExpectation, studyPreference, workLifeBalance, financialCondition };

        // Run scoring engine
        const topResults = calculateQuizResults(answers);

        // Fetch career data for top results
        const careerIds = topResults.map(r => r.careerId);
        const careers = await Career.find({ id: { $in: careerIds } }).select('-quizScoring');

        // Build response with match data
        const recommendations = topResults.map(result => {
            const career = careers.find(c => c.id === result.careerId);
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
        'data-analyst': `With your ${answers.interest === 'Coding' ? 'love for coding' : 'analytical mindset'} and ${answers.riskTolerance === 'Low' ? 'preference for stability' : 'calculated risk approach'}, Data Analytics is a ${matchPct > 75 ? 'perfect' : 'good'} fit. ${answers.financialCondition === 'limited' ? 'No expensive degree needed — skills-based entry is affordable.' : ''}`,
        'software-developer': `Your ${answers.branch === 'CSE' || answers.branch === 'IT' ? 'strong CS background' : 'technical foundation'} combined with ${answers.interest === 'Coding' ? 'passion for coding' : 'interest in technology'} makes Software Development a ${matchPct > 75 ? 'top choice' : 'solid option'}.`,
        'mba-cat': `Your interest in ${answers.interest === 'Management' ? 'management and leadership' : 'business and strategy'} with ${answers.financialCondition === 'can-afford' ? 'financial flexibility' : 'ambition to grow'} aligns well with an MBA via CAT.`,
        'psu-engineer': `${answers.riskTolerance === 'Low' ? 'Your preference for job security' : 'Your balanced approach'} and ${answers.workLifeBalance === 'High' ? 'high priority for work-life balance' : 'practical career goals'} make PSU jobs a strong match.`,
        'mtech-gate': `Your ${answers.interest === 'Research' ? 'passion for research' : 'desire for deeper knowledge'} and ${answers.studyPreference === 'Yes' ? 'willingness to study more' : 'technical inclination'} suit M.Tech via GATE perfectly.`,
        'ms-abroad': `Your ambition for ${answers.salaryExpectation === '>8lpa' ? 'high earning potential' : 'global exposure'} and ${answers.financialCondition === 'can-afford' ? 'financial readiness' : 'drive to succeed abroad'} make MS Abroad a compelling path.`,
        'govt-ssc-je': `Your preference for ${answers.riskTolerance === 'Low' ? 'job security' : 'government service'} and ${answers.workLifeBalance === 'High' ? 'work-life balance' : 'stable career'} make SSC JE an ideal choice.`,
        'entrepreneurship': `Your high ${answers.riskTolerance === 'High' ? 'risk appetite' : 'ambition'} and ${answers.interest === 'Entrepreneurship' ? 'entrepreneurial drive' : 'innovative thinking'} are exactly what entrepreneurship demands.`,
    };

    return explanations[careerId] || `Based on your profile, ${careerId.replace(/-/g, ' ')} scores ${matchPct}% match with your preferences.`;
}

/**
 * Scoring Service — CareerMap India
 * Rule-based weighted scoring engine.
 * Calculates match percentages for each career based on quiz answers.
 */

/**
 * Scoring rules for every career.
 * Each rule: { field, value, score }
 * Max possible score for normalization = 100
 */
const CAREER_SCORING_RULES = {
    'data-analyst': [
        // Branch
        { field: 'branch', value: 'CSE', score: 15 },
        { field: 'branch', value: 'IT', score: 15 },
        { field: 'branch', value: 'ECE', score: 12 },
        { field: 'branch', value: 'EEE', score: 10 },
        { field: 'branch', value: 'Mechanical', score: 8 },
        { field: 'branch', value: 'Civil', score: 6 },
        // Interest
        { field: 'interest', value: 'Coding', score: 20 },
        { field: 'interest', value: 'Research', score: 12 },
        { field: 'interest', value: 'Management', score: 8 },
        { field: 'interest', value: 'Government', score: -10 },
        { field: 'interest', value: 'Entrepreneurship', score: 5 },
        // Risk tolerance
        { field: 'riskTolerance', value: 'High', score: 10 },
        { field: 'riskTolerance', value: 'Medium', score: 15 },
        { field: 'riskTolerance', value: 'Low', score: 5 },
        // Salary expectation
        { field: 'salaryExpectation', value: '>8lpa', score: 15 },
        { field: 'salaryExpectation', value: '5-8lpa', score: 12 },
        { field: 'salaryExpectation', value: '<5lpa', score: 5 },
        // Study preference
        { field: 'studyPreference', value: 'No', score: 15 },
        { field: 'studyPreference', value: 'Yes', score: 5 },
        // Work-life balance
        { field: 'workLifeBalance', value: 'High', score: 10 },
        { field: 'workLifeBalance', value: 'Medium', score: 15 },
        { field: 'workLifeBalance', value: 'Low', score: 8 },
        // Financial
        { field: 'financialCondition', value: 'limited', score: 15 },
        { field: 'financialCondition', value: 'can-afford', score: 5 },
    ],

    'software-developer': [
        { field: 'branch', value: 'CSE', score: 18 },
        { field: 'branch', value: 'IT', score: 18 },
        { field: 'branch', value: 'ECE', score: 10 },
        { field: 'branch', value: 'EEE', score: 8 },
        { field: 'branch', value: 'Mechanical', score: 5 },
        { field: 'branch', value: 'Civil', score: 4 },
        { field: 'interest', value: 'Coding', score: 25 },
        { field: 'interest', value: 'Entrepreneurship', score: 10 },
        { field: 'interest', value: 'Research', score: 8 },
        { field: 'interest', value: 'Management', score: 5 },
        { field: 'interest', value: 'Government', score: -15 },
        { field: 'riskTolerance', value: 'High', score: 12 },
        { field: 'riskTolerance', value: 'Medium', score: 15 },
        { field: 'riskTolerance', value: 'Low', score: 5 },
        { field: 'salaryExpectation', value: '>8lpa', score: 18 },
        { field: 'salaryExpectation', value: '5-8lpa', score: 12 },
        { field: 'salaryExpectation', value: '<5lpa', score: 5 },
        { field: 'studyPreference', value: 'No', score: 15 },
        { field: 'studyPreference', value: 'Yes', score: 8 },
        { field: 'workLifeBalance', value: 'High', score: 8 },
        { field: 'workLifeBalance', value: 'Medium', score: 12 },
        { field: 'workLifeBalance', value: 'Low', score: 5 },
        { field: 'financialCondition', value: 'limited', score: 15 },
        { field: 'financialCondition', value: 'can-afford', score: 8 },
    ],

    'mba-cat': [
        { field: 'branch', value: 'CSE', score: 12 },
        { field: 'branch', value: 'Mechanical', score: 14 },
        { field: 'branch', value: 'Civil', score: 14 },
        { field: 'branch', value: 'ECE', score: 12 },
        { field: 'branch', value: 'EEE', score: 12 },
        { field: 'interest', value: 'Management', score: 25 },
        { field: 'interest', value: 'Entrepreneurship', score: 18 },
        { field: 'interest', value: 'Coding', score: 5 },
        { field: 'interest', value: 'Government', score: -5 },
        { field: 'interest', value: 'Research', score: 5 },
        { field: 'riskTolerance', value: 'High', score: 15 },
        { field: 'riskTolerance', value: 'Medium', score: 12 },
        { field: 'riskTolerance', value: 'Low', score: 5 },
        { field: 'salaryExpectation', value: '>8lpa', score: 18 },
        { field: 'salaryExpectation', value: '5-8lpa', score: 10 },
        { field: 'salaryExpectation', value: '<5lpa', score: 3 },
        { field: 'studyPreference', value: 'Yes', score: 20 },
        { field: 'studyPreference', value: 'No', score: 0 },
        { field: 'workLifeBalance', value: 'High', score: 5 },
        { field: 'workLifeBalance', value: 'Medium', score: 10 },
        { field: 'workLifeBalance', value: 'Low', score: 5 },
        { field: 'financialCondition', value: 'can-afford', score: 18 },
        { field: 'financialCondition', value: 'limited', score: 5 },
    ],

    'psu-engineer': [
        { field: 'branch', value: 'ECE', score: 16 },
        { field: 'branch', value: 'EEE', score: 16 },
        { field: 'branch', value: 'Mechanical', score: 16 },
        { field: 'branch', value: 'Civil', score: 16 },
        { field: 'branch', value: 'CSE', score: 12 },
        { field: 'interest', value: 'Government', score: 20 },
        { field: 'interest', value: 'Research', score: 10 },
        { field: 'interest', value: 'Management', score: 8 },
        { field: 'interest', value: 'Coding', score: 5 },
        { field: 'interest', value: 'Entrepreneurship', score: -5 },
        { field: 'riskTolerance', value: 'Low', score: 18 },
        { field: 'riskTolerance', value: 'Medium', score: 12 },
        { field: 'riskTolerance', value: 'High', score: 5 },
        { field: 'salaryExpectation', value: '5-8lpa', score: 15 },
        { field: 'salaryExpectation', value: '<5lpa', score: 12 },
        { field: 'salaryExpectation', value: '>8lpa', score: 8 },
        { field: 'studyPreference', value: 'Yes', score: 12 },
        { field: 'studyPreference', value: 'No', score: 8 },
        { field: 'workLifeBalance', value: 'High', score: 18 },
        { field: 'workLifeBalance', value: 'Medium', score: 12 },
        { field: 'workLifeBalance', value: 'Low', score: 5 },
        { field: 'financialCondition', value: 'limited', score: 18 },
        { field: 'financialCondition', value: 'can-afford', score: 10 },
    ],

    'mtech-gate': [
        { field: 'branch', value: 'CSE', score: 15 },
        { field: 'branch', value: 'ECE', score: 15 },
        { field: 'branch', value: 'Mechanical', score: 15 },
        { field: 'branch', value: 'Civil', score: 15 },
        { field: 'branch', value: 'EEE', score: 15 },
        { field: 'interest', value: 'Research', score: 25 },
        { field: 'interest', value: 'Coding', score: 10 },
        { field: 'interest', value: 'Government', score: 10 },
        { field: 'interest', value: 'Management', score: 5 },
        { field: 'interest', value: 'Entrepreneurship', score: 5 },
        { field: 'riskTolerance', value: 'Low', score: 15 },
        { field: 'riskTolerance', value: 'Medium', score: 12 },
        { field: 'riskTolerance', value: 'High', score: 5 },
        { field: 'salaryExpectation', value: '5-8lpa', score: 15 },
        { field: 'salaryExpectation', value: '<5lpa', score: 12 },
        { field: 'salaryExpectation', value: '>8lpa', score: 8 },
        { field: 'studyPreference', value: 'Yes', score: 22 },
        { field: 'studyPreference', value: 'No', score: -5 },
        { field: 'workLifeBalance', value: 'High', score: 12 },
        { field: 'workLifeBalance', value: 'Medium', score: 10 },
        { field: 'workLifeBalance', value: 'Low', score: 8 },
        { field: 'financialCondition', value: 'limited', score: 18 },
        { field: 'financialCondition', value: 'can-afford', score: 8 },
    ],

    'ms-abroad': [
        { field: 'branch', value: 'CSE', score: 15 },
        { field: 'branch', value: 'ECE', score: 14 },
        { field: 'branch', value: 'EEE', score: 12 },
        { field: 'branch', value: 'Mechanical', score: 10 },
        { field: 'branch', value: 'Civil', score: 10 },
        { field: 'interest', value: 'Research', score: 22 },
        { field: 'interest', value: 'Coding', score: 15 },
        { field: 'interest', value: 'Management', score: 8 },
        { field: 'interest', value: 'Entrepreneurship', score: 10 },
        { field: 'interest', value: 'Government', score: -15 },
        { field: 'riskTolerance', value: 'High', score: 18 },
        { field: 'riskTolerance', value: 'Medium', score: 12 },
        { field: 'riskTolerance', value: 'Low', score: 3 },
        { field: 'salaryExpectation', value: '>8lpa', score: 20 },
        { field: 'salaryExpectation', value: '5-8lpa', score: 10 },
        { field: 'salaryExpectation', value: '<5lpa', score: 2 },
        { field: 'studyPreference', value: 'Yes', score: 25 },
        { field: 'studyPreference', value: 'No', score: -10 },
        { field: 'workLifeBalance', value: 'High', score: 8 },
        { field: 'workLifeBalance', value: 'Medium', score: 10 },
        { field: 'workLifeBalance', value: 'Low', score: 5 },
        { field: 'financialCondition', value: 'can-afford', score: 25 },
        { field: 'financialCondition', value: 'limited', score: -20 },
    ],

    'govt-ssc-je': [
        { field: 'branch', value: 'Civil', score: 18 },
        { field: 'branch', value: 'Mechanical', score: 16 },
        { field: 'branch', value: 'EEE', score: 16 },
        { field: 'branch', value: 'ECE', score: 12 },
        { field: 'branch', value: 'CSE', score: 8 },
        { field: 'interest', value: 'Government', score: 25 },
        { field: 'interest', value: 'Management', score: 8 },
        { field: 'interest', value: 'Research', score: 5 },
        { field: 'interest', value: 'Coding', score: 3 },
        { field: 'interest', value: 'Entrepreneurship', score: -10 },
        { field: 'riskTolerance', value: 'Low', score: 20 },
        { field: 'riskTolerance', value: 'Medium', score: 12 },
        { field: 'riskTolerance', value: 'High', score: 3 },
        { field: 'salaryExpectation', value: '<5lpa', score: 15 },
        { field: 'salaryExpectation', value: '5-8lpa', score: 12 },
        { field: 'salaryExpectation', value: '>8lpa', score: 5 },
        { field: 'studyPreference', value: 'No', score: 12 },
        { field: 'studyPreference', value: 'Yes', score: 8 },
        { field: 'workLifeBalance', value: 'High', score: 18 },
        { field: 'workLifeBalance', value: 'Medium', score: 12 },
        { field: 'workLifeBalance', value: 'Low', score: 5 },
        { field: 'financialCondition', value: 'limited', score: 20 },
        { field: 'financialCondition', value: 'can-afford', score: 10 },
    ],

    'entrepreneurship': [
        { field: 'branch', value: 'CSE', score: 12 },
        { field: 'branch', value: 'Mechanical', score: 10 },
        { field: 'branch', value: 'ECE', score: 10 },
        { field: 'branch', value: 'Civil', score: 8 },
        { field: 'branch', value: 'EEE', score: 8 },
        { field: 'interest', value: 'Entrepreneurship', score: 30 },
        { field: 'interest', value: 'Management', score: 15 },
        { field: 'interest', value: 'Coding', score: 10 },
        { field: 'interest', value: 'Research', score: 8 },
        { field: 'interest', value: 'Government', score: -20 },
        { field: 'riskTolerance', value: 'High', score: 25 },
        { field: 'riskTolerance', value: 'Medium', score: 15 },
        { field: 'riskTolerance', value: 'Low', score: -10 },
        { field: 'salaryExpectation', value: '>8lpa', score: 15 },
        { field: 'salaryExpectation', value: '5-8lpa', score: 10 },
        { field: 'salaryExpectation', value: '<5lpa', score: 3 },
        { field: 'studyPreference', value: 'No', score: 15 },
        { field: 'studyPreference', value: 'Yes', score: 5 },
        { field: 'workLifeBalance', value: 'Low', score: 18 },
        { field: 'workLifeBalance', value: 'Medium', score: 10 },
        { field: 'workLifeBalance', value: 'High', score: 3 },
        { field: 'financialCondition', value: 'can-afford', score: 15 },
        { field: 'financialCondition', value: 'limited', score: 8 },
    ],
};

/**
 * Calculate score for a single career based on quiz answers
 */
function calculateCareerScore(careerId, answers) {
    const rules = CAREER_SCORING_RULES[careerId];
    if (!rules) return 0;

    let score = 0;
    for (const rule of rules) {
        if (answers[rule.field] === rule.value) {
            score += rule.score;
        }
    }
    return Math.max(0, score);
}

/**
 * Get max possible score for a career (for normalization)
 */
function getMaxScore(careerId) {
    const rules = CAREER_SCORING_RULES[careerId];
    if (!rules) return 100;

    // Sum of all positive scores
    return rules.filter(r => r.score > 0).reduce((sum, r) => sum + r.score, 0);
}

/**
 * Main scoring function
 * @param {Object} answers - { branch, interest, riskTolerance, salaryExpectation, studyPreference, workLifeBalance, financialCondition }
 * @returns {Array} - Top 3 recommended careers with match%
 */
function calculateQuizResults(answers) {
    const careerIds = Object.keys(CAREER_SCORING_RULES);
    const results = careerIds.map(careerId => {
        const raw = calculateCareerScore(careerId, answers);
        const max = getMaxScore(careerId);
        const matchPercentage = Math.min(100, Math.round((raw / max) * 100));
        return { careerId, matchPercentage, rawScore: raw };
    });

    // Sort by match% descending, take top 3
    results.sort((a, b) => b.matchPercentage - a.matchPercentage);
    return results.slice(0, 3);
}

module.exports = { calculateQuizResults, CAREER_SCORING_RULES };

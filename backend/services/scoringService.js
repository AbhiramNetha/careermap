/**
 * Scoring Service — CareerMap India
 * Rule-based weighted scoring engine.
 * Calculates match percentages for each career based on quiz answers.
 */

// Candidate careers mapped to each degree sector
const DEGREE_CANDIDATE_CAREERS = {
    'Engineering': [
        'software-developer',
        'psu-engineer',
        'mtech-iit-nit',
        'ms-abroad',
        'ssc-je',
        'saas-startup'
    ],
    'ComputerApplications': [
        'software-developer',
        'full-stack-developer',
        'data-scientist',
        'freelancer-remote-developer',
        'ms-computer-science',
        'gaming-ar-vr-startup'
    ],
    'Management': [
        'mba-iim-xlri',
        'product-manager',
        'technical-consultant',
        'rbi-grade-b',
        'pgdm',
        'edtech-startup'
    ],
    'Commerce': [
        'banking-po',
        'rbi-grade-b',
        'professional-certifications',
        'fintech-startup',
        'ssc-cgl-officer',
        'business-analyst'
    ],
    'Sciences': [
        'isro-scientist',
        'drdo-scientist',
        'phd-india',
        'phd-abroad',
        'government-lecturer',
        'ms-data-science-ai'
    ],
    'Arts': [
        'ias-ips-ifs-officer',
        'ui-ux-designer',
        'content-creator',
        'social-impact-tech',
        'llb-law',
        'freelance-agency'
    ]
};

// Comprehensive scoring rules for each candidate career based on branched questions
const CAREER_SCORING_RULES = {
    // === ENGINEERING BRANCH ===
    'software-developer': [
        { field: 'eng_branch', value: 'CSE', score: 20 },
        { field: 'eng_branch', value: 'ECE', score: 12 },
        { field: 'eng_interest', value: 'Coding', score: 30 },
        { field: 'eng_interest', value: 'Research', score: 10 },
        { field: 'eng_risk', value: 'Medium', score: 15 },
        { field: 'eng_risk', value: 'High', score: 10 },
        { field: 'eng_risk', value: 'Low', score: 5 },
        { field: 'eng_work', value: 'TechMNC', score: 25 },
        { field: 'eng_work', value: 'Startups', score: 15 },
    ],
    'psu-engineer': [
        { field: 'eng_branch', value: 'ECE', score: 10 },
        { field: 'eng_branch', value: 'EEE', score: 15 },
        { field: 'eng_branch', value: 'MECH', score: 15 },
        { field: 'eng_branch', value: 'CIVIL', score: 15 },
        { field: 'eng_interest', value: 'Core', score: 25 },
        { field: 'eng_interest', value: 'Civil', score: 20 },
        { field: 'eng_risk', value: 'Low', score: 30 },
        { field: 'eng_work', value: 'Govt', score: 25 },
    ],
    'mtech-iit-nit': [
        { field: 'eng_interest', value: 'Research', score: 30 },
        { field: 'eng_risk', value: 'Low', score: 20 },
        { field: 'eng_risk', value: 'Medium', score: 15 },
        { field: 'eng_work', value: 'ResearchLab', score: 30 },
        { field: 'eng_budget', value: 'Limited', score: 20 },
    ],
    'ms-abroad': [
        { field: 'eng_interest', value: 'Research', score: 25 },
        { field: 'eng_interest', value: 'Coding', score: 15 },
        { field: 'eng_risk', value: 'High', score: 20 },
        { field: 'eng_risk', value: 'Medium', score: 15 },
        { field: 'eng_work', value: 'ResearchLab', score: 20 },
        { field: 'eng_work', value: 'TechMNC', score: 15 },
        { field: 'eng_budget', value: 'Afford', score: 30 },
    ],
    'ssc-je': [
        { field: 'eng_branch', value: 'CIVIL', score: 25 },
        { field: 'eng_branch', value: 'MECH', score: 15 },
        { field: 'eng_branch', value: 'EEE', score: 15 },
        { field: 'eng_interest', value: 'Civil', score: 25 },
        { field: 'eng_interest', value: 'Core', score: 15 },
        { field: 'eng_risk', value: 'Low', score: 30 },
        { field: 'eng_work', value: 'Govt', score: 25 },
    ],
    'saas-startup': [
        { field: 'eng_interest', value: 'Coding', score: 20 },
        { field: 'eng_interest', value: 'Management', score: 15 },
        { field: 'eng_risk', value: 'High', score: 30 },
        { field: 'eng_risk', value: 'Medium', score: 15 },
        { field: 'eng_work', value: 'Startups', score: 30 },
    ],

    // === COMPUTER APPLICATIONS BRANCH ===
    'full-stack-developer': [
        { field: 'ca_specialization', value: 'WebDev', score: 30 },
        { field: 'ca_coding', value: 'LoveCoding', score: 25 },
        { field: 'ca_coding', value: 'ModerateCoding', score: 20 },
        { field: 'ca_risk', value: 'High', score: 20 },
        { field: 'ca_risk', value: 'Medium', score: 15 },
        { field: 'ca_salary', value: 'Learning', score: 20 },
        { field: 'ca_study', value: 'No', score: 15 },
    ],
    'data-scientist': [
        { field: 'ca_specialization', value: 'DataAI', score: 35 },
        { field: 'ca_coding', value: 'LoveCoding', score: 20 },
        { field: 'ca_coding', value: 'ModerateCoding', score: 20 },
        { field: 'ca_risk', value: 'Medium', score: 25 },
        { field: 'ca_salary', value: 'MaxSalary', score: 20 },
        { field: 'ca_study', value: 'Yes', score: 15 },
    ],
    'freelancer-remote-developer': [
        { field: 'ca_specialization', value: 'WebDev', score: 20 },
        { field: 'ca_coding', value: 'LoveCoding', score: 25 },
        { field: 'ca_risk', value: 'High', score: 35 },
        { field: 'ca_salary', value: 'Learning', score: 20 },
        { field: 'ca_study', value: 'No', score: 15 },
    ],
    'ms-computer-science': [
        { field: 'ca_specialization', value: 'DataAI', score: 20 },
        { field: 'ca_specialization', value: 'WebDev', score: 15 },
        { field: 'ca_coding', value: 'LoveCoding', score: 25 },
        { field: 'ca_risk', value: 'Medium', score: 15 },
        { field: 'ca_risk', value: 'High', score: 15 },
        { field: 'ca_study', value: 'Yes', score: 35 },
    ],
    'gaming-ar-vr-startup': [
        { field: 'ca_specialization', value: 'WebDev', score: 20 },
        { field: 'ca_coding', value: 'LoveCoding', score: 25 },
        { field: 'ca_risk', value: 'High', score: 35 },
        { field: 'ca_salary', value: 'Learning', score: 20 },
        { field: 'ca_study', value: 'No', score: 15 },
    ],

    // === BUSINESS & MANAGEMENT BRANCH ===
    'mba-iim-xlri': [
        { field: 'mgt_strength', value: 'Leadership', score: 25 },
        { field: 'mgt_strength', value: 'DataStrategy', score: 20 },
        { field: 'mgt_company', value: 'CorporateMNC', score: 25 },
        { field: 'mgt_company', value: 'Consultancy', score: 25 },
        { field: 'mgt_budget', value: 'Yes', score: 30 },
    ],
    'product-manager': [
        { field: 'mgt_specialization', value: 'Strategy', score: 25 },
        { field: 'mgt_specialization', value: 'Marketing', score: 15 },
        { field: 'mgt_strength', value: 'ProblemSolving', score: 25 },
        { field: 'mgt_strength', value: 'Leadership', score: 20 },
        { field: 'mgt_risk', value: 'Medium', score: 25 },
        { field: 'mgt_risk', value: 'High', score: 15 },
        { field: 'mgt_company', value: 'CorporateMNC', score: 20 },
        { field: 'mgt_company', value: 'StartupsVC', score: 20 },
    ],
    'technical-consultant': [
        { field: 'mgt_specialization', value: 'Strategy', score: 25 },
        { field: 'mgt_specialization', value: 'Operations', score: 15 },
        { field: 'mgt_strength', value: 'Communication', score: 25 },
        { field: 'mgt_strength', value: 'ProblemSolving', score: 20 },
        { field: 'mgt_company', value: 'Consultancy', score: 30 },
        { field: 'mgt_company', value: 'CorporateMNC', score: 15 },
    ],
    'rbi-grade-b': [
        { field: 'mgt_specialization', value: 'Finance', score: 25 },
        { field: 'mgt_strength', value: 'DataStrategy', score: 25 },
        { field: 'mgt_risk', value: 'Low', score: 30 },
        { field: 'mgt_company', value: 'Government', score: 35 },
        // Also Commerce support
        { field: 'com_specialization', value: 'CorpFinance', score: 20 },
        { field: 'com_specialization', value: 'Banking', score: 20 },
        { field: 'com_risk', value: 'Stable', score: 25 },
        { field: 'com_company', value: 'PublicBanks', score: 25 },
        { field: 'com_study', value: 'Yes', score: 25 },
    ],
    'pgdm': [
        { field: 'mgt_strength', value: 'Leadership', score: 20 },
        { field: 'mgt_strength', value: 'Communication', score: 20 },
        { field: 'mgt_company', value: 'CorporateMNC', score: 25 },
        { field: 'mgt_budget', value: 'No', score: 25 },
    ],
    'edtech-startup': [
        { field: 'mgt_specialization', value: 'Marketing', score: 20 },
        { field: 'mgt_strength', value: 'Communication', score: 20 },
        { field: 'mgt_strength', value: 'Leadership', score: 20 },
        { field: 'mgt_risk', value: 'High', score: 35 },
        { field: 'mgt_company', value: 'StartupsVC', score: 35 },
    ],

    // === COMMERCE & FINANCE BRANCH ===
    'banking-po': [
        { field: 'com_specialization', value: 'Banking', score: 30 },
        { field: 'com_risk', value: 'Stable', score: 25 },
        { field: 'com_company', value: 'PublicBanks', score: 35 },
        { field: 'com_study', value: 'No', score: 10 },
    ],
    'professional-certifications': [
        { field: 'com_professional', value: 'Yes', score: 35 },
        { field: 'com_study', value: 'Yes', score: 25 },
        { field: 'com_specialization', value: 'Accounting', score: 20 },
        { field: 'com_specialization', value: 'CorpFinance', score: 20 },
    ],
    'fintech-startup': [
        { field: 'com_specialization', value: 'Markets', score: 20 },
        { field: 'com_specialization', value: 'CorpFinance', score: 20 },
        { field: 'com_risk', value: 'Dynamic', score: 35 },
        { field: 'com_company', value: 'InvestmentBanks', score: 25 },
    ],
    'ssc-cgl-officer': [
        { field: 'com_specialization', value: 'Taxation', score: 25 },
        { field: 'com_specialization', value: 'Accounting', score: 20 },
        { field: 'com_risk', value: 'Stable', score: 30 },
        { field: 'com_study', value: 'No', score: 25 },
    ],
    'business-analyst': [
        { field: 'com_specialization', value: 'CorpFinance', score: 25 },
        { field: 'com_specialization', value: 'Accounting', score: 15 },
        { field: 'com_risk', value: 'Dynamic', score: 20 },
        { field: 'com_risk', value: 'Stable', score: 20 },
        { field: 'com_company', value: 'CorporateFin', score: 30 },
        { field: 'com_company', value: 'Big4', score: 25 },
    ],

    // === SCIENCES BRANCH ===
    'isro-scientist': [
        { field: 'sci_domain', value: 'PCM', score: 25 },
        { field: 'sci_domain', value: 'CompSci', score: 20 },
        { field: 'sci_interest', value: 'GovtLabs', score: 35 },
        { field: 'sci_study', value: 'Yes', score: 20 },
        { field: 'sci_work', value: 'Lab', score: 25 },
    ],
    'drdo-scientist': [
        { field: 'sci_domain', value: 'CompSci', score: 25 },
        { field: 'sci_domain', value: 'PCM', score: 20 },
        { field: 'sci_interest', value: 'GovtLabs', score: 35 },
        { field: 'sci_study', value: 'Yes', score: 20 },
        { field: 'sci_work', value: 'Lab', score: 25 },
    ],
    'phd-india': [
        { field: 'sci_interest', value: 'ResearchTeaching', score: 30 },
        { field: 'sci_study', value: 'Yes', score: 35 },
        { field: 'sci_work', value: 'Lab', score: 20 },
        { field: 'sci_work', value: 'Classroom', score: 20 },
        { field: 'sci_budget', value: 'No', score: 20 },
    ],
    'phd-abroad': [
        { field: 'sci_interest', value: 'ResearchTeaching', score: 25 },
        { field: 'sci_interest', value: 'PrivateRD', score: 20 },
        { field: 'sci_study', value: 'Yes', score: 30 },
        { field: 'sci_budget', value: 'Yes', score: 35 },
    ],
    'government-lecturer': [
        { field: 'sci_interest', value: 'ResearchTeaching', score: 30 },
        { field: 'sci_study', value: 'Yes', score: 25 },
        { field: 'sci_work', value: 'Classroom', score: 35 },
    ],
    'ms-data-science-ai': [
        { field: 'sci_domain', value: 'CompSci', score: 35 },
        { field: 'sci_interest', value: 'AppliedAnalytics', score: 30 },
        { field: 'sci_interest', value: 'PrivateRD', score: 20 },
        { field: 'sci_study', value: 'Yes', score: 20 },
    ],

    // === ARTS & HUMANITIES BRANCH ===
    'ias-ips-ifs-officer': [
        { field: 'art_domain', value: 'Economics', score: 15 },
        { field: 'art_domain', value: 'History', score: 15 },
        { field: 'art_interest', value: 'CivilServices', score: 35 },
        { field: 'art_risk', value: 'Stable', score: 30 },
        { field: 'art_study', value: 'Yes', score: 25 },
    ],
    'ui-ux-designer': [
        { field: 'art_domain', value: 'FineArts', score: 30 },
        { field: 'art_domain', value: 'Psychology', score: 25 },
        { field: 'art_interest', value: 'CreativeDesign', score: 35 },
        { field: 'art_risk', value: 'Corporate', score: 25 },
        { field: 'art_risk', value: 'Creative', score: 20 },
        { field: 'art_work', value: 'Flexible', score: 20 },
    ],
    'content-creator': [
        { field: 'art_domain', value: 'Literature', score: 25 },
        { field: 'art_domain', value: 'FineArts', score: 20 },
        { field: 'art_interest', value: 'Writing', score: 30 },
        { field: 'art_risk', value: 'Creative', score: 35 },
        { field: 'art_work', value: 'Flexible', score: 30 },
    ],
    'social-impact-tech': [
        { field: 'art_domain', value: 'Psychology', score: 25 },
        { field: 'art_interest', value: 'Counseling', score: 30 },
        { field: 'art_risk', value: 'Stable', score: 25 },
        { field: 'art_work', value: 'Flexible', score: 20 },
    ],
    'llb-law': [
        { field: 'art_domain', value: 'Economics', score: 25 },
        { field: 'art_domain', value: 'Literature', score: 15 },
        { field: 'art_interest', value: 'Academia', score: 20 },
        { field: 'art_work', value: 'Dynamic', score: 30 },
        { field: 'art_study', value: 'Yes', score: 20 },
    ],
    'freelance-agency': [
        { field: 'art_domain', value: 'FineArts', score: 20 },
        { field: 'art_domain', value: 'Literature', score: 20 },
        { field: 'art_interest', value: 'CreativeDesign', score: 25 },
        { field: 'art_interest', value: 'Writing', score: 25 },
        { field: 'art_risk', value: 'Creative', score: 30 },
        { field: 'art_risk', value: 'Corporate', score: 20 },
        { field: 'art_work', value: 'Flexible', score: 25 },
    ]
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
    const positiveScore = rules.filter(r => r.score > 0).reduce((sum, r) => sum + r.score, 0);
    return positiveScore > 0 ? positiveScore : 100;
}

/**
 * Main scoring function
 * Calculates match percentages for relevant careers based on the selected degree branch.
 * @param {Object} answers - { degree, ... }
 * @returns {Array} - Top 3 recommended careers with match%
 */
function calculateQuizResults(answers) {
    const degree = answers.degree || 'Engineering';
    const candidateIds = DEGREE_CANDIDATE_CAREERS[degree] || DEGREE_CANDIDATE_CAREERS['Engineering'];

    const results = candidateIds.map(careerId => {
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

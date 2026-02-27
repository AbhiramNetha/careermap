const mongoose = require('mongoose');

const RoadmapStepSchema = new mongoose.Schema({
    month: { type: String, required: true },    // e.g. "Month 1-2"
    skills: [String],
    tools: [String],
    projects: [String],
    interviewPrep: [String],
}, { _id: false });

const SalarySchema = new mongoose.Schema({
    fresher: { type: String, required: true },  // e.g. "₹4-8 LPA"
    threeYears: { type: String },
    fiveYears: { type: String },
    fresherMin: { type: Number },               // numeric for charts
    fresherMax: { type: Number },
    threeYearsMin: { type: Number },
    threeYearsMax: { type: Number },
    fiveYearsMin: { type: Number },
    fiveYearsMax: { type: Number },
}, { _id: false });

const CareerSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },   // slug like "data-analyst"
    name: { type: String, required: true },
    category: {
        type: String,
        enum: ['private', 'higher-studies', 'government', 'entrepreneurship'],
        required: true,
    },
    subCategory: String,                    // e.g. "Data & Analytics"
    overview: { type: String, required: true },
    salary: SalarySchema,
    demandLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Very High'] },
    skills: [String],
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High'] },
    studyRequired: { type: Boolean, default: false },
    studyDuration: String,                  // e.g. "6-12 months"
    preparationTime: String,
    competitionLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Very High'] },
    stabilityLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Very High'] },
    growthPotential: { type: String, enum: ['Low', 'Medium', 'High', 'Very High'] },
    workLifeBalance: { type: String, enum: ['Low', 'Medium', 'High'] },
    whoShouldChoose: [String],
    roadmap: [RoadmapStepSchema],
    eligibleBranches: [String],             // branches with HIGH compatibility
    moderateBranches: [String],             // branches needing skill transition
    quizScoring: {
        type: mongoose.Schema.Types.Mixed,    // scoring rules stored as JSON
    },
    relatedCareers: [String],               // career IDs
    isTrending: { type: Boolean, default: false },
    tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('Career', CareerSchema);

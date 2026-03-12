const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Career = sequelize.define('Career', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.ENUM('private', 'higher-studies', 'government', 'entrepreneurship'),
        allowNull: false,
    },
    subCategory: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    overview: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    salary: {
        type: DataTypes.JSONB,     // { fresher, threeYears, fiveYears, fresherMin, fresherMax, ... }
        defaultValue: {},
    },
    demandLevel: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    skills: {
        type: DataTypes.JSONB,     // string array
        defaultValue: [],
    },
    riskLevel: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    studyRequired: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    studyDuration: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    preparationTime: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    competitionLevel: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    stabilityLevel: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    growthPotential: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    workLifeBalance: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    whoShouldChoose: {
        type: DataTypes.JSONB,     // string array
        defaultValue: [],
    },
    roadmap: {
        type: DataTypes.JSONB,     // array of { month, skills, tools, projects, interviewPrep }
        defaultValue: [],
    },
    eligibleBranches: {
        type: DataTypes.JSONB,
        defaultValue: [],
    },
    moderateBranches: {
        type: DataTypes.JSONB,
        defaultValue: [],
    },
    quizScoring: {
        type: DataTypes.JSONB,
        defaultValue: {},
    },
    relatedCareers: {
        type: DataTypes.JSONB,
        defaultValue: [],
    },
    isTrending: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    tags: {
        type: DataTypes.JSONB,
        defaultValue: [],
    },
}, {
    tableName: 'careers',
    timestamps: true,
});

module.exports = Career;

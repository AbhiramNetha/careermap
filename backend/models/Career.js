const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Career = sequelize.define('Career', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: [['Private Sector', 'Government', 'Higher Studies', 'Entrepreneurship']],
        },
    },
    salaryRange: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'salary_range',
    },
    demandLevel: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'demand_level',
        validate: {
            isIn: [['Very High', 'High', 'Medium', 'Low']],
        },
    },
    examRoute: {
        type: DataTypes.STRING(150),
        allowNull: true,
        field: 'exam_route',
    },
    duration: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    riskLevel: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'risk_level',
    },
    capitalNeeded: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'capital_needed',
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    icon: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    isTrending: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_trending',
    },
    skills: {
        type: DataTypes.JSONB,
        defaultValue: [],
    },
    branches: {
        type: DataTypes.JSONB,
        defaultValue: [],
    },
}, {
    tableName: 'careers',
    timestamps: true,
    underscored: true,
});

module.exports = Career;

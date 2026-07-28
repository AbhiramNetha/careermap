const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Opportunity = sequelize.define('Opportunity', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    company: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('job', 'internship', 'walkin'),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    requirements: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    salary: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    applyLink: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    skills: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    walkinDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    clickCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    experienceLevel: {
        type: DataTypes.STRING,
        defaultValue: 'fresher',
    },
}, {
    tableName: 'opportunities',
    timestamps: true,
});

module.exports = Opportunity;

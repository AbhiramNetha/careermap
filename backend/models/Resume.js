const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Resume = sequelize.define('Resume', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.STRING, // Firebase UID
        allowNull: false,
        index: true
    },
    title: {
        type: DataTypes.STRING,
        defaultValue: 'My Resume'
    },
    template: {
        type: DataTypes.STRING,
        defaultValue: 'minimalist'
    },
    styles: {
        type: DataTypes.JSONB,
        defaultValue: {
            fontFamily: 'Inter',
            fontSize: '11pt',
            lineHeight: '1.4',
            primaryColor: '#0f172a'
        }
    },
    data: {
        type: DataTypes.JSONB, // Complete resume state (contact, education, jobs, projects, skills, etc.)
        defaultValue: {}
    }
}, {
    tableName: 'resumes',
    timestamps: true
});

module.exports = Resume;

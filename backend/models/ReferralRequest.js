const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReferralRequest = sequelize.define('ReferralRequest', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    collegeId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    studentId: {
        type: DataTypes.STRING, // Firebase UID
        allowNull: false
    },
    studentName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    targetCompany: {
        type: DataTypes.STRING,
        allowNull: false
    },
    targetRole: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    status: {
        type: DataTypes.ENUM('open', 'in_progress', 'fulfilled'),
        allowNull: false,
        defaultValue: 'open'
    }
}, {
    tableName: 'referral_requests',
    timestamps: true
});

module.exports = ReferralRequest;

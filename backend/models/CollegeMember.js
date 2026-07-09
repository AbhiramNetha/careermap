const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CollegeMember = sequelize.define('CollegeMember', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.STRING, // Firebase User UID
        allowNull: false,
        unique: true
    },
    collegeId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('student', 'alumnus', 'admin'),
        allowNull: false,
        defaultValue: 'student'
    },
    verificationMethod: {
        type: DataTypes.STRING, // 'domain' | 'manual'
        allowNull: false,
        defaultValue: 'domain'
    },
    verifiedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    batchYear: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    branch: {
        type: DataTypes.STRING,
        allowNull: true
    },
    currentCompany: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    },
    currentRole: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    },
    availabilityTags: {
        type: DataTypes.JSONB, // e.g. ['referrals', 'mentorship', 'chat']
        defaultValue: []
    }
}, {
    tableName: 'college_members',
    timestamps: true
});

module.exports = CollegeMember;

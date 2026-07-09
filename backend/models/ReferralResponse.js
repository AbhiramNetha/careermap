const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReferralResponse = sequelize.define('ReferralResponse', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    requestId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    alumnusId: {
        type: DataTypes.STRING, // Firebase UID
        allowNull: false
    },
    alumnusName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'referral_responses',
    timestamps: true
});

module.exports = ReferralResponse;

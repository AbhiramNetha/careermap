const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const College = sequelize.define('College', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    domain: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    logoUrl: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    bannerUrl: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    verifiedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'colleges',
    timestamps: true
});

module.exports = College;

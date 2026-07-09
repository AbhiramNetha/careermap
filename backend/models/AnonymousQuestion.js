const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AnonymousQuestion = sequelize.define('AnonymousQuestion', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    collegeId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'anonymous_questions',
    timestamps: true
});

module.exports = AnonymousQuestion;

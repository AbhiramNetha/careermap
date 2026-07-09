const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuestionAnswer = sequelize.define('QuestionAnswer', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    questionId: {
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
    alumnusRole: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    alumnusCompany: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    upvotes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'question_answers',
    timestamps: true
});

module.exports = QuestionAnswer;

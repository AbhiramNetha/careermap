const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuizQuestion = sequelize.define('QuizQuestion', {
    step: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    field: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    question: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subtitle: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    options: {
        type: DataTypes.JSONB,   // array of { id, label, value }
        defaultValue: [],
    },
}, {
    tableName: 'quiz_questions',
    timestamps: true,
});

module.exports = QuizQuestion;

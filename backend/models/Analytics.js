const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DailyStats = sequelize.define('DailyStats', {
    date: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    visitors: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    pageViews: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    courseClicks: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    newUsers: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    tableName: 'daily_stats',
    timestamps: true,
});

const CourseClick = sequelize.define('CourseClick', {
    courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    courseTitle: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    clickedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    userEmail: {
        type: DataTypes.STRING,
        defaultValue: 'anonymous',
    },
    referrer: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
}, {
    tableName: 'course_clicks',
    timestamps: true,
});

module.exports = { DailyStats, CourseClick };

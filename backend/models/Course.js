const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: '₹',
    },
    affiliateLink: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: 'Other',
    },
    platform: {
        type: DataTypes.STRING,
        defaultValue: 'Udemy',
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 4.5,
    },
    totalStudents: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    clickCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    tableName: 'courses',
    timestamps: true,
});

module.exports = Course;

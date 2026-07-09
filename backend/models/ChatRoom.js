const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatRoom = sequelize.define('ChatRoom', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    collegeId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING, // 'general' | 'placements' | 'internships' | 'higher-studies' | 'government' | 'startup'
        allowNull: false,
        defaultValue: 'general'
    }
}, {
    tableName: 'chat_rooms',
    timestamps: true
});

module.exports = ChatRoom;

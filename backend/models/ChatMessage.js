const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatMessage = sequelize.define('ChatMessage', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    roomId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    senderId: {
        type: DataTypes.STRING, // Firebase UID
        allowNull: false
    },
    senderName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senderAvatar: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'chat_messages',
    timestamps: true
});

module.exports = ChatMessage;

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db').default;

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    type: {
        type: DataTypes.ENUM(
            'application_status',
            'new_vacancy',
            'message',
            'reminder',
            'review_received',
            'system'
        ),
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    data: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    readAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'notifications',
    timestamps: true,
    indexes: [
        { fields: ['userId'] },
        { fields: ['isRead'] },
        { fields: ['type'] },
    ],
});

module.exports = Notification;
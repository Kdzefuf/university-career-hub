const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db').default;

const Interview = sequelize.define('Interview', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    applicationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'applications',
            key: 'id',
        },
    },
    employerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'employer_profiles',
            key: 'id',
        },
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'student_profiles',
            key: 'id',
        },
    },
    scheduledAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    duration: {
        type: DataTypes.INTEGER,
        defaultValue: 30,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    meetingLink: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    interviewType: {
        type: DataTypes.ENUM('phone', 'video', 'onsite'),
        defaultValue: 'onsite',
    },
    status: {
        type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'rescheduled', 'no_show'),
        defaultValue: 'scheduled',
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    feedback: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'interviews',
    timestamps: true,
    indexes: [
        { fields: ['applicationId'] },
        { fields: ['scheduledAt'] },
        { fields: ['status'] },
    ],
});

module.exports = Interview;
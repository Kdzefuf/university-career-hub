const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Application = sequelize.define('Application', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    vacancyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'vacancies',
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
    status: {
        type: DataTypes.ENUM('pending', 'viewed', 'shortlisted', 'rejected', 'accepted', 'withdrawn'),
        defaultValue: 'pending',
        allowNull: false,
    },
    coverLetter: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    resumeUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    additionalDocuments: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
    submittedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    reviewedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    employerNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    rejectionReason: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'applications',
    timestamps: true,
    indexes: [
        { fields: ['status'] },
        { fields: ['vacancyId'] },
        { fields: ['studentId'] },
    ],
});

module.exports = Application;
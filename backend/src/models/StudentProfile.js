const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db').default;

const StudentProfile = sequelize.define('StudentProfile', {
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
    major: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    yearOfStudy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    gpa: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    skills: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    resumeUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    portfolioUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    desiredPosition: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    availability: {
        type: DataTypes.ENUM('full-time', 'part-time', 'internship', 'project'),
        allowNull: true,
    },
}, {
    tableName: 'student_profiles',
    timestamps: true,
});

module.exports = StudentProfile;
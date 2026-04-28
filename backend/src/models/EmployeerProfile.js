const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const EmployerProfile = sequelize.define('EmployerProfile', {
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
    companyName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    companyDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    companyWebsite: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    industry: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    companySize: {
        type: DataTypes.ENUM('1-10', '11-50', '51-200', '201-500', '500+'),
        allowNull: true,
    },
    contactEmail: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    contactPhone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    logoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'employer_profiles',
    timestamps: true,
});

module.exports = EmployerProfile;
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Vacancy = sequelize.define('Vacancy', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    employerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'employer_profiles',
            key: 'id',
        },
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    requirements: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
    responsibilities: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    workType: {
        type: DataTypes.ENUM('onsite', 'remote', 'hybrid'),
        defaultValue: 'onsite',
    },
    employmentType: {
        type: DataTypes.ENUM('full-time', 'part-time', 'internship', 'project', 'temporary'),
        allowNull: false,
    },
    salaryMin: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    salaryMax: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: 'RUB',
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    applicationDeadline: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('draft', 'active', 'closed', 'paused'),
        defaultValue: 'draft',
    },
    viewsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    applicationsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    tableName: 'vacancies',
    timestamps: true,
    indexes: [
        { fields: ['status'] },
        { fields: ['employmentType'] },
        { fields: ['workType'] },
    ],
});

module.exports = Vacancy;
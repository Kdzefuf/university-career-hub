const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db').default;

const SavedVacancy = sequelize.define('SavedVacancy', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'student_profiles',
            key: 'id',
        },
    },
    vacancyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'vacancies',
            key: 'id',
        },
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'saved_vacancies',
    timestamps: true,
    indexes: [
        { fields: ['studentId'] },
        { fields: ['vacancyId'] },
        { unique: true, fields: ['studentId', 'vacancyId'] },
    ],
});

module.exports = SavedVacancy;
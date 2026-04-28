const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db').default;

const VacancySkill = sequelize.define('VacancySkill', {
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
    skillId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'skills',
            key: 'id',
        },
    },
    isRequired: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    proficiencyLevel: {
        type: DataTypes.ENUM('beginner', 'intermediate', 'advanced', 'expert'),
        defaultValue: 'intermediate',
    },
}, {
    tableName: 'vacancy_skills',
    timestamps: true,
    indexes: [
        { fields: ['vacancyId'] },
        { fields: ['skillId'] },
        { unique: true, fields: ['vacancyId', 'skillId'] },
    ],
});

module.exports = VacancySkill;
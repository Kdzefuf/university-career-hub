const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db').default;

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    targetUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    applicationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'applications',
            key: 'id',
        },
    },
    vacancyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'vacancies',
            key: 'id',
        },
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    reviewType: {
        type: DataTypes.ENUM('employer_to_student', 'student_to_employer', 'student_to_vacancy'),
        allowNull: false,
    },
    isVisible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'reviews',
    timestamps: true,
    indexes: [
        { fields: ['targetUserId'] },
        { fields: ['reviewType'] },
    ],
});

module.exports = Review;
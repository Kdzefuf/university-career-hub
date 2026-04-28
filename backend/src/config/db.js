const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: console.log,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('База данных подключена успешно.');
    } catch (error) {
        console.error('Не удалось подключиться к базе данных:', error.message);
        throw error;
    }
};

module.exports = { sequelize, testConnection };
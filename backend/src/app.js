const express = require('express');
const dotenv = require('dotenv');
const { testConnection } = require('./config/db');

dotenv.config();

require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Сервер работает нормально',
        timestamp: new Date().toISOString(),
    });
});

const startServer = async () => {
    try {
        await testConnection();

        const { sequelize } = require('./config/db');
        await sequelize.sync({ alter: true });
        console.log('База данных синхронизирована успешно.');

        app.listen(PORT, () => {
            console.log(`Сервер запущен на http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Сервер не удалось запустить:', error.message);
        process.exit(1);
    }
};

startServer();

module.exports = app;
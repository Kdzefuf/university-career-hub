const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { testConnection } = require('./config/db');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const path = require('path');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const vacancyRoutes = require('./routes/vacancyRoutes');

require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'University Career Hub API',
            version: '1.0.0',
            description: 'API для University Career Hub - платформы для студентов, чтобы находить временные работы и стажировки',
            contact: {
                name: 'Поддержка Университетского карьерного центра',
                email: 'support@university.edu',
            },
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Сервер разработки',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: [path.join(__dirname, 'utils', '*.js')],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Сервер работает нормально',
        timestamp: new Date().toISOString(),
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/vacancies', vacancyRoutes);

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Добро пожаловать в University Career Hub API',
        documentation: '/api-docs',
        health: '/health',
    });
});

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
    try {
        await testConnection();

        const { sequelize } = require('./config/db');
        await sequelize.sync({ alter: true });
        console.log('База данных синхронизирована успешно.');

        app.listen(PORT, () => {
            console.log(`Сервер запущен на http://localhost:${PORT}`);
            console.log(`Документация API доступна по адресу http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('Не удалось запустить сервер:', error.message);
        process.exit(1);
    }
};

startServer();

module.exports = app;
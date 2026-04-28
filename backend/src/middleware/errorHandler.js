const { validationResult } = require('express-validator');

class AppError extends Error {
    constructor(statusCode, message, errorCode, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.details = details;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((err) => ({
            field: err.path,
            message: err.msg,
            value: err.value,
            location: err.location,
        }));

        return next(
            new AppError(
                400,
                'Валидация данных не прошла. Проверьте правильность введенных данных.',
                'VALIDATION_ERROR',
                formattedErrors
            )
        );
    }
    next();
};

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
    let message = err.message || 'An unexpected error occurred';
    let details = err.details || null;

    if (err.name === 'SequelizeValidationError') {
        statusCode = 400;
        errorCode = 'SEQUELIZE_VALIDATION_ERROR';
        details = err.errors.map((e) => ({
            field: e.path,
            message: e.message,
            type: e.type,
        }));
        message = 'Валидация базы данных не прошла.';
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409;
        errorCode = 'DUPLICATE_ENTRY';
        details = {
            field: err.errors[0]?.path,
            message: 'Запись с таким значением уже существует.',
        };
        message = 'Обнаружено дублирование записи.';
    }

    if (err.name === 'SequelizeForeignKeyConstraintError') {
        statusCode = 400;
        errorCode = 'FOREIGN_KEY_VIOLATION';
        message = 'Ссылка на существующую запись не существует.';
    }

    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        errorCode = 'INVALID_TOKEN';
        message = 'Неверный токен.';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        errorCode = 'TOKEN_EXPIRED';
        message = 'Токен истек. Пожалуйста, войдите снова.';
    }

    console.error(`[${errorCode}] ${message}`, {
        statusCode,
        path: req.path,
        method: req.method,
        details,
        stack: err.stack,
    });

    res.status(statusCode).json({
        success: false,
        error: {
            code: errorCode,
            message,
            details,
            suggestion: getSuggestion(errorCode),
            timestamp: new Date().toISOString(),
            path: req.path,
        },
    });
};

const getSuggestion = (errorCode) => {
    const suggestions = {
        VALIDATION_ERROR: 'Пожалуйста, проверьте введенные данные и убедитесь, что все поля заполнены правильно.',
        SEQUELIZE_VALIDATION_ERROR: 'Предоставленные данные не соответствуют требованиям базы данных.',
        DUPLICATE_ENTRY: 'Пожалуйста, используйте другое значение для конфликтующего поля.',
        FOREIGN_KEY_VIOLATION: 'Убедитесь, что ссылка на существующую запись существует перед созданием этой записи.',
        NOT_FOUND: 'Запрашиваемый ресурс не существует. Пожалуйста, проверьте URL или ID.',
        UNAUTHORIZED: 'Пожалуйста, войдите, чтобы получить доступ к этому ресурсу.',
        INVALID_TOKEN: 'Пожалуйста, войдите снова, чтобы получить новый токен.',
        TOKEN_EXPIRED: 'Ваша сессия истекла. Пожалуйста, войдите снова.',
        FORBIDDEN: 'У вас нет разрешения на выполнение этого действия.',
        INTERNAL_SERVER_ERROR: 'Пожалуйста, попробуйте снова позже или свяжитесь с поддержкой, если проблема сохраняется.',
    };
    return suggestions[errorCode] || 'Пожалуйста, попробуйте снова позже или свяжитесь с поддержкой, если проблема сохраняется.';
};

const notFoundHandler = (req, res, next) => {
    next(
        new AppError(
            404,
            `Маршрут ${req.originalUrl} не найден`,
            'NOT_FOUND',
            { path: req.originalUrl, method: req.method }
        )
    );
};

module.exports = {
    AppError,
    handleValidationErrors,
    errorHandler,
    notFoundHandler,
};
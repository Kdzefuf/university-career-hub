const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { AppError } = require('./errorHandler');

const protect = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token && req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            throw new AppError(
                401,
                'Вы не авторизованы. Пожалуйста, войдите, чтобы получить доступ к этому ресурсу.',
                'UNAUTHORIZED'
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] },
        });

        if (!user) {
            throw new AppError(
                401,
                'Пользователь, связанный с этим токеном, больше не существует.',
                'USER_NOT_FOUND'
            );
        }

        if (!user.isActive) {
            throw new AppError(
                403,
                'Ваш аккаунт деактивирован. Пожалуйста, свяжитесь с поддержкой для получения помощи.',
                'ACCOUNT_DEACTIVATED'
            );
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(
                new AppError(
                    401,
                    'Вы не авторизованы. Пожалуйста, войдите, чтобы получить доступ к этому ресурсу.',
                    'UNAUTHORIZED'
                )
            );
        }

        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    403,
                    `У вас нет разрешения на выполнение этого действия. Требуемые роли: ${roles.join(', ')}`,
                    'FORBIDDEN',
                    { requiredRoles: roles, userRole: req.user.role }
                )
            );
        }

        next();
    };
};

module.exports = { protect, authorize };
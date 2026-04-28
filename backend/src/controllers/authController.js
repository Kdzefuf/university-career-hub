const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, StudentProfile, EmployerProfile } = require('../models');
const { AppError } = require('../middleware/errorHandler');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

const register = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, phone, role } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new AppError(
                409,
                'Пользователь с таким email уже существует.',
                'USER_EXISTS',
                { field: 'email', value: email }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phone,
            role: role || 'student',
        });

        if (user.role === 'student') {
            await StudentProfile.create({ userId: user.id });
        } else if (user.role === 'employer') {
            await EmployerProfile.create({ userId: user.id });
        }

        const token = generateToken(user.id);

        res.status(201).json({
            success: true,
            message: 'Пользователь зарегистрирован успешно.',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new AppError(
                400,
                'Укажите email и пароль для входа.',
                'MISSING_CREDENTIALS',
                { missing: [!email ? 'email' : null, !password ? 'password' : null].filter(Boolean) }
            );
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new AppError(
                401,
                'Неверный email или пароль.',
                'INVALID_CREDENTIALS'
            );
        }

        if (!user.isActive) {
            throw new AppError(
                403,
                'Ваш аккаунт был деактивирован. Пожалуйста, свяжитесь с поддержкой.',
                'ACCOUNT_DEACTIVATED'
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AppError(
                401,
                'Неверный email или пароль.',
                'INVALID_CREDENTIALS'
            );
        }

        user.lastLogin = new Date();
        await user.save();

        const token = generateToken(user.id);

        res.status(200).json({
            success: true,
            message: 'Вход выполнен успешно.',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
            include: [
                { model: StudentProfile, as: 'studentProfile' },
                { model: EmployerProfile, as: 'employerProfile' },
            ],
        });

        res.status(200).json({
            success: true,
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const { firstName, lastName, phone } = req.body;

        const user = await User.findByPk(req.user.id);

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone) user.phone = phone;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Профиль обновлен успешно.',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findByPk(req.user.id);

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new AppError(
                401,
                'Текущий пароль неверен.',
                'INVALID_PASSWORD'
            );
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Пароль успешно изменен.',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
};
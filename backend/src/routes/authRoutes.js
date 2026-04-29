const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/errorHandler');

const router = express.Router();

const registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Пожалуйста, предоставьте действительный адрес электронной почты.')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Пароль должен содержать не менее 6 символов.')
        .matches(/\d/)
        .withMessage('Пароль должен содержать хотя бы одно число.'),
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('Имя обязательно для заполнения.')
        .isLength({ max: 50 })
        .withMessage('Имя не может превышать 50 символов.'),
    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Фамилия обязательна для заполнения.')
        .isLength({ max: 50 })
        .withMessage('Фамилия не может превышать 50 символов.'),
    body('phone')
        .optional()
        .matches(/^\+?[\d\s-()]+$/)
        .withMessage('Пожалуйста, предоставьте действительный номер телефона.'),
    body('role')
        .optional()
        .isIn(['student', 'employer'])
        .withMessage('Роль должна быть либо "student", либо "employer".'),
    handleValidationErrors,
];

const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Пожалуйста, предоставьте действительный адрес электронной почты.')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Пароль обязателен для заполнения.'),
    handleValidationErrors,
];

const updateProfileValidation = [
    body('firstName')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Имя не может превышать 50 символов.'),
    body('lastName')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Фамилия не может превышать 50 символов.'),
    body('phone')
        .optional()
        .matches(/^\+?[\d\s-()]+$/)
        .withMessage('Пожалуйста, предоставьте действительный номер телефона.'),
    handleValidationErrors,
];

const changePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Текущий пароль обязателен для заполнения.'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('Новый пароль должен содержать не менее 6 символов.')
        .matches(/\d/)
        .withMessage('Новый пароль должен содержать хотя бы одно число.'),
    handleValidationErrors,
];

// Routes
/**
 * @route POST /api/auth/register
 * @description Регистрация нового пользователя
 * @access Public
 */
router.post('/register', registerValidation, authController.register);

/**
 * @route POST /api/auth/login
 * @description Вход пользователя
 * @access Public
 */
router.post('/login', loginValidation, authController.login);

/**
 * @route GET /api/auth/profile
 * @description Получить профиль текущего пользователя
 * @access Private
 */
router.get('/profile', protect, authController.getProfile);

/**
 * @route PUT /api/auth/profile
 * @description Оновить профиль пользователя
 * @access Private
 */
router.put('/profile', protect, updateProfileValidation, authController.updateProfile);

/**
 * @route PUT /api/auth/change-password
 * @description Изменить пароль пользователя
 * @access Private
 */
router.put('/change-password', protect, changePasswordValidation, authController.changePassword);

module.exports = router;
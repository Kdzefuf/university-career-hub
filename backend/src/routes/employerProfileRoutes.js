const express = require('express');
const { body } = require('express-validator');
const employerProfileController = require('../controllers/employerProfileController');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/errorHandler');

const router = express.Router();

const createOrUpdateProfileValidation = [
    body('companyName')
        .trim()
        .notEmpty()
        .withMessage('Название компании обязательно для заполнения.')
        .isLength({ max: 200 })
        .withMessage('Название компании не может превышать 200 символов.'),
    body('companyDescription')
        .optional()
        .trim(),
    body('companyWebsite')
        .optional()
        .trim()
        .isURL()
        .withMessage('Пожалуйста, предоставьте действительный URL веб-сайта.'),
    body('industry')
        .optional()
        .trim(),
    body('companySize')
        .optional()
        .isIn(['1-10', '11-50', '51-200', '201-500', '500+'])
        .withMessage('Неверный размер компании.'),
    body('contactEmail')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Пожалуйста, предоставьте действительный адрес электронной почты.'),
    body('contactPhone')
        .optional()
        .trim()
        .matches(/^\+?[\d\s-()]+$/)
        .withMessage('Пожалуйста, предоставьте действительный номер телефона.'),
    body('logoUrl')
        .optional()
        .trim()
        .isURL()
        .withMessage('Пожалуйста, предоставьте действительный URL логотипа.'),
    handleValidationErrors,
];

// Routes
/**
 * @route GET /api/employer/profile
 * @description Получить профиль текущего работодателя
 * @access Private (Employers only)
 */
router.get('/profile', protect, authorize('employer', 'admin'), employerProfileController.getProfile);

/**
 * @route POST /api/employer/profile
 * @description Создать или обновить профиль работодателя
 * @access Private (Employers only)
 */
router.post('/profile', protect, authorize('employer', 'admin'), createOrUpdateProfileValidation, employerProfileController.createOrUpdateProfile);

module.exports = router;
const express = require('express');
const { body, query, param } = require('express-validator');
const vacancyController = require('../controllers/vacancyController');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/errorHandler');

const router = express.Router();

const createVacancyValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Заголовок обязателен для заполнения.')
        .isLength({ max: 200 })
        .withMessage('Заголовок не может превышать 200 символов.'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Описание обязательно для заполнения.'),
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Местоположение обязательно для заполнения.'),
    body('employmentType')
        .isIn(['full-time', 'part-time', 'internship', 'project', 'temporary'])
        .withMessage('Неверный тип занятости.'),
    body('workType')
        .optional()
        .isIn(['onsite', 'remote', 'hybrid'])
        .withMessage('Неверный тип работы.'),
    body('requirements')
        .optional()
        .isArray()
        .withMessage('Требования должны быть массивом.'),
    body('responsibilities')
        .optional()
        .isArray()
        .withMessage('Обязанности должны быть массивом.'),
    body('salaryMin')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Минимальная зарплата должна быть положительным числом.'),
    body('salaryMax')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Максимальная зарплата должна быть положительным числом.'),
    handleValidationErrors,
];

const getVacanciesValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Страница должна быть положительным целым числом.'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Лимит должен быть между 1 и 100.'),
    query('employmentType')
        .optional()
        .isIn(['full-time', 'part-time', 'internship', 'project', 'temporary'])
        .withMessage('Неверный тип занятости.'),
    query('workType')
        .optional()
        .isIn(['onsite', 'remote', 'hybrid'])
        .withMessage('Неверный тип работы.'),
    handleValidationErrors,
];

const paramIdValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Неверный ID вакансии.'),
    handleValidationErrors,
];

// Routes
/**
 * @route GET /api/vacancies
 * @description Поиск вакансий с фильтрацией и пагинацией
 * @access Public
 */
router.get('/', getVacanciesValidation, vacancyController.getAllVacancies);

/**
 * @route GET /api/vacancies/saved
 * @description Получить сохраненные вакансии для текущего студента
 * @access Private (Students only)
 */
router.get('/saved', protect, authorize('student'), vacancyController.getSavedVacancies);

/**
 * @route GET /api/vacancies/:id
 * @description Получить одну вакансию по ID
 * @access Public
 */
router.get('/:id', paramIdValidation, vacancyController.getVacancyById);

/**
 * @route POST /api/vacancies
 * @description Создать новую вакансию
 * @access Private (Employers only)
 */
router.post('/', protect, authorize('employer', 'admin'), createVacancyValidation, vacancyController.createVacancy);

/**
 * @route PUT /api/vacancies/:id
 * @description Обновить вакансию
 * @access Private (Employers only)
 */
router.put('/:id', protect, authorize('employer', 'admin'), paramIdValidation, vacancyController.updateVacancy);

/**
 * @route DELETE /api/vacancies/:id
 * @description Удалить вакансию
 * @access Private (Employers only)
 */
router.delete('/:id', protect, authorize('employer', 'admin'), paramIdValidation, vacancyController.deleteVacancy);

/**
 * @route POST /api/vacancies/:id/save
 * @description Сохранить/закладка вакансии
 * @access Private (Students only)
 */
router.post('/:id/save', protect, authorize('student'), paramIdValidation, vacancyController.saveVacancy);

module.exports = router;
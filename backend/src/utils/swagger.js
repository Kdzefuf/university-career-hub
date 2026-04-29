/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         email:
 *           type: string
 *           format: email
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         role:
 *           type: string
 *           enum: [student, employer, admin]
 *         isActive:
 *           type: boolean
 *     Vacancy:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         location:
 *           type: string
 *         employmentType:
 *           type: string
 *           enum: [full-time, part-time, internship, project, temporary]
 *         workType:
 *           type: string
 *           enum: [onsite, remote, hybrid]
 *         status:
 *           type: string
 *           enum: [draft, active, closed, paused]
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *             message:
 *               type: string
 *             details:
 *               type: object
 *             suggestion:
 *               type: string
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [student, employer]
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *       400:
 *         description: Ошибка валидации
 *       409:
 *         description: Пользователь уже существует
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Вход выполнен успешно
 *       401:
 *         description: Неверные учетные данные
 */

/**
 * @swagger
 * tags:
 *   name: Vacancies
 *   description: Управление вакансиями
 */

/**
 * @swagger
 * /api/vacancies:
 *   get:
 *     summary: Получить все вакансии
 *     tags: [Vacancies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: employmentType
 *         schema:
 *           type: string
 *           enum: [full-time, part-time, internship, project, temporary]
 *       - in: query
 *         name: workType
 *         schema:
 *           type: string
 *           enum: [onsite, remote, hybrid]
 *     responses:
 *       200:
 *         description: Список вакансий
 *       400:
 *         description: Ошибка валидации
 *
 *   post:
 *     summary: Создать новую вакансию
 *     tags: [Vacancies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - location
 *               - employmentType
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               employmentType:
 *                 type: string
 *               workType:
 *                 type: string
 *               salaryMin:
 *                 type: integer
 *               salaryMax:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Вакансия создана
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Запрещено (не работодатель)
 */

/**
 * @swagger
 * /api/vacancies/{id}:
 *   get:
 *     summary: Получить вакансию по ID
 *     tags: [Vacancies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Детали вакансии
 *       404:
 *         description: Вакансия не найдена
 */

module.exports = {};
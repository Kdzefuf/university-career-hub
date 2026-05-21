const { Vacancy, EmployerProfile, Application, Skill, VacancySkill, SavedVacancy } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

const getAllVacancies = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            employmentType,
            workType,
            location,
            status = 'active',
            minSalary,
            maxSalary,
            sortBy = 'createdAt',
            order = 'DESC',
        } = req.query;

        const offset = (page - 1) * limit;
        const where = { status };

        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } },
            ];
        }

        if (employmentType) where.employmentType = employmentType;
        if (workType) where.workType = workType;
        if (location) where.location = { [Op.iLike]: `%${location}%` };
        if (minSalary) where.salaryMin = { [Op.gte]: minSalary };
        if (maxSalary) where.salaryMax = { [Op.lte]: maxSalary };

        const { count, rows } = await Vacancy.findAndCountAll({
            where,
            include: [
                {
                    model: EmployerProfile,
                    as: 'employer',
                    attributes: ['companyName', 'logoUrl', 'industry'],
                },
                {
                    model: Skill,
                    as: 'skills',
                    through: { attributes: ['proficiencyLevel'] },
                },
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[sortBy, order]],
        });

        res.status(200).json({
            success: true,
            data: {
                vacancies: rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    totalItems: count,
                    itemsPerPage: parseInt(limit),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

const getVacancyById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const vacancy = await Vacancy.findByPk(id, {
            include: [
                {
                    model: EmployerProfile,
                    as: 'employer',
                    include: [{
                        model: require('../models').User,
                        as: 'user',
                        attributes: ['firstName', 'lastName'],
                    }],
                },
                {
                    model: Skill,
                    as: 'skills',
                    through: { attributes: ['proficiencyLevel', 'isRequired'] },
                },
                {
                    model: Application,
                    as: 'applications',
                    attributes: ['id', 'status', 'submittedAt'],
                },
            ],
        });

        if (!vacancy) {
            throw new AppError(
                404,
                'Вакансия не найдена.',
                'NOT_FOUND',
                { resourceId: id, resourceType: 'vacancy' }
            );
        }

        vacancy.viewsCount += 1;
        await vacancy.save();

        res.status(200).json({
            success: true,
            data: { vacancy },
        });
    } catch (error) {
        next(error);
    }
};

const createVacancy = async (req, res, next) => {
    try {
        const {
            title,
            description,
            requirements,
            responsibilities,
            location,
            workType,
            employmentType,
            salaryMin,
            salaryMax,
            currency,
            startDate,
            endDate,
            applicationDeadline,
            skills,
        } = req.body;

        const employerProfile = await EmployerProfile.findOne({
            where: { userId: req.user.id },
        });

        if (!employerProfile) {
            throw new AppError(
                404,
                'Профиль работодателя не найден. Пожалуйста, создайте профиль работодателя перед публикацией вакансии.',
                'EMPLOYER_PROFILE_NOT_FOUND'
            );
        }

        const vacancy = await Vacancy.create({
            title,
            description,
            requirements: requirements || [],
            responsibilities: responsibilities || [],
            location,
            workType: workType || 'onsite',
            employmentType,
            salaryMin,
            salaryMax,
            currency: currency || 'RUB',
            startDate,
            endDate,
            applicationDeadline,
            employerId: employerProfile.id,
            status: 'draft',
        });

        if (skills && skills.length > 0) {
            for (const skillData of skills) {
                let skill = await Skill.findOne({
                    where: { name: skillData.name },
                });

                if (!skill) {
                    skill = await Skill.create({
                        name: skillData.name,
                        category: skillData.category,
                    });
                }

                await VacancySkill.create({
                    vacancyId: vacancy.id,
                    skillId: skill.id,
                    isRequired: skillData.isRequired !== false,
                    proficiencyLevel: skillData.proficiencyLevel || 'intermediate',
                });
            }
        }

        res.status(201).json({
            success: true,
            message: 'Вакансия создана успешно.',
            data: { vacancy },
        });
    } catch (error) {
        next(error);
    }
};

const updateVacancy = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const vacancy = await Vacancy.findByPk(id);

        if (!vacancy) {
            throw new AppError(
                404,
                'Вакансия не найдена.',
                'NOT_FOUND',
                { resourceId: id, resourceType: 'vacancy' }
            );
        }

        const employerProfile = await EmployerProfile.findOne({
            where: { userId: req.user.id },
        });

        if (vacancy.employerId !== employerProfile.id && req.user.role !== 'admin') {
            throw new AppError(
                403,
                'Вы не имеете прав для обновления этой вакансии.',
                'FORBIDDEN'
            );
        }

        await vacancy.update(updateData);

        res.status(200).json({
            success: true,
            message: 'Вакансия обновлена успешно.',
            data: { vacancy },
        });
    } catch (error) {
        next(error);
    }
};

const deleteVacancy = async (req, res, next) => {
    try {
        const { id } = req.params;

        const vacancy = await Vacancy.findByPk(id);

        if (!vacancy) {
            throw new AppError(
                404,
                'Вакансия не найдена.',
                'NOT_FOUND',
                { resourceId: id, resourceType: 'vacancy' }
            );
        }

        const employerProfile = await EmployerProfile.findOne({
            where: { userId: req.user.id },
        });

        if (vacancy.employerId !== employerProfile.id && req.user.role !== 'admin') {
            throw new AppError(
                403,
                'Вы не имеете прав для удаления этой вакансии.',
                'FORBIDDEN'
            );
        }

        await vacancy.destroy();

        res.status(200).json({
            success: true,
            message: 'Вакансия удалена успешно.',
        });
    } catch (error) {
        next(error);
    }
};

const saveVacancy = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;

        const studentProfile = await require('../models').StudentProfile.findOne({
            where: { userId: req.user.id },
        });

        if (!studentProfile) {
            throw new AppError(
                404,
                'Профиль студента не найден.',
                'STUDENT_PROFILE_NOT_FOUND'
            );
        }

        const vacancy = await Vacancy.findByPk(id);
        if (!vacancy) {
            throw new AppError(404, 'Вакансия не найдена.', 'NOT_FOUND');
        }

        const existing = await require('../models').SavedVacancy.findOne({
            where: { studentId: studentProfile.id, vacancyId: id },
        });

        if (existing) {
            throw new AppError(
                409,
                'Вакансия уже сохранена.',
                'ALREADY_SAVED'
            );
        }

        const saved = await SavedVacancy.create({
            studentId: studentProfile.id,
            vacancyId: id,
            notes,
        });

        res.status(201).json({
            success: true,
            message: 'Вакансия сохранена успешно.',
            data: { saved },
        });
    } catch (error) {
        next(error);
    }
};

const getSavedVacancies = async (req, res, next) => {
    try {
        const studentProfile = await require('../models').StudentProfile.findOne({
            where: { userId: req.user.id },
        });

        if (!studentProfile) {
            throw new AppError(404, 'Профиль студента не найден.', 'STUDENT_PROFILE_NOT_FOUND');
        }

        const saved = await SavedVacancy.findAll({
            where: { studentId: studentProfile.id },
            include: [{
                model: Vacancy,
                as: 'vacancy',
                include: [{
                    model: EmployerProfile,
                    as: 'employer',
                    attributes: ['companyName', 'logoUrl'],
                }],
            }],
        });

        res.status(200).json({
            success: true,
            data: { savedVacancies: saved },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllVacancies,
    getVacancyById,
    createVacancy,
    updateVacancy,
    deleteVacancy,
    saveVacancy,
    getSavedVacancies,
};
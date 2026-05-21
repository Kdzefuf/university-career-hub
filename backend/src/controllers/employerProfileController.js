const { EmployerProfile, User } = require('../models');
const { AppError } = require('../middleware/errorHandler');

/**
 * @description Получить профиль текущего работодателя
 * @route GET /api/employer/profile
 * @access Private (Employers only)
 */
const getProfile = async (req, res, next) => {
    try {
        const employerProfile = await EmployerProfile.findOne({
            where: { userId: req.user.id },
        });

        if (!employerProfile) {
            throw new AppError(
                404,
                'Профиль работодателя не найден.',
                'EMPLOYER_PROFILE_NOT_FOUND'
            );
        }

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @description Создать или обновить профиль работодателя
 * @route POST/PUT /api/employer/profile
 * @access Private (Employers only)
 */
const createOrUpdateProfile = async (req, res, next) => {
    try {
        const {
            companyName,
            companyDescription,
            companyWebsite,
            industry,
            companySize,
            contactEmail,
            contactPhone,
            logoUrl,
        } = req.body;

        let employerProfile = await EmployerProfile.findOne({
            where: { userId: req.user.id },
        });

        if (employerProfile) {
            // Обновляем существующий профиль
            if (companyName) employerProfile.companyName = companyName;
            if (companyDescription !== undefined) employerProfile.companyDescription = companyDescription;
            if (companyWebsite !== undefined) employerProfile.companyWebsite = companyWebsite;
            if (industry !== undefined) employerProfile.industry = industry;
            if (companySize !== undefined) employerProfile.companySize = companySize;
            if (contactEmail !== undefined) employerProfile.contactEmail = contactEmail;
            if (contactPhone !== undefined) employerProfile.contactPhone = contactPhone;
            if (logoUrl !== undefined) employerProfile.logoUrl = logoUrl;

            await employerProfile.save();
        } else {
            // Создаем новый профиль
            employerProfile = await EmployerProfile.create({
                userId: req.user.id,
                companyName,
                companyDescription,
                companyWebsite,
                industry,
                companySize,
                contactEmail,
                contactPhone,
                logoUrl,
            });
        }

        res.status(200).json({
            success: true,
            message: employerProfile ? 'Профиль обновлен успешно.' : 'Профиль создан успешно.',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    createOrUpdateProfile,
};
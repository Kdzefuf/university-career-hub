const User = require('./User');
const StudentProfile = require('./StudentProfile');
const EmployerProfile = require('./EmployerProfile');
const Vacancy = require('./Vacancy');
const Application = require('./Application');
const Review = require('./Review');
const SavedVacancy = require('./SavedVacancy');
const Notification = require('./Notification');
const Interview = require('./Interview');
const Skill = require('./Skill');
const VacancySkill = require('./VacancySkill');

// User - StudentProfile (1:1)
User.hasOne(StudentProfile, { foreignKey: 'userId', as: 'studentProfile' });
StudentProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User - EmployerProfile (1:1)
User.hasOne(EmployerProfile, { foreignKey: 'userId', as: 'employerProfile' });
EmployerProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// EmployerProfile - Vacancy (1:N)
EmployerProfile.hasMany(Vacancy, { foreignKey: 'employerId', as: 'vacancies' });
Vacancy.belongsTo(EmployerProfile, { foreignKey: 'employerId', as: 'employer' });

// StudentProfile - Application (1:N)
StudentProfile.hasMany(Application, { foreignKey: 'studentId', as: 'applications' });
Application.belongsTo(StudentProfile, { foreignKey: 'studentId', as: 'student' });

// Vacancy - Application (1:N)
Vacancy.hasMany(Application, { foreignKey: 'vacancyId', as: 'applications' });
Application.belongsTo(Vacancy, { foreignKey: 'vacancyId', as: 'vacancy' });

// StudentProfile - SavedVacancy (N:M through SavedVacancy)
StudentProfile.hasMany(SavedVacancy, { foreignKey: 'studentId', as: 'savedVacancies' });
Vacancy.hasMany(SavedVacancy, { foreignKey: 'vacancyId', as: 'savedBy' });
SavedVacancy.belongsTo(StudentProfile, { foreignKey: 'studentId', as: 'student' });
SavedVacancy.belongsTo(Vacancy, { foreignKey: 'vacancyId', as: 'vacancy' });

// User - Notification (1:N)
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Application - Interview (1:1)
Application.hasOne(Interview, { foreignKey: 'applicationId', as: 'interview' });
Interview.belongsTo(Application, { foreignKey: 'applicationId', as: 'application' });

// StudentProfile - Interview (1:N)
StudentProfile.hasMany(Interview, { foreignKey: 'studentId', as: 'interviews' });
Interview.belongsTo(StudentProfile, { foreignKey: 'studentId', as: 'student' });

// EmployerProfile - Interview (1:N)
EmployerProfile.hasMany(Interview, { foreignKey: 'employerId', as: 'interviews' });
Interview.belongsTo(EmployerProfile, { foreignKey: 'employerId', as: 'employer' });

// User - Review (1:N as author)
User.hasMany(Review, { foreignKey: 'authorId', as: 'authoredReviews' });
Review.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

// User - Review (1:N as target)
User.hasMany(Review, { foreignKey: 'targetUserId', as: 'receivedReviews' });
Review.belongsTo(User, { foreignKey: 'targetUserId', as: 'targetUser' });

// Vacancy - Review (1:N)
Vacancy.hasMany(Review, { foreignKey: 'vacancyId', as: 'reviews' });
Review.belongsTo(Vacancy, { foreignKey: 'vacancyId', as: 'vacancy' });

// Application - Review (1:1)
Application.hasOne(Review, { foreignKey: 'applicationId', as: 'review' });
Review.belongsTo(Application, { foreignKey: 'applicationId', as: 'application' });

// Vacancy - VacancySkill (1:N)
Vacancy.hasMany(VacancySkill, { foreignKey: 'vacancyId', as: 'vacancySkills' });
VacancySkill.belongsTo(Vacancy, { foreignKey: 'vacancyId', as: 'vacancy' });

// Skill - VacancySkill (1:N)
Skill.hasMany(VacancySkill, { foreignKey: 'skillId', as: 'vacancySkills' });
VacancySkill.belongsTo(Skill, { foreignKey: 'skillId', as: 'skill' });

// Vacancy - Skills (N:M through VacancySkill)
Vacancy.belongsToMany(Skill, { through: VacancySkill, foreignKey: 'vacancyId', as: 'skills' });
Skill.belongsToMany(Vacancy, { through: VacancySkill, foreignKey: 'skillId', as: 'vacancies' });

module.exports = {
    User,
    StudentProfile,
    EmployerProfile,
    Vacancy,
    Application,
    Review,
    SavedVacancy,
    Notification,
    Interview,
    Skill,
    VacancySkill,
};
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vacancyAPI } from '../services/api';
import './CreateVacancy.css';

const CreateVacancyForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: [''],
        responsibilities: [''],
        location: '',
        workType: 'onsite',
        employmentType: 'full-time',
        salaryMin: '',
        salaryMax: '',
        currency: 'RUB',
        applicationDeadline: '',
        skills: [{ name: '', proficiencyLevel: 'intermediate', isRequired: true }],
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setError('');
    };

    const handleArrayChange = (field, index, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData({
            ...formData,
            [field]: newArray,
        });
    };

    const addArrayItem = (field) => {
        if (field === 'requirements' || field === 'responsibilities') {
            setFormData({
                ...formData,
                [field]: [...formData[field], ''],
            });
        } else if (field === 'skills') {
            setFormData({
                ...formData,
                skills: [...formData.skills, { name: '', proficiencyLevel: 'intermediate', isRequired: true }],
            });
        }
    };

    const removeArrayItem = (field, index) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData({
            ...formData,
            [field]: newArray,
        });
    };

    const handleSkillChange = (index, field, value) => {
        const newSkills = [...formData.skills];
        newSkills[index] = {
            ...newSkills[index],
            [field]: value,
        };
        setFormData({
            ...formData,
            skills: newSkills,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const cleanedData = {
            ...formData,
            requirements: formData.requirements.filter(r => r.trim() !== ''),
            responsibilities: formData.responsibilities.filter(r => r.trim() !== ''),
            skills: formData.skills.filter(s => s.name.trim() !== ''),
            salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
            salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
        };

        try {
            await vacancyAPI.create(cleanedData);
            navigate('/vacancies');
        } catch (err) {
            setError(
                err.response?.data?.error?.message || err.response?.data?.message || 'Ошибка создания вакансии. Проверьте данные.'
            );
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="create-vacancy-container">
                <div className="auth-required">
                    <h2>Требуется авторизация</h2>
                    <p>Для создания вакансии необходимо войти в систему как работодатель.</p>
                    <Link to="/login" className="btn-primary">Войти</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="create-vacancy-container">
            <h1>Создать новую вакансию</h1>
            <p className="subtitle">Заполните форму для публикации вакансии</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="create-vacancy-form">
                <div className="form-section">
                    <h3>Основная информация</h3>

                    <div className="form-group">
                        <label htmlFor="title">Название вакансии *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Например: Frontend разработчик"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Описание вакансии *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Подробное описание вакансии..."
                            rows="5"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="employmentType">Тип занятости *</label>
                            <select
                                id="employmentType"
                                name="employmentType"
                                value={formData.employmentType}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            >
                                <option value="full-time">Полная занятость</option>
                                <option value="part-time">Частичная занятость</option>
                                <option value="internship">Стажировка</option>
                                <option value="project">Проектная работа</option>
                                <option value="temporary">Временная работа</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="workType">Формат работы *</label>
                            <select
                                id="workType"
                                name="workType"
                                value={formData.workType}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            >
                                <option value="onsite">В офисе</option>
                                <option value="remote">Удаленно</option>
                                <option value="hybrid">Гибрид</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="location">Местоположение *</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Например: Москва, ул. Пушкина, д. 10"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h3>Зарплата</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="salaryMin">Минимальная зарплата</label>
                            <input
                                type="number"
                                id="salaryMin"
                                name="salaryMin"
                                value={formData.salaryMin}
                                onChange={handleChange}
                                placeholder="От"
                                min="0"
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="salaryMax">Максимальная зарплата</label>
                            <input
                                type="number"
                                id="salaryMax"
                                name="salaryMax"
                                value={formData.salaryMax}
                                onChange={handleChange}
                                placeholder="До"
                                min="0"
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="currency">Валюта</label>
                            <select
                                id="currency"
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                <option value="RUB">RUB</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Требования</h3>

                    <div className="array-inputs">
                        {formData.requirements.map((req, index) => (
                            <div key={index} className="array-item">
                                <input
                                    type="text"
                                    value={req}
                                    onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                                    placeholder={`Требование ${index + 1}`}
                                    disabled={loading}
                                />
                                {formData.requirements.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('requirements', index)}
                                        className="btn-remove"
                                        disabled={loading}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayItem('requirements')}
                            className="btn-add"
                            disabled={loading}
                        >
                            + Добавить требование
                        </button>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Обязанности</h3>

                    <div className="array-inputs">
                        {formData.responsibilities.map((resp, index) => (
                            <div key={index} className="array-item">
                                <input
                                    type="text"
                                    value={resp}
                                    onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                                    placeholder={`Обязанность ${index + 1}`}
                                    disabled={loading}
                                />
                                {formData.responsibilities.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('responsibilities', index)}
                                        className="btn-remove"
                                        disabled={loading}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayItem('responsibilities')}
                            className="btn-add"
                            disabled={loading}
                        >
                            + Добавить обязанность
                        </button>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Навыки</h3>

                    <div className="skills-list">
                        {formData.skills.map((skill, index) => (
                            <div key={index} className="skill-item">
                                <input
                                    type="text"
                                    value={skill.name}
                                    onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                                    placeholder="Название навыка"
                                    disabled={loading}
                                />
                                <select
                                    value={skill.proficiencyLevel}
                                    onChange={(e) => handleSkillChange(index, 'proficiencyLevel', e.target.value)}
                                    disabled={loading}
                                >
                                    <option value="beginner">Начальный</option>
                                    <option value="intermediate">Средний</option>
                                    <option value="advanced">Продвинутый</option>
                                    <option value="expert">Эксперт</option>
                                </select>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={skill.isRequired}
                                        onChange={(e) => handleSkillChange(index, 'isRequired', e.target.checked)}
                                        disabled={loading}
                                    />
                                    Обязательный
                                </label>
                                {formData.skills.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('skills', index)}
                                        className="btn-remove"
                                        disabled={loading}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayItem('skills')}
                            className="btn-add"
                            disabled={loading}
                        >
                            + Добавить навык
                        </button>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Срок приема заявок</h3>

                    <div className="form-group">
                        <label htmlFor="applicationDeadline">Дедлайн подачи заявок</label>
                        <input
                            type="date"
                            id="applicationDeadline"
                            name="applicationDeadline"
                            value={formData.applicationDeadline}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/vacancies')} className="btn-secondary" disabled={loading}>
                        Отмена
                    </button>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Создание...' : 'Создать вакансию'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateVacancyForm;
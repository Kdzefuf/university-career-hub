import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { employerProfileAPI } from '../services/api';
import './EmployerProfileForm.css';

const EmployerProfileForm = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        companyDescription: '',
        companyWebsite: '',
        industry: '',
        companySize: '',
        contactEmail: '',
        contactPhone: '',
        logoUrl: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Если пользователь не работодатель, перенаправляем на главную
        if (isAuthenticated && user?.role !== 'employer') {
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            await employerProfileAPI.createOrUpdate(formData);
            setSuccessMessage('Профиль работодателя успешно создан! Теперь вы можете создавать вакансии.');

            // Перенаправляем на страницу создания вакансии через 2 секунды
            setTimeout(() => {
                navigate('/vacancies/create');
            }, 2000);
        } catch (err) {
            setError(
                err.response?.data?.error?.message || err.response?.data?.message || 'Ошибка создания профиля. Проверьте данные.'
            );
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="employer-profile-container">
                <div className="auth-required">
                    <h2>Требуется авторизация</h2>
                    <p>Для создания профиля работодателя необходимо войти в систему.</p>
                    <Link to="/login" className="btn-primary">Войти</Link>
                </div>
            </div>
        );
    }

    if (user?.role !== 'employer') {
        return (
            <div className="employer-profile-container">
                <div className="auth-required">
                    <h2>Доступ запрещен</h2>
                    <p>Только работодатели могут создать профиль компании.</p>
                    <Link to="/" className="btn-primary">На главную</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="employer-profile-container">
            <h1>Профиль работодателя</h1>
            <p className="subtitle">Заполните информацию о вашей компании</p>

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <form onSubmit={handleSubmit} className="employer-profile-form">
                <div className="form-section">
                    <h3>Основная информация о компании</h3>

                    <div className="form-group">
                        <label htmlFor="companyName">Название компании *</label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="Например: ООО «Технологии»"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="companyDescription">Описание компании</label>
                        <textarea
                            id="companyDescription"
                            name="companyDescription"
                            value={formData.companyDescription}
                            onChange={handleChange}
                            placeholder="Расскажите о вашей компании..."
                            rows="4"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="industry">Отрасль</label>
                            <input
                                type="text"
                                id="industry"
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                placeholder="Например: IT, Финансы, Образование"
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="companySize">Размер компании</label>
                            <select
                                id="companySize"
                                name="companySize"
                                value={formData.companySize}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                <option value="">Выберите размер</option>
                                <option value="1-10">1-10 сотрудников</option>
                                <option value="11-50">11-50 сотрудников</option>
                                <option value="51-200">51-200 сотрудников</option>
                                <option value="201-500">201-500 сотрудников</option>
                                <option value="500+">Более 500 сотрудников</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="companyWebsite">Веб-сайт компании</label>
                        <input
                            type="url"
                            id="companyWebsite"
                            name="companyWebsite"
                            value={formData.companyWebsite}
                            onChange={handleChange}
                            placeholder="https://example.com"
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h3>Контактная информация</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="contactEmail">Email для связи</label>
                            <input
                                type="email"
                                id="contactEmail"
                                name="contactEmail"
                                value={formData.contactEmail}
                                onChange={handleChange}
                                placeholder="hr@company.com"
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="contactPhone">Телефон для связи</label>
                            <input
                                type="tel"
                                id="contactPhone"
                                name="contactPhone"
                                value={formData.contactPhone}
                                onChange={handleChange}
                                placeholder="+7 (999) 000-00-00"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="logoUrl">URL логотипа компании</label>
                        <input
                            type="url"
                            id="logoUrl"
                            name="logoUrl"
                            value={formData.logoUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/logo.png"
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => navigate('/vacancies')}
                        disabled={loading}
                    >
                        Отмена
                    </button>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Сохранение...' : 'Создать профиль'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmployerProfileForm;
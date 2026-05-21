import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { vacancyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './VacancyDetail.css';

const VacancyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [vacancy, setVacancy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        fetchVacancy();
    }, [id]);

    const fetchVacancy = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await vacancyAPI.getById(id);
            setVacancy(response.data.data.vacancy);
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Ошибка загрузки вакансии');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveVacancy = async () => {
        if (!isAuthenticated || user?.role !== 'student') {
            navigate('/login');
            return;
        }

        setSaving(true);
        setSaveMessage('');
        try {
            await vacancyAPI.save(id, '');
            setSaveMessage('Вакансия сохранена!');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (err) {
            setSaveMessage(
                err.response?.data?.error?.message || 'Ошибка при сохранении вакансии'
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="loading">Загрузка вакансии...</div>;
    }

    if (error || !vacancy) {
        return (
            <div className="error-container">
                <p>{error || 'Вакансия не найдена'}</p>
                <Link to="/vacancies" className="btn-back">← К списку вакансий</Link>
            </div>
        );
    }

    const getEmploymentTypeLabel = (type) => {
        const labels = {
            'full-time': 'Полная занятость',
            'part-time': 'Частичная занятость',
            internship: 'Стажировка',
            project: 'Проектная работа',
            temporary: 'Временная работа',
        };
        return labels[type] || type;
    };

    const getWorkTypeLabel = (type) => {
        const labels = {
            onsite: 'В офисе',
            remote: 'Удаленно',
            hybrid: 'Гибрид',
        };
        return labels[type] || type;
    };

    return (
        <div className="vacancy-detail-container">
            <Link to="/vacancies" className="btn-back">← К списку вакансий</Link>

            <div className="vacancy-detail-card">
                <div className="vacancy-detail-header">
                    <h1>{vacancy.title}</h1>
                    {vacancy.employer && (
                        <div className="employer-info">
                            <span className="company-name">{vacancy.employer.companyName}</span>
                            {vacancy.employer.industry && (
                                <span className="industry">{vacancy.employer.industry}</span>
                            )}
                        </div>
                    )}
                </div>

                <div className="vacancy-meta">
                    <div className="meta-item">
                        <strong>Тип занятости:</strong> {getEmploymentTypeLabel(vacancy.employmentType)}
                    </div>
                    <div className="meta-item">
                        <strong>Формат работы:</strong> {getWorkTypeLabel(vacancy.workType)}
                    </div>
                    <div className="meta-item">
                        <strong>Местоположение:</strong> {vacancy.location}
                    </div>
                    {vacancy.salaryMin && vacancy.salaryMax && (
                        <div className="meta-item salary">
                            <strong>Зарплата:</strong> {vacancy.salaryMin} - {vacancy.salaryMax} {vacancy.currency || 'RUB'}
                        </div>
                    )}
                    {vacancy.applicationDeadline && (
                        <div className="meta-item deadline">
                            <strong>Дедлайн подачи:</strong> {new Date(vacancy.applicationDeadline).toLocaleDateString('ru-RU')}
                        </div>
                    )}
                </div>

                {isAuthenticated && user?.role === 'student' && (
                    <div className="action-buttons">
                        <button
                            onClick={handleSaveVacancy}
                            disabled={saving}
                            className="btn-save"
                        >
                            {saving ? 'Сохранение...' : '💾 Сохранить вакансию'}
                        </button>
                        {saveMessage && (
                            <span className={`save-message ${saveMessage.includes('Ошибка') ? 'error' : 'success'}`}>
                                {saveMessage}
                            </span>
                        )}
                    </div>
                )}

                {!isAuthenticated && (
                    <div className="login-prompt">
                        <p>🔒 Войдите как студент, чтобы сохранить эту вакансию</p>
                        <Link to="/login" className="btn-login">Войти</Link>
                    </div>
                )}

                <section className="detail-section">
                    <h2>Описание вакансии</h2>
                    <p className="description-full">{vacancy.description}</p>
                </section>

                {vacancy.requirements && vacancy.requirements.length > 0 && (
                    <section className="detail-section">
                        <h2>Требования</h2>
                        <ul className="requirements-list">
                            {vacancy.requirements.map((req, index) => (
                                <li key={index}>{req}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {vacancy.responsibilities && vacancy.responsibilities.length > 0 && (
                    <section className="detail-section">
                        <h2>Обязанности</h2>
                        <ul className="responsibilities-list">
                            {vacancy.responsibilities.map((resp, index) => (
                                <li key={index}>{resp}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {vacancy.skills && vacancy.skills.length > 0 && (
                    <section className="detail-section">
                        <h2>Необходимые навыки</h2>
                        <div className="skills-tags">
                            {vacancy.skills.map((skill) => (
                                <span key={skill.id} className="skill-tag">
                                    {skill.name}
                                    {skill.VacancySkill?.proficiencyLevel && (
                                        <span className="proficiency">({skill.VacancySkill.proficiencyLevel})</span>
                                    )}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                <div className="vacancy-footer">
                    <span className="views">👁️ Просмотров: {vacancy.viewsCount || 0}</span>
                    <span className="posted-date">
                        Опубликовано: {new Date(vacancy.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default VacancyDetail;
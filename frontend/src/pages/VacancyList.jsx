import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vacancyAPI } from '../services/api';
import './VacancyList.css';

const VacancyList = () => {
    const [vacancies, setVacancies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        search: '',
        employmentType: '',
        workType: '',
        location: '',
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
    });

    const fetchVacancies = async () => {
        setLoading(true);
        setError('');
        try {
            const params = {
                page: pagination.currentPage,
                limit: 10,
                ...filters,
            };
            Object.keys(params).forEach(
                (key) => params[key] === '' && delete params[key]
            );

            const response = await vacancyAPI.getAll(params);
            setVacancies(response.data.data.vacancies);
            setPagination(response.data.data.pagination);
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Ошибка загрузки вакансий');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVacancies();
    }, [pagination.currentPage]);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
        fetchVacancies();
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination((prev) => ({ ...prev, currentPage: newPage }));
        }
    };

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

    if (loading) {
        return <div className="loading">Загрузка вакансий...</div>;
    }

    return (
        <div className="vacancy-list-container">
            <h1>Вакансии и стажировки</h1>

            <form onSubmit={handleSearch} className="filter-form">
                <div className="filter-row">
                    <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="Поиск по названию или описанию..."
                        className="search-input"
                    />
                    <button type="submit" className="btn-search">
                        Найти
                    </button>
                </div>

                <div className="filter-options">
                    <select
                        name="employmentType"
                        value={filters.employmentType}
                        onChange={handleFilterChange}
                    >
                        <option value="">Все типы занятости</option>
                        <option value="full-time">Полная занятость</option>
                        <option value="part-time">Частичная занятость</option>
                        <option value="internship">Стажировка</option>
                        <option value="project">Проектная работа</option>
                        <option value="temporary">Временная работа</option>
                    </select>

                    <select
                        name="workType"
                        value={filters.workType}
                        onChange={handleFilterChange}
                    >
                        <option value="">Все форматы работы</option>
                        <option value="onsite">В офисе</option>
                        <option value="remote">Удаленно</option>
                        <option value="hybrid">Гибрид</option>
                    </select>

                    <input
                        type="text"
                        name="location"
                        value={filters.location}
                        onChange={handleFilterChange}
                        placeholder="Местоположение"
                    />
                </div>
            </form>

            {error && <div className="error-message">{error}</div>}

            {vacancies.length === 0 ? (
                <div className="no-vacancies">
                    <p>Вакансии не найдены</p>
                </div>
            ) : (
                <>
                    <div className="vacancies-grid">
                        {vacancies.map((vacancy) => (
                            <div key={vacancy.id} className="vacancy-card">
                                <div className="vacancy-header">
                                    <h3>{vacancy.title}</h3>
                                    {vacancy.employer && (
                                        <span className="company-name">
                                            {vacancy.employer.companyName}
                                        </span>
                                    )}
                                </div>

                                <div className="vacancy-details">
                                    <span className="badge">{getEmploymentTypeLabel(vacancy.employmentType)}</span>
                                    <span className="badge">{getWorkTypeLabel(vacancy.workType)}</span>
                                    {vacancy.salaryMin && vacancy.salaryMax && (
                                        <span className="salary">
                                            {vacancy.salaryMin} - {vacancy.salaryMax} {vacancy.currency || 'RUB'}
                                        </span>
                                    )}
                                </div>

                                <p className="location">{vacancy.location}</p>

                                <p className="description">
                                    {vacancy.description.substring(0, 150)}...
                                </p>

                                <Link to={`/vacancies/${vacancy.id}`} className="btn-view">
                                    Подробнее
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="pagination">
                        <button
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className="btn-page"
                        >
                            ← Назад
                        </button>
                        <span className="page-info">
                            Страница {pagination.currentPage} из {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="btn-page"
                        >
                            Вперед →
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default VacancyList;
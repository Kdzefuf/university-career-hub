import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <section className="hero-section">
                <h1>Найди свою идеальную работу в кампусе!</h1>
                <p className="hero-subtitle">
                    Карьера в университете — платформа для студентов, ищущих временную работу,
                    стажировки и возможности для профессионального роста
                </p>
                <div className="hero-buttons">
                    <Link to="/vacancies" className="btn-primary-large">
                        Смотреть вакансии
                    </Link>
                    <Link to="/register" className="btn-secondary-large">
                        Зарегистрироваться
                    </Link>
                </div>
            </section>

            <section className="features-section">
                <h2>Возможности платформы</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>Поиск вакансий</h3>
                        <p>
                            Фильтруйте вакансии по типу занятости, формату работы, местоположению
                            и другим параметрам
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Подача заявок</h3>
                        <p>
                            Отправляйте отклики на вакансии с резюме и сопроводительным письмом
                            в несколько кликов
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Для работодателей</h3>
                        <p>
                            Размещайте вакансии, управляйте откликами и находите талантливых студентов
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
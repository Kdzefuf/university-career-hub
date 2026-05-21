import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <section className="hero-section">
                <h1>Найди свою идеальную работу в кампусе!</h1>
                <p className="hero-subtitle">
                    University Career Hub — платформа для студентов, ищущих временную работу,
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
                        <div className="feature-icon">🔍</div>
                        <h3>Поиск вакансий</h3>
                        <p>
                            Фильтруйте вакансии по типу занятости, формату работы, местоположению
                            и другим параметрам
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📝</div>
                        <h3>Подача заявок</h3>
                        <p>
                            Отправляйте отклики на вакансии с резюме и сопроводительным письмом
                            в несколько кликов
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Отслеживание статуса</h3>
                        <p>
                            Следите за статусом ваших откликов и получайте уведомления о новых этапах
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">💼</div>
                        <h3>Личный кабинет</h3>
                        <p>
                            Управляйте своим профилем, сохраняйте интересные вакансии и планируйте
                            собеседования
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">⭐</div>
                        <h3>Отзывы и рекомендации</h3>
                        <p>
                            Читайте отзывы о работодателях и оставляйте свои впечатления о стажировках
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🎯</div>
                        <h3>Для работодателей</h3>
                        <p>
                            Размещайте вакансии, управляйте откликами и находите талантливых студентов
                        </p>
                    </div>
                </div>
            </section>

            <section className="stats-section">
                <h2>Платформа в цифрах</h2>
                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="stat-number">500+</span>
                        <span className="stat-label">Активных вакансий</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">200+</span>
                        <span className="stat-label">Партнеров-работодателей</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">1000+</span>
                        <span className="stat-label">Зарегистрированных студентов</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">85%</span>
                        <span className="stat-label">Успешных трудоустройств</span>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <h2>Готовы начать?</h2>
                <p>Присоединяйтесь к University Career Hub уже сегодня!</p>
                <Link to="/register" className="btn-primary-large">
                    Создать аккаунт
                </Link>
            </section>
        </div>
    );
};

export default Home;
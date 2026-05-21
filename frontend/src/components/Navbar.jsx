import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    Карьера в университете
                </Link>

                <div className="navbar-menu">
                    <Link to="/vacancies" className="nav-link">
                        Вакансии
                    </Link>

                    {isAuthenticated ? (
                        <>
                            {user?.role === 'employer' && (
                                <Link to="/vacancies/create" className="nav-link">
                                    Создать вакансию
                                </Link>
                            )}

                            {user?.role === 'employer' && (
                                <Link to="/employer/profile" className="nav-link">
                                    Профиль компании
                                </Link>
                            )}

                            {user?.role === 'student' && (
                                <Link to="/saved-vacancies" className="nav-link">
                                    Сохраненные
                                </Link>
                            )}

                            <div className="user-menu">
                                <span className="user-name">
                                    {user?.firstName} {user?.lastName}
                                </span>
                                <button onClick={handleLogout} className="btn-logout">
                                    Выйти
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn-login">
                                Войти
                            </Link>
                            <Link to="/register" className="btn-register">
                                Регистрация
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Добавляем токен к каждому запросу
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Обработка ошибок
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
    changePassword: (data) => api.put('/auth/change-password', data),
};

export const vacancyAPI = {
    getAll: (params) => api.get('/vacancies', { params }),
    getById: (id) => api.get(`/vacancies/${id}`),
    create: (data) => api.post('/vacancies', data),
    update: (id, data) => api.put(`/vacancies/${id}`, data),
    delete: (id) => api.delete(`/vacancies/${id}`),
    save: (id, notes) => api.post(`/vacancies/${id}/save`, { notes }),
    getSaved: () => api.get('/vacancies/saved'),
};

export const employerProfileAPI = {
    get: () => api.get('/employer/profile'),
    createOrUpdate: (data) => api.post('/employer/profile', data),
};

export default api;
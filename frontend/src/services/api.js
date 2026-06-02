import axios from 'axios';

const api = axios.create();

// Интерсептор для добавления токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Экспортируем authAPI для логина
export const authAPI = {
  login: (username, password) => api.post('/api/v1/login', { username, password }),
};

// Экспортируем api по умолчанию для других запросов
export default api;
import axios from 'axios';

const api = axios.create();

// Добавляем токен в заголовки, если он есть
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (username, password) => api.post('/api/v1/login', { username, password }),
};

export default api;
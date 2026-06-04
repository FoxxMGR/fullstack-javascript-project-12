import axios from 'axios';

// Важно: НЕ указывайте baseURL, чтобы запросы шли через прокси
const api = axios.create();

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
import axios from 'axios';
import Rollbar from 'rollbar';

const rollbar = new Rollbar({
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: import.meta.env.VITE_ROLLBAR_ENVIRONMENT || 'development',
});

const api = axios.create();

// Интерсептор для добавления токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерсептор для перехвата ошибок ответа
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Логируем только реальные ошибки сервера (не 401 и не 409)
    const status = error.response?.status;
    const url = error.config?.url;
    const method = error.config?.method;
    
    // Не логируем ожидаемые ошибки авторизации и конфликта
    if (status !== 401 && status !== 409) {
      rollbar.error('API Request Failed', {
        url,
        method,
        status,
        message: error.message,
      });
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (username, password) => api.post('/api/v1/login', { username, password }),
  signup: (username, password) => api.post('/api/v1/signup', { username, password }),
};

export default api;
import axios from 'axios';
import getRollbar from './rollbar';
import storage from './storage';

const api = axios.create();

api.interceptors.request.use((config) => {
  try {
    const user = storage.getUser();
    if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  } catch { /* ignore */ }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const method = error.config?.method;

    if (status !== 401 && status !== 409) {
      getRollbar().error('API Request Failed', {
        url,
        method,
        status,
        message: error.message,
      });
    }

    return Promise.reject(error);
  },
);

export const authAPI = {
  login: (username, password) => api.post('/api/v1/login', { username, password }),
  signup: (username, password) => api.post('/api/v1/signup', { username, password }),
};

export default api;

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

export const channelsAPI = {
  getAll: () => api.get('/api/v1/channels'),
  create: (name) => api.post('/api/v1/channels', { name }),
  remove: (id) => api.delete(`/api/v1/channels/${id}`),
};

export const messagesAPI = {
  getAll: () => api.get('/api/v1/messages'),
  send: (channelId, body) => api.post('/api/v1/messages', { channelId, body }),
};

export default api;
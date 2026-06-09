import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';
import { useRollbar } from '@rollbar/react';

export const useAuth = () => {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentUsername, setUsername] = useState(localStorage.getItem('username'));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.login(username, password);
      const { token: newToken } = response.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('username', username);  // ← ДОБАВИТЬ: сохраняем имя пользователя
      setToken(newToken);
      setUsername(username);
      toast.success(t('toasts.welcome'));
      navigate('/');
    } catch (err) {
      rollbar.error('Ошибка авторизации', { 
        error: err.message,
        status: err.response?.status 
      });
      let errorMessage = t('toasts.loginError');
      if (err.response?.status === 401) {
        errorMessage = t('errors.invalidCredentials');
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (!err.response) {
        errorMessage = t('toasts.networkError');
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');  // ← ДОБАВИТЬ: удаляем имя пользователя
    setToken(null);
    setUsername(null);
    toast.info(t('toasts.logout'));
    navigate('/login');
  };

  return { token, username: currentUsername, login, logout, error, loading };
};

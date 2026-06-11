import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';
import { useRollbar } from '@rollbar/react';

const getUserFromStorage = () => {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  return token && username ? { token, username } : null;
};

export const useAuth = () => {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const [user, setUser] = useState(getUserFromStorage);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(username, password);
      const { token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      setUser({ token, username });
      toast.success(t('toasts.welcome'));
      navigate('/');
    } catch (err) {
      rollbar.error('Ошибка авторизации', {
        error: err.message,
        status: err.response?.status,
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
  }, [t, navigate, rollbar]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
    toast.info(t('toasts.logout'));
    navigate('/login');
  }, [t, navigate]);

  return { user, login, logout, error, loading };
};

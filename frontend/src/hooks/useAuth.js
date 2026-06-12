import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import { authAPI } from '../services/api';
import { chatApi } from '../store/chatApi';
import { setUser } from '../store/authSlice';

export const useAuth = () => {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
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
      dispatch(setUser({ token, username }));
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
  }, [t, navigate, rollbar, dispatch]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    dispatch(setUser(null));
    dispatch(chatApi.util.resetApiState());
    toast.info(t('toasts.logout'));
    navigate('/login');
  }, [t, navigate, dispatch]);

  return { user, login, logout, error, loading, isAuth: !!user };
};

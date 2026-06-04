import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';

export const useAuth = () => {
  const { t } = useTranslation();
  const [token, setToken] = useState(localStorage.getItem('token'));
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
      setToken(newToken);
      toast.success(t('toasts.welcome'));
      navigate('/');
    } catch (err) {
      let errorMessage = t('toasts.loginError');
      if (err.response?.status === 401) {
        errorMessage = t('errors.invalidCredentials');
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (!err.response) {
        errorMessage = t('toasts.networkError');
        toast.error(errorMessage);
      }
      setError(errorMessage);
      if (err.response) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    toast.info(t('toasts.logout'));
    navigate('/login');
  };

  return { token, login, logout, error, loading };
};
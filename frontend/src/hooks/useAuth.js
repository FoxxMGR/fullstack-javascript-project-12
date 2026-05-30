import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export const useAuth = () => {
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
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Ошибка авторизации';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return { token, login, logout, error, loading };
};
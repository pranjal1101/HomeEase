import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('homeease_token') || null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('homeease_token');
    localStorage.removeItem('homeease_user');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('homeease_token');
      const storedUser = localStorage.getItem('homeease_user');

      if (storedToken && storedToken !== 'null' && storedToken !== 'undefined' && storedToken.trim() !== '') {
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.warn('Failed to parse cached user:', e);
          }
        }
        
        try {
          const res = await authAPI.getMe();
          const freshUser = res?.user || res?.data;
          if (res?.success && freshUser) {
            setUser(freshUser);
            localStorage.setItem('homeease_user', JSON.stringify(freshUser));
          }
        } catch (err) {
          console.warn('Token verification result:', err.response?.data?.message || err.message);
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            logout();
          }
        }
      } else {
        logout();
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    if (response.success && response.token) {
      const returnedUser = response.user || response.data;
      setToken(response.token);
      setUser(returnedUser);
      localStorage.setItem('homeease_token', response.token);
      localStorage.setItem('homeease_user', JSON.stringify(returnedUser));
    }
    return response;
  };

  const register = async (userData) => {
    const response = await authAPI.register(userData);
    if (response.success && response.token) {
      const returnedUser = response.user || response.data;
      setToken(response.token);
      setUser(returnedUser);
      localStorage.setItem('homeease_token', response.token);
      localStorage.setItem('homeease_user', JSON.stringify(returnedUser));
    }
    return response;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

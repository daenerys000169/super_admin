import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import API from '../utils/axiosInstance'; // Adjust the path if needed

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('auth_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      setUser(JSON.parse(userData));
    }

    setLoading(false);
  }, []);

  const sendOTP = async (email) => {
    try {
      const res = await API.post('/auth/send-otp', { email });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'OTP send failed');
    }
  };

  const verifyOTP = async ({ email, otp }) => {
    try {
      const res = await API.post('/auth/verify-otp', { email, otp });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'OTP verification failed');
    }
  };

  const register = async (userData) => {
    try {
      const res = await API.post('/auth/register', userData);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  };

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token, user } = res.data;

      Cookies.set('auth_token', token, { expires: 7 });
      localStorage.setItem('user_data', JSON.stringify(user));

      setUser(user);
      return user;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    Cookies.remove('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    sendOTP,
    verifyOTP,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
  
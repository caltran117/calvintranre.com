import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

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
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.data?.data) {
        setUser(response.data.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('accessToken');
    } finally {
      setIsLoading(false);
    }
  };

  const signin = (userData) => {
    setUser(userData.user);
    setIsAuthenticated(true);
    localStorage.setItem('accessToken', userData.accessToken);
  };

  const signout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
  };

  const updateProfile = async (data) => {
    try {
      const response = await authAPI.updateProfile(data);
      if (response.data?.data) {
        setUser(response.data.data);
        return response.data.data;
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      checkAuthStatus();
    } else {
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    signin,
    signout,
    updateProfile,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
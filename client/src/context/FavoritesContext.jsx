import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchFavorites = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const response = await authAPI.getFavorites();
      if (response.data?.data?.favorites) {
        setFavorites(response.data.data.favorites);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addFavorite = async (propertyId, propertyType, propertyData) => {
    if (!isAuthenticated) {
      throw new Error('You must be signed in to add favorites');
    }

    try {
      const response = await authAPI.addFavorite(propertyId, propertyType, propertyData);
      if (response.data?.data?.favorite) {
        setFavorites(prev => [...prev, response.data.data.favorite]);
        return response.data.data.favorite;
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  };

  const removeFavorite = async (propertyId, propertyType) => {
    if (!isAuthenticated) {
      throw new Error('You must be signed in to remove favorites');
    }

    try {
      await authAPI.removeFavorite(propertyId, propertyType);
      setFavorites(prev => prev.filter(
        fav => !(fav.propertyId === propertyId && fav.propertyType === propertyType)
      ));
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  };

  const isFavorite = (propertyId, propertyType) => {
    return favorites.some(fav => fav.propertyId === propertyId && fav.propertyType === propertyType);
  };

  const getFavoritesByType = (type) => {
    return favorites.filter(fav => fav.propertyType === type);
  };

  const toggleFavorite = async (propertyId, propertyType, propertyData) => {
    if (isFavorite(propertyId, propertyType)) {
      await removeFavorite(propertyId, propertyType);
      return false;
    } else {
      await addFavorite(propertyId, propertyType, propertyData);
      return true;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated]);

  const value = {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoritesByType,
    toggleFavorite,
    fetchFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
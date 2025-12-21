// ✅ Auth Hook
import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser } from '../config/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem('swasth_user');
      if (stored) {
        const parsedUser = JSON.parse(stored);
        // Validate stored user has required fields
        if (parsedUser && parsedUser.email) {
          setUser(parsedUser);
        } else {
          // Invalid user data, clear it
          await AsyncStorage.removeItem('swasth_user');
        }
      }
    } catch (e) {
      console.error('Load user error:', e);
      // Clear corrupted data
      try {
        await AsyncStorage.removeItem('swasth_user');
      } catch (clearError) {
        console.error('Failed to clear corrupted user data:', clearError);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const res = await loginUser(email, password);
      
      // Validate response structure
      if (!res || !res.user) {
        throw new Error('Invalid response from server');
      }

      const userData = res.user;
      
      // Ensure user has required fields
      if (!userData.email) {
        throw new Error('User data missing email');
      }

      // Store user
      await AsyncStorage.setItem('swasth_user', JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (error) {
      // Re-throw with proper error message
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      throw new Error(errorMessage);
    }
  };

  const register = async (data) => {
    try {
      if (!data || !data.email || !data.password) {
        throw new Error('Email and password are required');
      }

      const res = await registerUser(data);
      
      // Validate response structure
      if (!res || !res.user) {
        throw new Error('Invalid response from server');
      }

      const userData = res.user;
      
      // Ensure user has required fields
      if (!userData.email) {
        throw new Error('User data missing email');
      }

      // Store user
      await AsyncStorage.setItem('swasth_user', JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (error) {
      // Re-throw with proper error message
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('swasth_user');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if storage fails, clear user state
      setUser(null);
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      if (!user || !user.email) {
        throw new Error('User not logged in');
      }

      // Update local user data
      const updatedUser = {
        ...user,
        ...profileData,
      };

      // Store updated user
      await AsyncStorage.setItem('swasth_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      const errorMessage = error.message || 'Failed to update profile';
      throw new Error(errorMessage);
    }
  };

  const refreshUser = async () => {
    try {
      const stored = await AsyncStorage.getItem('swasth_user');
      if (stored) {
        const parsedUser = JSON.parse(stored);
        if (parsedUser && parsedUser.email) {
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateProfile, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

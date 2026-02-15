/**
 * Auth Context Store
 * Global state management for authentication using Zustand
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Determine API URL based on environment
const getApiUrl = () => {
  // If environment variable is set, use it
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  // For web development, use localhost
  if (typeof window !== 'undefined') {
    return 'http://localhost:5000/api';
  }
  
  // Default fallback (for mobile)
  return 'http://192.168.1.100:5000/api';
};

const API_URL = getApiUrl();
console.log('🔗 API URL:', API_URL);

/**
 * Storage abstraction - works on both web and mobile
 * On web: uses localStorage
 * On mobile: uses AsyncStorage
 */
const isWeb = typeof window !== 'undefined' && !window.ReactNativeWebView;

const storage = {
  getItem: async (key) => {
    try {
      if (isWeb) {
        return localStorage.getItem(key);
      } else {
        return await AsyncStorage.getItem(key);
      }
    } catch (error) {
      console.error(`❌ Storage getItem error for ${key}:`, error);
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      if (isWeb) {
        localStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.error(`❌ Storage setItem error for ${key}:`, error);
    }
  },
  removeItem: async (key) => {
    try {
      if (isWeb) {
        localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`❌ Storage removeItem error for ${key}:`, error);
    }
  },
};

console.log(`📱 Storage Mode: ${isWeb ? 'WEB (localStorage)' : 'MOBILE (AsyncStorage)'}`);

/**
 * Create auth store
 * Manages user authentication state and operations
 */
export const useAuthStore = create((set, get) => ({
  // State
  token: null,
  user: null,
  isLoading: false,
  error: null,

  /**
   * Initialize auth from persistent storage
   */
  initAuth: async () => {
    try {
      const savedToken = await storage.getItem('authToken');
      const savedUser = await storage.getItem('userData');

      if (savedToken && savedUser) {
        set({
          token: savedToken,
          user: JSON.parse(savedUser),
        });

        // Set auth header for axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  },

  /**
   * Register new user
   * @param {object} userData - User registration data
   */
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      const { token, user } = response.data.data;

      // Save to persistent storage
      await storage.setItem('authToken', token);
      await storage.setItem('userData', JSON.stringify(user));

      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      set({
        token,
        user,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Login user
   * @param {object} credentials - Login credentials
   */
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      console.log('📤 Sending login request to:', `${API_URL}/auth/login`);
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      
      console.log('📥 Login response received:', JSON.stringify(response.data, null, 2));
      console.log('📦 response.data.data:', response.data.data);
      
      const { token, user } = response.data.data;

      console.log('🔐 Token extracted:', token ? token.substring(0, 20) + '...' : 'UNDEFINED');
      console.log('👤 User extracted:', user);
      console.log('👤 User ID:', user?.id || user?._id || 'NO ID FOUND');

      if (!token || !user) {
        throw new Error('Invalid response: missing token or user data');
      }

      // Save to persistent storage
      console.log('💾 Saving to Storage...');
      await storage.setItem('authToken', token);
      await storage.setItem('userData', JSON.stringify(user));
      console.log('✅ Storage saved');

      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('🔑 Axios header set');

      console.log('📊 Updating Zustand state with:', { 
        token: token.substring(0, 20) + '...',
        user: user?.email,
        isLoading: false 
      });
      
      set({
        token,
        user,
        isLoading: false,
      });
      
      console.log('✅ Login successful - state updated');

      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error.message);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {object} profileData - Updated profile data
   */
  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, profileData);
      const updatedUser = response.data.data.user;
      const newToken = response.data.data.token;

      // If server returned a new token (e.g. after role change), persist it and update axios header
      if (newToken) {
        await storage.setItem('authToken', newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        set({ token: newToken });
      }

      await storage.setItem('userData', JSON.stringify(updatedUser));

      set({
        user: updatedUser,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Update failed';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    console.log('═══════════════════════════════════════════');
    console.log('🟡 LOGOUT STARTED');
    console.log('═══════════════════════════════════════════');
    
    set({ isLoading: true });
    try {
      const state = get();
      const token = state.token;
      const user = state.user;
      
      console.log('📊 Pre-logout state:');
      console.log('  - Token:', token ? '✅ Present' : '❌ Missing');
      console.log('  - User:', user ? `✅ ${user.email}` : '❌ Missing');
      console.log('  - Token preview:', token ? token.substring(0, 20) + '...' : 'null');
      
      // Call logout endpoint for logging (optional, don't block logout)
      if (token) {
        try {
          console.log('🌐 Attempting to call logout endpoint...');
          console.log('   URL:', `${API_URL}/auth/logout`);
          const response = await axios.post(`${API_URL}/auth/logout`, {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('✅ Logout endpoint responded:');
          console.log('   Status:', response.status);
          console.log('   Message:', response.data?.message);
        } catch (error) {
          console.warn('⚠️  Logout endpoint error (continuing with local logout):');
          console.warn('   Error:', error.message);
          console.warn('   Status:', error.response?.status);
          console.warn('   Response:', error.response?.data);
          console.warn('   (This is not critical - client logout will proceed)');
        }
      } else {
        console.log('⚠️  No token found - skipping endpoint call');
      }

      // Clear Storage
      console.log('💾 Clearing Storage...');
      try {
        await storage.removeItem('authToken');
        console.log('   ✅ authToken removed');
        await storage.removeItem('userData');
        console.log('   ✅ userData removed');
        console.log('💾 Storage cleared successfully');
      } catch (storageError) {
        console.error('   ❌ Storage error:', storageError.message);
        throw new Error(`Failed to clear storage: ${storageError.message}`);
      }
      
      // Clear axios header
      console.log('🔑 Clearing axios authorization header...');
      delete axios.defaults.headers.common['Authorization'];
      console.log('🔑 Axios header cleared');

      // Update state - this triggers NavigationContainer re-render
      console.log('📊 Updating Zustand state...');
      const newState = {
        token: null,
        user: null,
        error: null,
        isLoading: false,
      };
      set(newState);
      console.log('✅ Zustand state updated');
      console.log('   New state:', { token: null, user: null, error: null, isLoading: false });
      
      console.log('═══════════════════════════════════════════');
      console.log('✅ LOGOUT SUCCESSFUL');
      console.log('═══════════════════════════════════════════');

    } catch (error) {
      console.error('═══════════════════════════════════════════');
      console.error('❌ LOGOUT FAILED');
      console.error('═══════════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('Full Error:', error);
      
      set({ 
        isLoading: false,
        error: error.message 
      });
      throw error;
    }
  },

  /**
   * Clear errors
   */
  clearError: () => set({ error: null }),
}));

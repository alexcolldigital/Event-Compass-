/**
 * Services Context Store
 * Global state management for services
 */

import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.100:5000/api';

export const useServicesStore = create((set) => ({
  // State
  services: [],
  selectedService: null,
  isLoading: false,
  error: null,
  filters: {
    category: null,
    state: null,
    lga: null,
    minPrice: null,
    maxPrice: null,
    keyword: null,
  },

  /**
   * Fetch all services
   */
  fetchServices: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/services`, { params });
      set({
        services: response.data.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch services',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Get service by ID
   */
  getServiceById: async (serviceId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/services/${serviceId}`);
      set({
        selectedService: response.data.data.service,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch service',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Search services
   */
  searchServices: async (searchParams) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/services`, {
        params: searchParams,
      });
      set({
        services: response.data.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Search failed',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Create service
   */
  createService: async (serviceData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/services`, serviceData);
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create service',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Update service
   */
  updateService: async (serviceId, serviceData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/services/${serviceId}`, serviceData);
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update service',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Delete service
   */
  deleteService: async (serviceId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`${API_URL}/services/${serviceId}`);
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete service',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Set filters
   */
  setFilters: (filters) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
      },
    }));
  },

  /**
   * Clear error
   */
  clearError: () => set({ error: null }),
}));

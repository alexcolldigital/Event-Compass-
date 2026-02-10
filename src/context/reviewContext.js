/**
 * Review Context Store
 * Global state management for reviews using Zustand
 */

import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.100:5000/api';

export const useReviewStore = create((set) => ({
  // State
  reviews: [],
  serviceReviews: [],
  userReviews: [],
  isLoading: false,
  error: null,

  /**
   * Create review
   */
  createReview: async (reviewData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reviews`, reviewData);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create review';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Fetch reviews for a service
   */
  fetchServiceReviews: async (serviceId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/reviews/service/${serviceId}`);
      set({
        serviceReviews: response.data.data || response.data.data.reviews,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch reviews',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Fetch reviews by user
   */
  fetchUserReviews: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/reviews/user/${userId}`);
      set({
        userReviews: response.data.data || response.data.data.reviews,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch user reviews',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Update review
   */
  updateReview: async (reviewId, reviewData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/reviews/${reviewId}`, reviewData);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update review',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Delete review
   */
  deleteReview: async (reviewId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`${API_URL}/reviews/${reviewId}`);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete review',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Mark review as helpful
   */
  markHelpful: async (reviewId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reviews/${reviewId}/helpful`);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to mark review as helpful',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Clear error
   */
  clearError: () => set({ error: null }),
}));

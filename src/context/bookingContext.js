/**
 * Booking Context Store
 * Global state management for bookings using Zustand
 */

import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.100:5000/api';

export const useBookingStore = create((set) => ({
  // State
  bookings: [],
  selectedBooking: null,
  upcomingBookings: [],
  isLoading: false,
  error: null,

  /**
   * Create booking
   */
  createBooking: async (bookingData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/bookings`, bookingData);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create booking';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Fetch user's bookings
   */
  fetchUserBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/bookings/user/my-bookings`);
      set({
        bookings: response.data.data.bookings || response.data.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch bookings',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Get booking by ID
   */
  getBookingById: async (bookingId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/bookings/${bookingId}`);
      set({
        selectedBooking: response.data.data.booking || response.data.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch booking',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Fetch upcoming bookings
   */
  fetchUpcomingBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/bookings/upcoming`);
      set({
        upcomingBookings: response.data.data || response.data.data.bookings,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch upcoming bookings',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Update booking status
   */
  updateBookingStatus: async (bookingId, statusData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${API_URL}/bookings/${bookingId}/status`,
        statusData
      );
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update booking',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Cancel booking
   */
  cancelBooking: async (bookingId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`${API_URL}/bookings/${bookingId}`);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to cancel booking',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Add booking notes
   */
  addBookingNotes: async (bookingId, notes) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${API_URL}/bookings/${bookingId}/notes`,
        { notes }
      );
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to add notes',
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

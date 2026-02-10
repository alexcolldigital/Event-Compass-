/**
 * Message Context Store
 * Global state management for messaging using Zustand
 */

import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.100:5000/api';

export const useMessageStore = create((set) => ({
  // State
  conversations: [],
  selectedConversation: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  /**
   * Send message
   */
  sendMessage: async (messageData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/messages`, messageData);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send message';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Fetch conversation with a user
   */
  fetchConversation: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/messages/conversation/${userId}`);
      set({
        selectedConversation: response.data.data || response.data.data.messages,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch conversation',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Fetch all conversations
   */
  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/messages/conversations`);
      set({
        conversations: response.data.data || response.data.data.conversations,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch conversations',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Get unread message count
   */
  fetchUnreadCount: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/messages/unread-count`);
      set({
        unreadCount: response.data.data?.count || 0,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch unread count',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Mark message as read
   */
  markMessageAsRead: async (messageId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/messages/${messageId}/read`);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to mark as read',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Delete message
   */
  deleteMessage: async (messageId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`${API_URL}/messages/${messageId}`);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete message',
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

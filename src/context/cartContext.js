/**
 * Cart Context Store
 * Global state management for shopping cart using Zustand
 */

import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  // State
  cartItems: [],
  cartTotal: 0,
  isLoading: false,

  /**
   * Add item to cart
   */
  addToCart: (item) => {
    set((state) => {
      // Check if item already exists in cart
      const existingItem = state.cartItems.find(
        (cartItem) => cartItem._id === item._id
      );

      let updatedItems;
      if (existingItem) {
        // Update quantity if item exists
        updatedItems = state.cartItems.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
            : cartItem
        );
      } else {
        // Add new item to cart
        updatedItems = [
          ...state.cartItems,
          {
            ...item,
            quantity: 1,
            cartItemId: Math.random().toString(36).substr(2, 9), // Unique ID for this cart entry
          },
        ];
      }

      return {
        cartItems: updatedItems,
        cartTotal: calculateTotal(updatedItems),
      };
    });
  },

  /**
   * Remove item from cart
   */
  removeFromCart: (cartItemId) => {
    set((state) => {
      const updatedItems = state.cartItems.filter(
        (item) => item.cartItemId !== cartItemId
      );
      return {
        cartItems: updatedItems,
        cartTotal: calculateTotal(updatedItems),
      };
    });
  },

  /**
   * Update item quantity
   */
  updateQuantity: (cartItemId, quantity) => {
    set((state) => {
      let updatedItems;
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        updatedItems = state.cartItems.filter(
          (item) => item.cartItemId !== cartItemId
        );
      } else {
        updatedItems = state.cartItems.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity } : item
        );
      }
      return {
        cartItems: updatedItems,
        cartTotal: calculateTotal(updatedItems),
      };
    });
  },

  /**
   * Clear cart
   */
  clearCart: () => {
    set({
      cartItems: [],
      cartTotal: 0,
    });
  },

  /**
   * Get cart item count
   */
  getCartItemCount: () => {
    const { cartItems } = get();
    return cartItems.length;
  },

  /**
   * Get cart summary
   */
  getCartSummary: () => {
    const { cartItems, cartTotal } = get();
    return {
      itemCount: cartItems.length,
      totalItems: cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0),
      total: cartTotal,
      items: cartItems,
    };
  },
}));

/**
 * Calculate total price for cart items
 */
function calculateTotal(items) {
  return items.reduce((total, item) => {
    const price = item.basePrice || item.price || 0;
    const quantity = item.quantity || 1;
    return total + price * quantity;
  }, 0);
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const useCartStore = create(
  persist(
    (set, get) => ({
      sessionId: null,
      cart: { items: [] },
      isLoading: false,

      initializeSession: async () => {
        let sessionId = get().sessionId;
        if (!sessionId) {
          sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          set({ sessionId });
        }
        try {
          const response = await axios.get(`${API}/cart/${sessionId}`);
          set({ cart: response.data });
        } catch (error) {
          console.error('Error initializing session:', error);
        }
      },

      fetchCart: async () => {
        const sessionId = get().sessionId;
        if (!sessionId) return;
        
        try {
          const response = await axios.get(`${API}/cart/${sessionId}`);
          set({ cart: response.data });
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      },

      addToCart: async (product, quantity = 1) => {
        const sessionId = get().sessionId;
        if (!sessionId) {
          await get().initializeSession();
        }
        
        set({ isLoading: true });
        try {
          await axios.post(`${API}/cart/${get().sessionId}/add`, {
            product_id: product.id,
            quantity
          });
          await get().fetchCart();
        } catch (error) {
          console.error('Error adding to cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      removeFromCart: async (productId) => {
        const sessionId = get().sessionId;
        if (!sessionId) return;
        
        try {
          await axios.delete(`${API}/cart/${sessionId}/item/${productId}`);
          await get().fetchCart();
        } catch (error) {
          console.error('Error removing from cart:', error);
        }
      },

      updateQuantity: async (productId, quantity) => {
        const sessionId = get().sessionId;
        if (!sessionId) return;
        
        try {
          await axios.put(`${API}/cart/${sessionId}/item/${productId}?quantity=${quantity}`);
          await get().fetchCart();
        } catch (error) {
          console.error('Error updating quantity:', error);
        }
      },

      getCartCount: () => {
        const cart = get().cart;
        return cart.items.reduce((total, item) => total + item.quantity, 0);
      },

      getCartTotal: () => {
        const cart = get().cart;
        return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ sessionId: state.sessionId }),
    }
  )
);

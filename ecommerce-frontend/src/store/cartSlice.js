import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getSessionId = () => {
  let sessionId = sessionStorage.getItem('cartSessionId');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('cartSessionId', sessionId);
  }
  return sessionId;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
    sessionId: getSessionId(),
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setCartItems: (state, action) => {
      state.items = action.payload;
      state.loading = false;
    },
    addItemToState: (state, action) => {
      const existingIndex = state.items.findIndex(item => item.productId === action.payload.productId);
      if (existingIndex !== -1) {
        state.items[existingIndex].quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeItemFromState: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCartState: (state) => {
      state.items = [];
    },
  },
});

export const {
  setLoading,
  setError,
  setCartItems,
  addItemToState,
  removeItemFromState,
  clearCartState,
} = cartSlice.actions;

// Fetch cart from backend
export const fetchCart = () => async (dispatch) => {
  const sessionId = getSessionId();
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`${API_URL}/cart/${sessionId}`);
    dispatch(setCartItems(response.data));
  } catch (error) {
    console.error('Fetch cart error:', error);
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};

// Add to cart
export const addToCart = (productId, quantity = 1) => async (dispatch, getState) => {
  const sessionId = getSessionId();
  dispatch(setLoading(true));
  try {
    // First, get product details from products API
    const productResponse = await axios.get(`${API_URL}/products/${productId}`);
    const product = productResponse.data;
    
    // Add to cart via API
    const response = await axios.post(`${API_URL}/cart`, {
      sessionId,
      productId,
      quantity,
    });
    
    console.log('Added to cart:', response.data);
    
    // Refresh cart
    await dispatch(fetchCart());
    return response.data;
  } catch (error) {
    console.error('Add to cart error:', error);
    dispatch(setError(error.message));
    dispatch(setLoading(false));
    throw error;
  }
};

// Update cart item quantity
export const updateCartItem = (id, quantity) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await axios.put(`${API_URL}/cart/${id}`, { quantity });
    await dispatch(fetchCart());
  } catch (error) {
    console.error('Update cart error:', error);
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};

// Remove from cart
export const removeFromCart = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await axios.delete(`${API_URL}/cart/${id}`);
    await dispatch(fetchCart());
  } catch (error) {
    console.error('Remove from cart error:', error);
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};

// Clear cart
export const clearCart = () => async (dispatch) => {
  const sessionId = getSessionId();
  dispatch(setLoading(true));
  try {
    await axios.delete(`${API_URL}/cart/clear/${sessionId}`);
    dispatch(clearCartState());
    dispatch(setLoading(false));
  } catch (error) {
    console.error('Clear cart error:', error);
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};

// Place order - FIXED: Returns data directly, no unwrap needed
export const placeOrder = (orderData) => async (dispatch) => {
  const sessionId = getSessionId();
  dispatch(setLoading(true));
  try {
    const response = await axios.post(`${API_URL}/orders`, {
      ...orderData,
      sessionId,
    });
    await dispatch(clearCart());
    dispatch(setLoading(false));
    // Return the data directly
    return response.data;
  } catch (error) {
    console.error('Place order error:', error);
    dispatch(setError(error.message));
    dispatch(setLoading(false));
    throw error;
  }
};

export default cartSlice.reducer;
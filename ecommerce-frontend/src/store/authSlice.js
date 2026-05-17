import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setLoading, setError, loginSuccess, logout, clearError } = authSlice.actions;

// Register user
export const register = (userData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    dispatch(loginSuccess({ user: response.data.user, token: response.data.token }));
    return response.data;
  } catch (error) {
    dispatch(setError(error.response?.data?.error || 'Registration failed'));
    throw error;
  }
};

// Login user
export const login = (credentials) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post(`${API_URL}/users/login`, credentials);
    dispatch(loginSuccess({ user: response.data.user, token: response.data.token }));
    return response.data;
  } catch (error) {
    dispatch(setError(error.response?.data?.error || 'Login failed'));
    throw error;
  }
};

// Get current user
export const getCurrentUser = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  if (!token) return;
  
  try {
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch(loginSuccess({ user: response.data, token }));
  } catch (error) {
    dispatch(logout());
  }
};

export default authSlice.reducer;
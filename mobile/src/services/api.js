import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

// Configure base URL - update this for production
const API_URL = __DEV__ ? 'http://localhost:3000/api' : 'https://api.lanarecipe.com/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';
import { auth } from '../config/firebase.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Firebase ID token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting Firebase token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      try {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken(true); // Force refresh
          error.config.headers.Authorization = `Bearer ${token}`;
          return apiClient.request(error.config);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

import axios from 'axios';

// Create configured Axios instance using environment variable with fallback
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    // Check for user token or admin token
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for uniform error response handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract server message if available
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;

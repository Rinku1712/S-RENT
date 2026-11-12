import axios from 'axios';

// Create configured Axios instance using environment variable with fallback
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to automatically attach JWT token & handle FormData
api.interceptors.request.use(
  (config) => {
    // If request payload is FormData, remove Content-Type header so browser computes multipart boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    // If requesting admin route or category management, prefer adminToken
    const isAdminUrl =
      config.url?.includes('/admin') ||
      config.url?.includes('/dashboard/admin') ||
      (config.url?.includes('/category') && config.method !== 'get');
    const token = isAdminUrl
      ? localStorage.getItem('adminToken') || localStorage.getItem('token')
      : localStorage.getItem('token') || localStorage.getItem('adminToken');

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

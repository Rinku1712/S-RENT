import api from './api';

export const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const verifyOTP = async (otpData) => {
  const response = await api.post('/auth/verify-otp', otpData);
  return response.data;
};

export const resendOTP = async (emailData) => {
  const response = await api.post('/auth/resend-otp', emailData);
  return response.data;
};

export const forgotPassword = async (emailData) => {
  const response = await api.post('/auth/forgot-password', emailData);
  return response.data;
};

export const resetPassword = async (resetData) => {
  const response = await api.post('/auth/reset-password', resetData);
  return response.data;
};

export const adminLogin = async (credentials) => {
  const response = await api.post('/api/admin/login', credentials);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/api/users/profile');
  return response.data;
};

import api from './api';

export const getCommonDashboard = async () => {
  const response = await api.get('/api/dashboard/common');
  return response.data;
};

export const getUserDashboard = async () => {
  const response = await api.get('/api/dashboard/user');
  return response.data;
};

export const getAdminDashboard = async () => {
  const response = await api.get('/api/dashboard/admin');
  return response.data;
};

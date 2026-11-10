import api from './api';

export const getAdminProfile = async () => {
  const response = await api.get('/api/admin/profile');
  return response.data;
};

export const getAdminUsers = async (params = {}) => {
  const cleanParams = {};
  Object.keys(params).forEach((key) => {
    if (params[key] !== '' && params[key] !== undefined && params[key] !== null) {
      cleanParams[key] = params[key];
    }
  });

  const response = await api.get('/api/admin/users', { params: cleanParams });
  return response.data;
};

export const updateUserStatus = async (userId, accountStatus) => {
  const response = await api.patch(`/api/admin/users/${userId}/status`, { accountStatus });
  return response.data;
};

export const getAdminItems = async (params = {}) => {
  const cleanParams = {};
  Object.keys(params).forEach((key) => {
    if (params[key] !== '' && params[key] !== undefined && params[key] !== null) {
      cleanParams[key] = params[key];
    }
  });

  const response = await api.get('/api/admin/items', { params: cleanParams });
  return response.data;
};

export const deleteAdminItem = async (itemId) => {
  const response = await api.delete(`/api/admin/items/${itemId}`);
  return response.data;
};

export const getAdminRentals = async (params = {}) => {
  const cleanParams = {};
  Object.keys(params).forEach((key) => {
    if (params[key] !== '' && params[key] !== undefined && params[key] !== null) {
      cleanParams[key] = params[key];
    }
  });

  const response = await api.get('/api/admin/rentals', { params: cleanParams });
  return response.data;
};

import api from './api';

export const getCategories = async () => {
  const response = await api.get('/api/category');
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await api.post('/api/category', categoryData);
  return response.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/api/category/${id}`, categoryData);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/api/category/${id}`);
  return response.data;
};

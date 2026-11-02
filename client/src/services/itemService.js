import api from './api';

export const getAllItems = async () => {
  const response = await api.get('/api/item');
  // Backend returns: { message: "...", result: { item: [...] } }
  return response.data?.result?.item || [];
};

export const searchItems = async (params = {}) => {
  const cleanParams = {};
  Object.keys(params).forEach((key) => {
    if (params[key] !== '' && params[key] !== undefined && params[key] !== null) {
      cleanParams[key] = params[key];
    }
  });

  const response = await api.get('/api/item/search', { params: cleanParams });
  return response.data;
};

export const createItem = async (itemData) => {
  const response = await api.post('/api/item', itemData);
  return response.data;
};

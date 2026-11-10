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
  const isMultipart = itemData instanceof FormData;
  const response = await api.post('/api/item', itemData, {
    headers: isMultipart ? { 'Content-Type': 'multipart/form-data' } : undefined,
  });
  return response.data;
};

export const updateItemImages = async (itemId, files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));

  const response = await api.patch(`/api/item/${itemId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteItem = async (itemId) => {
  const response = await api.delete(`/api/item/${itemId}`);
  return response.data;
};

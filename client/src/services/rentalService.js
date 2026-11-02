import api from './api';

export const createRental = async (rentalData) => {
  const response = await api.post('/api/rentals', rentalData);
  return response.data;
};

export const getOwnerRentalRequests = async () => {
  const response = await api.get('/api/rentals/owner/requests');
  return response.data;
};

export const approveRentalRequest = async (rentalId) => {
  const response = await api.patch(`/api/rentals/${rentalId}/approve`);
  return response.data;
};

export const rejectRentalRequest = async (rentalId) => {
  const response = await api.patch(`/api/rentals/${rentalId}/reject`);
  return response.data;
};

import api from './api';

export const getOrdersByUser = async (userId) =>
  (await api.get('/orders', { params: { userId } })).data;

export const createOrder = async (order) =>
  (await api.post('/orders', order)).data;

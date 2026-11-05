
import api from './api';

export const getCart = async (userId) => {
  const response = await api.get('/carts', {
    params: { userId },
  });

  return response.data[0] || null;
};

export const saveCart = async (userId, items) => {
  const existing = await getCart(userId);

  const data = { userId: String(userId), items };

  if (existing) {
    const response = await api.patch(`/carts/${existing.id}`, data);
    return response.data;
  }

  const response = await api.post('/carts', data);
  return response.data;
};


import api from './api';

export const getWishlist = async (userId) => {
  const response = await api.get('/wishlists', {
    params: { userId },
  });

  return response.data[0] || null;
};

export const saveWishlist = async (userId, items) => {
  const existing = await getWishlist(userId);

  const data = {
    userId: String(userId),
    items,
  };

  if (existing) {
    const response = await api.patch(
      `/wishlists/${existing.id}`,
      data
    );
    return response.data;
  }

  const response = await api.post('/wishlists', data);
  return response.data;
};

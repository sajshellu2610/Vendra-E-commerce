import api from './api';

export const getProducts = async () => (await api.get('/products')).data;
export const getProductById = async (id) => (await api.get(`/products/${id}`)).data;

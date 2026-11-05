import api from './api';

export const getUsers = async () => (await api.get('/users')).data;
export const registerUser = async (user) => (await api.post('/users', user)).data;

export async function loginUser({ email, password }) {
  const { data } = await api.get('/users', { params: { email, password } });
  return data[0] || null;
}

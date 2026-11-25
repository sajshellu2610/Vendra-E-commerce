
import api from "./api";

export const getUsers = async () =>
  (await api.get("/users")).data;

export const registerUser = async (user) =>
  (await api.post("/users", user)).data;

export const updateUser = async (id, userData) =>
  (await api.patch(`/users/${id}`, userData)).data;

export async function loginUser({ email, password }) {
  const { data } = await api.get("/users", {
    params: { email, password },
  });

  const user = data[0];

  if (!user) {
    return null;
  }

  if (user.isBlocked === true) {
    throw new Error("Your account has been blocked by admin.");
  }

  return user;
}

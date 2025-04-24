import api from "./apiService";
import endpoints from "./endpoints";

export const login = async (email, password) => {
  try {
    const response = await api.post(endpoints.auth.login, { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post(endpoints.auth.register, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

import API from "./api";

export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await API.post("/auth/login", userData);
  return response.data;
};

export const getCurrentUserProfile = async () => {
  const response = await API.get("/auth/me");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await API.put("/auth/profile", profileData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await API.put("/auth/change-password", passwordData);
  return response.data;
};
import API from "./axios";

export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  return response.data;
};

export const firebaseLoginUser = async (idToken) => {
  const response = await API.post("/auth/firebase", { idToken });
  return response.data;
};

export const logoutUser = async () => {
  const response = await API.post("/auth/logout");
  return response.data;
};

export const getMe = async () => {
  const response = await API.get("/auth/me");
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await API.put("/auth/profile", profileData);
  return response.data;
};


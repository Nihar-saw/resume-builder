import API from "./axios";

export const createPortfolio = async (resumeId) => {
  const response = await API.post("/portfolio", { resumeId });
  return response.data;
};

export const getPublicResume = async (slug) => {
  const response = await API.get(`/portfolio/${slug}`);
  return response.data;
};

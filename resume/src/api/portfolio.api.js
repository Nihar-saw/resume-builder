import API from "./axios";

export const createPortfolio = async (resumeId, theme = "auto") => {
  const response = await API.post("/portfolio", { resumeId, theme });
  return response.data;
};

export const getPublicResume = async (slug) => {
  const response = await API.get(`/portfolio/${slug}`);
  return response.data;
};

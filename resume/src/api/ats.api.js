import API from "./axios";

export const analyzeATS = async (atsData) => {
  const response = await API.post("/ats/analyze", atsData);
  return response.data;
};

export const getATSReport = async (resumeId) => {
  const response = await API.get(`/ats/${resumeId}`);
  return response.data;
};

export const deleteATSReport = async (resumeId) => {
  const response = await API.delete(`/ats/${resumeId}`);
  return response.data;
};

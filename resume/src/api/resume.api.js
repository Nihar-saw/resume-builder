import API from "./axios";

export const createResume = async (resumeData) => {
  const response = await API.post("/resume", resumeData);
  return response.data;
};

export const getAllResumes = async () => {
  const response = await API.get("/resume");
  return response.data;
};

export const getResumeById = async (id) => {
  const response = await API.get(`/resume/${id}`);
  return response.data;
};

export const updateResume = async (id, resumeData) => {
  const response = await API.put(`/resume/${id}`, resumeData);
  return response.data;
};

export const deleteResume = async (id) => {
  const response = await API.delete(`/resume/${id}`);
  return response.data;
};

export const duplicateResume = async (id) => {
  const response = await API.post(`/resume/${id}/duplicate`);
  return response.data;
};

export const changeTemplate = async (id, template) => {
  const response = await API.patch(`/templates/${id}`, { template });
  return response.data;
};

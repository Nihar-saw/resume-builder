import API from "./axios";

export const improveSummary = async (summary, jobTitle) => {
  const response = await API.post("/ai/summary", { summary, jobTitle }, { timeout: 180000 });
  return response.data;
};

export const improveExperience = async (experience, jobTitle) => {
  const response = await API.post("/ai/experience", { experience, jobTitle }, { timeout: 180000 });
  return response.data;
};

export const suggestSkills = async (resume, jobDescription) => {
  const response = await API.post("/ai/skills", { resume, jobDescription }, { timeout: 180000 });
  return response.data;
};

export const generateCoverLetter = async (resume, company, jobTitle) => {
  const response = await API.post("/ai/cover-letter", { resume, company, jobTitle }, { timeout: 180000 });
  return response.data;
};

export const generateInterviewQuestions = async (resume, jobTitle) => {
  const response = await API.post("/ai/interview", { resume, jobTitle }, { timeout: 180000 });
  return response.data;
};

export const generateResumeFromPrompt = async (prompt) => {
  const response = await API.post("/ai/generate", { prompt }, { timeout: 300000 });
  return response.data;
};

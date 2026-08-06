import API from "./axios";

export const createPortfolio = async (resumeId, theme = "auto") => {
  const response = await API.post("/portfolio", { resumeId, theme });
  return response.data;
};

export const getPublicResume = async (slug) => {
  const response = await API.get(`/portfolio/${slug}`);
  return response.data;
};

export const downloadPortfolioZip = async (resumeId, theme = "auto") => {
  const response = await API.post("/docx/download-zip", { resumeId, theme }, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `portfolio-${resumeId}.zip`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

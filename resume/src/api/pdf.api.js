import API from "./axios";

export const downloadPDF = async (id, title = "resume") => {
  const response = await API.get(`/pdf/${id}`, {
    responseType: "blob",
  });
  
  const blob = new Blob([response.data], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = `${title}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
};

export const downloadDOCX = async (id, title = "resume") => {
  const response = await API.get(`/docx/${id}`, {
    responseType: "blob",
  });
  
  const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = `${title}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
};

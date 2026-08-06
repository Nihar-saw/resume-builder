import API from "./axios";

export const parseResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  const { data } = await API.post("/parser", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

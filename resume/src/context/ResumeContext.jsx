import { createContext, useState, useContext, useCallback } from "react";
import {
  createResume as apiCreateResume,
  getAllResumes as apiGetAllResumes,
  getResumeById as apiGetResumeById,
  updateResume as apiUpdateResume,
  deleteResume as apiDeleteResume,
  duplicateResume as apiDuplicateResume,
  changeTemplate as apiChangeTemplate,
} from "../api/resume.api";

export const ResumeContext = createContext(null);

export const ResumeProvider = ({ children }) => {
  const [resumes, setResumes] = useState([]);
  const [currentResume, setCurrentResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGetAllResumes();
      if (data.success) {
        setResumes(data.resumes || []);
      }
    } catch (error) {
      console.error("Failed to fetch resumes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchResumeById = useCallback(async (id) => {
    setLoading(true);
    try {
      const data = await apiGetResumeById(id);
      if (data.success) {
        setCurrentResume(data.resume);
        return data.resume;
      }
    } catch (error) {
      console.error(`Failed to fetch resume ${id}:`, error);
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  const createNewResume = async (title = "Untitled Resume") => {
    setLoading(true);
    try {
      const defaultResume = {
        title,
        template: "modern",
        personalInfo: {
          fullName: "",
          email: "",
          phone: "",
          location: "",
          website: "",
          linkedin: "",
          github: "",
          portfolio: "",
          summary: "",
        },
        education: [],
        experience: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
        customSections: [],
      };
      const data = await apiCreateResume(defaultResume);
      if (data.success) {
        setResumes((prev) => [data.resume, ...prev]);
        return data.resume;
      }
    } catch (error) {
      console.error("Failed to create resume:", error);
    } finally {
      setLoading(false);
    }
    return null;
  };

  const updateCurrentResume = async (id, updatedFields) => {
    setSaving(true);
    try {
      const data = await apiUpdateResume(id, updatedFields);
      if (data.success) {
        setCurrentResume(data.resume);
        setResumes((prev) =>
          prev.map((res) => (res._id === id ? data.resume : res))
        );
        return data.resume;
      }
    } catch (error) {
      console.error("Failed to update resume:", error);
    } finally {
      setSaving(false);
    }
    return null;
  };

  const deleteResumeById = async (id) => {
    try {
      const data = await apiDeleteResume(id);
      if (data.success) {
        setResumes((prev) => prev.filter((res) => res._id !== id));
        if (currentResume && currentResume._id === id) {
          setCurrentResume(null);
        }
        return true;
      }
    } catch (error) {
      console.error("Failed to delete resume:", error);
    }
    return false;
  };

  const duplicateResumeById = async (id) => {
    try {
      const data = await apiDuplicateResume(id);
      if (data.success) {
        setResumes((prev) => [data.resume, ...prev]);
        return data.resume;
      }
    } catch (error) {
      console.error("Failed to duplicate resume:", error);
    }
    return null;
  };

  const changeResumeTemplate = async (id, templateName) => {
    try {
      const data = await apiChangeTemplate(id, templateName);
      if (data.success) {
        setCurrentResume(data.resume);
        setResumes((prev) =>
          prev.map((res) => (res._id === id ? data.resume : res))
        );
        return data.resume;
      }
    } catch (error) {
      console.error("Failed to change template:", error);
    }
    return null;
  };

  return (
    <ResumeContext.Provider
      value={{
        resumes,
        currentResume,
        setCurrentResume,
        loading,
        saving,
        fetchResumes,
        fetchResumeById,
        createNewResume,
        updateCurrentResume,
        deleteResumeById,
        duplicateResumeById,
        changeResumeTemplate,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => useContext(ResumeContext);

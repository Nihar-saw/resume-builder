import { useState } from "react";
import {
  improveSummary,
  improveExperience,
  suggestSkills,
  generateCoverLetter,
} from "../api/ai.api";

const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cleanTextOutput = (data) => {
    return data.result || "";
  };

  const getImprovedSummary = async (summary, jobTitle) => {
    setLoading(true);
    setError(null);
    try {
      const data = await improveSummary(summary, jobTitle);
      return cleanTextOutput(data);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getImprovedExperience = async (experience, jobTitle) => {
    setLoading(true);
    setError(null);
    try {
      const data = await improveExperience(experience, jobTitle);
      return cleanTextOutput(data);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSkillsSuggestions = async (resume, jobDescription) => {
    setLoading(true);
    setError(null);
    try {
      const data = await suggestSkills(resume, jobDescription);
      return cleanTextOutput(data);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCoverLetter = async (resume, company, jobTitle) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateCoverLetter(resume, company, jobTitle);
      return cleanTextOutput(data);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getImprovedSummary,
    getImprovedExperience,
    getSkillsSuggestions,
    getCoverLetter,
    loading,
    error,
  };
};

export default useAI;

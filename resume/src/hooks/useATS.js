import { useState } from "react";
import { analyzeATS as apiAnalyzeATS, getATSReport as apiGetATSReport } from "../api/ats.api";

const useATS = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkATS = async (atsData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiAnalyzeATS(atsData);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to scan ATS");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getReport = async (resumeId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetATSReport(resumeId);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load report");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { checkATS, getReport, loading, error };
};

export default useATS;

import { useState, useEffect } from "react";
import { getAllResumes } from "../api/resume.api";
import { analyzeATS, getATSReport } from "../api/ats.api";
import { IoCloudUploadOutline, IoShieldCheckmarkOutline, IoTrendingUpOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Loader from "../components/common/Loader";
import { toast } from "react-hot-toast";

const ATSChecker = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingResumes, setFetchingResumes] = useState(true);
  const [report, setReport] = useState(null);

  useEffect(() => {
    const loadResumes = async () => {
      try {
        const data = await getAllResumes();
        if (data.success && data.resumes.length > 0) {
          setResumes(data.resumes);
          setSelectedResumeId(data.resumes[0]._id);
          
          // Pre-fetch report if there is one
          fetchExistingReport(data.resumes[0]._id);
        }
      } catch (error) {
        console.error("Failed to load resumes:", error);
      } finally {
        setFetchingResumes(false);
      }
    };
    loadResumes();
  }, []);

  const fetchExistingReport = async (resumeId) => {
    try {
      const data = await getATSReport(resumeId);
      if (data.success && data.report) {
        setReport(data.report);
      } else {
        setReport(null);
      }
    } catch (error) {
      setReport(null);
    }
  };

  const handleResumeChange = (e) => {
    const id = e.target.value;
    setSelectedResumeId(id);
    fetchExistingReport(id);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!selectedResumeId) {
      toast.error("Please select a resume first");
      return;
    }
    if (!jobDescription) {
      toast.error("Please paste the job description");
      return;
    }

    setLoading(true);
    setReport(null);
    try {
      const data = await analyzeATS({
        resumeId: selectedResumeId,
        jobDescription,
        jobTitle: jobTitle || "Target Role",
      });
      if (data.success) {
        setReport(data.report);
        toast.success("ATS scan complete!");
      }
    } catch (error) {
      console.error("ATS scan failed:", error);
      toast.error("ATS scan failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6 text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">ATS Checker</h2>
        <p className="mt-1 text-sm text-slate-500">
          Analyze your resume keyword matching and layout structure against job specifications.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Side: Upload & Input Form */}
        <form onSubmit={handleAnalyze} className="space-y-6">
          <Card className="space-y-6 text-left">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <IoCloudUploadOutline className="h-5 w-5 text-indigo-600" />
              Upload Details
            </h3>

            {fetchingResumes ? (
              <Loader size="md" />
            ) : resumes.length === 0 ? (
              <div className="text-center p-4 border border-dashed border-slate-200 rounded-xl">
                <p className="text-sm text-slate-500">You need to create a resume first.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-semibold text-slate-700">Select Resume</label>
                <select
                  value={selectedResumeId}
                  onChange={handleResumeChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-base text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all duration-200"
                >
                  {resumes.map((res) => (
                    <option key={res._id} value={res._id}>
                      {res.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Input
              label="Target Job Title"
              name="jobTitle"
              placeholder="e.g. Full Stack Developer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />

            <Input
              label="Job Description"
              name="jobDescription"
              type="textarea"
              placeholder="Paste the job description here to extract keywords..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
              disabled={resumes.length === 0}
            >
              Check ATS Score
            </Button>
          </Card>
        </form>

        {/* Right Side: ATS Score Result Panel */}
        <div className="space-y-6">
          {loading ? (
            <Card className="flex flex-col items-center justify-center py-20 text-center">
              <Loader size="lg" className="mb-4" />
              <h4 className="font-bold text-slate-800">Analyzing Resume...</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">Scanning text structures, mapping skills, and fetching score metrics.</p>
            </Card>
          ) : report ? (
            <Card className="space-y-6 text-left relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <h4 className="text-xl font-bold text-slate-900 flex items-center gap-1.5 justify-center sm:justify-start">
                    <IoShieldCheckmarkOutline className="h-5 w-5 text-indigo-600" />
                    ATS Score Result
                  </h4>
                  <p className="text-xs font-semibold text-emerald-600 mt-2 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {report.overallScore >= 80 ? "Highly Optimized" : report.overallScore >= 50 ? "Moderate Match" : "Needs Improvement"}
                  </p>
                </div>
                
                {/* Circular Score Badge */}
                <div className="relative flex items-center justify-center h-24 w-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#10b981"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - report.overallScore / 100)}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <span className="absolute text-2xl font-black text-slate-800">{report.overallScore}%</span>
                </div>
              </div>

              {/* Progress Scores */}
              <div className="space-y-4">
                {[
                  { label: "Keywords Match", value: report.keywordScore || 0 },
                  { label: "Format & Structure", value: report.formattingScore || 0 },
                  { label: "Content Optimization", value: report.contentScore || 0 },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggestions */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h5 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <IoTrendingUpOutline className="h-4.5 w-4.5 text-indigo-600" />
                  Suggestions to Improve
                </h5>
                <ul className="space-y-2.5">
                  {report.suggestions?.map((suggestion, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-600 leading-relaxed">
                      <IoCheckmarkCircleOutline className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                  {(!report.suggestions || report.suggestions.length === 0) && (
                    <li className="text-sm text-slate-500">Perfect match! No suggestions found.</li>
                  )}
                </ul>
              </div>

              {/* Keywords Match Lists */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                {/* Matched Keywords */}
                {report.matchedKeywords && report.matchedKeywords.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Matched Keywords</h5>
                    <div className="flex flex-wrap gap-2">
                      {report.matchedKeywords.map((kw, idx) => (
                        <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-150 rounded-xl px-2.5 py-1 text-[10px] font-bold capitalize">
                          ✓ {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Keywords */}
                {report.missingKeywords && report.missingKeywords.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Missing Keywords (Recommend adding)</h5>
                    <div className="flex flex-wrap gap-2">
                      {report.missingKeywords.map((kw, idx) => (
                        <span key={idx} className="bg-rose-50 text-rose-700 border border-rose-150 rounded-xl px-2.5 py-1 text-[10px] font-bold capitalize">
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center py-20 text-center border-dashed">
              <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
                <IoShieldCheckmarkOutline className="h-8 w-8" />
              </div>
              <h4 className="font-bold text-slate-700 text-sm">No Report Available</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                Fill in the details on the left and run a check to calculate your score metrics.
              </p>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
};

export default ATSChecker;

import { useState, useEffect } from "react";
import { getAllResumes } from "../api/resume.api";
import {
  improveSummary,
  improveExperience,
  suggestSkills,
  generateCoverLetter,
  generateInterviewQuestions,
} from "../api/ai.api";
import {
  IoSparklesOutline,
  IoDocumentTextOutline,
  IoBriefcaseOutline,
  IoHardwareChipOutline,
  IoMailOutline,
  IoPeopleOutline,
  IoClipboardOutline,
} from "react-icons/io5";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Loader from "../components/common/Loader";
import { toast } from "react-hot-toast";

const AIAssistant = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [selectedTab, setSelectedTab] = useState("summary");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  // Input states
  const [summaryText, setSummaryText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [experienceText, setExperienceText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    const loadResumes = async () => {
      try {
        const data = await getAllResumes();
        if (data.success && data.resumes.length > 0) {
          setResumes(data.resumes);
          setSelectedResumeId(data.resumes[0]._id);
        }
      } catch (error) {
        console.error("Failed to load resumes:", error);
      }
    };
    loadResumes();
  }, []);

  const handleAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      let data;
      if (selectedTab === "summary") {
        if (!summaryText) throw new Error("Please write your professional summary first");
        data = await improveSummary(summaryText, jobTitle);
      } else if (selectedTab === "experience") {
        if (!experienceText) throw new Error("Please paste your experience bullets first");
        data = await improveExperience(experienceText, jobTitle);
      } else if (selectedTab === "skills") {
        if (!selectedResumeId) throw new Error("Please select a resume");
        if (!jobDescription) throw new Error("Please paste the target job description");
        const resumeObj = resumes.find(r => r._id === selectedResumeId);
        data = await suggestSkills(resumeObj, jobDescription);
      } else if (selectedTab === "cover") {
        if (!selectedResumeId) throw new Error("Please select a resume");
        if (!companyName) throw new Error("Please enter the company name");
        if (!jobTitle) throw new Error("Please enter the target job title");
        const resumeObj = resumes.find(r => r._id === selectedResumeId);
        data = await generateCoverLetter(resumeObj, companyName, jobTitle);
      } else if (selectedTab === "interview") {
        if (!selectedResumeId) throw new Error("Please select a resume");
        if (!jobTitle) throw new Error("Please enter the target job title");
        const resumeObj = resumes.find(r => r._id === selectedResumeId);
        data = await generateInterviewQuestions(resumeObj, jobTitle);
      }

      if (data && data.success) {
        // Result could be array or string. Handle safely.
        if (Array.isArray(data.result)) {
          setResult(data.result.join("\n\n"));
        } else if (typeof data.result === "object") {
          setResult(JSON.stringify(data.result, null, 2));
        } else {
          setResult(data.result || "No suggestions returned");
        }
        toast.success("AI Generation Complete!");
      }
    } catch (error) {
      console.error("AI Action failed:", error);
      toast.error(error.message || "Failed to query AI");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast.success("Copied to clipboard!");
  };

  const tabs = [
    { id: "summary", label: "Improve Summary", icon: IoDocumentTextOutline },
    { id: "experience", label: "Improve Experience", icon: IoBriefcaseOutline },
    { id: "skills", label: "Skills Suggestion", icon: IoHardwareChipOutline },
    { id: "cover", label: "Cover Letter", icon: IoMailOutline },
    { id: "interview", label: "Interview Q&A", icon: IoPeopleOutline },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6 text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">AI Resume Assistant</h2>
        <p className="mt-1 text-sm text-slate-500">
          Utilize smart suggestions powered by Ollama integration to write high-impact resume content.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Tabs List */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedTab(tab.id);
                  setResult("");
                }}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold text-left transition-all ${
                  selectedTab === tab.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                    : "bg-white text-slate-600 border border-slate-100 hover:bg-slate-50"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {tab.label}
              </button>
            );
          })}
          
          {/* Mascot Visual container */}
          <div className="hidden lg:flex flex-col items-center justify-center p-6 border border-slate-100 bg-indigo-50/50 rounded-2xl relative overflow-hidden mt-6 text-center">
            <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/5 rounded-full blur-xl" />
            <div className="h-16 w-16 bg-indigo-600/10 text-indigo-600 rounded-full flex items-center justify-center mb-3 animate-float">
              <span className="text-3xl">🤖</span>
            </div>
            <h5 className="font-bold text-slate-800 text-xs">Need specific updates?</h5>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">AI tips will help update sections automatically inside the builder.</p>
          </div>
        </div>

        {/* Right Tab Content & Output */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleAction}>
            <Card className="space-y-6 text-left">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                <IoSparklesOutline className="h-5 w-5 text-indigo-600" />
                Configure Prompt
              </h3>

              {/* Conditionally render fields */}
              {(selectedTab === "skills" || selectedTab === "cover" || selectedTab === "interview") && (
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-semibold text-slate-700">Select Resume Context</label>
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
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

              {(selectedTab === "summary" || selectedTab === "experience" || selectedTab === "cover" || selectedTab === "interview") && (
                <Input
                  label="Target Job Title"
                  name="jobTitle"
                  placeholder="e.g. Senior Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              )}

              {selectedTab === "cover" && (
                <Input
                  label="Company Name"
                  name="companyName"
                  placeholder="e.g. Google"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              )}

              {selectedTab === "summary" && (
                <Input
                  label="Current Summary"
                  name="summaryText"
                  type="textarea"
                  placeholder="Paste your current professional summary here..."
                  value={summaryText}
                  onChange={(e) => setSummaryText(e.target.value)}
                />
              )}

              {selectedTab === "experience" && (
                <Input
                  label="Current Experience Description"
                  name="experienceText"
                  type="textarea"
                  placeholder="e.g. Maintained codebase and managed client queries."
                  value={experienceText}
                  onChange={(e) => setExperienceText(e.target.value)}
                />
              )}

              {selectedTab === "skills" && (
                <Input
                  label="Target Job Description"
                  name="jobDescription"
                  type="textarea"
                  placeholder="Paste the target job description to match skills..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                loading={loading}
              >
                Generate suggestions
              </Button>
            </Card>
          </form>

          {/* AI Result Container */}
          {(result || loading) && (
            <Card className="text-left space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <IoSparklesOutline className="h-4.5 w-4.5 text-violet-500" />
                  AI Suggested Output
                </h4>
                {result && (
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="text-xs py-1.5 px-3 flex items-center gap-1"
                  >
                    <IoClipboardOutline className="h-4 w-4" />
                    Copy
                  </Button>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Loader size="md" className="mb-2" />
                  <p className="text-xs text-slate-400">Ollama model is synthesizing responses...</p>
                </div>
              ) : (
                <pre className="text-sm font-medium text-slate-600 whitespace-pre-wrap font-sans leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100 max-h-96 overflow-y-auto">
                  {result}
                </pre>
              )}
            </Card>
          )}
        </div>

      </div>
    </div>
  );
};

export default AIAssistant;

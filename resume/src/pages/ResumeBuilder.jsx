import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useResume } from "../context/ResumeContext";
import { downloadPDF, downloadDOCX } from "../api/pdf.api";
import { generateResumeFromPrompt } from "../api/ai.api";
import {
  IoChevronBackOutline,
  IoEyeOutline,
  IoDownloadOutline,
  IoCloudDoneOutline,
  IoSyncOutline,
  IoTrashOutline,
  IoAddOutline,
} from "react-icons/io5";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Loader from "../components/common/Loader";

const RESUME_STYLES = [
  {
    name: "Modern Minimal",
    wrapper: "bg-white font-sans text-slate-800",
    header: "border-b border-slate-100 pb-4 mb-4",
    nameText: "text-xl font-bold text-slate-900 leading-none",
    titleText: "text-xs text-indigo-600 font-semibold mt-1.5",
    sectionTitle: "font-extrabold uppercase text-indigo-600 text-[10px] tracking-wider mb-1.5",
    textPrimary: "text-slate-800 text-[10px]",
    textSecondary: "text-slate-500 text-[10px]",
    dateText: "text-slate-400 text-[9px]",
    skillPill: "bg-slate-50 border border-slate-100 rounded-md px-1.5 py-0.5 text-[8.5px] font-bold text-slate-600",
    headerAlign: "text-left justify-start"
  },
  {
    name: "Classic Serif",
    wrapper: "bg-[#FAFAFA] font-serif text-gray-900",
    header: "border-b-2 border-gray-800 pb-4 mb-4 text-center",
    nameText: "text-2xl font-black text-gray-900 tracking-tight leading-none text-center",
    titleText: "text-xs text-gray-600 italic mt-1.5 text-center font-medium",
    sectionTitle: "font-bold uppercase text-gray-900 text-[10.5px] tracking-widest border-b border-gray-300 mb-2 pb-0.5",
    textPrimary: "text-gray-900 text-[10px] font-medium",
    textSecondary: "text-gray-700 text-[10px] leading-relaxed",
    dateText: "text-gray-500 text-[9px] italic",
    skillPill: "bg-transparent border border-gray-400 px-1.5 py-0.5 text-[8.5px] font-bold text-gray-700",
    headerAlign: "text-center justify-center"
  },
  {
    name: "Bold Dark",
    wrapper: "bg-slate-900 font-sans text-slate-100",
    header: "bg-indigo-600 -mx-6 -mt-6 p-6 mb-5 text-white",
    nameText: "text-xl font-black text-white leading-none",
    titleText: "text-xs text-indigo-200 font-bold mt-1",
    sectionTitle: "font-black uppercase text-indigo-400 text-[10px] tracking-wider mb-2",
    textPrimary: "text-slate-100 text-[10px]",
    textSecondary: "text-slate-300 text-[10px]",
    dateText: "text-indigo-300 text-[9px]",
    skillPill: "bg-indigo-900 border border-indigo-700 rounded px-1.5 py-0.5 text-[8.5px] font-bold text-indigo-100",
    headerAlign: "text-left justify-start"
  },
  {
    name: "Creative Modern",
    wrapper: "bg-stone-50 font-sans text-stone-800",
    header: "border-l-4 border-rose-500 pl-4 mb-5",
    nameText: "text-2xl font-black text-stone-900 leading-none tracking-tighter",
    titleText: "text-xs text-rose-600 font-bold mt-1 uppercase tracking-widest",
    sectionTitle: "font-black uppercase text-stone-900 text-[11px] tracking-wider mb-1.5",
    textPrimary: "text-stone-800 text-[10px] font-semibold",
    textSecondary: "text-stone-600 text-[10px]",
    dateText: "text-stone-400 text-[9px] font-bold",
    skillPill: "bg-stone-200 text-stone-800 rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider",
    headerAlign: "text-left justify-start"
  },
  {
    name: "Tech Monospace",
    wrapper: "bg-gray-50 font-mono text-gray-800",
    header: "border-b-2 border-emerald-500 pb-4 mb-4",
    nameText: "text-xl font-bold text-emerald-700 leading-none",
    titleText: "text-xs text-gray-500 mt-1.5",
    sectionTitle: "font-bold uppercase text-emerald-600 text-[10px] mb-1.5 bg-emerald-50 inline-block px-1",
    textPrimary: "text-gray-900 text-[9px]",
    textSecondary: "text-gray-600 text-[9px]",
    dateText: "text-gray-400 text-[8.5px]",
    skillPill: "bg-gray-200 border border-gray-300 rounded-sm px-1.5 py-0.5 text-[8px] text-gray-700 font-bold",
    headerAlign: "text-left justify-start"
  },
  {
    name: "Corporate Blue",
    wrapper: "bg-white font-sans text-slate-800",
    header: "bg-blue-800 -mx-6 -mt-6 p-6 mb-5 text-white flex flex-col items-center",
    nameText: "text-2xl font-bold text-white leading-none text-center",
    titleText: "text-xs text-blue-200 mt-1.5 text-center font-medium",
    sectionTitle: "font-bold uppercase text-blue-800 text-[11px] border-b-2 border-blue-800 mb-2 pb-0.5",
    textPrimary: "text-slate-800 text-[10px] font-bold",
    textSecondary: "text-slate-600 text-[10px]",
    dateText: "text-slate-500 text-[9px]",
    skillPill: "bg-blue-50 border border-blue-100 rounded text-blue-800 px-1.5 py-0.5 text-[8.5px] font-semibold",
    headerAlign: "text-center justify-center text-blue-100"
  },
  {
    name: "Elegant Gold",
    wrapper: "bg-amber-50/30 font-serif text-stone-800",
    header: "border-b pb-4 mb-4 border-amber-200",
    nameText: "text-2xl font-normal text-amber-700 tracking-wide leading-none",
    titleText: "text-xs text-stone-500 mt-1.5 tracking-widest uppercase",
    sectionTitle: "font-normal uppercase text-amber-700 text-[11px] tracking-[0.2em] mb-2 text-center",
    textPrimary: "text-stone-800 text-[10px]",
    textSecondary: "text-stone-600 text-[10px]",
    dateText: "text-amber-600/80 text-[9px] italic",
    skillPill: "bg-transparent border border-amber-200 text-amber-800 px-2 py-0.5 text-[8px] tracking-wider",
    headerAlign: "text-left justify-start"
  }
];

const ResumeBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentResume: dbResume, fetchResumeById, updateCurrentResume, saving } = useResume();
  
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("personal");
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatingWithAI, setGeneratingWithAI] = useState(false);
  const [styleIndex, setStyleIndex] = useState(0);
  const [styleSearch, setStyleSearch] = useState("");

  const activeStyle = RESUME_STYLES[styleIndex];

  // Local form state for instant typing (no API call per keystroke)
  const [localResume, setLocalResume] = useState(null);
  const saveTimerRef = useRef(null);

  // Computed state to merge local modifications with database version
  const currentResume = localResume || dbResume;

  // Sync localResume from context when it first loads or after AI autofill
  useEffect(() => {
    if (dbResume && !localResume) {
      setLocalResume(dbResume);
    }
  }, [dbResume]);

  // Debounced save: persist to backend 1s after last edit
  const debouncedSave = useCallback((updatedResume) => {
    setLocalResume(updatedResume);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      updateCurrentResume(id, updatedResume);
    }, 1000);
  }, [id, updateCurrentResume]);

  const handleAIGenerate = async (e) => {
    e.preventDefault();
    if (!aiPrompt) {
      toast.error("Please enter a prompt first");
      return;
    }
    setGeneratingWithAI(true);
    toast.loading("AI is generating resume details — this may take a minute...");
    try {
      const data = await generateResumeFromPrompt(aiPrompt);
      toast.dismiss();
      if (data.success && data.resume) {
        const merged = {
          ...currentResume,
          personalInfo: {
            ...currentResume.personalInfo,
            fullName: data.resume.personalInfo?.fullName || currentResume.personalInfo?.fullName || "",
            summary: data.resume.personalInfo?.summary || currentResume.personalInfo?.summary || "",
            email: data.resume.personalInfo?.email || currentResume.personalInfo?.email || "",
            phone: data.resume.personalInfo?.phone || currentResume.personalInfo?.phone || "",
            location: data.resume.personalInfo?.location || currentResume.personalInfo?.location || "",
            website: data.resume.personalInfo?.website || currentResume.personalInfo?.website || "",
            linkedin: data.resume.personalInfo?.linkedin || currentResume.personalInfo?.linkedin || "",
            github: data.resume.personalInfo?.github || currentResume.personalInfo?.github || "",
            portfolio: data.resume.personalInfo?.portfolio || currentResume.personalInfo?.portfolio || "",
          },
          skills: data.resume.skills || currentResume.skills || [],
          education: data.resume.education || currentResume.education || [],
          experience: data.resume.experience || currentResume.experience || [],
          projects: data.resume.projects || currentResume.projects || [],
        };
        await updateCurrentResume(id, merged);
        setLocalResume(merged);
        toast.success("Resume populated with AI suggestions!");
        setAiPrompt("");
      } else {
        console.error(data.message || "Failed to generate details. Please check Ollama.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingWithAI(false);
    }
  };

  useEffect(() => {
    const loadResume = async () => {
      const data = await fetchResumeById(id);
      if (!data) {
        navigate("/dashboard");
      }
      setLoading(false);
    };
    loadResume();
  }, [id, fetchResumeById, navigate]);

  // Form State Handlers (use localResume + debouncedSave for smooth typing)
  const r = localResume || currentResume;

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    const updated = {
      ...r,
      personalInfo: {
        ...r.personalInfo,
        [name]: value,
      },
    };
    debouncedSave(updated);
  };

  const handleTitleChange = (e) => {
    debouncedSave({ ...r, title: e.target.value });
  };

  // Education Handlers
  const addEducation = () => {
    const eduList = [...(r.education || [])];
    eduList.push({
      school: "School Name",
      degree: "Degree (e.g. BS)",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    debouncedSave({ ...r, education: eduList });
  };

  const handleEducationChange = (index, field, value) => {
    const eduList = [...(r.education || [])];
    eduList[index] = { ...eduList[index], [field]: value };
    debouncedSave({ ...r, education: eduList });
  };

  const removeEducation = (index) => {
    const eduList = (r.education || []).filter((_, i) => i !== index);
    debouncedSave({ ...r, education: eduList });
  };

  // Experience Handlers
  const addExperience = () => {
    const expList = [...(r.experience || [])];
    expList.push({
      company: "Company Name",
      position: "Job Title",
      location: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      description: [""],
    });
    debouncedSave({ ...r, experience: expList });
  };

  const handleExperienceChange = (index, field, value) => {
    const expList = [...(r.experience || [])];
    expList[index] = { ...expList[index], [field]: value };
    debouncedSave({ ...r, experience: expList });
  };

  const handleExperienceBulletChange = (expIndex, bulletIndex, value) => {
    const expList = [...(r.experience || [])];
    const bullets = [...(expList[expIndex].description || [])];
    bullets[bulletIndex] = value;
    expList[expIndex] = { ...expList[expIndex], description: bullets };
    debouncedSave({ ...r, experience: expList });
  };

  const addExperienceBullet = (index) => {
    const expList = [...(r.experience || [])];
    const bullets = [...(expList[index].description || [])];
    bullets.push("");
    expList[index] = { ...expList[index], description: bullets };
    debouncedSave({ ...r, experience: expList });
  };

  const removeExperienceBullet = (expIndex, bulletIndex) => {
    const expList = [...(r.experience || [])];
    const bullets = (expList[expIndex].description || []).filter((_, i) => i !== bulletIndex);
    expList[expIndex] = { ...expList[expIndex], description: bullets };
    debouncedSave({ ...r, experience: expList });
  };

  const removeExperience = (index) => {
    const expList = (r.experience || []).filter((_, i) => i !== index);
    debouncedSave({ ...r, experience: expList });
  };

  // Skills
  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(",").map((s) => s.trimStart());
    debouncedSave({ ...r, skills: skillsArray });
  };

  // Projects
  const addProject = () => {
    const projList = [...(r.projects || [])];
    projList.push({
      title: "Project Title",
      description: "",
      technologies: [],
      github: "",
      liveDemo: "",
    });
    debouncedSave({ ...r, projects: projList });
  };

  const handleProjectChange = (index, field, value) => {
    const projList = [...(r.projects || [])];
    if (field === "technologies") {
      projList[index] = { ...projList[index], [field]: value.split(",").map((t) => t.trimStart()) };
    } else {
      projList[index] = { ...projList[index], [field]: value };
    }
    debouncedSave({ ...r, projects: projList });
  };

  const removeProject = (index) => {
    const projList = (r.projects || []).filter((_, i) => i !== index);
    debouncedSave({ ...r, projects: projList });
  };

  // Download logic
  const handleDownloadPDF = async () => {
    await downloadPDF(id, currentResume?.title || "resume");
  };

  const handleDownloadDOCX = async () => {
    await downloadDOCX(id, currentResume?.title || "resume");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader size="lg" />
      </div>
    );
  }

  const sections = [
    { id: "personal", label: "Personal Info" },
    { id: "summary", label: "Summary" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0e0e10]">
      
      {/* Top Header */}
      <header className="sticky top-0 z-30 w-full border-b-2 border-black bg-[#16161a] px-4 py-3 flex items-center justify-between shadow-[0_3px_0px_0px_#000]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg border-2 border-black p-1.5 text-slate-300 hover:bg-[#0ae448] hover:text-black shadow-[2px_2px_0px_0px_#000] transition-all active:translate-x-0.5 active:translate-y-0.5"
          >
            <IoChevronBackOutline className="h-5 w-5" />
          </button>
          
          <input
            type="text"
            value={currentResume?.title || ""}
            onChange={handleTitleChange}
            className="text-base font-black text-white bg-transparent border-b-2 border-transparent hover:border-black focus:border-[#0ae448] focus:outline-none px-1 transition-all w-48 sm:w-60 uppercase"
          />
          
          <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-300 bg-[#1f1f26] border-2 border-black px-2.5 py-1 rounded-xl shadow-[2px_2px_0px_0px_#000] shrink-0">
            {saving ? (
              <>
                <IoSyncOutline className="h-3.5 w-3.5 animate-spin text-[#0ae448]" />
                Saving...
              </>
            ) : (
              <>
                <IoCloudDoneOutline className="h-3.5 w-3.5 text-[#0ae448]" />
                Saved
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/preview/${id}`)} className="flex items-center gap-1">
            <IoEyeOutline className="h-4.5 w-4.5" />
            Preview
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="primary" size="sm" onClick={handleDownloadPDF} className="flex items-center gap-1">
              <IoDownloadOutline className="h-4.5 w-4.5" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadDOCX} className="hidden sm:inline-flex">
              DOCX
            </Button>
          </div>
        </div>
      </header>

      {/* Main workspace */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-3.75rem)]">
        
        {/* Left SideNav */}
        <aside className="w-16 sm:w-48 border-r-2 border-black bg-[#16161a] p-3 space-y-2 overflow-y-auto shrink-0">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center w-full rounded-xl border-2 border-black py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-black text-left transition-all shadow-[2px_2px_0px_0px_#000] ${
                activeSection === section.id
                  ? "bg-[#0ae448] text-black shadow-[4px_4px_0px_0px_#000]"
                  : "bg-[#1f1f26] text-slate-300 hover:bg-[#2a2a33] hover:text-white"
              }`}
            >
              <span className="sm:hidden block mx-auto">{section.label.substring(0,2)}</span>
              <span className="hidden sm:block uppercase tracking-wide">{section.label}</span>
            </button>
          ))}
        </aside>

        {/* Center Panel (Fields Editor) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-xl mx-auto w-full space-y-6">
          
          {/* AI Autofill Prompt Card */}
          <div className="text-left p-5 rounded-2xl border-3 border-black bg-[#16161a] shadow-[5px_5px_0px_0px_#000]">
            <h4 className="font-black text-white text-sm uppercase flex items-center gap-2 mb-1.5" style={{ fontFamily: "var(--font-display)" }}>
              <span className="text-base">🤖</span>
              Autofill Resume with AI
            </h4>
            <p className="text-xs font-semibold text-slate-400 mb-4 leading-relaxed">
              Enter a short prompt detailing your role, work history, or technologies. AI will populate summary bullets, key skills, and projects automatically.
            </p>
            <form onSubmit={handleAIGenerate} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Senior Frontend Developer with 5 years React experience."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="flex-grow w-full rounded-xl border-2 border-black bg-[#1f1f26] px-3.5 py-2.5 text-xs font-semibold text-white placeholder:text-slate-500 shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#0ae448] focus:outline-none transition-all"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="text-xs font-black shrink-0 px-4"
                loading={generatingWithAI}
              >
                Autofill
              </Button>
            </form>
          </div>

          <div className="text-left space-y-6 rounded-2xl border-3 border-black bg-[#16161a] p-6 shadow-[6px_6px_0px_0px_#000]">
            
            {/* 1. Personal Info Section */}
            {activeSection === "personal" && (
              <div className="space-y-4">
                <h3 className="text-base font-black text-white uppercase tracking-wide border-b-2 border-black pb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Personal Information
                </h3>
                <Input
                  label="Full Name"
                  name="fullName"
                  placeholder="John Doe"
                  value={currentResume?.personalInfo?.fullName || ""}
                  onChange={handlePersonalInfoChange}
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={currentResume?.personalInfo?.email || ""}
                  onChange={handlePersonalInfoChange}
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone"
                    name="phone"
                    placeholder="+1 987 654 3210"
                    value={currentResume?.personalInfo?.phone || ""}
                    onChange={handlePersonalInfoChange}
                  />
                  <Input
                    label="Location"
                    name="location"
                    placeholder="San Francisco, CA"
                    value={currentResume?.personalInfo?.location || ""}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="LinkedIn"
                    name="linkedin"
                    placeholder="linkedin.com/in/johndoe"
                    value={currentResume?.personalInfo?.linkedin || ""}
                    onChange={handlePersonalInfoChange}
                  />
                  <Input
                    label="Portfolio Website"
                    name="portfolio"
                    placeholder="johndoe.dev"
                    value={currentResume?.personalInfo?.portfolio || ""}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
              </div>
            )}

            {/* 2. Summary Section */}
            {activeSection === "summary" && (
              <div className="space-y-4">
                <h3 className="text-base font-black text-white uppercase tracking-wide border-b-2 border-black pb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Professional Summary
                </h3>
                <Input
                  label="Summary"
                  name="summary"
                  type="textarea"
                  placeholder="Summarize your professional details and experience..."
                  value={currentResume?.personalInfo?.summary || ""}
                  onChange={handlePersonalInfoChange}
                  rows={6}
                />
              </div>
            )}

            {/* 3. Experience Section */}
            {activeSection === "experience" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b-2 border-black pb-2">
                  <h3 className="text-base font-black text-white uppercase tracking-wide" style={{ fontFamily: "var(--font-display)" }}>Work Experience</h3>
                  <Button variant="outline" size="sm" onClick={addExperience} className="text-xs flex items-center gap-1 py-1.5 px-3">
                    <IoAddOutline className="h-4 w-4" />
                    Add Work
                  </Button>
                </div>

                {(currentResume?.experience || []).map((exp, expIdx) => (
                  <div key={expIdx} className="space-y-4 border-2 border-black rounded-xl p-4 bg-[#1f1f26] relative shadow-[3px_3px_0px_0px_#000]">
                    <button
                      onClick={() => removeExperience(expIdx)}
                      className="absolute top-4 right-4 p-1.5 text-slate-400 hover:bg-red-500 hover:text-white rounded-lg border-2 border-black transition-colors"
                    >
                      <IoTrashOutline className="h-4.5 w-4.5" />
                    </button>
                    
                    <h4 className="font-black text-[#0ae448] text-xs uppercase">Experience #{expIdx + 1}</h4>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Company"
                        name="company"
                        placeholder="Company Name"
                        value={exp.company || ""}
                        onChange={(e) => handleExperienceChange(expIdx, "company", e.target.value)}
                      />
                      <Input
                        label="Position"
                        name="position"
                        placeholder="Job Title"
                        value={exp.position || ""}
                        onChange={(e) => handleExperienceChange(expIdx, "position", e.target.value)}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Start Date"
                        name="startDate"
                        type="date"
                        value={exp.startDate ? exp.startDate.substring(0, 10) : ""}
                        onChange={(e) => handleExperienceChange(expIdx, "startDate", e.target.value)}
                      />
                      <Input
                        label="End Date"
                        name="endDate"
                        type="date"
                        value={exp.endDate ? exp.endDate.substring(0, 10) : ""}
                        onChange={(e) => handleExperienceChange(expIdx, "endDate", e.target.value)}
                        disabled={exp.currentlyWorking}
                      />
                    </div>

                    <label className="flex items-center gap-2 text-xs font-black text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exp.currentlyWorking || false}
                        onChange={(e) => handleExperienceChange(expIdx, "currentlyWorking", e.target.checked)}
                        className="rounded border-2 border-black accent-[#0ae448]"
                      />
                      Currently working here
                    </label>

                    {/* Bullet description list */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-300 uppercase tracking-wider block">Description Bullets</label>
                      {(exp.description || []).map((bullet, bulletIdx) => (
                        <div key={bulletIdx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={bullet}
                            placeholder="Add bullet point description..."
                            onChange={(e) => handleExperienceBulletChange(expIdx, bulletIdx, e.target.value)}
                            className="flex-1 w-full rounded-xl border-2 border-black bg-[#16161a] px-3 py-2 text-sm font-semibold text-white placeholder:text-slate-500 shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#0ae448] focus:outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => removeExperienceBullet(expIdx, bulletIdx)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                          >
                            <IoTrashOutline className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => addExperienceBullet(expIdx)} className="text-[10px] py-1 px-2.5 mt-1.5">
                        <IoAddOutline className="mr-0.5 h-3.5 w-3.5" /> Add Bullet
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Education Section */}
            {activeSection === "education" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b-2 border-black pb-2">
                  <h3 className="text-base font-black text-white uppercase tracking-wide" style={{ fontFamily: "var(--font-display)" }}>Education Details</h3>
                  <Button variant="outline" size="sm" onClick={addEducation} className="text-xs flex items-center gap-1 py-1.5 px-3">
                    <IoAddOutline className="h-4 w-4" />
                    Add Education
                  </Button>
                </div>

                {(currentResume?.education || []).map((edu, eduIdx) => (
                  <div key={eduIdx} className="space-y-4 border-2 border-black rounded-xl p-4 bg-[#1f1f26] relative shadow-[3px_3px_0px_0px_#000]">
                    <button
                      onClick={() => removeEducation(eduIdx)}
                      className="absolute top-4 right-4 p-1.5 text-slate-400 hover:bg-red-500 hover:text-white rounded-lg border-2 border-black transition-colors"
                    >
                      <IoTrashOutline className="h-4.5 w-4.5" />
                    </button>
                    
                    <h4 className="font-black text-[#0ae448] text-xs uppercase">Education #{eduIdx + 1}</h4>
                    
                    <Input
                      label="School"
                      name="school"
                      placeholder="School or University name"
                      value={edu.school || ""}
                      onChange={(e) => handleEducationChange(eduIdx, "school", e.target.value)}
                    />
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Degree"
                        name="degree"
                        placeholder="e.g. Bachelor of Science"
                        value={edu.degree || ""}
                        onChange={(e) => handleEducationChange(eduIdx, "degree", e.target.value)}
                      />
                      <Input
                        label="Field of Study"
                        name="fieldOfStudy"
                        placeholder="e.g. Computer Science"
                        value={edu.fieldOfStudy || ""}
                        onChange={(e) => handleEducationChange(eduIdx, "fieldOfStudy", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 5. Skills Section */}
            {activeSection === "skills" && (
              <div className="space-y-4">
                <h3 className="text-base font-black text-white uppercase tracking-wide border-b-2 border-black pb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Key Skills
                </h3>
                <Input
                  label="Skills (Comma-separated)"
                  name="skills"
                  type="textarea"
                  placeholder="e.g. React, Node.js, Express, JavaScript, MongoDB, CSS"
                  value={(currentResume?.skills || []).join(", ")}
                  onChange={handleSkillsChange}
                  rows={4}
                />
              </div>
            )}

            {/* 6. Projects Section */}
            {activeSection === "projects" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b-2 border-black pb-2">
                  <h3 className="text-base font-black text-white uppercase tracking-wide" style={{ fontFamily: "var(--font-display)" }}>Featured Projects</h3>
                  <Button variant="outline" size="sm" onClick={addProject} className="text-xs flex items-center gap-1 py-1.5 px-3">
                    <IoAddOutline className="h-4 w-4" />
                    Add Project
                  </Button>
                </div>

                {(currentResume?.projects || []).map((proj, projIdx) => (
                  <div key={projIdx} className="space-y-4 border-2 border-black rounded-xl p-4 bg-[#1f1f26] relative shadow-[3px_3px_0px_0px_#000]">
                    <button
                      onClick={() => removeProject(projIdx)}
                      className="absolute top-4 right-4 p-1.5 text-slate-400 hover:bg-red-500 hover:text-white rounded-lg border-2 border-black transition-colors"
                    >
                      <IoTrashOutline className="h-4.5 w-4.5" />
                    </button>
                    
                    <h4 className="font-black text-[#0ae448] text-xs uppercase">Project #{projIdx + 1}</h4>
                    
                    <Input
                      label="Project Title"
                      name="title"
                      placeholder="e.g. Personal Portfolio"
                      value={proj.title || ""}
                      onChange={(e) => handleProjectChange(projIdx, "title", e.target.value)}
                    />
                    <Input
                      label="Description"
                      name="description"
                      type="textarea"
                      placeholder="Write brief description..."
                      value={proj.description || ""}
                      onChange={(e) => handleProjectChange(projIdx, "description", e.target.value)}
                      rows={2}
                    />
                    <Input
                      label="Technologies (Comma-separated)"
                      name="technologies"
                      placeholder="e.g. React, Firebase, Tailwind"
                      value={(proj.technologies || []).join(", ")}
                      onChange={(e) => handleProjectChange(projIdx, "technologies", e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}

          </div>
        </main>

        {/* Right Side: Live Resume Preview (as requested in the picture grid) */}
        <section 
          className="hidden lg:flex w-[450px] border-l border-slate-100 bg-slate-100/50 p-6 overflow-y-auto flex-col items-center gap-4"
        >
          <div className="flex w-full flex-col mb-2 gap-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Live Preview</h3>
            
            <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm w-full">
              <input 
                type="text" 
                placeholder="Search style..." 
                value={styleSearch}
                onChange={(e) => setStyleSearch(e.target.value)}
                className="text-xs px-2 py-1.5 rounded-lg border-none bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 flex-1"
              />
              <select
                value={styleIndex}
                onChange={(e) => setStyleIndex(Number(e.target.value))}
                className="text-xs font-bold text-slate-700 bg-transparent border-l border-slate-200 pl-2 focus:outline-none flex-1 max-w-[140px] truncate"
              >
                {RESUME_STYLES.map((style, idx) => {
                  if (styleSearch && !style.name.toLowerCase().includes(styleSearch.toLowerCase())) return null;
                  return (
                    <option key={idx} value={idx}>{style.name}</option>
                  );
                })}
              </select>
            </div>
          </div>
          
          {/* Resume A4 Paper container */}
          <div 
            className={`w-[400px] min-h-[565px] border border-slate-200/60 shadow-xl overflow-hidden cursor-default transition-all duration-300 rounded-sm ${activeStyle.wrapper}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header info */}
            <div className={`px-6 pt-6 ${activeStyle.header}`}>
              <h4 className={activeStyle.nameText}>
                {currentResume?.personalInfo?.fullName || "John Doe"}
              </h4>
              <p className={activeStyle.titleText}>
                {currentResume?.experience?.[0]?.position || "Full Stack Developer"}
              </p>
              <div className={`flex flex-wrap gap-x-3 mt-2 ${activeStyle.headerAlign}`}>
                {currentResume?.personalInfo?.email && <span className={activeStyle.textSecondary}>{currentResume.personalInfo.email}</span>}
                {currentResume?.personalInfo?.location && <span className={activeStyle.textSecondary}>{currentResume.personalInfo.location}</span>}
                {currentResume?.personalInfo?.phone && <span className={activeStyle.textSecondary}>{currentResume.personalInfo.phone}</span>}
              </div>
            </div>

            <div className={`px-6 pb-6 pt-2 space-y-4`}>
              {/* Summary */}
              {currentResume?.personalInfo?.summary && (
                <div>
                  <p className={activeStyle.sectionTitle}>Summary</p>
                  <p className={activeStyle.textSecondary}>{currentResume.personalInfo.summary}</p>
                </div>
              )}

              {/* Work */}
              {currentResume?.experience?.length > 0 && (
                <div>
                  <p className={activeStyle.sectionTitle}>Experience</p>
                  <div className="space-y-3 mt-1.5">
                    {currentResume.experience.map((exp, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className={`flex justify-between ${activeStyle.textPrimary}`}>
                          <span><span className="font-bold">{exp.position}</span> at {exp.company}</span>
                          <span className={activeStyle.dateText}>{exp.startDate ? exp.startDate.substring(0, 7) : ""}</span>
                        </div>
                        <ul className={`list-disc list-outside ml-3.5 ${activeStyle.textSecondary}`}>
                          {exp.description?.map((bullet, bIdx) => (
                            <li key={bIdx}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Education */}
              {currentResume?.education?.length > 0 && (
                <div>
                  <p className={activeStyle.sectionTitle}>Education</p>
                  <div className="space-y-2 mt-1.5">
                    {currentResume.education.map((edu, idx) => (
                      <div key={idx} className={`flex justify-between ${activeStyle.textPrimary}`}>
                        <span><span className="font-bold">{edu.degree}</span> in {edu.fieldOfStudy}, {edu.school}</span>
                        <span className={activeStyle.dateText}>{edu.startDate ? edu.startDate.substring(0, 4) : ""}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {currentResume?.skills?.length > 0 && (
                <div>
                  <p className={activeStyle.sectionTitle}>Skills</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {currentResume.skills.map((s, idx) => (
                      <span key={idx} className={activeStyle.skillPill}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Projects */}
              {currentResume?.projects?.length > 0 && (
                <div>
                  <p className={activeStyle.sectionTitle}>Projects</p>
                  <div className="space-y-2 mt-1.5">
                    {currentResume.projects.map((proj, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <div className={`flex justify-between ${activeStyle.textPrimary}`}>
                          <span className="font-bold">{proj.title}</span>
                        </div>
                        <p className={activeStyle.textSecondary}>{proj.description}</p>
                        {proj.technologies?.length > 0 && (
                          <div className={`text-[8px] text-slate-400 mt-0.5 flex flex-wrap gap-1 ${activeStyle.textSecondary}`}>
                            Technologies: {proj.technologies.join(", ")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ResumeBuilder;

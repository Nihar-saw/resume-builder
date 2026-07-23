import { useEffect, useState } from "react";
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
import { toast } from "react-hot-toast";

const ResumeBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentResume, fetchResumeById, updateCurrentResume, saving } = useResume();
  
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("personal");
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatingWithAI, setGeneratingWithAI] = useState(false);

  const handleAIGenerate = async (e) => {
    e.preventDefault();
    if (!aiPrompt) {
      toast.error("Please enter a prompt first");
      return;
    }
    setGeneratingWithAI(true);
    toast.loading("AI is generating resume details...");
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
        toast.success("Resume populated with AI suggestions!");
        setAiPrompt("");
      } else {
        toast.error("Failed to generate details. Please check Ollama.");
      }
    } catch (err) {
      toast.dismiss();
      console.error(err);
      toast.error(err.message || "Failed to generate details. Make sure Ollama is running.");
    } finally {
      setGeneratingWithAI(false);
    }
  };

  useEffect(() => {
    const loadResume = async () => {
      const data = await fetchResumeById(id);
      if (!data) {
        toast.error("Resume not found");
        navigate("/dashboard");
      }
      setLoading(false);
    };
    loadResume();
  }, [id, fetchResumeById, navigate]);

  // Form State Handlers
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    const updated = {
      ...currentResume,
      personalInfo: {
        ...currentResume.personalInfo,
        [name]: value,
      },
    };
    updateCurrentResume(id, updated);
  };

  const handleTitleChange = (e) => {
    updateCurrentResume(id, { ...currentResume, title: e.target.value });
  };

  // Education Handlers
  const addEducation = () => {
    const eduList = [...(currentResume.education || [])];
    eduList.push({
      school: "School Name",
      degree: "Degree (e.g. BS)",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    updateCurrentResume(id, { ...currentResume, education: eduList });
  };

  const handleEducationChange = (index, field, value) => {
    const eduList = [...(currentResume.education || [])];
    eduList[index] = { ...eduList[index], [field]: value };
    updateCurrentResume(id, { ...currentResume, education: eduList });
  };

  const removeEducation = (index) => {
    const eduList = (currentResume.education || []).filter((_, i) => i !== index);
    updateCurrentResume(id, { ...currentResume, education: eduList });
  };

  // Experience Handlers
  const addExperience = () => {
    const expList = [...(currentResume.experience || [])];
    expList.push({
      company: "Company Name",
      position: "Job Title",
      location: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      description: [""],
    });
    updateCurrentResume(id, { ...currentResume, experience: expList });
  };

  const handleExperienceChange = (index, field, value) => {
    const expList = [...(currentResume.experience || [])];
    expList[index] = { ...expList[index], [field]: value };
    updateCurrentResume(id, { ...currentResume, experience: expList });
  };

  const handleExperienceBulletChange = (expIndex, bulletIndex, value) => {
    const expList = [...(currentResume.experience || [])];
    const bullets = [...(expList[expIndex].description || [])];
    bullets[bulletIndex] = value;
    expList[expIndex] = { ...expList[expIndex], description: bullets };
    updateCurrentResume(id, { ...currentResume, experience: expList });
  };

  const addExperienceBullet = (index) => {
    const expList = [...(currentResume.experience || [])];
    const bullets = [...(expList[index].description || [])];
    bullets.push("");
    expList[index] = { ...expList[index], description: bullets };
    updateCurrentResume(id, { ...currentResume, experience: expList });
  };

  const removeExperienceBullet = (expIndex, bulletIndex) => {
    const expList = [...(currentResume.experience || [])];
    const bullets = (expList[expIndex].description || []).filter((_, i) => i !== bulletIndex);
    expList[expIndex] = { ...expList[expIndex], description: bullets };
    updateCurrentResume(id, { ...currentResume, experience: expList });
  };

  const removeExperience = (index) => {
    const expList = (currentResume.experience || []).filter((_, i) => i !== index);
    updateCurrentResume(id, { ...currentResume, experience: expList });
  };

  // Skills
  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(",").map((s) => s.trim());
    updateCurrentResume(id, { ...currentResume, skills: skillsArray });
  };

  // Projects
  const addProject = () => {
    const projList = [...(currentResume.projects || [])];
    projList.push({
      title: "Project Title",
      description: "",
      technologies: [],
      github: "",
      liveDemo: "",
    });
    updateCurrentResume(id, { ...currentResume, projects: projList });
  };

  const handleProjectChange = (index, field, value) => {
    const projList = [...(currentResume.projects || [])];
    if (field === "technologies") {
      projList[index] = { ...projList[index], [field]: value.split(",").map((t) => t.trim()) };
    } else {
      projList[index] = { ...projList[index], [field]: value };
    }
    updateCurrentResume(id, { ...currentResume, projects: projList });
  };

  const removeProject = (index) => {
    const projList = (currentResume.projects || []).filter((_, i) => i !== index);
    updateCurrentResume(id, { ...currentResume, projects: projList });
  };

  // Download logic
  const handleDownloadPDF = async () => {
    toast.loading("Generating PDF...");
    await downloadPDF(id, currentResume?.title || "resume");
    toast.dismiss();
    toast.success("Download started");
  };

  const handleDownloadDOCX = async () => {
    toast.loading("Generating Word document...");
    await downloadDOCX(id, currentResume?.title || "resume");
    toast.dismiss();
    toast.success("Download started");
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
    <div className="flex flex-col min-h-screen bg-slate-50/30">
      
      {/* Top Header */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-100 bg-white px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition-colors"
          >
            <IoChevronBackOutline className="h-5 w-5" />
          </button>
          
          <input
            type="text"
            value={currentResume?.title || ""}
            onChange={handleTitleChange}
            className="text-base font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:outline-none px-1 transition-all w-48 sm:w-60"
          />
          
          <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full shrink-0">
            {saving ? (
              <>
                <IoSyncOutline className="h-3.5 w-3.5 animate-spin text-indigo-500" />
                Saving...
              </>
            ) : (
              <>
                <IoCloudDoneOutline className="h-3.5 w-3.5 text-indigo-600" />
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
        <aside className="w-16 sm:w-48 border-r border-slate-100 bg-white p-3 space-y-1 overflow-y-auto shrink-0">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center w-full rounded-xl py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold text-left transition-all ${
                activeSection === section.id
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <span className="sm:hidden block mx-auto">{section.label.substring(0,2)}</span>
              <span className="hidden sm:block">{section.label}</span>
            </button>
          ))}
        </aside>

        {/* Center Panel (Fields Editor) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-xl mx-auto w-full space-y-6">
          
          {/* AI Autofill Prompt Card */}
          <Card className="text-left p-5 border border-indigo-100 bg-indigo-50/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/5 rounded-full blur-xl" />
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 mb-2">
              <span className="text-base">🤖</span>
              Autofill Resume with AI
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold mb-4 leading-relaxed">
              Enter a short prompt detailing your role, work history, or technologies. AI will populate summary bullets, key skills, and projects automatically.
            </p>
            <form onSubmit={handleAIGenerate} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Senior Frontend Developer with 5 years React experience, worked at Stripe."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="flex-grow w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-450 focus:border-indigo-500 focus:outline-none"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="text-xs font-bold shrink-0 shadow-md shadow-indigo-600/10 px-4"
                loading={generatingWithAI}
              >
                Autofill
              </Button>
            </form>
          </Card>

          <Card className="text-left space-y-6">
            
            {/* 1. Personal Info Section */}
            {activeSection === "personal" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-50 pb-2">
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
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-50 pb-2">
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
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <h3 className="text-lg font-bold text-slate-800">Work Experience</h3>
                  <Button variant="outline" size="sm" onClick={addExperience} className="text-xs flex items-center gap-1 py-1.5 px-3">
                    <IoAddOutline className="h-4 w-4" />
                    Add Work
                  </Button>
                </div>

                {(currentResume?.experience || []).map((exp, expIdx) => (
                  <div key={expIdx} className="space-y-4 border border-slate-100 rounded-2xl p-4 bg-slate-50/30 relative">
                    <button
                      onClick={() => removeExperience(expIdx)}
                      className="absolute top-4 right-4 p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                      <IoTrashOutline className="h-4.5 w-4.5" />
                    </button>
                    
                    <h4 className="font-bold text-slate-700 text-sm">Experience #{expIdx + 1}</h4>
                    
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

                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exp.currentlyWorking || false}
                        onChange={(e) => handleExperienceChange(expIdx, "currentlyWorking", e.target.checked)}
                        className="rounded border-slate-350 text-indigo-650"
                      />
                      Currently working here
                    </label>

                    {/* Bullet description list */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700 block">Description Bullets</label>
                      {(exp.description || []).map((bullet, bulletIdx) => (
                        <div key={bulletIdx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={bullet}
                            placeholder="Add bullet point description..."
                            onChange={(e) => handleExperienceBulletChange(expIdx, bulletIdx, e.target.value)}
                            className="flex-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
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
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <h3 className="text-lg font-bold text-slate-800">Education Details</h3>
                  <Button variant="outline" size="sm" onClick={addEducation} className="text-xs flex items-center gap-1 py-1.5 px-3">
                    <IoAddOutline className="h-4 w-4" />
                    Add Education
                  </Button>
                </div>

                {(currentResume.education || []).map((edu, eduIdx) => (
                  <div key={eduIdx} className="space-y-4 border border-slate-100 rounded-2xl p-4 bg-slate-50/30 relative">
                    <button
                      onClick={() => removeEducation(eduIdx)}
                      className="absolute top-4 right-4 p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                      <IoTrashOutline className="h-4.5 w-4.5" />
                    </button>
                    
                    <h4 className="font-bold text-slate-700 text-sm">Education #{eduIdx + 1}</h4>
                    
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
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-50 pb-2">
                  Key Skills
                </h3>
                <Input
                  label="Skills (Comma-separated)"
                  name="skills"
                  type="textarea"
                  placeholder="e.g. React, Node.js, Express, JavaScript, MongoDB, CSS"
                  value={(currentResume.skills || []).join(", ")}
                  onChange={handleSkillsChange}
                  rows={4}
                />
              </div>
            )}

            {/* 6. Projects Section */}
            {activeSection === "projects" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <h3 className="text-lg font-bold text-slate-800">Featured Projects</h3>
                  <Button variant="outline" size="sm" onClick={addProject} className="text-xs flex items-center gap-1 py-1.5 px-3">
                    <IoAddOutline className="h-4 w-4" />
                    Add Project
                  </Button>
                </div>

                {(currentResume.projects || []).map((proj, projIdx) => (
                  <div key={projIdx} className="space-y-4 border border-slate-100 rounded-2xl p-4 bg-slate-50/30 relative">
                    <button
                      onClick={() => removeProject(projIdx)}
                      className="absolute top-4 right-4 p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                      <IoTrashOutline className="h-4.5 w-4.5" />
                    </button>
                    
                    <h4 className="font-bold text-slate-700 text-sm">Project #{projIdx + 1}</h4>
                    
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

          </Card>
        </main>

        {/* Right Side: Live Resume Preview (as requested in the picture grid) */}
        <section className="hidden lg:flex w-96 border-l border-slate-100 bg-white p-6 overflow-y-auto flex-col gap-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 text-left">Live Preview</h3>
          
          <div className="border border-slate-150 rounded-2xl p-6 shadow-premium text-left space-y-6 text-[10px]">
            {/* Header info */}
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-slate-900 leading-none">
                {currentResume?.personalInfo?.fullName || "John Doe"}
              </h4>
              <p className="text-xs text-indigo-600 font-semibold mt-1">
                {currentResume?.experience?.[0]?.position || "Full Stack Developer"}
              </p>
              <div className="flex flex-wrap gap-x-2 text-[9px] text-slate-400 mt-1">
                {currentResume?.personalInfo?.email && <span>{currentResume.personalInfo.email}</span>}
                {currentResume?.personalInfo?.location && <span>{currentResume.personalInfo.location}</span>}
              </div>
            </div>

            {/* Summary */}
            {currentResume?.personalInfo?.summary && (
              <div>
                <p className="font-extrabold uppercase text-indigo-600 text-[9px] tracking-wider">Summary</p>
                <p className="text-slate-500 leading-relaxed mt-1 text-[9px]">{currentResume.personalInfo.summary}</p>
              </div>
            )}

            {/* Work */}
            {currentResume?.experience?.length > 0 && (
              <div className="space-y-2">
                <p className="font-extrabold uppercase text-indigo-600 text-[9px] tracking-wider">Experience</p>
                {currentResume.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between font-bold text-slate-800 text-[9px]">
                      <span>{exp.position} at {exp.company}</span>
                      <span className="text-slate-400">{exp.startDate ? exp.startDate.substring(0, 7) : ""}</span>
                    </div>
                    <ul className="list-disc list-inside text-slate-500 pl-1">
                      {exp.description?.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {currentResume?.skills?.length > 0 && (
              <div>
                <p className="font-extrabold uppercase text-indigo-600 text-[9px] tracking-wider">Skills</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentResume.skills.map((s, idx) => (
                    <span key={idx} className="bg-slate-50 border border-slate-100 rounded-md px-1.5 py-0.5 text-[8px] font-bold text-slate-650">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default ResumeBuilder;

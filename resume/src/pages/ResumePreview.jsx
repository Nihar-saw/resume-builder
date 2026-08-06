import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useResume } from "../context/ResumeContext";
import { downloadPDF, downloadDOCX } from "../api/pdf.api";
import { createPortfolio } from "../api/portfolio.api";
import {
  IoChevronBackOutline,
  IoDownloadOutline,
  IoShareSocialOutline,
  IoColorPaletteOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { toast } from "react-hot-toast";

const ResumePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentResume, fetchResumeById, changeResumeTemplate, updateCurrentResume } = useResume();
  const [loading, setLoading] = useState(true);
  const [themeColor, setThemeColor] = useState("indigo");
  const [font, setFont] = useState("sans");
  const [localResume, setLocalResume] = useState(null);
  const [templateSearch, setTemplateSearch] = useState("");

  useEffect(() => {
    const loadResume = async () => {
      const data = await fetchResumeById(id);
      if (!data) {
        toast.error("Resume not found");
        navigate("/dashboard");
      } else {
        setLocalResume(data);
      }
      setLoading(false);
    };
    loadResume();
  }, [id, fetchResumeById, navigate]);

  // Keep localResume in sync with currentResume (e.g. when template changes)
  useEffect(() => {
    if (currentResume) {
      setLocalResume(currentResume);
    }
  }, [currentResume]);

  // Handle direct inline contentEditable modifications
  const handleInlineEdit = async (path, val) => {
    const target = localResume || currentResume;
    if (!target) return;

    let updated = { ...target };
    
    if (path.startsWith("personalInfo.")) {
      const field = path.split(".")[1];
      updated.personalInfo = {
        ...updated.personalInfo,
        [field]: val
      };
    } else if (path.startsWith("experience[")) {
      const match = path.match(/experience\[(\d+)\]\.(.+)/);
      if (match) {
        const idx = parseInt(match[1]);
        const field = match[2];
        const expList = [...(updated.experience || [])];
        expList[idx] = { ...expList[idx], [field]: val };
        updated.experience = expList;
      }
    } else if (path.startsWith("experience_bullet[")) {
      const match = path.match(/experience_bullet\[(\d+)\]\[(\d+)\]/);
      if (match) {
        const expIdx = parseInt(match[1]);
        const bulletIdx = parseInt(match[2]);
        const expList = [...(updated.experience || [])];
        const bullets = [...(expList[expIdx].description || [])];
        bullets[bulletIdx] = val;
        expList[expIdx] = { ...expList[expIdx], description: bullets };
        updated.experience = expList;
      }
    } else if (path.startsWith("education[")) {
      const match = path.match(/education\[(\d+)\]\.(.+)/);
      if (match) {
        const idx = parseInt(match[1]);
        const field = match[2];
        const eduList = [...(updated.education || [])];
        eduList[idx] = { ...eduList[idx], [field]: val };
        updated.education = eduList;
      }
    } else if (path.startsWith("projects[")) {
      const match = path.match(/projects\[(\d+)\]\.(.+)/);
      if (match) {
        const idx = parseInt(match[1]);
        const field = match[2];
        const projList = [...(updated.projects || [])];
        projList[idx] = { ...projList[idx], [field]: val };
        updated.projects = projList;
      }
    } else if (path === "skills") {
      updated.skills = val.split("•").map(s => s.trim()).filter(Boolean);
    }

    setLocalResume(updated);
    try {
      await updateCurrentResume(id, updated);
    } catch (err) {
      console.error("Failed to save inline edit:", err);
    }
  };

  // Helper to render inline-editable text blocks
  const renderEditable = (path, value, className = "", placeholder = "Click to edit") => {
    return (
      <span
        contentEditable={true}
        suppressContentEditableWarning={true}
        onBlur={(e) => handleInlineEdit(path, e.target.innerText)}
        className={`outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-indigo-50/20 rounded transition-all duration-150 cursor-text hover:bg-indigo-50/10 hover:ring-1 hover:ring-indigo-300 hover:ring-dashed px-1 -mx-1 inline-block min-w-[20px] ${className}`}
      >
        {value || placeholder}
      </span>
    );
  };

  const handleDownloadPDF = async () => {
    toast.success("Ready to save! In the dialog, set Destination to 'Save as PDF' and Margins to 'None'.", { duration: 5000 });
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  const handleDownloadDOCX = async () => {
    toast.loading("Generating Word document...");
    await downloadDOCX(id, currentResume?.title || "resume");
    toast.dismiss();
    toast.success("Download started");
  };

  const handleShare = async () => {
    toast.loading("Creating share link...");
    try {
      const data = await createPortfolio(id);
      toast.dismiss();
      if (data.success && data.portfolio) {
        const link = `${window.location.origin}/r/${data.portfolio.slug}`;
        navigator.clipboard.writeText(link);
        toast.success("Copied shareable link to clipboard!");
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to share resume");
    }
  };

  const templates = ["modern", "classic", "minimal", "creative", "corporate", "elegant", "tech"];
  const themeColors = ["indigo", "slate", "violet", "emerald", "rose"];
  const fonts = ["sans", "serif", "mono"];

  if (loading || !currentResume) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader size="lg" />
      </div>
    );
  }

  const { personalInfo, education, experience, skills, projects } = localResume || currentResume;

  const getColorClass = (type = "text") => {
    const colors = {
      indigo: { text: "text-indigo-600", bg: "bg-indigo-50/50 border-indigo-200 text-indigo-600", fill: "bg-indigo-600" },
      slate: { text: "text-slate-800", bg: "bg-slate-50 border-slate-200 text-slate-800", fill: "bg-slate-800" },
      violet: { text: "text-violet-600", bg: "bg-violet-50/50 border-violet-200 text-violet-600", fill: "bg-violet-600" },
      emerald: { text: "text-emerald-600", bg: "bg-emerald-50/50 border-emerald-200 text-emerald-600", fill: "bg-emerald-600" },
      rose: { text: "text-rose-600", bg: "bg-rose-50/50 border-rose-200 text-rose-600", fill: "bg-rose-600" },
    };
    return colors[themeColor]?.[type] || colors.indigo[type];
  };

  const renderTemplate = () => {
    const fontClass = font === "sans" ? "font-sans" : font === "serif" ? "font-serif" : "font-mono";
    const templateStyle = currentResume.template || "modern";    // 1. Classic Template (Centered, elegant serif look)
    if (templateStyle === "classic") {
      return (
        <div className={`w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100/50 p-12 space-y-6 min-h-[842px] print:rounded-none print:shadow-none print:border-none print:max-w-none print:w-full print:h-full print:min-h-0 print:m-0 ${fontClass}`}>
          {/* Header */}
          <div className="text-center border-b border-slate-200 pb-5 space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {renderEditable("personalInfo.fullName", personalInfo?.fullName, "text-3xl font-bold text-slate-900")}
            </h1>
            <p className={`font-bold text-xs uppercase tracking-wider ${getColorClass("text")}`}>
              {renderEditable("experience[0].position", experience?.[0]?.position, "font-bold text-xs", "Full Stack Developer")}
            </p>
            <div className="flex justify-center gap-4 text-xs text-slate-500 font-medium flex-wrap">
              {personalInfo?.email && <span>📧 {renderEditable("personalInfo.email", personalInfo.email)}</span>}
              {personalInfo?.phone && <span>📞 {renderEditable("personalInfo.phone", personalInfo.phone)}</span>}
              {personalInfo?.location && <span>📍 {renderEditable("personalInfo.location", personalInfo.location)}</span>}
            </div>
          </div>
          {/* Summary */}
          {personalInfo?.summary && (
            <div className="space-y-2">
              <h4 className={`text-xs font-bold uppercase tracking-widest text-center border-b border-slate-100 pb-1 ${getColorClass("text")}`}>Professional Summary</h4>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-center">
                {renderEditable("personalInfo.summary", personalInfo.summary, "w-full block text-center")}
              </p>
            </div>
          )}
          {/* Experience */}
          {experience?.length > 0 && (
            <div className="space-y-4">
              <h4 className={`text-xs font-bold uppercase tracking-widest text-center border-b border-slate-100 pb-1 ${getColorClass("text")}`}>Professional History</h4>
              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-900 text-xs sm:text-sm">
                      <span>
                        {renderEditable(`experience[${idx}].position`, exp.position, "font-bold")} at {renderEditable(`experience[${idx}].company`, exp.company, "font-bold")}
                      </span>
                      <span className="text-slate-400 font-medium text-[10px] sm:text-xs">
                        {exp.startDate ? exp.startDate.substring(0, 7) : ""} - {exp.currentlyWorking ? "Present" : exp.endDate ? exp.endDate.substring(0, 7) : ""}
                      </span>
                    </div>
                    <p className="text-slate-400 font-medium text-[10px] sm:text-xs">
                      📍 {renderEditable(`experience[${idx}].location`, exp.location || "Remote", "text-[10px] sm:text-xs")}
                    </p>
                    <ul className="list-disc list-inside text-slate-600 text-xs leading-relaxed space-y-0.5 pl-1">
                      {exp.description?.map((bullet, bIdx) => (
                        <li key={bIdx} className="list-item text-left">
                          {renderEditable(`experience_bullet[${idx}][${bIdx}]`, bullet, "inline-block text-xs")}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Education */}
          {education?.length > 0 && (
            <div className="space-y-4">
              <h4 className={`text-xs font-bold uppercase tracking-widest text-center border-b border-slate-100 pb-1 ${getColorClass("text")}`}>Education</h4>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs sm:text-sm">
                    <div>
                      <span className="font-bold text-slate-900">
                        {renderEditable(`education[${idx}].degree`, edu.degree, "font-bold")} in {renderEditable(`education[${idx}].fieldOfStudy`, edu.fieldOfStudy, "font-bold")}
                      </span>
                      <p className="text-xs text-slate-500 font-medium">
                        🏫 {renderEditable(`education[${idx}].school`, edu.school, "font-medium")}
                      </p>
                    </div>
                    <span className="text-slate-400 text-xs">
                      {edu.startDate ? edu.startDate.substring(0, 4) : ""} - {edu.endDate ? edu.endDate.substring(0, 4) : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Projects */}
          {projects?.length > 0 && (
            <div className="space-y-4">
              <h4 className={`text-xs font-bold uppercase tracking-widest text-center border-b border-slate-100 pb-1 ${getColorClass("text")}`}>Projects</h4>
              <div className="space-y-3">
                {projects.map((proj, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {renderEditable(`projects[${idx}].title`, proj.title, "font-bold")}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {renderEditable(`projects[${idx}].description`, proj.description, "w-full block text-left")}
                    </p>
                    {proj.technologies?.length > 0 && (
                      <p className="text-[10px] text-slate-400 font-semibold">Tech: {proj.technologies.join(", ")}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Skills */}
          {skills?.length > 0 && (
            <div className="space-y-2">
              <h4 className={`text-xs font-bold uppercase tracking-widest text-center border-b border-slate-100 pb-1 ${getColorClass("text")}`}>Skills</h4>
              <div className="text-xs text-slate-600 text-center font-bold">
                {renderEditable("skills", skills.join(" • "), "w-full block text-center")}
                <p className="text-[9px] text-slate-400 mt-1 font-semibold italic">* Use bullet dots (•) to separate skills</p>
              </div>
            </div>
          )}
        </div>
      );
    }

    // 2. Minimal Template (Simple, elegant alignment, clean left accents)
    if (templateStyle === "minimal") {
      return (
        <div className={`w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100/50 p-10 space-y-8 min-h-[842px] print:rounded-none print:shadow-none print:border-none print:max-w-none print:w-full print:h-full print:min-h-0 print:m-0 ${fontClass}`}>
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{personalInfo?.fullName || "John Doe"}</h1>
            <p className="text-slate-500 font-medium text-sm capitalize">{renderEditable("experience[0].position", experience?.[0]?.position, "", "Full Stack Developer")}</p>
            <div className="flex gap-4 text-xs text-slate-400 font-medium flex-wrap pt-1">
              {personalInfo?.email && <span>{personalInfo.email}</span>}
              {personalInfo?.phone && <span>{personalInfo.phone}</span>}
              {personalInfo?.location && <span>{personalInfo.location}</span>}
            </div>
          </div>
          {/* Summary */}
          {personalInfo?.summary && (
            <div className="space-y-1">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Profile</h4>
              <p className="text-slate-600 text-xs leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}
          {/* Experience */}
          {experience?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Experience</h4>
              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1 pl-3 border-l border-slate-200">
                    <div className="flex justify-between font-bold text-slate-800 text-xs">
                      <span>{exp.position} — {exp.company}</span>
                      <span className="text-slate-400 font-medium text-[10px]">
                        {exp.startDate ? exp.startDate.substring(0, 7) : ""} - {exp.currentlyWorking ? "Present" : exp.endDate ? exp.endDate.substring(0, 7) : ""}
                      </span>
                    </div>
                    <ul className="list-disc list-inside text-slate-500 text-[11px] leading-relaxed space-y-0.5">
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
          {education?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Education</h4>
              <div className="space-y-2">
                {education.map((edu, idx) => (
                  <div key={idx} className="pl-3 border-l border-slate-200 text-xs flex justify-between">
                    <div>
                      <span className="font-bold text-slate-850">{edu.degree} in {edu.fieldOfStudy}</span>
                      <p className="text-[10px] text-slate-500">{edu.school}</p>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {edu.startDate ? edu.startDate.substring(0, 4) : ""} - {edu.endDate ? edu.endDate.substring(0, 4) : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Projects */}
          {projects?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Projects</h4>
              <div className="space-y-2">
                {projects.map((proj, idx) => (
                  <div key={idx} className="pl-3 border-l border-slate-200 text-xs">
                    <span className="font-bold text-slate-850">{proj.title}</span>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Skills */}
          {skills?.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Skills</h4>
              <p className="text-[11px] text-slate-550 leading-relaxed font-semibold">
                {skills.join(", ")}
              </p>
            </div>
          )}
        </div>
      );
    }

    // 3. Creative Template (Two-column sidebar split design)
    if (templateStyle === "creative") {
      return (
        <div className={`w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100/50 overflow-hidden flex min-h-[842px] print:rounded-none print:shadow-none print:border-none print:max-w-none print:w-full print:h-full print:min-h-0 print:m-0 ${fontClass}`}>
          {/* Left Column Sidebar */}
          <div className="w-1/3 bg-slate-900 text-white p-6 space-y-6 text-left">
            <div className="space-y-3">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-lg text-white ${getColorClass("fill")}`}>
                {personalInfo?.fullName?.charAt(0) || "J"}
              </div>
              <div>
                <h2 className="text-base font-bold tracking-tight">{personalInfo?.fullName || "John Doe"}</h2>
                <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5 tracking-wider">{renderEditable("experience[0].position", experience?.[0]?.position, "", "Full Stack Developer")}</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-slate-850 text-[10px] text-slate-350 space-y-2.5">
              {personalInfo?.email && <p className="truncate">📧 {personalInfo.email}</p>}
              {personalInfo?.phone && <p>📞 {personalInfo.phone}</p>}
              {personalInfo?.location && <p>📍 {personalInfo.location}</p>}
            </div>

            {skills?.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-850">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s, idx) => (
                    <span key={idx} className="bg-slate-800 border border-slate-700 text-slate-300 rounded px-2.5 py-0.5 text-[9px] font-bold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column Content */}
          <div className="w-2/3 p-8 space-y-6 text-left">
            {/* Summary */}
            {personalInfo?.summary && (
              <div className="space-y-2">
                <h4 className={`text-[10px] font-bold uppercase tracking-wider border-b border-slate-200 pb-1 ${getColorClass("text")}`}>Profile</h4>
                <p className="text-slate-700 text-xs leading-relaxed">{personalInfo.summary}</p>
              </div>
            )}
            {/* Experience */}
            {experience?.length > 0 && (
              <div className="space-y-3">
                <h4 className={`text-[10px] font-bold uppercase tracking-wider border-b border-slate-100 pb-1 ${getColorClass("text")}`}>Experience</h4>
                <div className="space-y-4">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between font-bold text-slate-800 text-xs">
                        <span>{exp.position}</span>
                        <span className="text-slate-400 font-medium text-[9px]">
                          {exp.startDate ? exp.startDate.substring(0, 7) : ""} - {exp.currentlyWorking ? "Present" : exp.endDate ? exp.endDate.substring(0, 7) : ""}
                        </span>
                      </div>
                      <p className="text-slate-600 font-bold text-[10px]">{exp.company}</p>
                      <ul className="list-disc list-inside text-slate-700 text-[11px] leading-relaxed space-y-0.5">
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
            {education?.length > 0 && (
              <div className="space-y-3">
                <h4 className={`text-[10px] font-bold uppercase tracking-wider border-b border-slate-100 pb-1 ${getColorClass("text")}`}>Education</h4>
                <div className="space-y-2.5">
                  {education.map((edu, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="flex justify-between font-semibold text-slate-800 text-[11px]">
                        <span>{edu.degree} in {edu.fieldOfStudy}</span>
                        <span className="text-slate-400 text-[9px] font-medium">
                          {edu.startDate ? edu.startDate.substring(0, 4) : ""} - {edu.endDate ? edu.endDate.substring(0, 4) : ""}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">{edu.school}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Projects */}
            {projects?.length > 0 && (
              <div className="space-y-3">
                <h4 className={`text-[10px] font-bold uppercase tracking-wider border-b border-slate-100 pb-1 ${getColorClass("text")}`}>Projects</h4>
                <div className="space-y-2">
                  {projects.map((proj, idx) => (
                    <div key={idx} className="text-xs">
                      <span className="font-bold text-slate-800 text-[11px]">{proj.title}</span>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // 5. Tech Template (Terminal style)
    if (templateStyle === "tech") {
      return (
        <div className={`w-full max-w-2xl bg-[#0D1117] text-emerald-400 rounded-3xl shadow-xl border border-emerald-500/30 p-10 space-y-6 min-h-[842px] print:bg-[#0D1117] print:rounded-none print:shadow-none print:border-none print:max-w-none print:w-full print:h-full print:min-h-0 print:m-0 ${fontClass}`}>
          {/* Header */}
          <div className="border-b-2 border-emerald-500/50 pb-5">
            <h1 className="text-2xl font-bold tracking-wider flex items-center gap-2">
              <span className="text-emerald-600 select-none">›</span>
              {renderEditable("personalInfo.fullName", personalInfo?.fullName, "font-bold text-emerald-400")}
            </h1>
            <p className="font-bold text-sm mt-1.5 capitalize text-emerald-500/80 flex items-center gap-1.5">
              <span className="text-emerald-700 font-mono text-xs select-none bg-emerald-900/30 px-1 rounded">role</span>
              {renderEditable("experience[0].position", experience?.[0]?.position, "", "Full Stack Developer")}
            </p>
            <div className="flex gap-4 text-[10px] text-emerald-600/70 mt-2 font-mono flex-wrap">
              {personalInfo?.email && <span>[email: {renderEditable("personalInfo.email", personalInfo.email)}]</span>}
              {personalInfo?.phone && <span>[phone: {renderEditable("personalInfo.phone", personalInfo.phone)}]</span>}
              {personalInfo?.location && <span>[loc: {renderEditable("personalInfo.location", personalInfo.location)}]</span>}
            </div>
          </div>
          {/* Summary */}
          {personalInfo?.summary && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-500/90 flex items-center gap-1.5"><span className="text-emerald-700">#</span> Summary</h4>
              <p className="text-emerald-400/80 text-xs sm:text-sm leading-relaxed">
                {renderEditable("personalInfo.summary", personalInfo.summary, "w-full block text-left")}
              </p>
            </div>
          )}
          {/* Experience */}
          {experience?.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-500/90 flex items-center gap-1.5"><span className="text-emerald-700">#</span> Experience</h4>
              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-bold text-emerald-300 text-xs sm:text-sm">
                      <span>
                        {renderEditable(`experience[${idx}].position`, exp.position, "font-bold")} @ {renderEditable(`experience[${idx}].company`, exp.company, "font-bold")}
                      </span>
                      <span className="text-emerald-600/80 font-medium text-[10px] sm:text-xs">
                        {exp.startDate ? exp.startDate.substring(0, 7) : ""} : {exp.currentlyWorking ? "Present" : exp.endDate ? exp.endDate.substring(0, 7) : ""}
                      </span>
                    </div>
                    <ul className="text-emerald-400/80 text-[11px] leading-relaxed space-y-0.5 mt-1 pl-2">
                      {exp.description?.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 select-none mt-0.5">›</span>
                          {renderEditable(`experience_bullet[${idx}][${bIdx}]`, bullet, "inline-block text-[11px] flex-1")}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Education */}
          {education?.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-500/90 flex items-center gap-1.5"><span className="text-emerald-700">#</span> Education</h4>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs sm:text-sm text-emerald-300">
                    <div>
                      <span className="font-bold">
                        {renderEditable(`education[${idx}].degree`, edu.degree, "font-bold")} in {renderEditable(`education[${idx}].fieldOfStudy`, edu.fieldOfStudy, "font-bold")}
                      </span>
                      <p className="text-[10px] sm:text-xs text-emerald-500/80 font-medium">
                        {renderEditable(`education[${idx}].school`, edu.school, "font-medium")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Projects */}
          {projects?.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-500/90 flex items-center gap-1.5"><span className="text-emerald-700">#</span> Projects</h4>
              <div className="space-y-3">
                {projects.map((proj, idx) => (
                  <div key={idx} className="space-y-1 text-emerald-300">
                    <span className="font-bold text-xs sm:text-sm">
                      {renderEditable(`projects[${idx}].title`, proj.title, "font-bold")}
                    </span>
                    <p className="text-[11px] text-emerald-400/80 leading-relaxed">
                      {renderEditable(`projects[${idx}].description`, proj.description, "w-full block text-left")}
                    </p>
                    {proj.technologies?.length > 0 && (
                      <p className="text-[10px] text-emerald-600 mt-1">
                        [{proj.technologies.join(", ")}]
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Skills */}
          {skills?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-500/90 flex items-center gap-1.5"><span className="text-emerald-700">#</span> Skills</h4>
              <div className="text-xs sm:text-sm text-emerald-400/90">
                {renderEditable("skills", skills.join(" | "), "w-full block text-left font-bold")}
              </div>
            </div>
          )}
        </div>
      );
    }

    // 6. Corporate Template
    if (templateStyle === "corporate") {
      return (
        <div className={`w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100/50 overflow-hidden flex flex-col min-h-[842px] print:rounded-none print:shadow-none print:border-none print:max-w-none print:w-full print:h-full print:min-h-0 print:m-0 ${fontClass}`}>
          <div className={`p-10 pb-6 text-white text-center ${getColorClass("fill")}`}>
             <h1 className="text-3xl font-bold">{renderEditable("personalInfo.fullName", personalInfo?.fullName)}</h1>
             <p className="font-semibold text-white/80 mt-1 uppercase tracking-widest text-sm">{renderEditable("experience[0].position", experience?.[0]?.position, "", "Full Stack Developer")}</p>
             <div className="flex justify-center gap-4 text-xs text-white/70 font-medium flex-wrap mt-3">
               {personalInfo?.email && <span>{renderEditable("personalInfo.email", personalInfo.email)}</span>}
               {personalInfo?.phone && <span>{renderEditable("personalInfo.phone", personalInfo.phone)}</span>}
               {personalInfo?.location && <span>{renderEditable("personalInfo.location", personalInfo.location)}</span>}
             </div>
          </div>
          <div className="p-10 space-y-6 bg-slate-50 flex-1">
            {/* Same internal structure as classic but left-aligned */}
            {/* Summary */}
            {personalInfo?.summary && (
              <div className="space-y-2">
                <h4 className={`text-xs font-bold uppercase tracking-widest border-b-2 pb-1 ${getColorClass("text")} border-current`}>Professional Summary</h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {renderEditable("personalInfo.summary", personalInfo.summary, "w-full block text-left")}
                </p>
              </div>
            )}
            {/* Experience */}
            {experience?.length > 0 && (
              <div className="space-y-4">
                <h4 className={`text-xs font-bold uppercase tracking-widest border-b-2 pb-1 ${getColorClass("text")} border-current`}>Professional History</h4>
                <div className="space-y-4">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between font-bold text-slate-900 text-xs sm:text-sm">
                        <span>
                          {renderEditable(`experience[${idx}].position`, exp.position, "font-bold")} at {renderEditable(`experience[${idx}].company`, exp.company, "font-bold")}
                        </span>
                        <span className="text-slate-500 font-medium text-[10px] sm:text-xs">
                          {exp.startDate ? exp.startDate.substring(0, 7) : ""} - {exp.currentlyWorking ? "Present" : exp.endDate ? exp.endDate.substring(0, 7) : ""}
                        </span>
                      </div>
                      <ul className="list-disc list-inside text-slate-600 text-xs leading-relaxed space-y-0.5 pl-1">
                        {exp.description?.map((bullet, bIdx) => (
                          <li key={bIdx} className="list-item text-left">
                            {renderEditable(`experience_bullet[${idx}][${bIdx}]`, bullet, "inline-block text-xs")}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Education */}
            {education?.length > 0 && (
              <div className="space-y-4">
                <h4 className={`text-xs font-bold uppercase tracking-widest border-b-2 pb-1 ${getColorClass("text")} border-current`}>Education</h4>
                <div className="space-y-3">
                  {education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-start text-xs sm:text-sm">
                      <div>
                        <span className="font-bold text-slate-900">
                          {renderEditable(`education[${idx}].degree`, edu.degree, "font-bold")} in {renderEditable(`education[${idx}].fieldOfStudy`, edu.fieldOfStudy, "font-bold")}
                        </span>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {renderEditable(`education[${idx}].school`, edu.school, "font-medium")}
                        </p>
                      </div>
                      <span className="text-slate-500 text-xs">
                        {edu.startDate ? edu.startDate.substring(0, 4) : ""} - {edu.endDate ? edu.endDate.substring(0, 4) : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Projects */}
            {projects?.length > 0 && (
              <div className="space-y-4">
                <h4 className={`text-xs font-bold uppercase tracking-widest border-b-2 pb-1 ${getColorClass("text")} border-current`}>Projects</h4>
                <div className="space-y-3">
                  {projects.map((proj, idx) => (
                    <div key={idx} className="space-y-1">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        {renderEditable(`projects[${idx}].title`, proj.title, "font-bold")}
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {renderEditable(`projects[${idx}].description`, proj.description, "w-full block text-left")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Skills */}
            {skills?.length > 0 && (
              <div className="space-y-2">
                <h4 className={`text-xs font-bold uppercase tracking-widest border-b-2 pb-1 ${getColorClass("text")} border-current`}>Skills</h4>
                <div className="text-xs text-slate-700 font-bold">
                  {renderEditable("skills", skills.join(" • "), "w-full block text-left")}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // 7. Elegant Template
    if (templateStyle === "elegant") {
      return (
        <div className={`w-full max-w-2xl bg-white text-stone-900 rounded-3xl shadow-xl border border-stone-200 p-12 space-y-6 min-h-[842px] print:rounded-none print:shadow-none print:border-none print:max-w-none print:w-full print:h-full print:min-h-0 print:m-0 ${fontClass}`}>
          {/* Header */}
          <div className="text-center border-b-2 border-amber-800/20 pb-6 space-y-2">
            <h1 className="text-4xl font-semibold text-stone-950 tracking-wider">
              {renderEditable("personalInfo.fullName", personalInfo?.fullName, "text-4xl font-semibold text-stone-950")}
            </h1>
            <p className="font-bold text-xs uppercase tracking-[0.25em] text-amber-900">
              {renderEditable("experience[0].position", experience?.[0]?.position, "", "Full Stack Developer")}
            </p>
            <div className="flex justify-center gap-6 text-xs text-stone-700 font-semibold flex-wrap mt-2">
              {personalInfo?.email && <span>{renderEditable("personalInfo.email", personalInfo.email)}</span>}
              {personalInfo?.phone && <span>{renderEditable("personalInfo.phone", personalInfo.phone)}</span>}
              {personalInfo?.location && <span>{renderEditable("personalInfo.location", personalInfo.location)}</span>}
            </div>
          </div>
          {/* Summary */}
          {personalInfo?.summary && (
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-center text-amber-900 border-b border-stone-200 pb-1">Professional Summary</h4>
              <p className="text-stone-800 text-xs sm:text-sm leading-relaxed text-center font-medium italic">
                {renderEditable("personalInfo.summary", personalInfo.summary, "w-full block text-center")}
              </p>
            </div>
          )}
          {/* Experience */}
          {experience?.length > 0 && (
            <div className="space-y-5 pt-2">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-center text-amber-900 border-b border-stone-200 pb-1">Professional History</h4>
              <div className="space-y-5">
                {experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-bold text-stone-950 text-xs sm:text-sm">
                      <span>
                        <span className="font-extrabold">{renderEditable(`experience[${idx}].position`, exp.position)}</span> — {renderEditable(`experience[${idx}].company`, exp.company)}
                      </span>
                      <span className="text-stone-600 font-semibold text-[10px] sm:text-xs italic">
                        {exp.startDate ? exp.startDate.substring(0, 7) : ""} - {exp.currentlyWorking ? "Present" : exp.endDate ? exp.endDate.substring(0, 7) : ""}
                      </span>
                    </div>
                    <ul className="list-disc list-inside text-stone-800 text-xs leading-relaxed space-y-0.5 pl-1">
                      {exp.description?.map((bullet, bIdx) => (
                        <li key={bIdx} className="list-item text-left font-medium">
                          {renderEditable(`experience_bullet[${idx}][${bIdx}]`, bullet, "inline-block text-xs")}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Education */}
          {education?.length > 0 && (
            <div className="space-y-4 pt-2">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-center text-amber-900 border-b border-stone-200 pb-1">Education</h4>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs sm:text-sm">
                    <div>
                      <span className="font-bold text-stone-950">
                        {renderEditable(`education[${idx}].degree`, edu.degree)} in {renderEditable(`education[${idx}].fieldOfStudy`, edu.fieldOfStudy)}
                      </span>
                      <p className="text-xs text-stone-700 font-semibold mt-0.5">
                        {renderEditable(`education[${idx}].school`, edu.school)}
                      </p>
                    </div>
                    <span className="text-stone-600 text-xs font-semibold italic">
                      {edu.startDate ? edu.startDate.substring(0, 4) : ""} - {edu.endDate ? edu.endDate.substring(0, 4) : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Skills */}
          {skills?.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-center text-amber-900 border-b border-stone-200 pb-1">Key Skills</h4>
              <div className="text-xs text-stone-900 text-center font-bold leading-loose">
                {renderEditable("skills", skills.join("  |  "), "w-full block text-center")}
              </div>
            </div>
          )}
        </div>
      );
    }

    // 4. Modern Template (Default classic/modern split grid structure)
    return (
      <div className={`w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100/50 p-10 space-y-6 min-h-[842px] print:rounded-none print:shadow-none print:border-none print:max-w-none print:w-full print:h-full print:min-h-0 print:m-0 ${fontClass}`}>
        {/* Header info */}
        <div className="border-b border-slate-100 pb-5">
          <h1 className="text-2xl font-black text-slate-900 leading-none">
            {renderEditable("personalInfo.fullName", personalInfo?.fullName, "text-2xl font-black text-slate-900")}
          </h1>
          <p className={`font-bold text-sm mt-1.5 capitalize ${getColorClass("text")}`}>
            {renderEditable("experience[0].position", experience?.[0]?.position, "font-bold text-sm", "Full Stack Developer")}
          </p>
          <div className="flex flex-wrap gap-x-3 text-[11px] text-slate-400 mt-2 font-medium">
            {personalInfo?.email && (
              <span>
                📧 {renderEditable("personalInfo.email", personalInfo.email)}
              </span>
            )}
            {personalInfo?.phone && (
              <span>
                📞 {renderEditable("personalInfo.phone", personalInfo.phone)}
              </span>
            )}
            {personalInfo?.location && (
              <span>
                📍 {renderEditable("personalInfo.location", personalInfo.location)}
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        {personalInfo?.summary && (
          <div className="space-y-2">
            <h4 className={`text-xs font-extrabold uppercase tracking-widest ${getColorClass("text")}`}>Summary</h4>
            <p className="text-slate-655 text-xs sm:text-sm leading-relaxed">
              {renderEditable("personalInfo.summary", personalInfo.summary, "w-full block text-left")}
            </p>
          </div>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <div className="space-y-4">
            <h4 className={`text-xs font-extrabold uppercase tracking-widest ${getColorClass("text")}`}>Experience</h4>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-900 text-xs sm:text-sm">
                    <span>
                      {renderEditable(`experience[${idx}].position`, exp.position, "font-bold")} at {renderEditable(`experience[${idx}].company`, exp.company, "font-bold")}
                    </span>
                    <span className="text-slate-400 font-medium text-[10px] sm:text-xs">
                      {exp.startDate ? exp.startDate.substring(0, 7) : ""} - {exp.currentlyWorking ? "Present" : exp.endDate ? exp.endDate.substring(0, 7) : ""}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[10px] sm:text-xs font-bold">
                    📍 {renderEditable(`experience[${idx}].location`, exp.location || "Remote", "text-[10px] sm:text-xs")}
                  </p>
                  <ul className="list-disc list-inside text-slate-600 text-[11px] leading-relaxed space-y-0.5 mt-1 pl-1">
                    {exp.description?.map((bullet, bIdx) => (
                      <li key={bIdx} className="list-item">
                        {renderEditable(`experience_bullet[${idx}][${bIdx}]`, bullet, "inline-block text-[11px]")}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <div className="space-y-4">
            <h4 className={`text-xs font-extrabold uppercase tracking-widest ${getColorClass("text")}`}>Education</h4>
            <div className="space-y-3">
              {education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-slate-900">
                      {renderEditable(`education[${idx}].degree`, edu.degree, "font-bold")} in {renderEditable(`education[${idx}].fieldOfStudy`, edu.fieldOfStudy, "font-bold")}
                    </span>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                      🏫 {renderEditable(`education[${idx}].school`, edu.school, "font-medium")}
                    </p>
                  </div>
                  <span className="text-slate-400 text-[10px] sm:text-xs">
                    {edu.startDate ? edu.startDate.substring(0, 4) : ""} - {edu.endDate ? edu.endDate.substring(0, 4) : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <div className="space-y-4">
            <h4 className={`text-xs font-extrabold uppercase tracking-widest ${getColorClass("text")}`}>Projects</h4>
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    {renderEditable(`projects[${idx}].title`, proj.title, "font-bold")}
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {renderEditable(`projects[${idx}].description`, proj.description, "w-full block text-left")}
                  </p>
                  {proj.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.technologies.map((tech, tIdx) => (
                        <span key={tIdx} className="bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5 text-[9px] font-bold text-slate-550">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <div className="space-y-2">
            <h4 className={`text-xs font-extrabold uppercase tracking-widest ${getColorClass("text")}`}>Skills</h4>
            <div className="text-xs sm:text-sm text-slate-700">
              {renderEditable("skills", skills.join(" • "), "w-full block text-left font-bold")}
              <p className="text-[9px] text-slate-400 mt-1 font-semibold italic">* Use bullet dots (•) to separate skills</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0e0e10] text-left">
      
      {/* Top Header */}
      <header className="print:hidden sticky top-0 z-30 w-full border-b-2 border-black bg-[#16161a] px-4 py-3 flex items-center justify-between shadow-[0_3px_0px_0px_#000]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/builder/${id}`)}
            className="rounded-lg border-2 border-black p-1.5 text-slate-300 hover:bg-[#0ae448] hover:text-black shadow-[2px_2px_0px_0px_#000] transition-all active:translate-x-0.5 active:translate-y-0.5"
          >
            <IoChevronBackOutline className="h-5 w-5" />
          </button>
          <span className="font-black text-white uppercase tracking-wide text-sm">{currentResume.title} <span className="text-slate-500">— Preview</span></span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-1">
            <IoShareSocialOutline className="h-4.5 w-4.5" />
            Share Link
          </Button>
          <Button variant="primary" size="sm" onClick={handleDownloadPDF} className="flex items-center gap-1">
            <IoDownloadOutline className="h-4.5 w-4.5" />
            Download PDF
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-3.75rem)] print:h-auto print:overflow-visible">
        
        {/* Left Options Panel */}
        <aside className="print:hidden w-60 border-r-2 border-black bg-[#16161a] p-5 space-y-5 overflow-y-auto shrink-0 hidden md:block">
          {/* Template select */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Template Style</label>
            <input 
              type="text" 
              placeholder="Search templates..."
              value={templateSearch}
              onChange={(e) => setTemplateSearch(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border-2 border-black bg-[#1f1f26] text-white placeholder:text-slate-600 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:shadow-[3px_3px_0px_0px_#0ae448] transition-all mb-2"
            />
            <div className="grid grid-cols-2 gap-2">
              {templates.filter(t => t.includes(templateSearch.toLowerCase())).map((t) => (
                <button
                  key={t}
                  onClick={() => changeResumeTemplate(id, t)}
                  className={`rounded-xl border-2 border-black p-2 text-[10px] font-black text-center capitalize transition-all shadow-[2px_2px_0px_0px_#000] ${
                    currentResume.template === t
                      ? "bg-[#0ae448] text-black shadow-[3px_3px_0px_0px_#000]"
                      : "bg-[#1f1f26] text-white hover:bg-[#2a2a33]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Theme select */}
          <div className="space-y-2 border-t-2 border-black pt-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Theme Color</label>
            <div className="flex gap-2">
              {themeColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setThemeColor(color)}
                  className={`h-8 w-8 rounded-full border-2 border-black transition-all hover:scale-110 active:scale-95 shadow-[2px_2px_0px_0px_#000] ${
                    color === "indigo" ? "bg-indigo-600" :
                    color === "slate" ? "bg-slate-700" :
                    color === "violet" ? "bg-violet-600" :
                    color === "emerald" ? "bg-emerald-600" : "bg-rose-500"
                  } ${themeColor === color ? "ring-2 ring-[#0ae448] ring-offset-2 ring-offset-[#16161a]" : ""}`}
                />
              ))}
            </div>
          </div>

          {/* Font select */}
          <div className="space-y-2 border-t-2 border-black pt-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Typography</label>
            <select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="w-full rounded-xl border-2 border-black bg-[#1f1f26] px-3 py-2 text-xs font-bold text-white shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:shadow-[3px_3px_0px_0px_#0ae448] transition-all"
            >
              {fonts.map((f) => (
                <option key={f} value={f}>{f === "sans" ? "Sans Serif (Inter)" : f === "serif" ? "Classical Serif" : "Developer Mono"}</option>
              ))}
            </select>
          </div>
        </aside>

        {/* Center Panel: Full Page Mockup Preview */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#0a0a0c] flex justify-center print:p-0 print:bg-white print:block print:overflow-visible">
          <div className="print:shadow-none print:w-[210mm] print:h-[297mm] print:m-0 print:border-none">
            {renderTemplate()}
          </div>
        </main>

      </div>
    </div>
  );
};

export default ResumePreview;

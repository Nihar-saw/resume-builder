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
  const { currentResume, fetchResumeById, changeResumeTemplate } = useResume();
  const [loading, setLoading] = useState(true);
  const [themeColor, setThemeColor] = useState("indigo");
  const [font, setFont] = useState("sans");

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

  const templates = ["modern", "classic", "minimal", "creative"];
  const themeColors = ["indigo", "slate", "violet", "emerald", "rose"];
  const fonts = ["sans", "serif", "mono"];

  if (loading || !currentResume) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader size="lg" />
      </div>
    );
  }

  const { personalInfo, education, experience, skills, projects } = currentResume;

  const getColorClass = (type = "text") => {
    const colors = {
      indigo: { text: "text-indigo-650", bg: "bg-indigo-50/50 border-indigo-150 text-indigo-650", fill: "bg-indigo-650" },
      slate: { text: "text-slate-800", bg: "bg-slate-50 border-slate-150 text-slate-800", fill: "bg-slate-800" },
      violet: { text: "text-violet-650", bg: "bg-violet-50/50 border-violet-150 text-violet-650", fill: "bg-violet-650" },
      emerald: { text: "text-emerald-600", bg: "bg-emerald-50/50 border-emerald-150 text-emerald-600", fill: "bg-emerald-600" },
      rose: { text: "text-rose-650", bg: "bg-rose-50/50 border-rose-150 text-rose-650", fill: "bg-rose-650" },
    };
    return colors[themeColor]?.[type] || colors.indigo[type];
  };

  const renderTemplate = () => {
    const fontClass = font === "sans" ? "font-sans" : font === "serif" ? "font-serif" : "font-mono";
    const templateStyle = currentResume.template || "modern";

    // 1. Classic Template (Centered, elegant serif look)
    if (templateStyle === "classic") {
      return (
        <div className={`w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100/50 p-12 space-y-6 min-h-[842px] ${fontClass}`}>
          {/* Header */}
          <div className="text-center border-b border-slate-200 pb-5 space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{personalInfo?.fullName || "John Doe"}</h1>
            <p className={`font-bold text-xs uppercase tracking-wider ${getColorClass("text")}`}>
              {experience?.[0]?.position || "Full Stack Developer"}
            </p>
            <div className="flex justify-center gap-4 text-xs text-slate-500 font-medium flex-wrap">
              {personalInfo?.email && <span>{personalInfo.email}</span>}
              {personalInfo?.phone && <span>{personalInfo.phone}</span>}
              {personalInfo?.location && <span>{personalInfo.location}</span>}
            </div>
          </div>
          {/* Summary */}
          {personalInfo?.summary && (
            <div className="space-y-2">
              <h4 className={`text-xs font-bold uppercase tracking-widest text-center border-b border-slate-100 pb-1 ${getColorClass("text")}`}>Professional Summary</h4>
              <p className="text-slate-650 text-xs sm:text-sm leading-relaxed text-center">{personalInfo.summary}</p>
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
                      <span>{exp.position} at {exp.company}</span>
                      <span className="text-slate-400 font-medium text-[10px] sm:text-xs">
                        {exp.startDate ? exp.startDate.substring(0, 7) : ""} - {exp.currentlyWorking ? "Present" : exp.endDate ? exp.endDate.substring(0, 7) : ""}
                      </span>
                    </div>
                    <p className="text-slate-400 font-medium text-[10px] sm:text-xs">{exp.location}</p>
                    <ul className="list-disc list-inside text-slate-600 text-xs leading-relaxed space-y-0.5 pl-1">
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
            <div className="space-y-4">
              <h4 className={`text-xs font-bold uppercase tracking-widest text-center border-b border-slate-100 pb-1 ${getColorClass("text")}`}>Education</h4>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs sm:text-sm">
                    <div>
                      <span className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span>
                      <p className="text-xs text-slate-500 font-medium">{edu.school}</p>
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
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{proj.title}</span>
                    <p className="text-xs text-slate-605 leading-relaxed">{proj.description}</p>
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
              <p className="text-xs text-slate-600 text-center leading-relaxed font-semibold">
                {skills.join(" • ")}
              </p>
            </div>
          )}
        </div>
      );
    }

    // 2. Minimal Template (Simple, elegant alignment, clean left accents)
    if (templateStyle === "minimal") {
      return (
        <div className={`w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100/50 p-10 space-y-8 min-h-[842px] ${fontClass}`}>
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{personalInfo?.fullName || "John Doe"}</h1>
            <p className="text-slate-500 font-medium text-sm capitalize">{experience?.[0]?.position || "Full Stack Developer"}</p>
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
        <div className={`w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100/50 overflow-hidden flex min-h-[842px] ${fontClass}`}>
          {/* Left Column Sidebar */}
          <div className="w-1/3 bg-slate-900 text-white p-6 space-y-6 text-left">
            <div className="space-y-3">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-lg text-white ${getColorClass("fill")}`}>
                {personalInfo?.fullName?.charAt(0) || "J"}
              </div>
              <div>
                <h2 className="text-base font-bold tracking-tight">{personalInfo?.fullName || "John Doe"}</h2>
                <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5 tracking-wider">{experience?.[0]?.position || "Developer"}</p>
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
                <h4 className={`text-[10px] font-bold uppercase tracking-wider border-b border-slate-100 pb-1 ${getColorClass("text")}`}>Profile</h4>
                <p className="text-slate-655 text-xs leading-relaxed">{personalInfo.summary}</p>
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
                      <p className="text-slate-450 font-bold text-[10px]">{exp.company}</p>
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

    // 4. Modern Template (Default classic/modern split grid structure)
    return (
      <div className={`w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100/50 p-10 space-y-6 min-h-[842px] ${fontClass}`}>
        {/* Header info */}
        <div className="border-b border-slate-100 pb-5">
          <h1 className="text-2xl font-black text-slate-900 leading-none">
            {personalInfo?.fullName || "John Doe"}
          </h1>
          <p className={`font-bold text-sm mt-1.5 capitalize ${getColorClass("text")}`}>
            {experience?.[0]?.position || "Full Stack Developer"}
          </p>
          <div className="flex flex-wrap gap-x-3 text-[11px] text-slate-400 mt-2 font-medium">
            {personalInfo?.email && <span>{personalInfo.email}</span>}
            {personalInfo?.phone && <span>{personalInfo.phone}</span>}
            {personalInfo?.location && <span>{personalInfo.location}</span>}
          </div>
        </div>

        {/* Summary */}
        {personalInfo?.summary && (
          <div className="space-y-2">
            <h4 className={`text-xs font-extrabold uppercase tracking-widest ${getColorClass("text")}`}>Summary</h4>
            <p className="text-slate-655 text-xs sm:text-sm leading-relaxed">{personalInfo.summary}</p>
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
                    <span>{exp.position}</span>
                    <span className="text-slate-400 font-medium text-[10px] sm:text-xs">
                      {exp.startDate ? exp.startDate.substring(0, 7) : ""} - {exp.currentlyWorking ? "Present" : exp.endDate ? exp.endDate.substring(0, 7) : ""}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[10px] sm:text-xs font-bold">{exp.company} • {exp.location}</p>
                  <ul className="list-disc list-inside text-slate-600 text-[11px] leading-relaxed space-y-0.5 mt-1 pl-1">
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
          <div className="space-y-4">
            <h4 className={`text-xs font-extrabold uppercase tracking-widest ${getColorClass("text")}`}>Education</h4>
            <div className="space-y-3">
              {education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-medium">{edu.school}</p>
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
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">{proj.title}</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{proj.description}</p>
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
            <div className="flex flex-wrap gap-2">
              {skills.map((s, idx) => (
                <span key={idx} className="bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1 text-[10px] sm:text-xs font-bold text-slate-700">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30 text-left">
      
      {/* Top Header */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-100 bg-white px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/builder/${id}`)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition-colors"
          >
            <IoChevronBackOutline className="h-5 w-5" />
          </button>
          <span className="font-bold text-slate-900">{currentResume.title} — Preview</span>
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
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-3.75rem)]">
        
        {/* Left Options Panel */}
        <aside className="w-64 border-r border-slate-100 bg-white p-6 space-y-6 overflow-y-auto shrink-0 hidden md:block">
          {/* Template select */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Template Style</label>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((t) => (
                <button
                  key={t}
                  onClick={() => changeResumeTemplate(id, t)}
                  className={`rounded-xl border p-2.5 text-xs font-bold text-center capitalize transition-all ${
                    currentResume.template === t
                      ? "border-indigo-650 bg-indigo-50/50 text-indigo-650 shadow-sm"
                      : "border-slate-205 hover:bg-slate-50 text-slate-650"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Theme select */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Theme Color</label>
            <div className="flex gap-2">
              {themeColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setThemeColor(color)}
                  className={`h-7 w-7 rounded-full transition-all ring-offset-2 hover:scale-105 active:scale-95 ${
                    color === "indigo" ? "bg-indigo-600" :
                    color === "slate" ? "bg-slate-700" :
                    color === "violet" ? "bg-violet-600" :
                    color === "emerald" ? "bg-emerald-600" : "bg-rose-500"
                  } ${themeColor === color ? "ring-2 ring-indigo-500" : ""}`}
                />
              ))}
            </div>
          </div>

          {/* Font select */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Typography</label>
            <select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none"
            >
              {fonts.map((f) => (
                <option key={f} value={f}>{f === "sans" ? "Sans Serif (Inter)" : f === "serif" ? "Classical Serif" : "Developer Mono"}</option>
              ))}
            </select>
          </div>
        </aside>

        {/* Center Panel: Full Page Mockup Preview */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-100 flex justify-center">
          {renderTemplate()}
        </main>

      </div>
    </div>
  );
};

export default ResumePreview;

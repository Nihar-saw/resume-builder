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
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-600 shadow-sm"
                      : "border-slate-200 hover:bg-slate-50 text-slate-650"
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
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100/50 p-10 space-y-8 min-h-[842px]">
            {/* Header info */}
            <div className="border-b border-slate-100 pb-5">
              <h1 className="text-2xl font-black text-slate-900 leading-none">
                {personalInfo?.fullName || "John Doe"}
              </h1>
              <p className="text-indigo-600 font-bold text-sm mt-1 capitalize">
                {experience?.[0]?.position || "Full Stack Developer"}
              </p>
              <div className="flex flex-wrap gap-x-3 text-xs text-slate-400 mt-2 font-medium">
                {personalInfo?.email && <span>{personalInfo.email}</span>}
                {personalInfo?.phone && <span>{personalInfo.phone}</span>}
                {personalInfo?.location && <span>{personalInfo.location}</span>}
              </div>
            </div>

            {/* Summary */}
            {personalInfo?.summary && (
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">Summary</h4>
                <p className="text-slate-650 text-sm leading-relaxed">{personalInfo.summary}</p>
              </div>
            )}

            {/* Experience */}
            {experience?.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">Experience</h4>
                <div className="space-y-4">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between font-bold text-slate-900 text-sm">
                        <span>{exp.position}</span>
                        <span className="text-slate-400 font-medium text-xs">
                          {exp.startDate ? exp.startDate.substring(0, 7) : ""} - {exp.currentlyWorking ? "Present" : exp.endDate ? exp.endDate.substring(0, 7) : ""}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs font-bold">{exp.company} • {exp.location}</p>
                      <ul className="list-disc list-inside text-slate-600 text-xs leading-relaxed space-y-0.5 mt-1 pl-1">
                        {exp.description?.map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {skills?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s, idx) => (
                    <span key={idx} className="bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
};

export default ResumePreview;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useResume } from "../context/ResumeContext";
import { getDashboardData } from "../api/dashboard.api";
import {
  IoAddOutline,
  IoDocumentTextOutline,
  IoShieldCheckmarkOutline,
  IoHardwareChipOutline,
  IoColorPaletteOutline,
  IoDownloadOutline,
  IoTrashOutline,
  IoCopyOutline,
  IoGlobeOutline,
  IoSparklesOutline,
  IoTrendingUpOutline,
  IoArrowForwardOutline,
  IoCheckmarkCircleOutline,
  IoRocketOutline,
  IoBulbOutline,
} from "react-icons/io5";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const { createNewResume, deleteResumeById, duplicateResumeById } = useResume();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const fetchDashboard = async () => {
    try {
      const data = await getDashboardData();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to fetch dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCreate = async () => {
    setLoading(true);
    const resume = await createNewResume();
    setLoading(false);
    if (resume) {
      toast.success("New resume created!");
      navigate(`/builder/${resume._id}`);
    } else {
      toast.error("Failed to create resume");
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this resume?")) {
      const success = await deleteResumeById(id);
      if (success) {
        toast.success("Resume deleted");
        fetchDashboard();
      } else {
        toast.error("Failed to delete resume");
      }
    }
  };

  const handleDuplicate = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    const resume = await duplicateResumeById(id);
    if (resume) {
      toast.success("Resume duplicated!");
      fetchDashboard();
    } else {
      toast.error("Failed to duplicate resume");
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const totalResumes = stats?.totalResumes || 0;
  const averageATS = stats?.averageATS || 0;
  const downloads = stats?.downloads || 0;
  const activityCount = stats?.recentActivity?.length || 0;

  return (
    <div className="space-y-8 text-left">
      {/* Hero Welcome Command Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-8 sm:p-10 shadow-2xl border border-indigo-700/40">
        {/* Glow Orbs */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 h-48 w-48 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Ollama AI Active
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-200">
                <IoSparklesOutline className="h-3.5 w-3.5" /> Career Hub
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {getTimeGreeting()}, {user?.firstName || "Professional"}! 👋
            </h1>
            <p className="text-indigo-200 text-sm leading-relaxed">
              Your personal resume builder, ATS optimization engine, and public portfolio center are ready.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button
              onClick={handleCreate}
              className="bg-white text-indigo-950 hover:bg-indigo-50 font-extrabold shadow-xl border-none text-sm py-3 px-6 rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              <IoAddOutline className="mr-1.5 h-5 w-5 text-indigo-600" />
              Create New Resume
            </Button>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Resumes */}
        <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <IoDocumentTextOutline className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              Resumes
            </span>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900">{totalResumes}</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Total Resumes Created</p>
          </div>
        </div>

        {/* Metric 2: Average ATS Compatibility */}
        <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <IoShieldCheckmarkOutline className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {averageATS >= 80 ? "Optimal" : averageATS >= 50 ? "Moderate" : "Building"}
            </span>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900">{averageATS}%</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Average ATS Score</p>
          </div>
        </div>

        {/* Metric 3: Downloads */}
        <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <IoDownloadOutline className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Exports
            </span>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900">{downloads}</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Total PDF & Zip Downloads</p>
          </div>
        </div>

        {/* Metric 4: Recent Activities */}
        <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-10 w-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
              <IoTrendingUpOutline className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
              Activity
            </span>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900">{activityCount}</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">AI Actions & Updates</p>
          </div>
        </div>
      </div>

      {/* Feature Command Hub (Quick Launchpad Grid) */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <IoRocketOutline className="h-5 w-5 text-indigo-600" />
          Feature Launchpad
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={handleCreate}
            className="group p-5 rounded-2xl bg-white border border-slate-150 hover:border-indigo-500 hover:shadow-lg transition-all text-left flex flex-col justify-between h-36"
          >
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <IoAddOutline className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                Build Resume <IoArrowForwardOutline className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Create or edit your resume</p>
            </div>
          </button>

          <Link
            to="/ats"
            className="group p-5 rounded-2xl bg-white border border-slate-150 hover:border-emerald-500 hover:shadow-lg transition-all text-left flex flex-col justify-between h-36"
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <IoShieldCheckmarkOutline className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors flex items-center justify-between">
                ATS Checker <IoArrowForwardOutline className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Ollama AI job compatibility</p>
            </div>
          </Link>

          <Link
            to="/portfolio"
            className="group p-5 rounded-2xl bg-white border border-slate-150 hover:border-cyan-500 hover:shadow-lg transition-all text-left flex flex-col justify-between h-36"
          >
            <div className="h-10 w-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <IoGlobeOutline className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-cyan-600 transition-colors flex items-center justify-between">
                Public Portfolio <IoArrowForwardOutline className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Themes, QR codes & Zip code</p>
            </div>
          </Link>

          <Link
            to="/ai-assistant"
            className="group p-5 rounded-2xl bg-white border border-slate-150 hover:border-purple-500 hover:shadow-lg transition-all text-left flex flex-col justify-between h-36"
          >
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <IoHardwareChipOutline className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-purple-600 transition-colors flex items-center justify-between">
                AI Assistant <IoArrowForwardOutline className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Rewrite summaries & STAR bullets</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Grid: Resumes List & Recommendations */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Recent Resumes Workspace */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <IoDocumentTextOutline className="h-5 w-5 text-indigo-600" />
              Recent Resumes
            </h3>
            <Link to="/resumes" className="text-xs font-extrabold text-indigo-600 hover:text-indigo-700">
              View All Resumes →
            </Link>
          </div>

          {stats?.resumes?.length === 0 ? (
            <EmptyState
              title="No resumes found"
              description="You haven't created any resumes yet. Click below to generate your first professional resume!"
              actionLabel="Create Resume"
              onAction={handleCreate}
            />
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {stats.resumes.map((resume) => (
                <div
                  key={resume._id}
                  onClick={() => navigate(`/builder/${resume._id}`)}
                  className="group relative rounded-2xl border border-slate-150 bg-white p-5 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between cursor-pointer space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <IoDocumentTextOutline className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase">
                        {resume.templateId || "Modern"}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {resume.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Last edited {new Date(resume.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-700">ATS {resume.atsScore || 0}%</span>
                      <span
                        className={`h-2 w-2 rounded-full ${
                          resume.atsScore > 80 ? "bg-emerald-500" : resume.atsScore > 50 ? "bg-amber-500" : "bg-red-400"
                        }`}
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleDuplicate(resume._id, e)}
                        className="p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all"
                        title="Duplicate Resume"
                      >
                        <IoCopyOutline className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(resume._id, e)}
                        className="p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all"
                        title="Delete Resume"
                      >
                        <IoTrashOutline className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: AI Smart Career Recommendations */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <IoBulbOutline className="h-5 w-5 text-amber-500" />
            Smart Recommendations
          </h3>

          <Card className="space-y-4 text-left p-5">
            <div className="flex items-start gap-3 text-xs leading-relaxed">
              <IoCheckmarkCircleOutline className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">Run ATS Keyword Optimization</p>
                <p className="text-slate-500 mt-0.5">Scan your resume with Ollama AI against target job specs to boost match rates.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs leading-relaxed pt-3 border-t border-slate-100">
              <IoCheckmarkCircleOutline className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">Export Standalone Portfolio (.zip)</p>
                <p className="text-slate-500 mt-0.5">Download index.html & style.css package for direct web hosting on GitHub Pages.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs leading-relaxed pt-3 border-t border-slate-100">
              <IoCheckmarkCircleOutline className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">Enhance Bullets with STAR Method</p>
                <p className="text-slate-500 mt-0.5">Use the AI Assistant tab to automatically generate high-impact accomplishment bullets.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

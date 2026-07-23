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
  IoShareSocialOutline,
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

  const statItems = [
    { label: "Total Resumes", value: stats?.totalResumes || 0, icon: IoDocumentTextOutline, color: "text-indigo-600 bg-indigo-50" },
    { label: "ATS Score (Avg)", value: `${stats?.averageATS || 0}%`, icon: IoShieldCheckmarkOutline, color: "text-emerald-600 bg-emerald-50" },
    { label: "Templates Used", value: "4", icon: IoColorPaletteOutline, color: "text-violet-600 bg-violet-50" }, // Static template estimate
    { label: "Downloads", value: stats?.downloads || 0, icon: IoDownloadOutline, color: "text-blue-600 bg-blue-50" },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.firstName || "User"}!
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Let's build something amazing today.
          </p>
        </div>
        <Button onClick={handleCreate} className="shadow-lg shadow-indigo-600/20 w-full sm:w-auto">
          <IoAddOutline className="mr-1.5 h-5 w-5" />
          Create New Resume
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="flex items-center gap-4 p-5 hover:translate-y-0">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Side: Recent Resumes */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center justify-between">
            Recent Resumes
            {stats?.resumes?.length > 0 && (
              <span className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">
                View All
              </span>
            )}
          </h3>

          {stats?.resumes?.length === 0 ? (
            <EmptyState
              title="No resumes found"
              description="You haven't created any resumes yet. Start today!"
              actionLabel="Create Resume"
              onAction={handleCreate}
            />
          ) : (
            <div className="space-y-4">
              {stats.resumes.map((resume) => (
                <div
                  key={resume._id}
                  onClick={() => navigate(`/builder/${resume._id}`)}
                  className="group relative rounded-2xl border border-slate-100 bg-white p-5 shadow-premium hover:shadow-indigo-500/5 hover:border-indigo-100 hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <IoDocumentTextOutline className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-indigo-600 transition-colors">
                        {resume.title}
                      </h4>
                      <p className="text-xs font-semibold text-slate-400 mt-0.5">
                        Updated {new Date(resume.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* ATS score indicator */}
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100/50 rounded-full px-2.5 py-1 text-xs">
                      <span className="font-bold text-slate-700">{resume.atsScore || 0}%</span>
                      <span className={`h-2 w-2 rounded-full ${resume.atsScore > 80 ? 'bg-emerald-500' : resume.atsScore > 50 ? 'bg-yellow-500' : 'bg-red-400'}`} />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleDuplicate(resume._id, e)}
                        className="p-1.5 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-all"
                        title="Duplicate"
                      >
                        <IoCopyOutline className="h-4.5 w-4.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(resume._id, e)}
                        className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
                        title="Delete"
                      >
                        <IoTrashOutline className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Quick Actions</h3>
          
          <div className="grid gap-4">
            <button
              onClick={handleCreate}
              className="flex items-center gap-3 text-left w-full rounded-2xl border border-slate-100 bg-white p-4 shadow-premium hover:border-indigo-100 hover:translate-y-[-2px] transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <IoAddOutline className="h-5 w-5" />
              </div>
              <div>
                <h5 className="font-bold text-slate-800 text-sm">Create New Resume</h5>
                <p className="text-xs text-slate-400 font-medium">Build a new custom resume</p>
              </div>
            </button>

            <Link
              to="/ats"
              className="flex items-center gap-3 text-left w-full rounded-2xl border border-slate-100 bg-white p-4 shadow-premium hover:border-indigo-100 hover:translate-y-[-2px] transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <IoShieldCheckmarkOutline className="h-5 w-5" />
              </div>
              <div>
                <h5 className="font-bold text-slate-800 text-sm">Check ATS Score</h5>
                <p className="text-xs text-slate-400 font-medium">Scan your match percentage</p>
              </div>
            </Link>

            <Link
              to="/ai-assistant"
              className="flex items-center gap-3 text-left w-full rounded-2xl border border-slate-100 bg-white p-4 shadow-premium hover:border-indigo-100 hover:translate-y-[-2px] transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <IoHardwareChipOutline className="h-5 w-5" />
              </div>
              <div>
                <h5 className="font-bold text-slate-800 text-sm">AI Resume Assistant</h5>
                <p className="text-xs text-slate-400 font-medium">Generate smart descriptions</p>
              </div>
            </Link>

            <Link
              to="/templates"
              className="flex items-center gap-3 text-left w-full rounded-2xl border border-slate-100 bg-white p-4 shadow-premium hover:border-indigo-100 hover:translate-y-[-2px] transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <IoColorPaletteOutline className="h-5 w-5" />
              </div>
              <div>
                <h5 className="font-bold text-slate-800 text-sm">View Templates</h5>
                <p className="text-xs text-slate-400 font-medium">Browse beautiful designs</p>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

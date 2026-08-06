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
      {/* ─── Hero Welcome Banner ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-[#16161a] border-3 border-black shadow-[8px_8px_0px_0px_#0ae448] p-8 sm:p-10">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 h-32 w-32 bg-[#0ae448]/10 rounded-bl-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-24 w-24 bg-[#facc15]/10 rounded-tr-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="neo-badge neo-badge-green text-[10px]">
                <span className="h-2 w-2 rounded-full bg-black animate-pulse inline-block mr-1" />
                AI Active
              </span>
              <span className="neo-badge neo-badge-yellow text-[10px]">
                <IoSparklesOutline className="h-3 w-3" />
                Career Hub
              </span>
            </div>
            <h1
              className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {getTimeGreeting()},{" "}
              <span className="bg-[#0ae448] text-black px-2 py-0.5 border-2 border-black shadow-[3px_3px_0px_0px_#000] inline-block">
                {user?.firstName || "Pro"}
              </span>{" "}
              👋
            </h1>
            <p className="text-sm font-semibold text-slate-300 leading-relaxed">
              Your resume builder, ATS optimizer, and public portfolio center are ready.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button onClick={handleCreate} variant="primary" size="lg">
              <IoAddOutline className="mr-1.5 h-5 w-5" />
              Create Resume
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Analytics Stats Grid ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Resumes",
            value: totalResumes,
            suffix: "",
            icon: IoDocumentTextOutline,
            badge: "RESUMES",
            badgeColor: "neo-badge-green",
            shadowColor: "#0ae448",
          },
          {
            label: "Avg ATS Score",
            value: `${averageATS}%`,
            suffix: "",
            icon: IoShieldCheckmarkOutline,
            badge: averageATS >= 80 ? "OPTIMAL" : averageATS >= 50 ? "MODERATE" : "BUILDING",
            badgeColor: "neo-badge-yellow",
            shadowColor: "#facc15",
          },
          {
            label: "PDF Downloads",
            value: downloads,
            suffix: "",
            icon: IoDownloadOutline,
            badge: "EXPORTS",
            badgeColor: "neo-badge-cyan",
            shadowColor: "#38bdf8",
          },
          {
            label: "AI Actions",
            value: activityCount,
            suffix: "",
            icon: IoTrendingUpOutline,
            badge: "ACTIVITY",
            badgeColor: "neo-badge-pink",
            shadowColor: "#ff007a",
          },
        ].map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div
              key={i}
              className="neo-box-interactive rounded-2xl p-5 flex flex-col gap-4"
              style={{ "--neo-shadow": metric.shadowColor }}
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-[#0ae448] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`neo-badge ${metric.badgeColor} text-[9px]`}>
                  {metric.badge}
                </span>
              </div>
              <div>
                <p
                  className="text-3xl font-black text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {metric.value}
                  {metric.suffix}
                </p>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                  {metric.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Feature Launchpad ─── */}
      <div className="space-y-4">
        <h3
          className="text-base font-black text-white flex items-center gap-2 uppercase tracking-wider"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span className="neo-badge neo-badge-pink text-[10px]">
            <IoRocketOutline className="h-3.5 w-3.5" />
            Quick Launch
          </span>
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Build Resume",
              desc: "Create or edit resume",
              icon: IoAddOutline,
              color: "#0ae448",
              textColor: "text-black",
              onClick: handleCreate,
              to: null,
            },
            {
              label: "ATS Checker",
              desc: "AI job compatibility",
              icon: IoShieldCheckmarkOutline,
              color: "#facc15",
              textColor: "text-black",
              to: "/ats",
            },
            {
              label: "Public Portfolio",
              desc: "Themes & QR codes",
              icon: IoGlobeOutline,
              color: "#38bdf8",
              textColor: "text-black",
              to: "/portfolio",
            },
            {
              label: "AI Assistant",
              desc: "Rewrite & optimize",
              icon: IoHardwareChipOutline,
              color: "#ff007a",
              textColor: "text-white",
              to: "/ai-assistant",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            const content = (
              <>
                <div
                  className="h-12 w-12 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: item.color }}
                >
                  <Icon className={`h-6 w-6 ${item.textColor}`} />
                </div>
                <div>
                  <h4 className="font-black text-white text-sm uppercase tracking-wide flex items-center justify-between group-hover:text-[#0ae448] transition-colors">
                    {item.label}
                    <IoArrowForwardOutline className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">{item.desc}</p>
                </div>
              </>
            );

            const cls =
              "group neo-box-interactive rounded-2xl p-5 text-left flex flex-col justify-between h-36 cursor-pointer";

            return item.to ? (
              <Link key={i} to={item.to} className={cls}>
                {content}
              </Link>
            ) : (
              <button key={i} onClick={item.onClick} className={cls}>
                {content}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Resumes + Recommendations ─── */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Recent Resumes */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center">
            <h3
              className="text-base font-black text-white flex items-center gap-2 uppercase"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <IoDocumentTextOutline className="h-5 w-5 text-[#0ae448]" />
              Recent Resumes
            </h3>
            <Link
              to="/resumes"
              className="text-xs font-extrabold text-[#0ae448] hover:underline uppercase tracking-wide"
            >
              View All →
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
              {stats?.resumes?.map((resume) => (
                <div
                  key={resume._id}
                  onClick={() => navigate(`/builder/${resume._id}`)}
                  className="group relative rounded-2xl border-3 border-black bg-[#16161a] p-5 shadow-[5px_5px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#0ae448] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150 flex flex-col justify-between cursor-pointer space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-xl bg-[#0ae448] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center">
                        <IoDocumentTextOutline className="h-5 w-5" />
                      </div>
                      <span className="neo-badge neo-badge-yellow text-[9px]">
                        {resume.templateId || "Modern"}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-black text-white text-base group-hover:text-[#0ae448] transition-colors line-clamp-1 uppercase">
                        {resume.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 font-medium">
                        Last edited {new Date(resume.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t-2 border-black">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-3 w-3 rounded-full border-2 border-black ${
                          resume.atsScore > 80
                            ? "bg-[#0ae448]"
                            : resume.atsScore > 50
                            ? "bg-[#facc15]"
                            : "bg-[#ff007a]"
                        }`}
                      />
                      <span className="text-xs font-black text-white uppercase">
                        ATS {resume.atsScore || 0}%
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleDuplicate(resume._id, e)}
                        className="p-1.5 rounded-lg border-2 border-black bg-[#1f1f26] text-slate-300 hover:bg-[#0ae448] hover:text-black shadow-[2px_2px_0px_0px_#000] transition-all"
                        title="Duplicate Resume"
                      >
                        <IoCopyOutline className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(resume._id, e)}
                        className="p-1.5 rounded-lg border-2 border-black bg-[#1f1f26] text-slate-300 hover:bg-red-500 hover:text-white shadow-[2px_2px_0px_0px_#000] transition-all"
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

        {/* Smart Recommendations */}
        <div className="lg:col-span-4 space-y-4">
          <h3
            className="text-base font-black text-white flex items-center gap-2 uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <IoBulbOutline className="h-5 w-5 text-[#facc15]" />
            AI Tips
          </h3>

          <div className="rounded-2xl border-3 border-black bg-[#16161a] p-5 shadow-[5px_5px_0px_0px_#facc15] space-y-4">
            {[
              {
                icon: IoCheckmarkCircleOutline,
                color: "text-[#0ae448]",
                title: "Run ATS Keyword Optimization",
                desc: "Scan your resume with Ollama AI against target job specs to boost match rates.",
              },
              {
                icon: IoCheckmarkCircleOutline,
                color: "text-[#38bdf8]",
                title: "Export Standalone Portfolio (.zip)",
                desc: "Download index.html & style.css package for direct web hosting on GitHub Pages.",
              },
              {
                icon: IoCheckmarkCircleOutline,
                color: "text-[#ff007a]",
                title: "Enhance Bullets with STAR Method",
                desc: "Use the AI Assistant tab to automatically generate high-impact accomplishment bullets.",
              },
            ].map((tip, i) => {
              const Icon = tip.icon;
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 text-xs leading-relaxed ${
                    i > 0 ? "pt-3 border-t-2 border-black" : ""
                  }`}
                >
                  <Icon className={`h-5 w-5 ${tip.color} shrink-0 mt-0.5`} />
                  <div>
                    <p className="font-black text-white uppercase tracking-wide">{tip.title}</p>
                    <p className="text-slate-400 mt-0.5 font-medium">{tip.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

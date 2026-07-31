import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResume } from "../context/ResumeContext";
import {
  IoAddOutline,
  IoDocumentTextOutline,
  IoSearchOutline,
  IoCopyOutline,
  IoTrashOutline,
  IoCreateOutline,
  IoEyeOutline,
  IoSparklesOutline,
  IoFilterOutline,
  IoShareSocialOutline,
} from "react-icons/io5";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { toast } from "react-hot-toast";
import { createPortfolio } from "../api/portfolio.api";

const Resumes = () => {
  const { resumes, fetchResumes, createNewResume, deleteResumeById, duplicateResumeById, loading } = useResume();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSort, setFilterSort] = useState("newest"); // "newest", "oldest", "ats"

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleCreate = async () => {
    toast.loading("Creating resume...");
    const resume = await createNewResume();
    toast.dismiss();
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
        toast.success("Resume deleted successfully");
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
    } else {
      toast.error("Failed to duplicate resume");
    }
  };

  const handleShare = async (id, e) => {
    e.stopPropagation();
    toast.loading("Creating share link...");
    try {
      const data = await createPortfolio(id);
      toast.dismiss();
      if (data.success && data.portfolio) {
        const link = `${window.location.origin}/r/${data.portfolio.slug}`;
        await navigator.clipboard.writeText(link);
        toast.success("Copied shareable link to clipboard!");
      } else {
        toast.error("Failed to generate link.");
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Error creating shareable link.");
    }
  };

  const filteredResumes = resumes.filter((res) =>
    res.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterSort === "newest") {
    filteredResumes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  } else if (filterSort === "oldest") {
    filteredResumes.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
  } else if (filterSort === "ats") {
    filteredResumes.sort((a, b) => (b.atsScore || 0) - (a.atsScore || 0));
  }

  return (
    <div className="space-y-8 text-left">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-150 pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            My Resumes Library
            <span className="inline-flex items-center gap-1 text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100">
              <IoSparklesOutline className="h-3.5 w-3.5" /> {resumes.length} Saved
            </span>
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Browse, manage, duplicate, and build all your custom resumes in one central library.
          </p>
        </div>
        <Button onClick={handleCreate} className="shadow-lg shadow-indigo-600/20 w-full sm:w-auto">
          <IoAddOutline className="mr-1.5 h-5 w-5" />
          Create New Resume
        </Button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-150 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <IoSearchOutline className="h-5 w-5" />
          </span>
          <input
            type="text"
            placeholder="Search resumes by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all duration-200"
          />
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <IoFilterOutline className="h-4 w-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-500 shrink-0">Sort By:</span>
          <select
            value={filterSort}
            onChange={(e) => setFilterSort(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="newest">Recently Updated</option>
            <option value="oldest">Oldest First</option>
            <option value="ats">Highest ATS Score</option>
          </select>
        </div>
      </div>

      {/* Resumes Grid */}
      {loading && resumes.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <Loader size="lg" />
        </div>
      ) : filteredResumes.length === 0 ? (
        <EmptyState
          title="No resumes found"
          description={searchTerm ? "No match found for your search term." : "You haven't built any resumes yet."}
          actionLabel={searchTerm ? null : "Build a Resume"}
          onAction={searchTerm ? null : handleCreate}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume) => (
            <Card
              key={resume._id}
              onClick={() => navigate(`/builder/${resume._id}`)}
              className="flex flex-col justify-between p-6 hover:translate-y-[-4px] border border-slate-150 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 group min-h-56 cursor-pointer space-y-4"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                    <IoDocumentTextOutline className="h-6 w-6" />
                  </div>

                  {/* ATS score tag */}
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-150 rounded-full px-3 py-1 text-xs">
                    <span className="font-bold text-slate-700">ATS {resume.atsScore || 0}%</span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        resume.atsScore > 80 ? "bg-emerald-500" : resume.atsScore > 50 ? "bg-amber-500" : "bg-red-400"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-base line-clamp-1">
                    {resume.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    Last updated {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/preview/${resume._id}`);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg transition-all"
                  >
                    <IoEyeOutline className="h-4 w-4" />
                    Preview
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/builder/${resume._id}`);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1.5 rounded-lg transition-all"
                  >
                    <IoCreateOutline className="h-4 w-4" />
                    Edit
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleShare(resume._id, e)}
                    className="p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                    title="Share Link"
                  >
                    <IoShareSocialOutline className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={(e) => handleDuplicate(resume._id, e)}
                    className="p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                    title="Duplicate"
                  >
                    <IoCopyOutline className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(resume._id, e)}
                    className="p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <IoTrashOutline className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Resumes;

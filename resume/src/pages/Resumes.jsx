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
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { toast } from "react-hot-toast";
import { createPortfolio } from "../api/portfolio.api";

const Resumes = () => {
  const { resumes, fetchResumes, createNewResume, deleteResumeById, duplicateResumeById, loading } = useResume();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSort, setFilterSort] = useState("newest");

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
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-3 border-black pb-6">
        <div>
          <h2
            className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3 uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            My Resumes
            <span className="neo-badge neo-badge-green text-[10px]">
              <IoSparklesOutline className="h-3.5 w-3.5" />
              {resumes.length} Saved
            </span>
          </h2>
          <p className="mt-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Browse, manage, duplicate, and build all your custom resumes.
          </p>
        </div>
        <Button onClick={handleCreate} variant="primary" size="md">
          <IoAddOutline className="mr-1.5 h-5 w-5" />
          Create Resume
        </Button>
      </div>

      {/* ─── Filter Toolbar ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#16161a] border-3 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] p-4">
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
            className="w-full rounded-xl border-2 border-black bg-[#1f1f26] py-2.5 pl-10 pr-4 text-sm font-medium text-white placeholder:text-slate-500 shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#0ae448] focus:outline-none transition-all"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <IoFilterOutline className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-black text-slate-400 shrink-0 uppercase tracking-wide">Sort:</span>
          <select
            value={filterSort}
            onChange={(e) => setFilterSort(e.target.value)}
            className="rounded-xl border-2 border-black bg-[#1f1f26] px-3 py-2 text-xs font-black text-white shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:shadow-[4px_4px_0px_0px_#0ae448] transition-all"
          >
            <option value="newest">Recently Updated</option>
            <option value="oldest">Oldest First</option>
            <option value="ats">Highest ATS Score</option>
          </select>
        </div>
      </div>

      {/* ─── Resumes Grid ─── */}
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
            <div
              key={resume._id}
              onClick={() => navigate(`/builder/${resume._id}`)}
              className="group rounded-2xl border-3 border-black bg-[#16161a] p-6 shadow-[5px_5px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#0ae448] hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between min-h-56 space-y-4 transition-all duration-150"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-[#0ae448] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IoDocumentTextOutline className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#1f1f26] px-3 py-1 shadow-[2px_2px_0px_0px_#000]">
                    <span
                      className={`h-2.5 w-2.5 rounded-full border-2 border-black ${
                        resume.atsScore > 80 ? "bg-[#0ae448]" : resume.atsScore > 50 ? "bg-[#facc15]" : "bg-[#ff007a]"
                      }`}
                    />
                    <span className="font-black text-white text-[10px] uppercase">ATS {resume.atsScore || 0}%</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-black text-white group-hover:text-[#0ae448] transition-colors text-base line-clamp-1 uppercase">
                    {resume.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    Last updated {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between border-t-2 border-black pt-4">
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/preview/${resume._id}`);
                    }}
                    className="inline-flex items-center gap-1 text-[10px] font-black text-slate-200 border-2 border-black bg-[#1f1f26] hover:bg-[#facc15] hover:text-black px-2 py-1.5 rounded-lg shadow-[2px_2px_0px_0px_#000] transition-all uppercase"
                  >
                    <IoEyeOutline className="h-3.5 w-3.5" />
                    Preview
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/builder/${resume._id}`);
                    }}
                    className="inline-flex items-center gap-1 text-[10px] font-black text-black border-2 border-black bg-[#0ae448] hover:bg-[#3dff6e] px-2 py-1.5 rounded-lg shadow-[2px_2px_0px_0px_#000] transition-all uppercase"
                  >
                    <IoCreateOutline className="h-3.5 w-3.5" />
                    Edit
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleShare(resume._id, e)}
                    className="p-1.5 rounded-lg border-2 border-black bg-[#1f1f26] text-slate-300 hover:bg-[#38bdf8] hover:text-black shadow-[2px_2px_0px_0px_#000] transition-all"
                    title="Share Link"
                  >
                    <IoShareSocialOutline className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDuplicate(resume._id, e)}
                    className="p-1.5 rounded-lg border-2 border-black bg-[#1f1f26] text-slate-300 hover:bg-[#facc15] hover:text-black shadow-[2px_2px_0px_0px_#000] transition-all"
                    title="Duplicate"
                  >
                    <IoCopyOutline className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(resume._id, e)}
                    className="p-1.5 rounded-lg border-2 border-black bg-[#1f1f26] text-slate-300 hover:bg-red-500 hover:text-white shadow-[2px_2px_0px_0px_#000] transition-all"
                    title="Delete"
                  >
                    <IoTrashOutline className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Resumes;

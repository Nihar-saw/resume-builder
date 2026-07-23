import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResume } from "../context/ResumeContext";
import {
  IoAddOutline,
  IoDocumentTextOutline,
  IoSearchOutline,
  IoCopyOutline,
  IoTrashOutline,
} from "react-icons/io5";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { toast } from "react-hot-toast";

const Resumes = () => {
  const { resumes, fetchResumes, createNewResume, deleteResumeById, duplicateResumeById, loading } = useResume();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredResumes = resumes.filter((res) =>
    res.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">My Resumes</h2>
          <p className="mt-1 text-sm text-slate-500">Manage and edit your saved resumes or build new ones.</p>
        </div>
        <Button onClick={handleCreate} className="shadow-lg shadow-indigo-600/20 w-full sm:w-auto">
          <IoAddOutline className="mr-1.5 h-5 w-5" />
          Create Resume
        </Button>
      </div>

      {/* Search & Actions Bar */}
      <div className="relative w-full max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <IoSearchOutline className="h-5 w-5" />
        </span>
        <input
          type="text"
          placeholder="Search resumes by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none transition-all duration-200"
        />
      </div>

      {/* Resumes Grid list */}
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
              className="flex flex-col justify-between p-6 hover:translate-y-[-4px] border border-slate-100 hover:border-indigo-100 transition-all duration-300 group min-h-48"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-650 transition-colors">
                    <IoDocumentTextOutline className="h-5 w-5" />
                  </div>
                  
                  {/* ATS score tag */}
                  <span className="text-[10px] font-bold bg-slate-50 px-2 py-0.5 rounded-full text-slate-500 border border-slate-100">
                    ATS: {resume.atsScore || 0}%
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 group-hover:text-indigo-650 transition-colors text-base line-clamp-1">
                    {resume.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">
                    Updated {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-2 border-t border-slate-50 pt-3 mt-4">
                <button
                  onClick={(e) => handleDuplicate(resume._id, e)}
                  className="p-1.5 text-slate-400 hover:bg-slate-50 hover:text-indigo-650 rounded-lg transition-colors"
                  title="Duplicate"
                >
                  <IoCopyOutline className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={(e) => handleDelete(resume._id, e)}
                  className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-655 rounded-lg transition-colors"
                  title="Delete"
                >
                  <IoTrashOutline className="h-4.5 w-4.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Resumes;

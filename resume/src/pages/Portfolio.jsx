import { useEffect, useState } from "react";
import { getAllResumes } from "../api/resume.api";
import { createPortfolio } from "../api/portfolio.api";
import { IoFolderOpenOutline, IoLinkOutline, IoQrCodeOutline, IoCopyOutline, IoChevronForwardOutline } from "react-icons/io5";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { toast } from "react-hot-toast";

const Portfolio = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [qrCode, setQrCode] = useState("");

  const loadResumes = async () => {
    try {
      const data = await getAllResumes();
      if (data.success && data.resumes.length > 0) {
        setResumes(data.resumes);
        setSelectedResumeId(data.resumes[0]._id);
      }
    } catch (error) {
      console.error("Failed to load resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedResumeId) {
      toast.error("Please select a resume context");
      return;
    }

    setCreating(true);
    setPortfolioLink("");
    setQrCode("");
    try {
      const data = await createPortfolio(selectedResumeId);
      if (data.success && data.portfolio) {
        const link = `${window.location.origin}/r/${data.portfolio.slug}`;
        setPortfolioLink(link);
        setQrCode(data.portfolio.qrCode);
        toast.success("Public Portfolio Generated!");
      }
    } catch (error) {
      console.error("Failed to generate portfolio:", error);
      toast.error("Failed to generate public link");
    } finally {
      setCreating(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(portfolioLink);
    toast.success("Link copied!");
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6 text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Public Portfolio</h2>
        <p className="mt-1 text-sm text-slate-500">
          Turn your resume into a beautiful, shareable web portfolio link with a custom QR code.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Side: Creation Panel */}
        {resumes.length === 0 ? (
          <EmptyState
            title="Create a Resume First"
            description="You need to have at least one resume saved in order to generate a public link."
          />
        ) : (
          <form onSubmit={handleGenerate}>
            <Card className="text-left space-y-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <IoFolderOpenOutline className="h-5 w-5 text-indigo-600" />
                Select Resume Source
              </h3>
              
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-semibold text-slate-700">Choose Resume</label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-base text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all duration-200"
                >
                  {resumes.map((res) => (
                    <option key={res._id} value={res._id}>
                      {res.title}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                loading={creating}
              >
                Generate Public Portfolio
              </Button>
            </Card>
          </form>
        )}

        {/* Right Side: Output Panel */}
        <div>
          {creating ? (
            <Card className="flex flex-col items-center justify-center py-20 text-center">
              <Loader size="lg" className="mb-4" />
              <h4 className="font-bold text-slate-800">Generating Portfolio...</h4>
              <p className="text-xs text-slate-400 mt-1">Creating custom short slugs and rendering QR codes.</p>
            </Card>
          ) : portfolioLink ? (
            <Card className="text-left space-y-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                <IoLinkOutline className="h-5 w-5 text-indigo-600" />
                Your Shareable Links
              </h3>

              {/* Link Input Row */}
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={portfolioLink}
                  className="flex-1 w-full rounded-xl border border-slate-250 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 focus:outline-none"
                />
                <Button variant="outline" size="sm" onClick={copyLink} className="py-2.5 px-4 shrink-0">
                  <IoCopyOutline className="h-4.5 w-4.5" />
                </Button>
              </div>

              {/* QR Code section */}
              {qrCode && (
                <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 border-t border-slate-100">
                  <div className="border border-slate-100 rounded-2xl p-3 bg-slate-50 shadow-inner shrink-0">
                    <img src={qrCode} alt="Portfolio QR Code" className="h-32 w-32 object-contain" />
                  </div>
                  <div className="text-center sm:text-left space-y-2">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 justify-center sm:justify-start">
                      <IoQrCodeOutline className="h-4.5 w-4.5 text-indigo-500" />
                      QR Code Ready
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Download this QR code to print on your business cards, paste into emails, or share directly on social media.
                    </p>
                    <a
                      href={qrCode}
                      download="my-resume-qr.png"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-500 pt-1"
                    >
                      Download Image
                      <IoChevronForwardOutline className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center py-20 text-center border-dashed">
              <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
                <IoLinkOutline className="h-8 w-8" />
              </div>
              <h4 className="font-bold text-slate-700 text-sm">No Active Portfolio</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                Generate a portfolio link using the left panel to share your work publicly.
              </p>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
};

export default Portfolio;

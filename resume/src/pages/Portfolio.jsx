import { useEffect, useState } from "react";
import { getAllResumes } from "../api/resume.api";
import { createPortfolio } from "../api/portfolio.api";
import { downloadPortfolioZip } from "../utils/portfolioExporter";
import {
  IoFolderOpenOutline,
  IoLinkOutline,
  IoQrCodeOutline,
  IoCopyOutline,
  IoChevronForwardOutline,
  IoColorPaletteOutline,
  IoSparklesOutline,
  IoDownloadOutline,
} from "react-icons/io5";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { toast } from "react-hot-toast";

const THEMES = [
  { id: "auto", name: "🎲 Auto / Dynamic Random", desc: "Generates a unique, distinct design & layout automatically" },
  { id: "aurora", name: "🌌 Aurora Cyberpunk", desc: "Dark mode glassmorphism with neon cyan & violet glow" },
  { id: "editorial", name: "📜 Editorial Elegance", desc: "Classic serif typography with ivory & navy luxury styling" },
  { id: "brutalist", name: "🎨 Neo-Brutalism", desc: "Bold saturated colors, thick borders & hard pop shadows" },
  { id: "terminal", name: "💻 Hacker Terminal", desc: "Developer console aesthetic with matrix green code font" },
  { id: "swiss", name: "📐 Swiss Minimalist", desc: "Crisp white layout with high contrast bold typography" },
  { id: "sunset", name: "🌅 Vibrant Sunset", desc: "Rich gradient mesh header with floating glass card elements" },
];

const Portfolio = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("auto");
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
      const data = await createPortfolio(selectedResumeId, selectedTheme);
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

  const handleDownloadZip = () => {
    const selectedResume = resumes.find((r) => r._id === selectedResumeId) || resumes[0];
    if (!selectedResume) {
      toast.error("Please select a resume first");
      return;
    }
    try {
      downloadPortfolioZip(selectedResume, selectedTheme);
      toast.success("Portfolio Zip Generated & Downloading!", { icon: "📦" });
    } catch (error) {
      console.error("Zip export failed:", error);
      toast.error("Failed to generate portfolio zip");
    }
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
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          Public Portfolio
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100">
            <IoSparklesOutline className="h-3.5 w-3.5" /> Dynamic Themes
          </span>
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Turn your resume into a unique web portfolio link or download the complete HTML/CSS source code (.zip).
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Side: Creation Panel */}
        {resumes.length === 0 ? (
          <EmptyState
            title="Create a Resume First"
            description="You need to have at least one resume saved in order to generate a public link or export source code."
          />
        ) : (
          <form onSubmit={handleGenerate}>
            <Card className="text-left space-y-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <IoFolderOpenOutline className="h-5 w-5 text-indigo-600" />
                1. Select Resume Source
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

              {/* Theme Selection */}
              <div className="space-y-3 pt-2">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <IoColorPaletteOutline className="h-5 w-5 text-indigo-600" />
                  2. Choose Design Style
                </h3>
                <div className="grid gap-2 max-h-60 overflow-y-auto pr-1">
                  {THEMES.map((theme) => (
                    <label
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                        selectedTheme === theme.id
                          ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                          : "border-slate-150 bg-white hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="portfolioTheme"
                        checked={selectedTheme === theme.id}
                        onChange={() => setSelectedTheme(theme.id)}
                        className="mt-1 accent-indigo-600"
                      />
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-800">{theme.name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{theme.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Button type="submit" variant="primary" className="w-full" loading={creating}>
                  Generate Public Portfolio Link
                </Button>

                <button
                  type="button"
                  onClick={handleDownloadZip}
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-sm py-2.5 px-4 rounded-xl transition-all"
                >
                  <IoDownloadOutline className="h-4 w-4" />
                  Download Source Code (.zip)
                </button>
              </div>
            </Card>
          </form>
        )}

        {/* Right Side: Output Panel */}
        <div>
          {creating ? (
            <Card className="flex flex-col items-center justify-center py-20 text-center">
              <Loader size="lg" className="mb-4" />
              <h4 className="font-bold text-slate-800">Generating Unique Portfolio...</h4>
              <p className="text-xs text-slate-400 mt-1">Applying theme layouts, short slugs and QR code graphics.</p>
            </Card>
          ) : portfolioLink ? (
            <Card className="text-left space-y-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                <IoLinkOutline className="h-5 w-5 text-indigo-600" />
                Your Shareable Portfolio
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

              <div className="flex flex-wrap gap-3">
                <a
                  href={portfolioLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-xl transition-all"
                >
                  Visit Public Portfolio
                  <IoChevronForwardOutline className="h-3 w-3" />
                </a>

                <button
                  type="button"
                  onClick={handleDownloadZip}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 px-3 py-2 rounded-xl transition-all"
                >
                  <IoDownloadOutline className="h-3.5 w-3.5" />
                  Download Code (.zip)
                </button>
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
                Generate a portfolio link using the left panel to share your work publicly with a unique design theme or download the source code (.zip).
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;

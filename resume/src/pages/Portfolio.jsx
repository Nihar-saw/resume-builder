import { useEffect, useState } from "react";
import { useResume } from "../context/ResumeContext";
import { createPortfolio, downloadPortfolioZip } from "../api/portfolio.api";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  IoGlobeOutline,
  IoColorPaletteOutline,
  IoSparklesOutline,
  IoCopyOutline,
  IoOpenOutline,
  IoDownloadOutline,
  IoFolderOpenOutline,
} from "react-icons/io5";
import { toast } from "react-hot-toast";

const PORTFOLIO_THEMES = [
  {
    id: "aurora",
    name: "Aurora Cyberpunk",
    category: "popular",
    badge: "Cyberpunk",
    badgeColor: "neo-badge-green",
    desc: "Dark background with glowing neon green-cyan gradients and animated glass cards.",
  },
  {
    id: "editorial",
    name: "Editorial Elegance",
    category: "executive",
    badge: "Classic",
    badgeColor: "neo-badge-yellow",
    desc: "Sophisticated editorial serif typography with warm cream and charcoal aesthetics.",
  },
  {
    id: "brutalist",
    name: "Neo-Brutalism",
    category: "creative",
    badge: "Neo-Brutal",
    badgeColor: "neo-badge-pink",
    desc: "Bold high-contrast layout featuring offset shadows, thick borders, and neon badge accents.",
  },
  {
    id: "terminal",
    name: "Hacker Terminal",
    category: "tech",
    badge: "Developer",
    badgeColor: "neo-badge-green",
    desc: "Console terminal theme with matrix green mono text, shell commands, and prompt symbols.",
  },
  {
    id: "swiss",
    name: "Swiss Minimalist",
    category: "minimal",
    badge: "Minimal",
    badgeColor: "neo-badge-blue",
    desc: "Ultra-clean Swiss grid layout emphasizing pure white space and crisp typography.",
  },
  {
    id: "sunset",
    name: "Vibrant Sunset",
    category: "creative",
    badge: "Creative",
    badgeColor: "neo-badge-pink",
    desc: "Warm vibrant gradient palette with animated hover cards designed for media and design roles.",
  },
];

const CATEGORIES = ["all", "popular", "executive", "creative", "tech", "minimal"];

const Portfolio = () => {
  const { resumes, fetchResumes } = useResume();
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("aurora");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [generatedPortfolio, setGeneratedPortfolio] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  useEffect(() => {
    if (resumes.length > 0 && !selectedResumeId) {
      setSelectedResumeId(resumes[0]._id);
    }
  }, [resumes, selectedResumeId]);

  const filteredThemes = selectedCategory === "all"
    ? PORTFOLIO_THEMES
    : PORTFOLIO_THEMES.filter(t => t.category === selectedCategory);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedResumeId) return;

    setLoading(true);
    try {
      const data = await createPortfolio(selectedResumeId, selectedTheme);
      if (data.success && data.portfolio) {
        setGeneratedPortfolio(data.portfolio);
        toast.success("Portfolio website generated!");
      } else {
        toast.error("Failed to generate portfolio");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating portfolio link");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!generatedPortfolio) return;
    const link = `${window.location.origin}/r/${generatedPortfolio.slug}`;
    navigator.clipboard.writeText(link);
    toast.success("Public link copied to clipboard!");
  };

  const handleDownloadZip = async () => {
    if (!selectedResumeId) return;
    setDownloadingZip(true);
    toast.loading("Generating ZIP source code...");
    try {
      await downloadPortfolioZip(selectedResumeId, selectedTheme);
      toast.dismiss();
      toast.success("Downloaded portfolio source code (.zip)!");
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Failed to download ZIP file");
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* ─── Header ─── */}
      <div className="border-b-3 border-black pb-6">
        <h2
          className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3 uppercase"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Web Portfolio Generator
          <span className="neo-badge neo-badge-green text-[10px]">
            <IoSparklesOutline className="h-3.5 w-3.5" /> Live
          </span>
        </h2>
        <p className="mt-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Turn your resume into a unique web portfolio link or export the source code.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* ─── Left Panel: Form ─── */}
        {resumes.length === 0 ? (
          <EmptyState
            title="Create a Resume First"
            description="You need to have at least one resume saved in order to generate a public link or export source code."
          />
        ) : (
          <form onSubmit={handleGenerate} className="rounded-2xl border-3 border-black bg-[#16161a] p-6 shadow-[6px_6px_0px_0px_#000] space-y-6">
            <h3 className="text-base font-black text-white uppercase tracking-wide flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
              <IoFolderOpenOutline className="h-5 w-5 text-[#0ae448]" />
              1. Select Resume Source
            </h3>

            <div className="space-y-1.5 w-full">
              <label className="text-xs font-black uppercase tracking-wider text-slate-300">Choose Resume</label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full rounded-xl border-2 border-black bg-[#1f1f26] px-4 py-2.5 text-sm font-semibold text-white shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#0ae448] focus:outline-none transition-all"
              >
                {resumes.map((res) => (
                  <option key={res._id} value={res._id}>
                    {res.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme & Category Selection */}
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-black text-white uppercase tracking-wide flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                <IoColorPaletteOutline className="h-5 w-5 text-[#0ae448]" />
                2. Choose Design Style & Category
              </h3>

              {/* Category Filters */}
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-xl border-2 border-black px-3 py-1.5 text-[10px] font-black uppercase transition-all shrink-0 shadow-[2px_2px_0px_0px_#000] ${
                      selectedCategory === cat
                        ? "bg-[#0ae448] text-black shadow-[3px_3px_0px_0px_#000]"
                        : "bg-[#1f1f26] text-slate-400 hover:bg-[#2a2a33] hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Theme Options */}
              <div className="grid gap-3 max-h-72 overflow-y-auto pr-1">
                {filteredThemes.map((theme) => (
                  <label
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 border-black cursor-pointer transition-all shadow-[2px_2px_0px_0px_#000] ${
                      selectedTheme === theme.id
                        ? "bg-[#0ae448] text-black shadow-[4px_4px_0px_0px_#000]"
                        : "bg-[#1f1f26] text-slate-300 hover:bg-[#2a2a33]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="portfolioTheme"
                      checked={selectedTheme === theme.id}
                      onChange={() => setSelectedTheme(theme.id)}
                      className="mt-1 accent-black"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-black text-sm uppercase">{theme.name}</h4>
                        <span className={`neo-badge ${theme.badgeColor} text-[9px] py-0.5 px-2`}>
                          {theme.badge}
                        </span>
                      </div>
                      <p className={`text-xs mt-1 ${selectedTheme === theme.id ? "text-black font-semibold" : "text-slate-400 font-medium"}`}>{theme.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-black">
              <Button type="submit" variant="primary" loading={loading} className="w-full sm:flex-1">
                <IoGlobeOutline className="mr-1.5 h-5 w-5" />
                Generate Web Link
              </Button>
              <Button
                type="button"
                variant="outline"
                loading={downloadingZip}
                onClick={handleDownloadZip}
                className="w-full sm:flex-1"
              >
                <IoDownloadOutline className="mr-1.5 h-5 w-5" />
                Download Source (.ZIP)
              </Button>
            </div>
          </form>
        )}

        {/* ─── Right Panel: Generated Output ─── */}
        <div className="space-y-6">
          {generatedPortfolio ? (
            <div className="rounded-2xl border-3 border-black bg-[#16161a] p-6 shadow-[6px_6px_0px_0px_#000] space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#0ae448] text-black border-2 border-black flex items-center justify-center font-black">
                  <IoGlobeOutline className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-black text-white text-base uppercase" style={{ fontFamily: "var(--font-display)" }}>
                    Portfolio Link Ready!
                  </h4>
                  <p className="text-xs text-slate-400 font-semibold">Your public website link is live and shareable.</p>
                </div>
              </div>

              <div className="p-3 bg-[#1f1f26] rounded-xl border-2 border-black font-mono text-xs text-[#0ae448] break-all shadow-[2px_2px_0px_0px_#000]">
                {window.location.origin}/r/{generatedPortfolio.slug}
              </div>

              <div className="flex gap-3">
                <Button variant="primary" size="sm" onClick={handleCopyLink} className="flex-1">
                  <IoCopyOutline className="mr-1.5 h-4 w-4" /> Copy Link
                </Button>
                <a
                  href={`/r/${generatedPortfolio.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <IoOpenOutline className="mr-1.5 h-4 w-4" /> View Live
                  </Button>
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-3 border-black bg-[#16161a] p-10 text-center shadow-[6px_6px_0px_0px_#000] space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1f1f26] border-2 border-black text-[#0ae448] shadow-[3px_3px_0px_0px_#000]">
                <IoGlobeOutline className="h-8 w-8" />
              </div>
              <h4 className="font-black text-white text-base uppercase" style={{ fontFamily: "var(--font-display)" }}>
                No Portfolio Generated Yet
              </h4>
              <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">
                Select your resume and theme on the left, then click &quot;Generate Web Link&quot; to publish your custom website.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResume } from "../context/ResumeContext";
import { IoCheckmarkOutline, IoSparklesOutline } from "react-icons/io5";
import Button from "../components/common/Button";
import { toast } from "react-hot-toast";

const templatesList = [
  {
    id: "modern",
    name: "Modern Pro",
    category: "popular",
    badge: "Most Popular",
    badgeColor: "neo-badge-green",
    gradient: "from-emerald-500/20 via-[#0ae448]/10 to-transparent",
    borderAccent: "border-[#0ae448]",
    description: "Sleek, high-impact layout with bold section headings and optimized spacing for ATS scans.",
  },
  {
    id: "classic",
    name: "Executive Serif",
    category: "executive",
    badge: "Corporate",
    badgeColor: "neo-badge-yellow",
    gradient: "from-yellow-500/20 via-amber-500/10 to-transparent",
    borderAccent: "border-[#facc15]",
    description: "Centered, elegant serif typography tailored for senior roles, management, and legal fields.",
  },
  {
    id: "minimal",
    name: "Swiss Minimalist",
    category: "minimal",
    badge: "Clean",
    badgeColor: "neo-badge-blue",
    gradient: "from-sky-500/20 via-blue-500/10 to-transparent",
    borderAccent: "border-[#38bdf8]",
    description: "Stripped-back, disciplined alignment with clean border accents highlighting core content.",
  },
  {
    id: "creative",
    name: "Creative Portfolio",
    category: "creative",
    badge: "Design & Media",
    badgeColor: "neo-badge-pink",
    gradient: "from-pink-500/20 via-purple-500/10 to-transparent",
    borderAccent: "border-[#ff007a]",
    description: "Distinctive two-column sidebar layout built for designers, developers, and marketers.",
  },
  {
    id: "corporate",
    name: "Corporate Standard",
    category: "executive",
    badge: "Enterprise",
    badgeColor: "neo-badge-yellow",
    gradient: "from-blue-600/20 via-indigo-600/10 to-transparent",
    borderAccent: "border-indigo-400",
    description: "Top colored banner heading designed for corporate management, banking, and consulting.",
  },
  {
    id: "elegant",
    name: "Golden Elegant",
    category: "executive",
    badge: "Luxury",
    badgeColor: "neo-badge-yellow",
    gradient: "from-amber-600/20 via-yellow-600/10 to-transparent",
    borderAccent: "border-amber-400",
    description: "Warm charcoal typography with subtle warm amber dividers for executive presentations.",
  },
  {
    id: "tech",
    name: "Hacker Terminal",
    category: "tech",
    badge: "Developer",
    badgeColor: "neo-badge-green",
    gradient: "from-emerald-600/20 via-green-600/10 to-transparent",
    borderAccent: "border-[#0ae448]",
    description: "Dark matrix green aesthetic with prompt symbols (›, #) for software engineers and DevOps.",
  },
];

const CATEGORIES = ["all", "popular", "executive", "creative", "tech", "minimal"];

const Templates = () => {
  const { createNewResume } = useResume();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const filteredTemplates = filter === "all" 
    ? templatesList 
    : templatesList.filter(t => t.category === filter);

  const handleSelect = async (templateId, templateName) => {
    toast.loading(`Creating ${templateName}...`);
    const resume = await createNewResume(`My ${templateName}`);
    toast.dismiss();
    if (resume) {
      resume.template = templateId;
      toast.success(`${templateName} created!`);
      navigate(`/builder/${resume._id}`);
    } else {
      toast.error("Failed to create resume");
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
          Resume Templates
          <span className="neo-badge neo-badge-green text-[10px]">
            <IoSparklesOutline className="h-3.5 w-3.5" /> {templatesList.length} Styles
          </span>
        </h2>
        <p className="mt-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Choose an ATS-optimized template designed for your specific industry.
        </p>
      </div>

      {/* ─── Category Filter Tabs ─── */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-xl border-2 border-black px-4 py-2 text-xs font-black uppercase transition-all shrink-0 shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 ${
              filter === cat
                ? "bg-[#0ae448] text-black shadow-[4px_4px_0px_0px_#000]"
                : "bg-[#16161a] text-slate-400 hover:bg-[#1f1f26] hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ─── Templates Grid ─── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="rounded-2xl border-3 border-black bg-[#16161a] shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#0ae448] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150 overflow-hidden flex flex-col justify-between group"
          >
            {/* Visual Header Banner */}
            <div className={`p-5 bg-gradient-to-br ${template.gradient} border-b-2 border-black flex justify-between items-start relative`}>
              <span className={`neo-badge ${template.badgeColor} text-[10px]`}>
                {template.badge}
              </span>
              <div className="h-8 w-8 rounded-xl bg-[#1f1f26] border-2 border-black flex items-center justify-center font-mono text-xs font-black text-white shadow-[2px_2px_0px_0px_#000]">
                {template.id.substring(0, 2).toUpperCase()}
              </div>
            </div>

            {/* Template Info & Action */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
              <div>
                <h4 className="font-black text-white text-lg uppercase tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
                  {template.name}
                </h4>
                <p className="text-xs font-semibold text-slate-400 mt-1.5 leading-relaxed">
                  {template.description}
                </p>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => handleSelect(template.id, template.name)}
                  variant="primary"
                  size="sm"
                  className="w-full text-xs font-black"
                >
                  <IoCheckmarkOutline className="mr-1 h-4 w-4" />
                  Use Template
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;

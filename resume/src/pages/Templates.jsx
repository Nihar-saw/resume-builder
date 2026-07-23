import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResume } from "../context/ResumeContext";
import { IoCheckmarkOutline, IoEyeOutline } from "react-icons/io5";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { toast } from "react-hot-toast";

const Templates = () => {
  const { createNewResume } = useResume();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const templatesList = [
    {
      id: "modern",
      name: "Modern Pro",
      category: "modern",
      color: "from-blue-500 to-indigo-500",
      description: "Clean, elegant layout with strong typography hierarchies.",
    },
    {
      id: "classic",
      name: "Clean Design",
      category: "classic",
      color: "from-slate-700 to-slate-800",
      description: "Traditional grid alignment suitable for serious corporate positions.",
    },
    {
      id: "minimal",
      name: "Minimalist",
      category: "minimal",
      color: "from-zinc-400 to-zinc-600",
      description: "Stripped-back elegant details highlighting clean text content.",
    },
    {
      id: "creative",
      name: "Creative One",
      category: "creative",
      color: "from-purple-500 to-pink-500",
      description: "Vibrant accents, perfect for design, tech, and marketing fields.",
    },
  ];

  const filteredTemplates = filter === "all" 
    ? templatesList 
    : templatesList.filter(t => t.category === filter);

  const handleSelect = async (templateId) => {
    toast.loading("Creating resume with template...");
    const resume = await createNewResume(`My ${templateId.charAt(0).toUpperCase() + templateId.slice(1)} Resume`);
    toast.dismiss();
    if (resume) {
      // Set the template explicitly
      resume.template = templateId;
      toast.success("Resume created!");
      navigate(`/builder/${resume._id}`);
    } else {
      toast.error("Failed to create resume");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6 text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Choose a Template</h2>
        <p className="mt-1 text-sm text-slate-500">
          Select a template style optimized to get you past automated tracking systems.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["all", "modern", "minimal", "classic", "creative"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold capitalize transition-all shrink-0 active:scale-95 ${
              filter === tab
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "bg-white text-slate-600 border border-slate-150 hover:bg-slate-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="p-0 overflow-hidden flex flex-col justify-between group">
            {/* Visual Thumbnail */}
            <div className={`aspect-video bg-gradient-to-br ${template.color} p-4 flex flex-col justify-between text-white relative`}>
              <span className="text-xs uppercase font-extrabold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md">
                {template.category}
              </span>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10 shadow-lg">
                <div className="h-3 w-20 bg-white/50 rounded-sm mb-2" />
                <div className="h-1.5 w-full bg-white/30 rounded-sm mb-1.5" />
                <div className="h-1.5 w-4/5 bg-white/30 rounded-sm" />
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-4 text-left">
              <div>
                <h4 className="font-bold text-slate-800 text-base">{template.name}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{template.description}</p>
              </div>
              
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={() => handleSelect(template.id)}
                  variant="primary"
                  size="sm"
                  className="flex-1 font-bold text-xs"
                >
                  <IoCheckmarkOutline className="mr-1 h-4 w-4" />
                  Use Template
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Templates;

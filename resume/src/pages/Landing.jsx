import { Link } from "react-router-dom";
import { IoHardwareChipOutline, IoShieldCheckmarkOutline, IoColorPaletteOutline, IoDownloadOutline, IoSparklesOutline, IoChevronForward } from "react-icons/io5";
import Button from "../components/common/Button";

const Landing = () => {
  const features = [
    {
      title: "AI-Powered Suggestions",
      description: "Receive instant smart updates and tailored bullet points directly based on target descriptions.",
      icon: IoHardwareChipOutline,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      title: "ATS Score Checker",
      description: "Check your resume structure and scan for critical keywords matching your job profile.",
      icon: IoShieldCheckmarkOutline,
      color: "text-violet-600 bg-violet-50",
    },
    {
      title: "Multiple Templates",
      description: "Switch seamlessly between beautiful styles (Modern, Clean, Classic, Creative) in real-time.",
      icon: IoColorPaletteOutline,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "PDF & DOCX Download",
      description: "Export high-resolution documents ready for submission in multiple file formats.",
      icon: IoDownloadOutline,
      color: "text-emerald-600 bg-emerald-50",
    },
  ];

  return (
    <div className="bg-slate-50/50 min-h-screen">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl z-0" />
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* Headline tag */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-700 mb-6">
            <IoSparklesOutline className="h-3.5 w-3.5" />
            Empowered by Advanced AI
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl max-w-2xl leading-tight">
            Build a Professional Resume with <span className="text-gradient font-black">AI Power</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-slate-500 leading-relaxed">
            Create ATS-friendly resumes, get real-time AI suggestions, scan your resume against job specifications, and land your dream role.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link to="/register">
              <Button variant="primary" size="lg" className="shadow-lg shadow-indigo-600/20">
                Get Started Free
                <IoChevronForward className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/templates">
              <Button variant="outline" size="lg">
                View Templates
              </Button>
            </Link>
          </div>

          {/* Large Mockup Graphic */}
          <div className="mt-16 w-full max-w-4xl rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl relative">
            <div className="relative rounded-xl overflow-hidden bg-slate-50 aspect-video flex items-center justify-center p-8">
              <div className="w-full max-w-xl bg-white border border-slate-100 rounded-xl p-6 shadow-lg flex gap-6 text-left">
                {/* Simulated resume structure */}
                <div className="flex-1 space-y-4">
                  <div className="h-6 w-32 bg-slate-100 rounded-md" />
                  <div className="h-3 w-48 bg-slate-50 rounded-md" />
                  <div className="space-y-2 mt-6">
                    <div className="h-2 w-full bg-slate-50 rounded-md" />
                    <div className="h-2 w-5/6 bg-slate-50 rounded-md" />
                    <div className="h-2 w-4/5 bg-slate-50 rounded-md" />
                  </div>
                </div>
                <div className="w-24 flex flex-col items-center justify-center gap-2 border-l border-slate-100 pl-6">
                  <div className="relative flex items-center justify-center">
                    {/* Circle badge */}
                    <div className="h-16 w-16 rounded-full border-4 border-emerald-500 flex items-center justify-center">
                      <span className="text-lg font-bold text-slate-800">96</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Excellent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 bg-white border-y border-slate-100">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Everything you need to succeed
          </h2>
          <p className="mt-4 text-slate-500">
            Engineered to guide you at every stage of your job application journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color} mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust AI banner */}
      <section id="ai-tools" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center">
        <div className="premium-gradient rounded-3xl p-8 sm:p-16 text-white max-w-5xl mx-auto shadow-2xl relative overflow-hidden flex flex-col items-center">
          <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
          
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl max-w-xl leading-tight">
            Ready to stand out in the applicant pool?
          </h2>
          <p className="mt-4 max-w-md text-sm sm:text-base text-indigo-100">
            Sign up now and build templates fully compatible with major ATS software.
          </p>
          <div className="mt-8">
            <Link to="/register">
              <Button variant="outline" className="bg-white hover:bg-slate-50 border-transparent text-indigo-600 font-bold px-8 py-3.5 shadow-md shadow-black/10">
                Create My Resume
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

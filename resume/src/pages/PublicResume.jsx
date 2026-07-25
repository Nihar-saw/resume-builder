import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getPublicResume } from "../api/portfolio.api";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import {
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
  IoLogoLinkedin,
  IoLogoGithub,
  IoGlobeOutline,
  IoSendOutline,
  IoSparklesOutline,
  IoShuffleOutline,
  IoCodeSlashOutline,
  IoTerminalOutline,
  IoLayersOutline,
} from "react-icons/io5";
import { toast } from "react-hot-toast";

const AVAILABLE_THEMES = [
  { id: "aurora", name: "🌌 Aurora Cyberpunk" },
  { id: "editorial", name: "📜 Editorial Elegance" },
  { id: "brutalist", name: "🎨 Neo-Brutalism" },
  { id: "terminal", name: "💻 Hacker Terminal" },
  { id: "swiss", name: "📐 Swiss Minimalist" },
  { id: "sunset", name: "🌅 Vibrant Sunset" },
];

function getEffectiveTheme(themeProp, slug = "") {
  if (themeProp && themeProp !== "auto" && AVAILABLE_THEMES.some((t) => t.id === themeProp)) {
    return themeProp;
  }
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVAILABLE_THEMES.length;
  return AVAILABLE_THEMES[index].id;
}

const PublicResume = () => {
  const { slug } = useParams();
  const [resume, setResume] = useState(null);
  const [resumeUser, setResumeUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTheme, setActiveTheme] = useState("aurora");
  const [showThemePicker, setShowThemePicker] = useState(false);

  // Refs for scrolling
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const skillsRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await getPublicResume(slug);
        if (data.success && data.resume) {
          setResume(data.resume);
          setResumeUser(data.user);
          const chosenTheme = getEffectiveTheme(data.theme, slug);
          setActiveTheme(chosenTheme);
        } else {
          setError(data.message || "Failed to load public resume");
        }
      } catch (err) {
        setError("Resume not found or is no longer public.");
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [slug]);

  const scrollToSection = (elementRef) => {
    elementRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully!");
    e.target.reset();
  };

  const randomizeTheme = () => {
    const otherThemes = AVAILABLE_THEMES.filter((t) => t.id !== activeTheme);
    const randomTheme = otherThemes[Math.floor(Math.random() * otherThemes.length)];
    setActiveTheme(randomTheme.id);
    toast.success(`Switched to ${randomTheme.name}!`, { icon: "🎨" });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-6 text-center text-white">
        <div className="rounded-3xl bg-slate-800 p-12 shadow-2xl border border-slate-700 max-w-md w-full">
          <span className="text-4xl mb-4 block">🚫</span>
          <h2 className="text-xl font-bold text-white mb-2">Unavailable</h2>
          <p className="text-sm text-slate-400 mb-6">{error || "This resume is private or doesn't exist."}</p>
        </div>
      </div>
    );
  }

  const { personalInfo, education, experience, skills, projects } = resume;
  const fullName = personalInfo?.fullName || "Portfolio Owner";
  const targetRole = experience?.[0]?.position || "Full Stack Engineer";
  const bio =
    personalInfo?.summary ||
    "Passionate software professional dedicated to crafting clean, high-performance web applications and scalable digital experiences.";
  const avatarUrl = resumeUser?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${fullName}`;

  return (
    <div className="relative min-h-screen transition-colors duration-500">
      {/* Render Dynamic Unique Theme */}
      {activeTheme === "aurora" && (
        <AuroraTheme
          fullName={fullName}
          targetRole={targetRole}
          bio={bio}
          avatarUrl={avatarUrl}
          personalInfo={personalInfo}
          education={education}
          experience={experience}
          skills={skills}
          projects={projects}
          scrollToSection={scrollToSection}
          homeRef={homeRef}
          aboutRef={aboutRef}
          projectsRef={projectsRef}
          skillsRef={skillsRef}
          contactRef={contactRef}
          handleContactSubmit={handleContactSubmit}
        />
      )}

      {activeTheme === "editorial" && (
        <EditorialTheme
          fullName={fullName}
          targetRole={targetRole}
          bio={bio}
          avatarUrl={avatarUrl}
          personalInfo={personalInfo}
          education={education}
          experience={experience}
          skills={skills}
          projects={projects}
          scrollToSection={scrollToSection}
          homeRef={homeRef}
          aboutRef={aboutRef}
          projectsRef={projectsRef}
          skillsRef={skillsRef}
          contactRef={contactRef}
          handleContactSubmit={handleContactSubmit}
        />
      )}

      {activeTheme === "brutalist" && (
        <BrutalistTheme
          fullName={fullName}
          targetRole={targetRole}
          bio={bio}
          avatarUrl={avatarUrl}
          personalInfo={personalInfo}
          education={education}
          experience={experience}
          skills={skills}
          projects={projects}
          scrollToSection={scrollToSection}
          homeRef={homeRef}
          aboutRef={aboutRef}
          projectsRef={projectsRef}
          skillsRef={skillsRef}
          contactRef={contactRef}
          handleContactSubmit={handleContactSubmit}
        />
      )}

      {activeTheme === "terminal" && (
        <TerminalTheme
          fullName={fullName}
          targetRole={targetRole}
          bio={bio}
          avatarUrl={avatarUrl}
          personalInfo={personalInfo}
          education={education}
          experience={experience}
          skills={skills}
          projects={projects}
          scrollToSection={scrollToSection}
          homeRef={homeRef}
          aboutRef={aboutRef}
          projectsRef={projectsRef}
          skillsRef={skillsRef}
          contactRef={contactRef}
          handleContactSubmit={handleContactSubmit}
        />
      )}

      {activeTheme === "swiss" && (
        <SwissTheme
          fullName={fullName}
          targetRole={targetRole}
          bio={bio}
          avatarUrl={avatarUrl}
          personalInfo={personalInfo}
          education={education}
          experience={experience}
          skills={skills}
          projects={projects}
          scrollToSection={scrollToSection}
          homeRef={homeRef}
          aboutRef={aboutRef}
          projectsRef={projectsRef}
          skillsRef={skillsRef}
          contactRef={contactRef}
          handleContactSubmit={handleContactSubmit}
        />
      )}

      {activeTheme === "sunset" && (
        <SunsetTheme
          fullName={fullName}
          targetRole={targetRole}
          bio={bio}
          avatarUrl={avatarUrl}
          personalInfo={personalInfo}
          education={education}
          experience={experience}
          skills={skills}
          projects={projects}
          scrollToSection={scrollToSection}
          homeRef={homeRef}
          aboutRef={aboutRef}
          projectsRef={projectsRef}
          skillsRef={skillsRef}
          contactRef={contactRef}
          handleContactSubmit={handleContactSubmit}
        />
      )}
    </div>
  );
};

/* ==========================================================================
   THEME 1: AURORA CYBERPUNK (Glassmorphic Dark Mode with Neon Accents)
   ========================================================================== */
const AuroraTheme = ({
  fullName,
  targetRole,
  bio,
  avatarUrl,
  personalInfo,
  education,
  experience,
  skills,
  projects,
  scrollToSection,
  homeRef,
  aboutRef,
  projectsRef,
  skillsRef,
  contactRef,
  handleContactSubmit,
}) => (
  <div className="bg-[#0b0f19] text-slate-100 font-sans antialiased min-h-screen selection:bg-cyan-500 selection:text-black">
    {/* Glow Orbs */}
    <div className="fixed top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />
    <div className="fixed bottom-0 right-1/4 h-96 w-96 rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none" />

    {/* Navbar */}
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0b0f19]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center font-black text-black text-sm shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            {fullName.charAt(0)}
          </div>
          <span className="font-extrabold text-white tracking-tight">{fullName}</span>
        </div>
        <nav className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-slate-400">
          <button onClick={() => scrollToSection(homeRef)} className="hover:text-cyan-400 transition-colors">Home</button>
          <button onClick={() => scrollToSection(aboutRef)} className="hover:text-cyan-400 transition-colors">About</button>
          {projects?.length > 0 && <button onClick={() => scrollToSection(projectsRef)} className="hover:text-cyan-400 transition-colors">Projects</button>}
          {skills?.length > 0 && <button onClick={() => scrollToSection(skillsRef)} className="hover:text-cyan-400 transition-colors">Skills</button>}
          <button onClick={() => scrollToSection(contactRef)} className="hover:text-cyan-400 transition-colors">Contact</button>
        </nav>
        <Button variant="primary" size="sm" onClick={() => scrollToSection(contactRef)} className="bg-gradient-to-r from-cyan-500 to-indigo-600 text-black font-extrabold border-none shadow-lg">
          Hire Me
        </Button>
      </div>
    </header>

    {/* Hero */}
    <section ref={homeRef} className="mx-auto max-w-6xl px-6 py-24 grid md:grid-cols-12 gap-12 items-center min-h-[calc(100vh-4rem)]">
      <div className="md:col-span-7 space-y-6 text-left">
        <span className="inline-block bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          ⚡ Available for Opportunities
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          Hello, I'm <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">{fullName}</span>
        </h1>
        <p className="text-xl text-slate-400 font-medium capitalize">{targetRole}</p>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg">{bio}</p>
        <div className="flex gap-4 pt-2">
          <button onClick={() => scrollToSection(contactRef)} className="px-6 py-3 rounded-xl bg-cyan-400 text-slate-950 font-extrabold text-sm hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            Let's Talk
          </button>
          {projects?.length > 0 && (
            <button onClick={() => scrollToSection(projectsRef)} className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-sm hover:border-slate-700 transition-all">
              Explore Projects
            </button>
          )}
        </div>
      </div>

      <div className="md:col-span-5 flex justify-center">
        <div className="relative h-72 w-72 sm:h-80 sm:w-80 rounded-3xl bg-slate-900/60 border border-cyan-500/20 p-4 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex items-center justify-center backdrop-blur-xl">
          <img src={avatarUrl} alt={fullName} className="h-64 w-64 rounded-2xl object-cover bg-slate-950 border border-slate-800" />
        </div>
      </div>
    </section>

    {/* About & Timeline */}
    <section ref={aboutRef} className="border-t border-slate-800/80 bg-slate-950/50 py-20">
      <div className="mx-auto max-w-6xl px-6 space-y-12 text-left">
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" /> Experience & Education
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          {/* Experience */}
          {experience?.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest">Work History</h3>
              <div className="space-y-6 border-l-2 border-slate-800 pl-4">
                {experience.map((exp, idx) => (
                  <div key={idx} className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl relative space-y-2">
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/20">
                      {exp.startDate ? new Date(exp.startDate).getFullYear() : ""} - {exp.currentlyWorking ? "Present" : exp.endDate ? new Date(exp.endDate).getFullYear() : ""}
                    </span>
                    <h4 className="font-bold text-white text-base">{exp.position}</h4>
                    <p className="text-xs text-slate-400">{exp.company} • {exp.location}</p>
                    {exp.description?.map((b, bIdx) => (
                      <p key={bIdx} className="text-xs text-slate-400 leading-relaxed">• {b}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education?.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Academic Background</h3>
              <div className="space-y-6 border-l-2 border-slate-800 pl-4">
                {education.map((edu, idx) => (
                  <div key={idx} className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-500/20">
                      {edu.startDate ? new Date(edu.startDate).getFullYear() : ""} - {edu.endDate ? new Date(edu.endDate).getFullYear() : ""}
                    </span>
                    <h4 className="font-bold text-white text-base">{edu.degree}</h4>
                    <p className="text-xs text-slate-400">{edu.school}</p>
                    {edu.fieldOfStudy && <p className="text-xs text-slate-500">Major: {edu.fieldOfStudy}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>

    {/* Projects */}
    {projects?.length > 0 && (
      <section ref={projectsRef} className="py-20 mx-auto max-w-6xl px-6 space-y-10 text-left">
        <h2 className="text-3xl font-extrabold text-white">Featured Projects</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 p-6 rounded-2xl space-y-4 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all">
              <h4 className="font-bold text-white text-lg">{proj.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
              {proj.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {proj.technologies.map((tech, tIdx) => (
                    <span key={tIdx} className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-md">
                      #{tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Skills */}
    {skills?.length > 0 && (
      <section ref={skillsRef} className="bg-slate-950/80 border-y border-slate-800/80 py-16 text-left">
        <div className="mx-auto max-w-6xl px-6 space-y-6">
          <h2 className="text-2xl font-bold text-white">Technical Arsenal</h2>
          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill, idx) => (
              <span key={idx} className="bg-slate-900 text-cyan-400 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono font-bold shadow-inner">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>
    )}

    {/* Contact */}
    <section ref={contactRef} className="py-20 mx-auto max-w-6xl px-6 text-left">
      <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5 space-y-6">
          <h2 className="text-3xl font-extrabold text-white">Get In Touch</h2>
          <p className="text-sm text-slate-400">Ready to initiate a project or discuss career opportunities?</p>
          <div className="space-y-3 text-xs text-slate-300">
            {personalInfo?.email && <p>📧 {personalInfo.email}</p>}
            {personalInfo?.phone && <p>📞 {personalInfo.phone}</p>}
            {personalInfo?.location && <p>📍 {personalInfo.location}</p>}
          </div>
        </div>
        <div className="md:col-span-7 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <Input label="Name" name="name" placeholder="Your Name" required className="bg-slate-950 border-slate-800 text-white" />
            <Input label="Email" name="email" type="email" placeholder="Your Email" required className="bg-slate-950 border-slate-800 text-white" />
            <Input label="Message" name="message" type="textarea" placeholder="Message details..." rows={4} required className="bg-slate-950 border-slate-800 text-white" />
            <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-black font-extrabold py-3 rounded-xl shadow-lg hover:opacity-90 transition-all">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
);

/* ==========================================================================
   THEME 2: EDITORIAL ELEGANCE (Classic Luxury Executive Theme)
   ========================================================================== */
const EditorialTheme = ({
  fullName,
  targetRole,
  bio,
  avatarUrl,
  personalInfo,
  education,
  experience,
  skills,
  projects,
  scrollToSection,
  homeRef,
  aboutRef,
  projectsRef,
  skillsRef,
  contactRef,
  handleContactSubmit,
}) => (
  <div className="bg-[#faf8f5] text-[#1c1917] font-serif antialiased min-h-screen selection:bg-amber-200">
    <header className="border-b border-amber-900/10 bg-[#faf8f5]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-8">
        <span className="text-2xl font-bold tracking-tight text-[#0c0a09] font-serif italic">{fullName}</span>
        <nav className="hidden md:flex gap-8 text-xs font-sans font-semibold uppercase tracking-widest text-[#78716c]">
          <button onClick={() => scrollToSection(homeRef)} className="hover:text-amber-900 transition-colors">Overview</button>
          <button onClick={() => scrollToSection(aboutRef)} className="hover:text-amber-900 transition-colors">Biography</button>
          {projects?.length > 0 && <button onClick={() => scrollToSection(projectsRef)} className="hover:text-amber-900 transition-colors">Portfolio</button>}
          {skills?.length > 0 && <button onClick={() => scrollToSection(skillsRef)} className="hover:text-amber-900 transition-colors">Expertise</button>}
          <button onClick={() => scrollToSection(contactRef)} className="hover:text-amber-900 transition-colors">Contact</button>
        </nav>
      </div>
    </header>

    <section ref={homeRef} className="mx-auto max-w-4xl px-8 py-24 text-center space-y-8">
      <img src={avatarUrl} alt={fullName} className="h-36 w-36 rounded-full mx-auto border-2 border-amber-900/20 object-cover p-1 shadow-md bg-white" />
      <div className="space-y-4">
        <p className="text-xs font-sans uppercase tracking-[0.3em] font-bold text-amber-800">{targetRole}</p>
        <h1 className="text-4xl sm:text-6xl font-normal text-[#0c0a09] leading-tight font-serif italic">{fullName}</h1>
        <p className="text-lg text-[#57534e] max-w-2xl mx-auto leading-relaxed font-sans font-light">{bio}</p>
      </div>
      <div className="pt-4 flex justify-center gap-4 font-sans text-xs font-bold uppercase tracking-wider">
        <button onClick={() => scrollToSection(contactRef)} className="px-8 py-3 bg-[#1c1917] text-white rounded-none hover:bg-amber-900 transition-all">
          Inquire Directly
        </button>
      </div>
    </section>

    <section ref={aboutRef} className="border-t border-amber-900/10 py-20 bg-white">
      <div className="mx-auto max-w-4xl px-8 space-y-12 text-left">
        <h2 className="text-2xl font-serif italic text-[#0c0a09] border-b border-amber-900/10 pb-4">Professional Biography</h2>
        {experience?.length > 0 && (
          <div className="space-y-8 font-sans">
            {experience.map((exp, idx) => (
              <div key={idx} className="grid md:grid-cols-12 gap-4 pb-6 border-b border-stone-100">
                <div className="md:col-span-3 text-xs text-amber-900 font-bold tracking-wider">
                  {exp.startDate ? new Date(exp.startDate).getFullYear() : ""} — {exp.currentlyWorking ? "Present" : exp.endDate ? new Date(exp.endDate).getFullYear() : ""}
                </div>
                <div className="md:col-span-9 space-y-1">
                  <h4 className="font-bold text-stone-900 font-serif text-lg">{exp.position}</h4>
                  <p className="text-xs text-stone-500 font-semibold">{exp.company} • {exp.location}</p>
                  {exp.description?.map((b, bIdx) => (
                    <p key={bIdx} className="text-xs text-stone-600 leading-relaxed pt-1">{b}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>

    {projects?.length > 0 && (
      <section ref={projectsRef} className="py-20 mx-auto max-w-4xl px-8 space-y-10 text-left">
        <h2 className="text-2xl font-serif italic text-[#0c0a09] border-b border-amber-900/10 pb-4">Selected Works</h2>
        <div className="grid md:grid-cols-2 gap-8 font-sans">
          {projects.map((proj, idx) => (
            <div key={idx} className="bg-white border border-stone-200 p-6 space-y-3 shadow-sm">
              <h4 className="font-serif italic text-lg text-stone-900">{proj.title}</h4>
              <p className="text-xs text-stone-600 leading-relaxed">{proj.description}</p>
            </div>
          ))}
        </div>
      </section>
    )}

    {skills?.length > 0 && (
      <section ref={skillsRef} className="bg-white border-y border-amber-900/10 py-16 text-center font-sans">
        <div className="mx-auto max-w-4xl px-8 space-y-6">
          <h2 className="text-xs uppercase tracking-[0.3em] text-amber-900 font-bold">Core Competencies</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill, idx) => (
              <span key={idx} className="text-xs font-semibold text-stone-800 bg-[#faf8f5] border border-stone-300 px-4 py-2">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>
    )}

    <section ref={contactRef} className="py-20 mx-auto max-w-3xl px-8 text-center font-sans space-y-8">
      <h2 className="text-3xl font-serif italic text-stone-900">Initiate Contact</h2>
      <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
        <Input label="Your Name" name="name" placeholder="Full Name" required className="bg-white border-stone-300 rounded-none" />
        <Input label="Your Email" name="email" type="email" placeholder="Email Address" required className="bg-white border-stone-300 rounded-none" />
        <Input label="Message" name="message" type="textarea" placeholder="Your Message..." rows={4} required className="bg-white border-stone-300 rounded-none" />
        <button type="submit" className="w-full bg-stone-900 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-none hover:bg-amber-900 transition-all">
          Send Message
        </button>
      </form>
    </section>
  </div>
);

/* ==========================================================================
   THEME 3: NEO-BRUTALISM (Bold Pop Art & Offset Box Shadows)
   ========================================================================== */
const BrutalistTheme = ({
  fullName,
  targetRole,
  bio,
  avatarUrl,
  personalInfo,
  education,
  experience,
  skills,
  projects,
  scrollToSection,
  homeRef,
  aboutRef,
  projectsRef,
  skillsRef,
  contactRef,
  handleContactSubmit,
}) => (
  <div className="bg-[#fef3c7] text-[#0f172a] font-sans antialiased min-h-screen selection:bg-black selection:text-yellow-300">
    <header className="border-b-4 border-black bg-white sticky top-0 z-40">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <span className="font-black text-xl text-black uppercase tracking-wider bg-yellow-300 px-3 py-1 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          {fullName}
        </span>
        <nav className="hidden md:flex gap-6 text-xs font-black uppercase tracking-wider text-black">
          <button onClick={() => scrollToSection(homeRef)} className="hover:underline">Home</button>
          <button onClick={() => scrollToSection(aboutRef)} className="hover:underline">About</button>
          {projects?.length > 0 && <button onClick={() => scrollToSection(projectsRef)} className="hover:underline">Projects</button>}
          {skills?.length > 0 && <button onClick={() => scrollToSection(skillsRef)} className="hover:underline">Skills</button>}
          <button onClick={() => scrollToSection(contactRef)} className="hover:underline">Contact</button>
        </nav>
      </div>
    </header>

    <section ref={homeRef} className="mx-auto max-w-5xl px-6 py-20 grid md:grid-cols-12 gap-8 items-center">
      <div className="md:col-span-7 space-y-6 text-left">
        <span className="inline-block bg-pink-400 text-black border-2 border-black font-black text-xs px-3 py-1 uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          🚀 Open For Work
        </span>
        <h1 className="text-5xl sm:text-7xl font-black text-black leading-tight">
          HEY! I'M <span className="bg-cyan-300 px-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">{fullName}</span>
        </h1>
        <p className="text-xl font-bold bg-white inline-block px-3 py-1 border-2 border-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">{targetRole}</p>
        <p className="text-sm font-bold leading-relaxed bg-white p-4 border-3 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">{bio}</p>
        <div className="pt-2">
          <button onClick={() => scrollToSection(contactRef)} className="bg-lime-400 text-black font-black text-sm px-6 py-3 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            GET IN TOUCH ⚡
          </button>
        </div>
      </div>

      <div className="md:col-span-5 flex justify-center">
        <div className="bg-violet-400 p-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <img src={avatarUrl} alt={fullName} className="h-64 w-64 bg-white border-2 border-black object-cover" />
        </div>
      </div>
    </section>

    {/* About / Exp */}
    <section ref={aboutRef} className="border-t-4 border-black bg-white py-16">
      <div className="mx-auto max-w-5xl px-6 space-y-8 text-left">
        <h2 className="text-3xl font-black uppercase tracking-tight bg-yellow-300 inline-block px-4 py-1 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Experience & Study
        </h2>
        {experience?.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {experience.map((exp, idx) => (
              <div key={idx} className="bg-sky-200 border-3 border-black p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-2">
                <span className="text-xs font-black bg-black text-white px-2 py-0.5">
                  {exp.startDate ? new Date(exp.startDate).getFullYear() : ""} - {exp.currentlyWorking ? "Present" : exp.endDate ? new Date(exp.endDate).getFullYear() : ""}
                </span>
                <h4 className="font-black text-lg text-black uppercase">{exp.position}</h4>
                <p className="text-xs font-bold">{exp.company} • {exp.location}</p>
                {exp.description?.map((b, bIdx) => (
                  <p key={bIdx} className="text-xs font-semibold leading-snug">• {b}</p>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>

    {/* Projects */}
    {projects?.length > 0 && (
      <section ref={projectsRef} className="py-16 mx-auto max-w-5xl px-6 space-y-8 text-left">
        <h2 className="text-3xl font-black uppercase bg-pink-400 inline-block px-4 py-1 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Featured Builds
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj, idx) => (
            <div key={idx} className="bg-white border-3 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
              <h4 className="font-black text-lg uppercase">{proj.title}</h4>
              <p className="text-xs font-semibold leading-relaxed">{proj.description}</p>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Skills */}
    {skills?.length > 0 && (
      <section ref={skillsRef} className="bg-violet-300 border-y-4 border-black py-12 text-left">
        <div className="mx-auto max-w-5xl px-6 space-y-4">
          <h2 className="text-2xl font-black uppercase">Skills & Tools</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span key={idx} className="bg-white border-2 border-black font-black text-xs px-3 py-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>
    )}

    {/* Contact */}
    <section ref={contactRef} className="py-16 mx-auto max-w-4xl px-6 text-left">
      <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
        <h2 className="text-3xl font-black uppercase bg-yellow-300 inline-block px-3 py-1 border-2 border-black">Send A Signal</h2>
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <Input label="Name" name="name" placeholder="Your Name" required className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
          <Input label="Email" name="email" type="email" placeholder="Your Email" required className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
          <Input label="Message" name="message" type="textarea" placeholder="Message details..." rows={4} required className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
          <button type="submit" className="w-full bg-black text-yellow-300 font-black text-sm uppercase py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(253,224,71,1)] hover:bg-slate-900">
            Submit Message
          </button>
        </form>
      </div>
    </section>
  </div>
);

/* ==========================================================================
   THEME 4: HACKER TERMINAL (Developer Monospace Console)
   ========================================================================== */
const TerminalTheme = ({
  fullName,
  targetRole,
  bio,
  avatarUrl,
  personalInfo,
  education,
  experience,
  skills,
  projects,
  scrollToSection,
  homeRef,
  aboutRef,
  projectsRef,
  skillsRef,
  contactRef,
  handleContactSubmit,
}) => (
  <div className="bg-[#0d1117] text-[#c9d1d9] font-mono antialiased min-h-screen selection:bg-emerald-500 selection:text-black">
    {/* Terminal Navbar */}
    <header className="border-b border-[#30363d] bg-[#161b22] sticky top-0 z-40">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-500 inline-block" />
          <span className="h-3 w-3 rounded-full bg-amber-500 inline-block" />
          <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" />
          <span className="text-slate-400 font-bold ml-2">bash -- {fullName.toLowerCase().replace(/\s+/g, "_")}.sh</span>
        </div>
        <nav className="hidden md:flex gap-6 text-[11px] text-emerald-400">
          <button onClick={() => scrollToSection(homeRef)} className="hover:underline">~/home</button>
          <button onClick={() => scrollToSection(aboutRef)} className="hover:underline">~/about</button>
          {projects?.length > 0 && <button onClick={() => scrollToSection(projectsRef)} className="hover:underline">~/projects</button>}
          {skills?.length > 0 && <button onClick={() => scrollToSection(skillsRef)} className="hover:underline">~/skills</button>}
          <button onClick={() => scrollToSection(contactRef)} className="hover:underline">~/contact</button>
        </nav>
      </div>
    </header>

    {/* Hero Console */}
    <section ref={homeRef} className="mx-auto max-w-5xl px-6 py-20 grid md:grid-cols-12 gap-8 items-center">
      <div className="md:col-span-7 space-y-4 text-left">
        <div className="text-xs text-slate-500">$ whoami</div>
        <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
          <span className="text-emerald-400">&gt;</span> {fullName}
        </h1>
        <p className="text-xs text-cyan-400 font-semibold">// Role: {targetRole}</p>
        <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg text-xs leading-relaxed text-slate-300">
          <span className="text-emerald-400">$ cat bio.txt</span>
          <p className="mt-2">{bio}</p>
        </div>
        <div className="pt-2">
          <button onClick={() => scrollToSection(contactRef)} className="bg-emerald-500 text-black font-bold text-xs px-5 py-2.5 rounded hover:bg-emerald-400 transition-all">
            $ ./contact.sh
          </button>
        </div>
      </div>

      <div className="md:col-span-5 flex justify-center">
        <div className="bg-[#161b22] border border-[#30363d] p-3 rounded-xl shadow-2xl">
          <img src={avatarUrl} alt={fullName} className="h-56 w-56 rounded-lg object-cover bg-black" />
        </div>
      </div>
    </section>

    {/* Experience */}
    <section ref={aboutRef} className="border-t border-[#30363d] bg-[#161b22]/40 py-16">
      <div className="mx-auto max-w-5xl px-6 space-y-6 text-left">
        <div className="text-xs text-emerald-400 font-bold">$ git log --experience</div>
        {experience?.length > 0 && (
          <div className="space-y-4 text-xs">
            {experience.map((exp, idx) => (
              <div key={idx} className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg space-y-1">
                <span className="text-amber-400 font-bold">
                  commit: {exp.startDate ? new Date(exp.startDate).getFullYear() : ""} - {exp.currentlyWorking ? "HEAD" : exp.endDate ? new Date(exp.endDate).getFullYear() : ""}
                </span>
                <h4 className="font-bold text-white text-sm">{exp.position} @ {exp.company}</h4>
                {exp.description?.map((b, bIdx) => (
                  <p key={bIdx} className="text-slate-400 text-[11px] leading-relaxed">+ {b}</p>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>

    {/* Projects */}
    {projects?.length > 0 && (
      <section ref={projectsRef} className="py-16 mx-auto max-w-5xl px-6 space-y-6 text-left">
        <div className="text-xs text-emerald-400 font-bold">$ ls -l ./projects</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {projects.map((proj, idx) => (
            <div key={idx} className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg space-y-2">
              <h4 className="font-bold text-cyan-400 text-sm">{proj.title}</h4>
              <p className="text-slate-400 leading-relaxed">{proj.description}</p>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Skills */}
    {skills?.length > 0 && (
      <section ref={skillsRef} className="bg-[#161b22] border-y border-[#30363d] py-12 text-left">
        <div className="mx-auto max-w-5xl px-6 space-y-4">
          <div className="text-xs text-emerald-400 font-bold">$ cat dependencies.json</div>
          <div className="flex flex-wrap gap-2 text-xs">
            {skills.map((skill, idx) => (
              <span key={idx} className="bg-[#0d1117] text-emerald-400 border border-[#30363d] px-3 py-1 rounded">
                "{skill}"
              </span>
            ))}
          </div>
        </div>
      </section>
    )}

    {/* Contact */}
    <section ref={contactRef} className="py-16 mx-auto max-w-3xl px-6 text-left">
      <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-lg space-y-4 text-xs">
        <div className="text-emerald-400 font-bold">$ ./send_message --interactive</div>
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <Input label="Sender Name" name="name" placeholder="Name" required className="bg-[#0d1117] border-[#30363d] text-white" />
          <Input label="Sender Email" name="email" type="email" placeholder="Email" required className="bg-[#0d1117] border-[#30363d] text-white" />
          <Input label="Payload" name="message" type="textarea" placeholder="Message content..." rows={4} required className="bg-[#0d1117] border-[#30363d] text-white" />
          <button type="submit" className="w-full bg-emerald-500 text-black font-bold py-2.5 rounded hover:bg-emerald-400 transition-all">
            EXECUTE TRANSMISSION
          </button>
        </form>
      </div>
    </section>
  </div>
);

/* ==========================================================================
   THEME 5: SWISS MINIMALIST (Clean Grid & Bold Stark Contrast)
   ========================================================================== */
const SwissTheme = ({
  fullName,
  targetRole,
  bio,
  avatarUrl,
  personalInfo,
  education,
  experience,
  skills,
  projects,
  scrollToSection,
  homeRef,
  aboutRef,
  projectsRef,
  skillsRef,
  contactRef,
  handleContactSubmit,
}) => (
  <div className="bg-white text-slate-950 font-sans antialiased min-h-screen selection:bg-blue-600 selection:text-white">
    <header className="border-b-2 border-slate-950 bg-white sticky top-0 z-40">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-8">
        <span className="font-black text-2xl tracking-tighter uppercase">{fullName}</span>
        <nav className="hidden md:flex gap-8 text-xs font-extrabold uppercase tracking-widest text-slate-600">
          <button onClick={() => scrollToSection(homeRef)} className="hover:text-blue-600">01 Home</button>
          <button onClick={() => scrollToSection(aboutRef)} className="hover:text-blue-600">02 About</button>
          {projects?.length > 0 && <button onClick={() => scrollToSection(projectsRef)} className="hover:text-blue-600">03 Works</button>}
          {skills?.length > 0 && <button onClick={() => scrollToSection(skillsRef)} className="hover:text-blue-600">04 Skills</button>}
          <button onClick={() => scrollToSection(contactRef)} className="hover:text-blue-600">05 Contact</button>
        </nav>
      </div>
    </header>

    <section ref={homeRef} className="mx-auto max-w-6xl px-8 py-24 border-b-2 border-slate-950 grid md:grid-cols-12 gap-12 items-center">
      <div className="md:col-span-8 space-y-6 text-left">
        <p className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">// {targetRole}</p>
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight uppercase leading-none">{fullName}</h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-xl font-medium">{bio}</p>
        <div className="pt-4">
          <button onClick={() => scrollToSection(contactRef)} className="bg-slate-950 text-white font-extrabold text-xs uppercase tracking-widest px-8 py-4 hover:bg-blue-600 transition-all">
            Get In Touch
          </button>
        </div>
      </div>

      <div className="md:col-span-4 flex justify-center">
        <img src={avatarUrl} alt={fullName} className="h-64 w-64 object-cover border-2 border-slate-950 grayscale hover:grayscale-0 transition-all duration-300" />
      </div>
    </section>

    {/* Experience */}
    <section ref={aboutRef} className="mx-auto max-w-6xl px-8 py-20 border-b-2 border-slate-950 text-left">
      <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-12">02 / Experience</h2>
      {experience?.length > 0 && (
        <div className="space-y-12">
          {experience.map((exp, idx) => (
            <div key={idx} className="grid md:grid-cols-12 gap-4 border-t border-slate-200 pt-6">
              <div className="md:col-span-4 text-sm font-extrabold text-slate-500">
                {exp.startDate ? new Date(exp.startDate).getFullYear() : ""} — {exp.currentlyWorking ? "Present" : exp.endDate ? new Date(exp.endDate).getFullYear() : ""}
              </div>
              <div className="md:col-span-8 space-y-2">
                <h4 className="text-2xl font-black uppercase">{exp.position}</h4>
                <p className="text-xs font-bold text-blue-600">{exp.company} • {exp.location}</p>
                {exp.description?.map((b, bIdx) => (
                  <p key={bIdx} className="text-sm text-slate-600 leading-relaxed">{b}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>

    {/* Projects */}
    {projects?.length > 0 && (
      <section ref={projectsRef} className="mx-auto max-w-6xl px-8 py-20 border-b-2 border-slate-950 text-left space-y-8">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">03 / Works</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((proj, idx) => (
            <div key={idx} className="border-2 border-slate-950 p-6 space-y-3">
              <h4 className="text-xl font-black uppercase">{proj.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Skills */}
    {skills?.length > 0 && (
      <section ref={skillsRef} className="mx-auto max-w-6xl px-8 py-16 border-b-2 border-slate-950 text-left space-y-6">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">04 / Capabilities</h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, idx) => (
            <span key={idx} className="border border-slate-950 font-extrabold text-xs px-4 py-2 uppercase">
              {skill}
            </span>
          ))}
        </div>
      </section>
    )}

    {/* Contact */}
    <section ref={contactRef} className="mx-auto max-w-4xl px-8 py-20 text-left">
      <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8">05 / Initiate</h2>
      <form onSubmit={handleContactSubmit} className="space-y-4">
        <Input label="Name" name="name" placeholder="Name" required className="border-2 border-slate-950 rounded-none" />
        <Input label="Email" name="email" type="email" placeholder="Email" required className="border-2 border-slate-950 rounded-none" />
        <Input label="Message" name="message" type="textarea" placeholder="Message..." rows={4} required className="border-2 border-slate-950 rounded-none" />
        <button type="submit" className="w-full bg-blue-600 text-white font-black text-xs uppercase tracking-widest py-4 hover:bg-slate-950 transition-all">
          Transmit Message
        </button>
      </form>
    </section>
  </div>
);

/* ==========================================================================
   THEME 6: VIBRANT SUNSET (Gradient Mesh Backdrop & Floating Cards)
   ========================================================================== */
const SunsetTheme = ({
  fullName,
  targetRole,
  bio,
  avatarUrl,
  personalInfo,
  education,
  experience,
  skills,
  projects,
  scrollToSection,
  homeRef,
  aboutRef,
  projectsRef,
  skillsRef,
  contactRef,
  handleContactSubmit,
}) => (
  <div className="bg-slate-950 text-white font-sans antialiased min-h-screen">
    {/* Gradient Hero Mesh Banner */}
    <div className="relative bg-gradient-to-r from-amber-500 via-rose-500 to-violet-600 py-24 px-6 text-center shadow-2xl">
      <div className="mx-auto max-w-4xl space-y-6">
        <img src={avatarUrl} alt={fullName} className="h-32 w-32 rounded-full mx-auto border-4 border-white/40 shadow-2xl object-cover" />
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">{fullName}</h1>
        <p className="text-xl font-bold text-white/90 capitalize">{targetRole}</p>
        <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">{bio}</p>
        <div className="pt-2 flex justify-center gap-4">
          <button onClick={() => scrollToSection(contactRef)} className="bg-white text-slate-950 font-black text-xs px-6 py-3 rounded-full shadow-lg hover:bg-slate-100 transition-all">
            Get in Touch
          </button>
        </div>
      </div>
    </div>

    {/* Experience & Study */}
    <section ref={aboutRef} className="py-20 mx-auto max-w-5xl px-6 space-y-12 text-left">
      <h2 className="text-2xl font-black text-rose-400">Career & Background</h2>
      {experience?.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {experience.map((exp, idx) => (
            <div key={idx} className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold text-rose-400 bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-800/40">
                {exp.startDate ? new Date(exp.startDate).getFullYear() : ""} - {exp.currentlyWorking ? "Present" : exp.endDate ? new Date(exp.endDate).getFullYear() : ""}
              </span>
              <h4 className="font-bold text-white text-lg">{exp.position}</h4>
              <p className="text-xs text-slate-400">{exp.company} • {exp.location}</p>
              {exp.description?.map((b, bIdx) => (
                <p key={bIdx} className="text-xs text-slate-400 leading-relaxed">• {b}</p>
              ))}
            </div>
          ))}
        </div>
      )}
    </section>

    {/* Projects */}
    {projects?.length > 0 && (
      <section ref={projectsRef} className="py-16 mx-auto max-w-5xl px-6 space-y-8 text-left">
        <h2 className="text-2xl font-black text-amber-400">Featured Builds</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-rose-500/50 transition-all">
              <h4 className="font-bold text-white text-base">{proj.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Skills */}
    {skills?.length > 0 && (
      <section ref={skillsRef} className="bg-slate-900/60 border-y border-slate-800 py-16 text-left">
        <div className="mx-auto max-w-5xl px-6 space-y-6">
          <h2 className="text-2xl font-black text-violet-400">Technical Skills</h2>
          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill, idx) => (
              <span key={idx} className="bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-rose-200 border border-rose-500/30 px-4 py-2 rounded-xl text-xs font-bold">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>
    )}

    {/* Contact */}
    <section ref={contactRef} className="py-20 mx-auto max-w-3xl px-6 text-left">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
        <h2 className="text-3xl font-black text-white">Let's Connect</h2>
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <Input label="Name" name="name" placeholder="Name" required className="bg-slate-950 border-slate-800 text-white" />
          <Input label="Email" name="email" type="email" placeholder="Email" required className="bg-slate-950 border-slate-800 text-white" />
          <Input label="Message" name="message" type="textarea" placeholder="Message..." rows={4} required className="bg-slate-950 border-slate-800 text-white" />
          <button type="submit" className="w-full bg-gradient-to-r from-amber-500 via-rose-500 to-violet-600 text-white font-bold py-3.5 rounded-xl shadow-xl hover:opacity-90 transition-all">
            Send Message
          </button>
        </form>
      </div>
    </section>
  </div>
);

export default PublicResume;

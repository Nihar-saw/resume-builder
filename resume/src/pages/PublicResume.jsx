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
} from "react-icons/io5";
import { toast } from "react-hot-toast";

const PublicResume = () => {
  const { slug } = useParams();
  const [resume, setResume] = useState(null);
  const [resumeUser, setResumeUser] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          setQrCode(data.qrCode);
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <div className="rounded-3xl bg-white p-12 shadow-2xl border border-slate-100 max-w-md w-full">
          <span className="text-4xl mb-4 block">🚫</span>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Unavailable</h2>
          <p className="text-sm text-slate-400 mb-6">{error || "This resume is private or doesn't exist."}</p>
        </div>
      </div>
    );
  }

  const { personalInfo, education, experience, skills, projects } = resume;
  const fullName = personalInfo?.fullName || "John Doe";
  const targetRole = experience?.[0]?.position || "Full Stack Developer";
  const bio = personalInfo?.summary || "Full Stack Developer passionate about building responsive, modern, and scalable web applications.";

  return (
    <div className="bg-slate-50 min-h-screen font-sans antialiased text-slate-900 scroll-smooth">
      
      {/* Portfolio Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-650 text-white font-extrabold text-sm shadow-md">
              {fullName.charAt(0)}
            </div>
            <span className="text-base font-bold tracking-tight text-slate-800">
              {fullName}
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
            <button onClick={() => scrollToSection(homeRef)} className="hover:text-indigo-600 transition-colors">Home</button>
            <button onClick={() => scrollToSection(aboutRef)} className="hover:text-indigo-600 transition-colors">About</button>
            {projects?.length > 0 && <button onClick={() => scrollToSection(projectsRef)} className="hover:text-indigo-600 transition-colors">Projects</button>}
            {skills?.length > 0 && <button onClick={() => scrollToSection(skillsRef)} className="hover:text-indigo-600 transition-colors">Skills</button>}
            <button onClick={() => scrollToSection(contactRef)} className="hover:text-indigo-600 transition-colors">Contact</button>
          </nav>

          {/* Contact CTA */}
          <Button variant="primary" size="sm" onClick={() => scrollToSection(contactRef)}>
            Hire Me
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={homeRef} className="mx-auto max-w-6xl px-6 py-20 sm:px-8 grid md:grid-cols-12 gap-12 items-center min-h-[calc(100vh-4rem)]">
        <div className="md:col-span-7 text-left space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700">
            👋 Available for Hire
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 leading-tight tracking-tight">
            Hi, I'm <span className="text-gradient block sm:inline">{fullName}</span>
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-500 capitalize">
            {targetRole}
          </h2>
          <p className="text-slate-500 leading-relaxed text-sm sm:text-base max-w-lg">
            {bio}
          </p>
          <div className="flex gap-4 pt-2">
            <Button variant="primary" onClick={() => scrollToSection(contactRef)}>
              Get in Touch
            </Button>
            {projects?.length > 0 && (
              <Button variant="outline" onClick={() => scrollToSection(projectsRef)}>
                View Projects
              </Button>
            )}
          </div>
        </div>

        {/* Profile Mascot graphic representation */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative h-72 w-72 sm:h-80 sm:w-80 rounded-full bg-indigo-600/10 flex items-center justify-center border border-indigo-150 shadow-inner animate-float">
            <div className="absolute -top-4 -left-4 h-16 w-16 bg-violet-400/10 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -right-4 h-16 w-16 bg-indigo-400/10 rounded-full blur-xl" />
            
            <img
              src={resumeUser?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${fullName}`}
              alt={fullName}
              className="h-60 w-60 rounded-full object-cover bg-white border border-indigo-100 shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* About & Education / Experience Section */}
      <section ref={aboutRef} className="bg-white border-y border-slate-100 py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 space-y-16 text-left">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold text-slate-900">About Me</h2>
            <p className="mt-4 text-slate-500 leading-relaxed">
              I specialize in analyzing requirements, structuring database schema topologies, and crafting responsive user interface dashboards.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Experience Column */}
            {experience && experience.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-650" />
                  Work Experience
                </h3>
                <div className="space-y-6 border-l border-slate-100 pl-4 ml-1">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1.5 relative">
                      <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-indigo-650 ring-4 ring-white" />
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">{exp.position}</h4>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                          {exp.startDate ? new Date(exp.startDate).getFullYear() : ""} - {exp.currentlyWorking ? "Present" : exp.endDate ? new Date(exp.endDate).getFullYear() : ""}
                        </span>
                      </div>
                      <p className="text-slate-500 font-semibold text-xs">{exp.company} • {exp.location}</p>
                      <ul className="list-disc list-inside text-xs text-slate-650 space-y-1 leading-relaxed pl-1 pt-1">
                        {exp.description?.map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Column */}
            {education && education.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-violet-650" />
                  Education
                </h3>
                <div className="space-y-6 border-l border-slate-100 pl-4 ml-1">
                  {education.map((edu, idx) => (
                    <div key={idx} className="space-y-1.5 relative">
                      <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-violet-650 ring-4 ring-white" />
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">{edu.degree}</h4>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                          {edu.startDate ? new Date(edu.startDate).getFullYear() : ""} - {edu.endDate ? new Date(edu.endDate).getFullYear() : ""}
                        </span>
                      </div>
                      <p className="text-slate-500 font-semibold text-xs">{edu.school}</p>
                      {edu.fieldOfStudy && <p className="text-xs text-slate-400 font-medium">Field: {edu.fieldOfStudy}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Projects Grid */}
      {projects && projects.length > 0 && (
        <section ref={projectsRef} className="mx-auto max-w-6xl px-6 py-20 sm:px-8 space-y-12">
          <div className="text-left">
            <h2 className="text-3xl font-extrabold text-slate-900">Featured Projects</h2>
            <p className="mt-2 text-slate-500 text-sm">A handpicked showcase of solutions I have designed and deployed.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj, idx) => (
              <Card key={idx} className="flex flex-col justify-between p-6 hover:translate-y-[-4px] border border-slate-100 hover:border-indigo-100 transition-all duration-300">
                <div className="text-left space-y-3">
                  <h4 className="font-bold text-slate-800 text-base">{proj.title}</h4>
                  <p className="text-xs text-slate-550 leading-relaxed">{proj.description}</p>
                </div>
                
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {proj.technologies.map((tech, tIdx) => (
                      <span key={tIdx} className="bg-slate-100 text-slate-500 rounded-md px-2 py-0.5 text-[10px] font-bold">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Skills Showcase Section */}
      {skills && skills.length > 0 && (
        <section ref={skillsRef} className="bg-white border-y border-slate-100 py-20 text-left">
          <div className="mx-auto max-w-6xl px-6 sm:px-8 space-y-8">
            <h2 className="text-3xl font-extrabold text-slate-900">Technical Skills</h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-indigo-50 text-indigo-650 rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold border border-indigo-100/50 hover:bg-indigo-100/30 transition-all duration-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section ref={contactRef} className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
        <div className="grid md:grid-cols-12 gap-12 items-start text-left">
          
          {/* Info Details */}
          <div className="md:col-span-5 space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Let's Connect</h2>
            <p className="text-slate-550 text-sm sm:text-base leading-relaxed">
              Interested in collaborating or hiring me for your team? Get in touch using the details below or fill out the contact form.
            </p>

            <div className="space-y-4 pt-4">
              {personalInfo?.email && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <IoMailOutline className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Email</p>
                    <a href={`mailto:${personalInfo.email}`} className="text-sm font-semibold text-slate-700 hover:text-indigo-600">
                      {personalInfo.email}
                    </a>
                  </div>
                </div>
              )}

              {personalInfo?.phone && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                    <IoCallOutline className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Phone</p>
                    <a href={`tel:${personalInfo.phone}`} className="text-sm font-semibold text-slate-700 hover:text-indigo-600">
                      {personalInfo.phone}
                    </a>
                  </div>
                </div>
              )}

              {personalInfo?.location && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <IoLocationOutline className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Location</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {personalInfo.location}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Social handles */}
            <div className="flex gap-3 pt-4">
              {personalInfo?.linkedin && (
                <a
                  href={`https://${personalInfo.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center text-slate-500 transition-all active:scale-95"
                >
                  <IoLogoLinkedin className="h-5 w-5" />
                </a>
              )}
              {personalInfo?.github && (
                <a
                  href={`https://${personalInfo.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center text-slate-500 transition-all active:scale-95"
                >
                  <IoLogoGithub className="h-5 w-5" />
                </a>
              )}
              {personalInfo?.website && (
                <a
                  href={personalInfo.website}
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center text-slate-500 transition-all active:scale-95"
                >
                  <IoGlobeOutline className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Contact form panel */}
          <Card className="md:col-span-7 w-full p-6 sm:p-8">
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Name" name="name" placeholder="Your Name" required />
                <Input label="Email" name="email" type="email" placeholder="Your Email" required />
              </div>
              <Input label="Subject" name="subject" placeholder="Subject Topic" required />
              <Input label="Message" name="message" type="textarea" placeholder="Describe details..." rows={4} required />
              <Button type="submit" variant="primary" className="w-full flex items-center gap-2 justify-center">
                Send Message
                <IoSendOutline className="h-4 w-4" />
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Portfolio Footer */}
      <footer className="border-t border-slate-150/60 bg-white py-8 text-center text-sm text-slate-400">
        <p>&copy; {new Date().getFullYear()} {fullName}. Generated by ResumeAI.</p>
      </footer>
    </div>
  );
};

export default PublicResume;

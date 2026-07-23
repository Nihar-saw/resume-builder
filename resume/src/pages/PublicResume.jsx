import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicResume } from "../api/portfolio.api";
import Loader from "../components/common/Loader";

const PublicResume = () => {
  const { slug } = useParams();
  const [resume, setResume] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await getPublicResume(slug);
        if (data.success) {
          setResume(data.resume);
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

  const { personalInfo, education, experience, skills, projects, certifications, languages } = resume;

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header decoration */}
        <div className="h-4 bg-indigo-600 w-full" />
        
        <div className="p-8 sm:p-12 space-y-10 text-left">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-8">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {personalInfo?.fullName || "John Doe"}
              </h1>
              <p className="text-indigo-600 font-semibold text-lg">
                {experience?.[0]?.position || "Full Stack Developer"}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-slate-500 font-medium pt-1">
                {personalInfo?.email && <span>{personalInfo.email}</span>}
                {personalInfo?.phone && <span>{personalInfo.phone}</span>}
                {personalInfo?.location && <span>{personalInfo.location}</span>}
              </div>
            </div>
            {qrCode && (
              <div className="border border-slate-100 rounded-2xl p-2 bg-slate-50 shadow-inner flex flex-col items-center justify-center shrink-0">
                <img src={qrCode} alt="Public Portfolio Link QR" className="h-20 w-20" />
                <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Scan Link</span>
              </div>
            )}
          </div>

          {/* Professional Summary */}
          {personalInfo?.summary && (
            <div className="space-y-3">
              <h3 className="text-base font-extrabold uppercase tracking-widest text-indigo-600">Summary</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold uppercase tracking-widest text-indigo-600">Experience</h3>
              <div className="space-y-6">
                {experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <h4 className="font-bold text-slate-950 text-base">{exp.position}</h4>
                      <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                        {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : ""} - {exp.currentlyWorking ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : ""}
                      </span>
                    </div>
                    <p className="text-slate-500 font-bold text-sm">{exp.company} {exp.location ? `• ${exp.location}` : ""}</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 pl-2">
                      {exp.description?.map((desc, dIdx) => (
                        <li key={dIdx} className="leading-relaxed">{desc}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold uppercase tracking-widest text-indigo-600">Education</h3>
              <div className="space-y-4">
                {education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h4 className="font-bold text-slate-950 text-base">{edu.degree} in {edu.fieldOfStudy}</h4>
                      <p className="text-slate-500 text-sm">{edu.school}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                      {edu.startDate ? new Date(edu.startDate).getFullYear() : ""} - {edu.endDate ? new Date(edu.endDate).getFullYear() : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-extrabold uppercase tracking-widest text-indigo-600">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span key={idx} className="bg-indigo-50/50 text-indigo-600 rounded-xl px-3 py-1.5 text-xs font-bold border border-indigo-100/50">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold uppercase tracking-widest text-indigo-600">Projects</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {projects.map((proj, idx) => (
                  <div key={idx} className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                    <h4 className="font-bold text-slate-900 text-base">{proj.title}</h4>
                    <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">{proj.description}</p>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {proj.technologies.map((tech, tIdx) => (
                          <span key={tIdx} className="bg-slate-100 text-slate-500 rounded-md px-1.5 py-0.5 text-[10px] font-bold">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicResume;

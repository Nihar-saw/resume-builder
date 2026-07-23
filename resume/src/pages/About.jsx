import Card from "../components/common/Card";

const About = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-12 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">About ResumeAI</h1>
        <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
          ResumeAI is an advanced web portal dedicated to building gorgeous, ATS-compliant professional profiles.
        </p>
      </div>

      <Card className="text-left space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Our Mission</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          Job searching is complex. ResumeAI uses advanced formatting templates, deep analysis algorithms, and simple interactive forms to maximize keyword compatibility and structure optimization, helping you clear standard applicant tracking software with ease.
        </p>
      </Card>
    </div>
  );
};

export default About;

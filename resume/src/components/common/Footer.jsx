import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-slate-100 bg-white py-12 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-extrabold text-sm shadow-md shadow-indigo-600/30">
              R
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-800">
              Resume<span className="text-indigo-600">AI</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-slate-500">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <Link to="/templates" className="hover:text-indigo-600 transition-colors">Templates</Link>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
            <a href="#privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
          </div>

          {/* Copy */}
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} ResumeAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

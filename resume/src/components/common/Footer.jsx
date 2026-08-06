import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0a0a0a] py-12 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0ae448] text-black font-black text-sm shadow-md shadow-[#0ae448]/20">
              A
            </div>
            <span
              className="text-lg font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Astra<span className="text-[#0ae448]">CV</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-slate-500">
            <a
              href="#features"
              className="hover:text-[#0ae448] transition-colors duration-300"
            >
              Features
            </a>
            <Link
              to="/templates"
              className="hover:text-[#0ae448] transition-colors duration-300"
            >
              Templates
            </Link>
            <a
              href="#pricing"
              className="hover:text-[#0ae448] transition-colors duration-300"
            >
              Pricing
            </a>
            <a
              href="#privacy"
              className="hover:text-[#0ae448] transition-colors duration-300"
            >
              Privacy Policy
            </a>
          </div>

          {/* Copy */}
          <p className="text-sm text-slate-600">
            &copy; {new Date().getFullYear()} AstraCV. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

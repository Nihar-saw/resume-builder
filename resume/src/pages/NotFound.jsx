import { Link } from "react-router-dom";
import Button from "../components/common/Button";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <div className="rounded-3xl bg-white p-12 shadow-2xl border border-slate-100 max-w-md w-full relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-16 -left-16 h-36 w-36 bg-indigo-500/5 rounded-full blur-2xl" />
        
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-6 animate-float">
          <span className="text-4xl">🔍</span>
        </div>
        
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">404</h2>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Page Not Found</h3>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link to="/dashboard">
          <Button variant="primary" className="w-full">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

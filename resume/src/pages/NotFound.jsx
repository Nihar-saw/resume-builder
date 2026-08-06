import { Link } from "react-router-dom";
import Button from "../components/common/Button";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0e0e10] grid-pattern-neo px-6 text-center">
      <div className="rounded-3xl border-4 border-black bg-[#16161a] p-12 shadow-[10px_10px_0px_0px_#0ae448] max-w-md w-full relative overflow-hidden">
        {/* Corner accent */}
        <div className="absolute top-0 right-0 h-24 w-24 bg-[#0ae448]/15 rounded-bl-3xl pointer-events-none" />

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#0ae448] text-black border-3 border-black shadow-[5px_5px_0px_0px_#000] mb-6 animate-float">
          <span className="text-4xl">🔍</span>
        </div>

        <span className="neo-badge neo-badge-pink mb-4">ERROR 404</span>

        <h2
          className="text-5xl font-black text-white tracking-tight mb-2 uppercase"
          style={{ fontFamily: "var(--font-display)" }}
        >
          404
        </h2>
        <h3 className="text-lg font-black text-white mb-2 uppercase">Page Not Found</h3>
        <p className="text-xs font-semibold text-slate-400 mb-8 leading-relaxed">
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

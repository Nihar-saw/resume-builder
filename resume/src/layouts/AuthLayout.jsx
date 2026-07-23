import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center relative z-10 bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-2xl">
        
        {/* Left Side: Dynamic Forms */}
        <div className="w-full flex flex-col justify-center px-2 sm:px-6">
          <Outlet />
        </div>

        {/* Right Side: Showcase Panel */}
        <div className="hidden md:flex flex-col items-center justify-center text-center p-8 rounded-2xl premium-gradient text-white h-full relative overflow-hidden min-h-[500px]">
          {/* Glass panels background pattern */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
          
          <div className="relative z-10 max-w-sm flex flex-col items-center">
            {/* Robot mascot representation */}
            <div className="h-44 w-44 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner mb-8 animate-float">
              <div className="h-32 w-32 rounded-full bg-white/25 flex items-center justify-center shadow-md">
                <span className="text-6xl">🤖</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-3 tracking-tight">AI Resume Builder</h2>
            <p className="text-sm text-indigo-100/90 leading-relaxed">
              Smart. Fast. Professional. Enhance your resume with tailor-made suggestions that align with major ATS guidelines.
            </p>
            
            {/* Dots UI */}
            <div className="flex gap-1.5 mt-8">
              <span className="h-2 w-6 rounded-full bg-white" />
              <span className="h-2 w-2 rounded-full bg-white/40" />
              <span className="h-2 w-2 rounded-full bg-white/40" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;

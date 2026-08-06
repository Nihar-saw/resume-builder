import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import gsap from "gsap";

const AuthLayout = () => {
  const cardRef = useRef(null);
  const rightPanelRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.fromTo(
      card,
      { opacity: 0, y: 30, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    const panel = rightPanelRef.current;
    if (!panel) return;

    const rings = panel.querySelectorAll(".auth-ring");
    rings.forEach((ring, i) => {
      gsap.to(ring, {
        rotation: 360,
        duration: 20 + i * 10,
        ease: "none",
        repeat: -1,
      });
    });

    const dots = panel.querySelectorAll(".auth-dot");
    gsap.fromTo(
      dots,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(2)",
        delay: 0.6,
      }
    );
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0e0e10] px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden grid-pattern-neo">
      {/* Background orbs */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#0ae448]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#facc15]/10 blur-[120px] pointer-events-none" />

      <div
        ref={cardRef}
        className="w-full max-w-5xl grid md:grid-cols-2 gap-0 items-stretch relative z-10 bg-[#16161a] border-3 border-black rounded-3xl overflow-hidden shadow-[10px_10px_0px_0px_#000]"
      >
        {/* Left Side: Dynamic Forms */}
        <div className="w-full flex flex-col justify-center px-6 sm:px-10 py-10">
          <Outlet />
        </div>

        {/* Right Side: Showcase Panel */}
        <div
          ref={rightPanelRef}
          className="hidden md:flex flex-col items-center justify-center text-center p-8 bg-[#1f1f26] border-l-3 border-black text-white relative overflow-hidden min-h-[520px]"
        >
          {/* Decorative rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="auth-ring absolute h-80 w-80 rounded-full border-2 border-black/80 stroke-dashed" />
            <div className="auth-ring absolute h-64 w-64 rounded-full border-2 border-[#0ae448]/40" />
            <div className="auth-ring absolute h-44 w-44 rounded-full border-2 border-[#facc15]/40" />
          </div>

          <div className="relative z-10 max-w-sm flex flex-col items-center">
            {/* Mascot Container */}
            <div className="h-36 w-36 rounded-2xl bg-[#0ae448] border-3 border-black shadow-[5px_5px_0px_0px_#000] flex items-center justify-center mb-8 animate-float">
              <div className="h-24 w-24 rounded-xl bg-black flex items-center justify-center border-2 border-black">
                <span className="text-5xl">⚡</span>
              </div>
            </div>

            <span className="neo-badge neo-badge-yellow mb-3">
              AI Resume Builder
            </span>

            <h2
              className="text-3xl font-black mb-3 tracking-tight text-white uppercase"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Stand Out & Win
            </h2>
            <p className="text-xs font-bold text-slate-300 leading-relaxed max-w-xs uppercase tracking-wide">
              Smart. Fast. Neo-Brutalist. Generate ATS-optimized resumes and high-converting job applications.
            </p>

            {/* Dots */}
            <div className="flex gap-2.5 mt-8">
              <span className="auth-dot h-3 w-8 rounded-full bg-[#0ae448] border-2 border-black shadow-[2px_2px_0px_0px_#000]" />
              <span className="auth-dot h-3 w-3 rounded-full bg-[#facc15] border-2 border-black shadow-[2px_2px_0px_0px_#000]" />
              <span className="auth-dot h-3 w-3 rounded-full bg-[#ff007a] border-2 border-black shadow-[2px_2px_0px_0px_#000]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

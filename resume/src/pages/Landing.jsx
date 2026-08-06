import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  IoHardwareChipOutline,
  IoShieldCheckmarkOutline,
  IoColorPaletteOutline,
  IoDownloadOutline,
  IoSparklesOutline,
  IoChevronForward,
  IoStarOutline,
  IoFlashOutline,
} from "react-icons/io5";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "../components/common/Button";
import {
  useHeroAnimation,
  useStaggerReveal,
  useScrollReveal,
} from "../hooks/useGsapAnimations";

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const heroRefs = useHeroAnimation();
  const featuresRef = useStaggerReveal({ stagger: 0.15, y: 50 });
  const ctaSectionRef = useScrollReveal({ y: 60, duration: 1.2 });

  // Floating orbs animation
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);

  useEffect(() => {
    const orbs = [orb1Ref.current, orb2Ref.current, orb3Ref.current].filter(
      Boolean
    );
    const timelines = orbs.map((orb, i) => {
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.to(orb, {
        x: `random(-40, 40)`,
        y: `random(-40, 40)`,
        duration: 6 + i * 2,
        ease: "sine.inOut",
      });
      return tl;
    });
    return () => timelines.forEach((tl) => tl.kill());
  }, []);

  // Stats counter
  const statsRef = useRef(null);
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    const counters = el.querySelectorAll("[data-count]");
    counters.forEach((counter) => {
      const end = parseInt(counter.dataset.count, 10);
      const suffix = counter.dataset.suffix || "";
      const obj = { val: 0 };

      gsap.to(obj, {
        val: end,
        duration: 2.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: counter,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          counter.textContent = Math.round(obj.val).toLocaleString() + suffix;
        },
      });
    });
  }, []);

  const features = [
    {
      title: "AI-Powered Bullet Points",
      description:
        "Receive instant smart updates and tailored bullet points directly based on target descriptions.",
      icon: IoHardwareChipOutline,
      badge: "AI CORE",
      badgeColor: "neo-badge-green",
    },
    {
      title: "ATS Score Checker",
      description:
        "Check your resume structure and scan for critical keywords matching your job profile.",
      icon: IoShieldCheckmarkOutline,
      badge: "VERIFIED",
      badgeColor: "neo-badge-yellow",
    },
    {
      title: "Multiple Pro Templates",
      description:
        "Switch seamlessly between modern, clean, classic, and creative styles in real-time.",
      icon: IoColorPaletteOutline,
      badge: "DESIGN",
      badgeColor: "neo-badge-pink",
    },
    {
      title: "PDF & DOCX Export",
      description:
        "Export high-resolution documents ready for submission in multiple file formats.",
      icon: IoDownloadOutline,
      badge: "EXPORTS",
      badgeColor: "neo-badge-cyan",
    },
  ];

  const stats = [
    { value: 10000, suffix: "+", label: "Resumes Built" },
    { value: 95, suffix: "%", label: "ATS Pass Rate" },
    { value: 50, suffix: "+", label: "Templates" },
    { value: 4.9, suffix: "★", label: "User Rating", isDecimal: true },
  ];

  return (
    <div className="bg-[#0e0e10] min-h-screen overflow-hidden text-white grid-pattern-neo">
      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 pt-24 pb-20 overflow-hidden">
        {/* Animated Orbs */}
        <div
          ref={orb1Ref}
          className="orb orb-green w-[450px] h-[450px] -top-30 -left-20"
        />
        <div
          ref={orb2Ref}
          className="orb orb-blue w-[380px] h-[380px] top-1/3 -right-20"
        />
        <div
          ref={orb3Ref}
          className="orb orb-purple w-[320px] h-[320px] bottom-0 left-1/3"
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Badge */}
          <div
            ref={heroRefs.badge}
            className="neo-badge neo-badge-green mb-8"
          >
            <IoSparklesOutline className="h-4 w-4" />
            Empowered by Advanced AI
            <IoFlashOutline className="h-4 w-4" />
          </div>

          {/* Heading */}
          <h1
            ref={heroRefs.heading}
            className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.95] max-w-4xl uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Build Resumes
            <br />
            <span className="bg-[#0ae448] text-black px-4 py-1 inline-block border-3 border-black shadow-[6px_6px_0px_0px_#000] rotate-[-1deg] my-2">
              That Land Jobs
            </span>
          </h1>

          {/* Subtitle */}
          <p
            ref={heroRefs.subtitle}
            className="mt-8 max-w-xl text-base sm:text-lg text-slate-300 font-medium leading-relaxed"
          >
            Create ATS-friendly resumes, get real-time AI suggestions, scan
            against job specs, and land your dream role.
          </p>

          {/* CTA */}
          <div
            ref={heroRefs.cta}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/register">
              <Button variant="primary" size="lg">
                Get Started Free
                <IoChevronForward className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/templates">
              <Button variant="secondary" size="lg">
                View Templates
              </Button>
            </Link>
          </div>

          {/* Mockup */}
          <div
            ref={heroRefs.mockup}
            className="mt-20 w-full max-w-4xl rounded-3xl border-3 border-black bg-[#16161a] p-4 shadow-[10px_10px_0px_0px_#000] relative"
          >
            <div className="rounded-2xl border-2 border-black overflow-hidden bg-[#0e0e10] aspect-video flex items-center justify-center p-6">
              <div className="w-full max-w-xl bg-[#1f1f26] border-3 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_#000] flex flex-col sm:flex-row gap-6 text-left">
                {/* Simulated resume structure */}
                <div className="flex-1 space-y-4">
                  <div className="h-7 w-40 bg-[#0ae448] border-2 border-black rounded-md shadow-[2px_2px_0px_0px_#000]" />
                  <div className="h-3 w-52 bg-white/20 rounded-md" />
                  <div className="space-y-2 mt-6">
                    <div className="h-3 w-full bg-white/10 rounded-md" />
                    <div className="h-3 w-5/6 bg-white/10 rounded-md" />
                    <div className="h-3 w-4/5 bg-white/10 rounded-md" />
                  </div>
                </div>
                <div className="w-full sm:w-32 flex flex-col items-center justify-center gap-2 border-t sm:border-t-0 sm:border-l-3 border-black pt-4 sm:pt-0 sm:pl-6">
                  <div className="h-20 w-20 rounded-2xl bg-[#facc15] border-3 border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center">
                    <span className="text-2xl font-black text-black">98%</span>
                  </div>
                  <span className="neo-badge neo-badge-green text-[10px] mt-1">
                    ATS PASS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section
        ref={statsRef}
        className="relative border-y-3 border-black bg-[#16161a] py-16 shadow-[0_6px_0px_0px_#000]"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border-2.5 border-black bg-[#1f1f26] shadow-[4px_4px_0px_0px_#000]"
              >
                <p
                  data-count={stat.isDecimal ? undefined : stat.value}
                  data-suffix={stat.suffix}
                  className="text-4xl sm:text-5xl font-black text-[#0ae448]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {stat.isDecimal
                    ? stat.value + stat.suffix
                    : "0" + stat.suffix}
                </p>
                <p className="text-xs font-black uppercase tracking-wider text-slate-300 mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="neo-badge neo-badge-pink mb-4">POWERFUL FEATURES</span>
          <h2
            className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase mt-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Everything To <span className="bg-[#facc15] text-black px-3 py-0.5 border-2 border-black inline-block shadow-[3px_3px_0px_0px_#000]">Win</span>
          </h2>
          <p className="mt-4 text-slate-300 text-base font-semibold">
            Engineered to guide you at every stage of your job application journey.
          </p>
        </div>

        <div
          ref={featuresRef}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="rounded-2xl border-3 border-black bg-[#16161a] p-6 shadow-[6px_6px_0px_0px_#000] flex flex-col justify-between hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[9px_9px_0px_0px_#000] transition-all duration-150"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#0ae448] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`neo-badge ${feature.badgeColor} text-[10px]`}>
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white mb-2 uppercase">
                    {feature.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section
        id="ai-tools"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <div
          ref={ctaSectionRef}
          className="relative rounded-3xl border-4 border-black bg-[#16161a] p-8 sm:p-16 max-w-5xl mx-auto shadow-[10px_10px_0px_0px_#0ae448] text-center overflow-hidden"
        >
          <div className="relative z-10 flex flex-col items-center">
            <span className="neo-badge neo-badge-yellow mb-6">
              <IoStarOutline className="h-4 w-4" />
              READY TO STAND OUT?
            </span>

            <h2
              className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-2xl leading-tight uppercase"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Build Resumes That{" "}
              <span className="bg-[#ff007a] text-white px-3 py-0.5 border-2 border-black shadow-[4px_4px_0px_0px_#000] inline-block my-1 rotate-1">
                BEAT THE BOTS
              </span>
            </h2>
            <p className="mt-6 max-w-lg text-base text-slate-300 font-semibold">
              Sign up now and build templates fully compatible with major ATS software.
            </p>
            <div className="mt-8">
              <Link to="/register">
                <Button variant="primary" size="lg">
                  Create My Resume
                  <IoChevronForward className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

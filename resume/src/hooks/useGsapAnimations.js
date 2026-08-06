import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Fade-up reveal on scroll for a single element.
 * Usage: const ref = useScrollReveal();  <div ref={ref}>...</div>
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { y = 50, duration = 1, delay = 0, start = "top 85%" } = options;

    gsap.set(el, { opacity: 0, y });

    const anim = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: "play none none none",
      },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, []);

  return ref;
}

/**
 * Staggered reveal of children on scroll.
 * Usage: const ref = useStaggerReveal();  <div ref={ref}><child/><child/>...</div>
 */
export function useStaggerReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const {
      y = 40,
      duration = 0.8,
      stagger = 0.12,
      start = "top 85%",
      childSelector = ":scope > *",
    } = options;

    const children = container.querySelectorAll(childSelector);
    if (!children.length) return;

    gsap.set(children, { opacity: 0, y });

    const anim = gsap.to(children, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container,
        start,
        toggleActions: "play none none none",
      },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, []);

  return ref;
}

/**
 * Orchestrated hero animation timeline.
 * Pass an object of refs keyed by name.
 * Usage: const refs = useHeroAnimation(); refs.heading, refs.subtitle, etc.
 */
export function useHeroAnimation() {
  const refs = {
    badge: useRef(null),
    heading: useRef(null),
    subtitle: useRef(null),
    cta: useRef(null),
    mockup: useRef(null),
  };

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power4.out", duration: 1 },
    });

    // Set initial states
    const elements = [
      refs.badge.current,
      refs.heading.current,
      refs.subtitle.current,
      refs.cta.current,
      refs.mockup.current,
    ].filter(Boolean);

    gsap.set(elements, { opacity: 0, y: 40 });

    if (refs.badge.current) {
      tl.to(refs.badge.current, { opacity: 1, y: 0, duration: 0.6 }, 0.2);
    }
    if (refs.heading.current) {
      tl.to(refs.heading.current, { opacity: 1, y: 0, duration: 0.9 }, 0.4);
    }
    if (refs.subtitle.current) {
      tl.to(refs.subtitle.current, { opacity: 1, y: 0, duration: 0.8 }, 0.7);
    }
    if (refs.cta.current) {
      tl.to(refs.cta.current, { opacity: 1, y: 0, duration: 0.7 }, 0.9);
    }
    if (refs.mockup.current) {
      tl.to(
        refs.mockup.current,
        { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" },
        1.0
      );
    }

    return () => tl.kill();
  }, []);

  return refs;
}

/**
 * Page fade-in on mount.
 * Usage: const ref = usePageTransition();  <div ref={ref}>...</div>
 */
export function usePageTransition(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { duration = 0.6, y = 20 } = options;

    gsap.fromTo(
      el,
      { opacity: 0, y },
      { opacity: 1, y: 0, duration, ease: "power2.out" }
    );
  }, []);

  return ref;
}

/**
 * Counter animation for stats numbers.
 * Usage: const ref = useCountUp(1234);
 */
export function useCountUp(endValue, options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || endValue === undefined || endValue === null) return;

    const { duration = 2, suffix = "", start = "top 85%" } = options;
    const numericEnd = parseFloat(endValue) || 0;
    const counter = { val: 0 };

    const anim = gsap.to(counter, {
      val: numericEnd,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: "play none none none",
      },
      onUpdate: () => {
        el.textContent = Math.round(counter.val) + suffix;
      },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [endValue]);

  return ref;
}

/**
 * Floating orb animation — slight random movement.
 */
export function useFloatingOrb(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { range = 30, duration = 6 } = options;

    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    tl.to(el, {
      x: `random(-${range}, ${range})`,
      y: `random(-${range}, ${range})`,
      duration,
      ease: "sine.inOut",
    });

    return () => tl.kill();
  }, []);

  return ref;
}

/**
 * Magnetic hover effect — element subtly follows cursor.
 */
export function useMagneticHover(strength = 0.3) {
  const ref = useRef(null);

  const handleMouseMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: "power2.out",
      });
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return ref;
}

/**
 * Staggered form field entrance.
 */
export function useFormEntrance() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = el.querySelectorAll(
      "input, label, button, .form-field, h2, p, a, .divider-row, .social-row"
    );
    if (!children.length) return;

    gsap.fromTo(
      children,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.2,
      }
    );
  }, []);

  return ref;
}

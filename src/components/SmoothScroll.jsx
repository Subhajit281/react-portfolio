import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Same breakpoint used by FloatingSkillsHelix, kept in sync intentionally.
const MOBILE_BREAKPOINT = "(max-width: 640px)";

/**
 * Wrap your app with this component.
 *
 * It drives Lenis off GSAP's own ticker so Lenis's scroll values and
 * ScrollTrigger's pin/scrub calculations always agree.
 *
 * On mobile (< 640px), Lenis is skipped so touch devices use smooth native momentum.
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    const isMobile = window.matchMedia(MOBILE_BREAKPOINT).matches;

    if (isMobile) {
      window.__lenis = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    window.__lenis = lenis;

    // Keep ScrollTrigger in sync with Lenis's scroll position
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis's rAF loop from GSAP's ticker
    const update = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return children;
}
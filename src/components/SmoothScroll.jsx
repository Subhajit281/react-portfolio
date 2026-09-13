import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// On mobile & touch devices (< 1024px or coarse pointer), Lenis is skipped
// so touch screens preserve 100% native 60/120fps hardware-accelerated momentum.
const MOBILE_OR_TOUCH = "(max-width: 1024px), (pointer: coarse)";

/**
 * Wrap your app with this component.
 *
 * It drives Lenis off GSAP's own ticker so Lenis's scroll values and
 * ScrollTrigger's pin/scrub calculations always agree.
 *
 * On mobile/touch, Lenis is skipped so touch devices use smooth native momentum.
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    const isMobileOrTouch = window.matchMedia(MOBILE_OR_TOUCH).matches;

    if (isMobileOrTouch) {
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
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Same breakpoint used by FloatingSkillsHelix, kept in sync intentionally.
const MOBILE_BREAKPOINT = "(max-width: 640px)";

/**
 * Wrap your app (or at least the parts that contain pinned
 * ScrollTrigger sections, like <Projects />) with this component.
 *
 *   <SmoothScroll>
 *     <App />
 *   </SmoothScroll>
 *
 * It drives Lenis off GSAP's own ticker so Lenis's scroll values and
 * ScrollTrigger's pin/scrub calculations always agree — without this
 * sync, pinned sections can jitter or drift out of place.
 *
 * On mobile, Lenis is skipped entirely: touch devices already have
 * smooth native momentum scrolling, and running Lenis's JS-driven
 * smoothing on top of it just adds overhead and fights the browser's
 * own scroll handling, which is what was causing the mobile jank.
 * ScrollTrigger still works fine off native scroll in that case.
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    const isMobile = window.matchMedia(MOBILE_BREAKPOINT).matches;

    if (isMobile) {
      // No Lenis on mobile — native touch scroll handles it better on its own.
      // ScrollTrigger still listens to native scroll events by default.
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    // Keep ScrollTrigger in sync with Lenis's scroll position
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis's rAF loop from GSAP's ticker instead of its own
    // requestAnimationFrame, so both stay perfectly in step
    const update = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return children;
}
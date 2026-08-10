import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
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
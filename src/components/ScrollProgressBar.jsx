import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgressBar
 * A modern, glowing top reading & scroll progress indicator.
 */
export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 origin-left z-[100] shadow-[0_0_10px_rgba(56,189,248,0.7)] pointer-events-none"
    />
  );
}


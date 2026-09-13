import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import preloaderAnimation from "../assets/sand.json";

export default function Preloader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress counter from 0 to 100
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Accelerate near the end
        const increment = prev < 50 ? Math.floor(Math.random() * 8) + 4 : Math.floor(Math.random() * 12) + 6;
        return Math.min(100, prev + increment);
      });
    }, 90);

    return () => clearInterval(interval);
  }, []);

  const getStatusText = (val) => {
    if (val < 25) return "INITIALIZING SYSTEM CORE...";
    if (val < 55) return "MOUNTING REACT 19 RUNTIME...";
    if (val < 85) return "OPTIMIZING 3D TRANSFORM PIPELINE...";
    return "INITIALIZATION COMPLETE • WELCOME";
  };

  return (
    <motion.div
      className="fixed inset-0 z-[120] pointer-events-auto flex flex-col justify-center items-center overflow-hidden bg-[#030712]"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.04,
        filter: "blur(8px)",
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
      }}
    >
      {/* Subtle radial glow backdrop */}
      <div className="absolute w-[350px] h-[350px] rounded-full bg-cyan-500/10 filter blur-[90px] pointer-events-none" />

      {/* Center animation */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-36 h-36 sm:w-44 sm:h-44 relative"
        >
          <Lottie
            animationData={preloaderAnimation}
            loop={true}
            className="w-full h-full"
          />
        </motion.div>

        {/* Brand title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center mt-2"
        >
          <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-white font-mono flex items-center justify-center gap-2">
            <span className="text-cyan-400 font-bold">&lt;</span>
            <span>SUBHAJIT SARKAR</span>
            <span className="text-cyan-400 font-bold">/&gt;</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono tracking-widest mt-1 uppercase">
            Full Stack Engineer • Portfolio
          </p>
        </motion.div>

        {/* Progress bar container */}
        <div className="w-full mt-6 flex flex-col gap-2">
          <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-white/5 relative">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-sky-300 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.7)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.1 }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 px-0.5">
            <span className="text-cyan-400/90 tracking-wide font-medium">
              {getStatusText(progress)}
            </span>
            <span className="text-white font-bold tabular-nums">
              {progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Bottom copyright / build info tag */}
      <div className="absolute bottom-8 text-[11px] font-mono text-slate-500 tracking-wider">
        SYS.READY // NIT SILCHAR
      </div>
    </motion.div>
  );
}

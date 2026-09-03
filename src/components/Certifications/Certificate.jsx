import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";

// Deterministic per-card resting tilt/offset so the shelf looks organic
// but never shifts on re-render (no Math.random() in render).
const REST_ROTATIONS = [-4, 3, -2, 5, -5, 2, -3, 4];

const Certificate = ({ cert, index, onOpen, reduceMotion }) => {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const restRotate = reduceMotion ? 0 : REST_ROTATIONS[index % REST_ROTATIONS.length];
  const restY = reduceMotion ? 0 : ((index * 37) % 13) - 6;

  const handleMove = useCallback(
    (e) => {
      if (reduceMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      setTilt({ rotateX: dy * -10, rotateY: dx * 10 });
    },
    [reduceMotion]
  );

  const handleLeave = () => setTilt({ rotateX: 0, rotateY: 0 });

  const handleOpen = () => {
    // Warm the browser cache for the full-res image only once the user
    // actually shows intent to view it — never loaded eagerly on the shelf.
    if (typeof window !== "undefined" && cert.image) {
      const preload = new window.Image();
      preload.src = cert.image;
    }
    onOpen(cert);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpen();
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      aria-label={`View certificate: ${cert.title} from ${cert.issuer}`}
      style={{ rotate: restRotate, y: restY }}
      whileHover={
        reduceMotion ? {} : { y: restY - 16, scale: 1.06, rotate: 0, zIndex: 30 }
      }
      whileFocus={
        reduceMotion ? {} : { y: restY - 16, scale: 1.06, rotate: 0, zIndex: 30 }
      }
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group relative shrink-0 w-40 sm:w-44 md:w-48 snap-center md:snap-align-none rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
    >
      <motion.div
        animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
        transition={{ type: "spring", stiffness: 150, damping: 12 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative rounded-lg overflow-hidden border border-cyan-400/20 bg-gray-900/60 shadow-lg shadow-black/40 transition-colors duration-300 group-hover:border-cyan-400/60 group-hover:shadow-xl group-hover:shadow-cyan-400/30"
      >
        <div className="aspect-[4/5] w-full overflow-hidden bg-gray-950/40">
          <img
            src={cert.thumbnail}
            alt={`${cert.title} certificate from ${cert.issuer}`}
            loading="lazy"
            className="h-full w-full object-cover"
            draggable="false"
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-950/95 via-gray-950/60 to-transparent p-3 text-left">
          <p className="truncate text-sm font-semibold text-white">{cert.title}</p>
          <p className="truncate text-xs text-cyan-300">{cert.issuer}</p>
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-gray-950/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="rounded-full border border-cyan-400/50 bg-gray-900/70 px-3 py-1 text-xs font-medium tracking-wide text-cyan-300">
            Click to view
          </span>
        </div>
      </motion.div>
    </motion.button>
  );
};

export default Certificate;
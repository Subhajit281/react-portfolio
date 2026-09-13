import React, { useEffect, useRef, useState } from "react";

/**
 * DynamicBackground
 *
 * An engineering-grade ambient canvas:
 * 1. Deep space obsidian base (#030712)
 * 2. Subtle matrix dot-grid with radial vignette mask
 * 3. Floating, breathing aurora glowing orbs (Cyan & Indigo)
 * 4. Passive, GPU-accelerated cursor spotlight for desktop fine-pointers
 * 5. Instant zero-JS lightweight mode for mobile devices (60/120fps smooth)
 */
export default function DynamicBackground() {
  const containerRef = useRef(null);
  const [hasFinePointer, setHasFinePointer] = useState(false);

  useEffect(() => {
    // Only track pointer on devices that support hover / fine mouse
    const finePointerMq = window.matchMedia("(pointer: fine)");
    setHasFinePointer(finePointerMq.matches);

    const handlePointerChange = (e) => setHasFinePointer(e.matches);
    finePointerMq.addEventListener("change", handlePointerChange);

    return () => finePointerMq.removeEventListener("change", handlePointerChange);
  }, []);

  useEffect(() => {
    if (!hasFinePointer || !containerRef.current) return;

    let rafId = null;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      // Smooth interpolation (lerp) for buttery cursor follow
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      if (containerRef.current) {
        containerRef.current.style.setProperty("--mouse-x", `${currentX.toFixed(1)}px`);
        containerRef.current.style.setProperty("--mouse-y", `${currentY.toFixed(1)}px`);
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [hasFinePointer]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030712]"
      aria-hidden="true"
      style={{
        "--mouse-x": "50vw",
        "--mouse-y": "50vh",
      }}
    >
      {/* 1. Subtle Matrix Dot Grid with Radial Vignette Mask */}
      <div
        className="absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage: `radial-gradient(rgba(148, 163, 184, 0.45) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 75% 75% at 50% 45%, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 75% at 50% 45%, black 20%, transparent 80%)",
        }}
      />

      {/* 2. Ambient Floating Aurora Orbs */}
      {/* Cyan orb top left */}
      <div
        className="absolute -top-[15vw] -left-[10vw] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full filter blur-[100px] opacity-25"
        style={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.7) 0%, rgba(14, 165, 233, 0.2) 55%, transparent 75%)",
          animation: "floaty 9s ease-in-out infinite alternate",
        }}
      />

      {/* Violet/Indigo orb bottom right */}
      <div
        className="absolute -bottom-[12vw] -right-[8vw] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full filter blur-[115px] opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.65) 0%, rgba(99, 102, 241, 0.2) 55%, transparent 75%)",
          animation: "floaty 12s ease-in-out infinite alternate-reverse",
        }}
      />

      {/* Subtle deep sapphire orb mid-screen */}
      <div
        className="absolute top-[40vh] left-[60vw] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full filter blur-[120px] opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(37, 99, 235, 0.55) 0%, transparent 70%)",
          animation: "pulse-glow 7s ease-in-out infinite",
        }}
      />

      {/* 3. Interactive Mouse Spotlight (Fine Pointer Only) */}
      {hasFinePointer && (
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(56, 189, 248, 0.075), transparent 70%)`,
          }}
        />
      )}

      {/* 4. Fine Horizon Linear Vignette at top and bottom */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#030712] to-transparent opacity-80" />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#030712] to-transparent opacity-90" />
    </div>
  );
}


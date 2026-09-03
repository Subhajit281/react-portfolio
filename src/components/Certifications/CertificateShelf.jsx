import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Certificate from "./Certificate";

// Desktop/tablet (md+): fixed-width carousel, N per slide, arrows + dots.
// Mobile: 1 per slide, swipe.
// Container size never grows with more certifications — it paginates instead.
const PER_PAGE_DESKTOP = 4;
const PER_PAGE_MOBILE = 1;
const AUTOPLAY_MS = 5000;

const CertificateShelf = ({ certifications, onOpen, reduceMotion }) => {
  const [perPage, setPerPage] = useState(PER_PAGE_DESKTOP);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setPerPage(mq.matches ? PER_PAGE_MOBILE : PER_PAGE_DESKTOP);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const pageCount = Math.max(1, Math.ceil(certifications.length / perPage));

  useEffect(() => {
    if (page > pageCount - 1) setPage(0);
  }, [pageCount, page]);

  const goTo = useCallback(
    (next) => {
      setDirection(next > page ? 1 : -1);
      setPage(((next % pageCount) + pageCount) % pageCount);
    },
    [page, pageCount]
  );

  const next = useCallback(() => goTo(page + 1), [goTo, page]);
  const prev = useCallback(() => goTo(page - 1), [goTo, page]);

  // autoplay
  useEffect(() => {
    if (reduceMotion || pageCount <= 1) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [next, reduceMotion, pageCount]);

  const start = page * perPage;
  const visible = certifications.slice(start, start + perPage);

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -50) next();
    else if (info.offset.x > 50) prev();
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border-b-2 border-cyan-400 bg-gray-900/40 px-4 py-10 shadow-xl shadow-cyan-400/20 backdrop-blur-sm sm:px-8 md:py-14">
      {/* subtle ambient glow — the only decorative flourish */}
      <div className="pointer-events-none absolute -top-10 left-1/2 h-40 w-2/3 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative flex items-center justify-center gap-2 md:gap-4">
        {pageCount > 1 && (
          <button
            type="button"
            aria-label="Previous certifications"
            onClick={prev}
            className="z-10 shrink-0 rounded-full border border-cyan-400/40 bg-gray-900/60 p-2 text-cyan-300 transition hover:border-cyan-400 hover:bg-cyan-400/10"
          >
            ‹
          </button>
        )}

        <div className="relative w-full max-w-4xl overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial={reduceMotion ? false : "enter"}
              animate="center"
              exit={reduceMotion ? undefined : "exit"}
              transition={{ duration: 0.35, ease: "easeOut" }}
              drag={perPage === PER_PAGE_MOBILE ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="flex items-end justify-center gap-6 md:gap-8"
            >
              {visible.map((cert, i) => (
                <Certificate
                  key={`${cert.title}-${start + i}`}
                  cert={cert}
                  index={i}
                  onOpen={onOpen}
                  reduceMotion={reduceMotion}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {pageCount > 1 && (
          <button
            type="button"
            aria-label="Next certifications"
            onClick={next}
            className="z-10 shrink-0 rounded-full border border-cyan-400/40 bg-gray-900/60 p-2 text-cyan-300 transition hover:border-cyan-400 hover:bg-cyan-400/10"
          >
            ›
          </button>
        )}
      </div>

      {pageCount > 1 && (
        <div className="relative mt-6 flex justify-center gap-2">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to page ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === page ? "w-6 bg-cyan-400" : "w-1.5 bg-cyan-400/30"
              }`}
            />
          ))}
        </div>
      )}

      {/* shelf ledge line */}
      <div className="pointer-events-none absolute bottom-6 left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent md:bottom-8" />
    </div>
  );
};

export default CertificateShelf;
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiX, FiExternalLink } from "react-icons/fi";

const CertificateModal = ({ cert, onClose, reduceMotion }) => {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/80 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="certificate-modal-title"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 24 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-cyan-400/30 bg-gray-900/95 p-6 shadow-2xl shadow-cyan-400/20"
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close certificate preview"
          className="absolute right-4 top-4 rounded-full border border-gray-700 bg-gray-900/60 p-2 text-gray-300 transition-colors hover:border-cyan-400/50 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <FiX className="text-lg" />
        </button>

        <img
          src={cert.image}
          alt={`${cert.title} certificate from ${cert.issuer}`}
          className="max-h-[60vh] w-full rounded-lg bg-gray-950/40 object-contain"
        />

        <div className="mt-5 text-left">
          <h3 id="certificate-modal-title" className="text-2xl font-bold text-white">
            {cert.title}
          </h3>
          <p className="mt-1 text-cyan-300">
            {cert.issuer} · {cert.date}
          </p>

          {cert.skills?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {cert.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-cyan-900/50 px-3 py-1 text-xs font-medium text-cyan-400"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {cert.credentialUrl && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/50 px-4 py-2 text-sm font-medium text-cyan-300 transition-colors hover:border-cyan-400 hover:text-white"
            >
              View credential <FiExternalLink />
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CertificateModal;

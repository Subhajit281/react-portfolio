import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import certifications from "../../data/certifications";
import CertificateShelf from "./CertificateShelf";
import CertificateModal from "./CertificateModal";

const Certifications = () => {
  const [activeCert, setActiveCert] = useState(null);
  const reduceMotion = useReducedMotion();

  return (
    <section id="certifications" className="bg-transparent relative z-10 text-white py-20 md:py-28">
      <div className="container max-w-6xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
          Verified Credentials
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white"
        >
          Licenses & <span className="gradient-text-cyan">Certifications</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base sm:text-lg text-slate-300 mb-14 max-w-2xl mx-auto"
        >
          A collection of industry credentials, fellowships, and domain specializations I've earned.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <CertificateShelf
            certifications={certifications}
            onOpen={setActiveCert}
            reduceMotion={reduceMotion}
          />
        </motion.div>
      </div>

      <AnimatePresence>
        {activeCert && (
          <CertificateModal
            cert={activeCert}
            onClose={() => setActiveCert(null)}
            reduceMotion={reduceMotion}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certifications;

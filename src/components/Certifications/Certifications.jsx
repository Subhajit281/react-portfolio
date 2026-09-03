import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import certifications from "../../data/certifications";
import CertificateShelf from "./CertificateShelf";
import CertificateModal from "./CertificateModal";

const Certifications = () => {
  const [activeCert, setActiveCert] = useState(null);
  const reduceMotion = useReducedMotion();

  return (
    <section id="certifications" className="bg-transparent relaive z-100 text-white py-20 md:py-32">
      <div className="container max-w-6xl mx-auto px-7 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-4 inline-block bg-gray-900/40 px-8 py-1 rounded-lg text-purple-100 [text-shadow:10px_7px_3px_rgba(0,0,0,0.9)]"
        >
          Certifications
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-gray-300 mb-14 max-w-2xl mx-auto"
        >
          A collection of things I've learned, built, and earned.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
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

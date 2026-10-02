// src/components/PrivacyNotice.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShieldAlt, FaCog, FaCheck, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { analytics } from "../services/analytics";
import PrivacySettingsModal from "./PrivacySettingsModal";

export default function PrivacyNotice() {
  const [showNotice, setShowNotice] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Check if visitor has already decided
    const consentChoice = analytics.getConsentChoice();
    if (!consentChoice) {
      // Delay presentation slightly so it doesn't clash with preloader or hero animation
      const timer = setTimeout(() => {
        setShowNotice(true);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for manual trigger from Footer or other links
  useEffect(() => {
    const handleOpenSettings = () => setShowSettings(true);
    window.addEventListener("open-privacy-settings", handleOpenSettings);
    return () => window.removeEventListener("open-privacy-settings", handleOpenSettings);
  }, []);

  const handleAccept = () => {
    analytics.grantConsent();
    setShowNotice(false);
  };

  const handleDecline = () => {
    analytics.revokeConsent();
    setShowNotice(false);
  };

  return (
    <>
      <AnimatePresence>
        {showNotice && (
          <motion.aside
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            aria-label="Privacy and Analytics Notice"
            role="region"
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-lg p-5 rounded-2xl bg-slate-900/95 border border-cyan-500/30 shadow-2xl shadow-black/80 backdrop-blur-xl text-white"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5">
                <FaShieldAlt size={16} />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Privacy & Analytics Notice
                  </h3>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                    aria-label="Configure privacy settings"
                  >
                    <FaCog size={11} />
                    <span>Settings</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3.5">
                  This portfolio uses privacy-conscious analytics to understand site traffic,
                  approximate location (via IP geolocation), and engagement time. We do not
                  collect personal identity, precise GPS, or cross-site tracking.{" "}
                  <Link
                    to="/privacy-policy"
                    className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                  >
                    Learn more
                  </Link>
                  .
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleAccept}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                  >
                    <FaCheck size={10} />
                    <span>Accept Analytics</span>
                  </button>

                  <button
                    onClick={handleDecline}
                    className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs border border-white/10 transition-colors flex items-center gap-1"
                  >
                    <FaTimes size={10} />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <PrivacySettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
}


// src/components/PrivacySettingsModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShieldAlt, FaTimes, FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import { analytics } from "../services/analytics";

export default function PrivacySettingsModal({ isOpen, onClose }) {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(() => {
    return analytics.getConsentChoice() !== "denied";
  });
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (analyticsEnabled) {
      analytics.grantConsent();
    } else {
      analytics.revokeConsent();
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-slate-900/95 border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 text-white backdrop-blur-xl"
          role="dialog"
          aria-labelledby="privacy-modal-title"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800/60"
            aria-label="Close privacy settings"
          >
            <FaTimes size={16} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <FaShieldAlt size={18} />
            </div>
            <div>
              <h3 id="privacy-modal-title" className="text-lg font-bold text-white">
                Privacy & Analytics Settings
              </h3>
              <p className="text-xs font-mono text-cyan-400">PORTFOLIO DATA PREFERENCES</p>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            We value your digital privacy. This portfolio collects anonymous technical metrics (IP-derived approximate region, device type, visit duration) to gauge project interest and global reach.
          </p>

          {/* Setting Toggle Item */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-white/10 mb-6 flex items-start justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">
                Anonymous Portfolio Analytics
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Allows measurement of view counts, approximate city/country, and active session duration. No personal identifying information is stored.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={analyticsEnabled}
              onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
              className={`relative shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                analyticsEnabled ? "bg-cyan-500" : "bg-slate-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  analyticsEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="text-xs text-slate-400 mb-6">
            Read our full transparent disclosure in the{" "}
            <Link
              to="/privacy-policy"
              onClick={onClose}
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
            >
              Privacy Policy
            </Link>
            .
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
            >
              {saved ? (
                <>
                  <FaCheck size={12} />
                  <span>Preferences Saved</span>
                </>
              ) : (
                <span>Save Preferences</span>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


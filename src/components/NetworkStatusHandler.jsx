import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaWifi, FaCheckCircle, FaTimes } from "react-icons/fa";

/**
 * NetworkStatusHandler
 *
 * Real-time event monitor for network connectivity.
 * Displays unobtrusive, floating senior-grade telemetry alerts
 * whenever the user loses or regains network access.
 */
export default function NetworkStatusHandler() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showRestoredToast, setShowRestoredToast] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setDismissed(false);
      setShowRestoredToast(true);
      const timer = setTimeout(() => {
        setShowRestoredToast(false);
      }, 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setDismissed(false);
      setShowRestoredToast(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {/* Offline Alert Banner */}
      <AnimatePresence>
        {isOffline && !dismissed && (
          <motion.aside
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[90] w-[92%] max-w-md"
            aria-live="polite"
            role="alert"
          >
            <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-950/90 border border-amber-500/40 text-amber-200 backdrop-blur-2xl shadow-2xl shadow-amber-950/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <FaWifi className="text-sm animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white tracking-wide">Network Disconnected</h3>
                  <p className="text-[11px] text-amber-300/80">You are browsing in offline cached mode.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/network-error"
                  onClick={() => setDismissed(true)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-mono font-medium border border-amber-500/30 transition-colors"
                >
                  Diagnose
                </Link>
                <button
                  onClick={() => setDismissed(true)}
                  aria-label="Dismiss offline banner"
                  className="p-1.5 text-amber-400 hover:text-white transition-colors"
                >
                  <FaTimes size={13} />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Reconnected Toast Notification */}
      <AnimatePresence>
        {showRestoredToast && (
          <motion.aside
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90]"
            aria-live="polite"
            role="status"
          >
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-950/90 border border-emerald-500/40 text-emerald-300 backdrop-blur-xl shadow-2xl shadow-emerald-950/50 text-xs font-mono">
              <FaCheckCircle className="text-emerald-400 text-sm" />
              <span>CONNECTION RESTORED • ONLINE</span>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}


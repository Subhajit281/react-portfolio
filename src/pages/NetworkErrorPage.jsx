import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaWifi,
  FaRedo,
  FaHome,
  FaTerminal,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import PageTransition from "../components/PageTransition";

export default function NetworkErrorPage() {
  const navigate = useNavigate();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    // Give user realistic feedback delay
    await new Promise((res) => setTimeout(res, 800));

    if (navigator.onLine) {
      try {
        // Attempt a cache-busted fetch to test real connectivity
        const res = await fetch("/favicon.ico?" + Date.now(), { method: "HEAD", cache: "no-store" });
        if (res.ok || res.type === "opaque") {
          setTestResult({
            success: true,
            message: "Connection verified! You are back online. Redirecting to home...",
          });
          setTimeout(() => {
            navigate("/");
          }, 1500);
          setTesting(false);
          return;
        }
      } catch {
        // Fall through to offline result
      }
    }

    setTestResult({
      success: false,
      message: "Ping failed. No active internet handshake detected. Check Wi-Fi or mobile data.",
    });
    setTesting(false);
  };

  return (
    <PageTransition>
      <div className="container max-w-4xl mx-auto px-6 flex flex-col items-center justify-center min-h-[75vh] text-center">
        {/* Telemetry Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-mono uppercase tracking-wider mb-6 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>NET_STATUS: DISCONNECTED_OR_UNREACHABLE</span>
        </motion.div>

        {/* Radar / WiFi Offline Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 bg-amber-500/10 filter blur-3xl rounded-full pointer-events-none" />
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-900/80 border border-white/10 flex items-center justify-center text-amber-400 shadow-2xl shadow-amber-500/10 relative">
            <FaWifi className="text-4xl sm:text-5xl opacity-80" />
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-[11px] font-bold border-2 border-slate-950">
              ✕
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3"
        >
          Network <span className="gradient-text-cyan">Connection Lost</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="text-slate-300 text-sm sm:text-base max-w-lg mb-8 leading-relaxed"
        >
          Unable to establish a secure packet stream with the cloud runtime. Please verify your internet connection, router, or local proxy configuration.
        </motion.p>

        {/* Terminal Diagnostic Log */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full max-w-lg rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-xl p-4 sm:p-5 text-left font-mono text-xs text-slate-400 shadow-2xl mb-8 overflow-hidden"
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-slate-500">
            <div className="flex items-center gap-2">
              <FaTerminal className="text-cyan-400" />
              <span>network-diag --interface</span>
            </div>
            <span className="text-[10px] text-amber-400/80">INTERFACE: ETH0_DOWN</span>
          </div>
          <div className="space-y-1.5 text-slate-300">
            <p className="text-cyan-400">$ ping -c 3 gateway.internal</p>
            <p className="text-red-400">[FAIL] Destination host unreachable (100% packet loss)</p>
            <p className="text-slate-500">-- Recommendations:</p>
            <p className="pl-3 text-slate-400">1. Verify physical Wi-Fi or Ethernet link status.</p>
            <p className="pl-3 text-slate-400">2. Ensure DNS resolution is active and unblocked.</p>
          </div>
        </motion.div>

        {/* Feedback Message */}
        {testResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-lg p-3.5 rounded-xl text-xs font-mono mb-6 flex items-center gap-2.5 ${
              testResult.success
                ? "bg-emerald-950/50 border border-emerald-500/40 text-emerald-300"
                : "bg-red-950/50 border border-red-500/40 text-red-300"
            }`}
          >
            {testResult.success ? (
              <FaCheckCircle className="text-emerald-400 text-base shrink-0" />
            ) : (
              <FaExclamationTriangle className="text-red-400 text-base shrink-0" />
            )}
            <span>{testResult.message}</span>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <button
            onClick={handleTestConnection}
            disabled={testing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 hover:bg-cyan-400 transition-all duration-200 disabled:opacity-50"
          >
            <FaRedo className={testing ? "animate-spin" : ""} />
            <span>{testing ? "Testing Connection..." : "Test Connection & Retry"}</span>
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white font-medium text-sm border border-white/10 hover:border-cyan-400/40 transition-all duration-200"
          >
            <FaHome className="text-cyan-400" />
            <span>Return to Home</span>
          </Link>
        </motion.div>
      </div>
    </PageTransition>
  );
}


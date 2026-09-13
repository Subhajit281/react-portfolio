import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaProjectDiagram, FaBookOpen, FaArrowLeft, FaTerminal } from "react-icons/fa";
import PageTransition from "../components/PageTransition";

export default function NotFoundPage({ message }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <PageTransition>
      <div className="container max-w-4xl mx-auto px-6 flex flex-col items-center justify-center min-h-[75vh] text-center">
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-mono uppercase tracking-wider mb-6 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span>HTTP_STATUS: 404_ROUTE_NOT_FOUND</span>
        </motion.div>

        {/* 404 Glow Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative mb-2"
        >
          <div className="absolute inset-0 bg-cyan-500/10 filter blur-3xl rounded-full pointer-events-none" />
          <h1 className="text-7xl sm:text-9xl font-black font-mono tracking-tighter gradient-text-cyan select-none">
            404
          </h1>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3"
        >
          Packet Dropped In The Void
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="text-slate-300 text-sm sm:text-base max-w-lg mb-8 leading-relaxed"
        >
          {message ||
            `The requested route "${location.pathname}" could not be resolved on this system. The destination may have been decommissioned or moved.`}
        </motion.p>

        {/* Terminal Diagnostic Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full max-w-lg rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-xl p-4 sm:p-5 text-left font-mono text-xs text-slate-400 shadow-2xl mb-10 overflow-hidden"
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-slate-500">
            <div className="flex items-center gap-2">
              <FaTerminal className="text-cyan-400" />
              <span>bash - diagnostic_trace</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
          </div>
          <div className="space-y-1.5 text-slate-300">
            <p className="text-cyan-400">$ route-lookup --path "{location.pathname}"</p>
            <p className="text-red-400">[ERROR] 404: Route handler resolution failed.</p>
            <p className="text-slate-500">-- Diagnostics:</p>
            <p className="pl-3 text-slate-400">1. Verification: Resource does not exist in bundle map.</p>
            <p className="pl-3 text-slate-400">2. Fallback: Routing to available recovery navigation.</p>
          </div>
        </motion.div>

        {/* Navigation Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 hover:bg-cyan-400 transition-all duration-200"
          >
            <FaHome />
            <span>Return to Base</span>
          </Link>

          <Link
            to="/projects"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white font-medium text-sm border border-white/10 hover:border-cyan-400/40 transition-all duration-200"
          >
            <FaProjectDiagram className="text-cyan-400" />
            <span>View Projects</span>
          </Link>

          <Link
            to="/blogs"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white font-medium text-sm border border-white/10 hover:border-cyan-400/40 transition-all duration-200"
          >
            <FaBookOpen className="text-cyan-400" />
            <span>Explore Articles</span>
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 text-slate-400 hover:text-white text-sm border border-white/5 transition-all duration-200"
          >
            <FaArrowLeft />
            <span>Go Back</span>
          </button>
        </motion.div>
      </div>
    </PageTransition>
  );
}


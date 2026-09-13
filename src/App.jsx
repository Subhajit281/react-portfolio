import React, { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";

import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Preloader from "./components/preLoader";
import Chatbot from "./components/Chatbot";
import CodingActivity from "./components/CodingActivity";
import ScrollToHash from "./components/ScrollToHash";
import SmoothScroll from "./components/SmoothScroll";
import Certifications from "./components/Certifications/Certifications";
import FloatingSkillsHelix from "./components/FloatingSkillsHelix";
import DynamicBackground from "./components/DynamicBackground";
import ScrollProgressBar from "./components/ScrollProgressBar";

// Code-split secondary routes for maximum performance
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const SkillsPage = lazy(() => import("./pages/SkillsPage"));
const ExperiencePage = lazy(() => import("./pages/ExperiencePage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));

import { blogRoutes } from "./routes/BlogRoutes";

function RouteFallback() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-slate-700 border-t-cyan-400 rounded-full animate-spin" />
    </div>
  );
}

// ================================
// HOME PAGE (Complete showcase)
// ================================

const HomePage = () => {
  return (
    <>
      {/* Floating 3D skill helix for desktop */}
      <FloatingSkillsHelix />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Hero />
        <CodingActivity />
        <Skills />
        <Experience />
        <Projects />
        <Certifications />
        <Education />
        <Contact />
      </motion.div>
    </>
  );
};

// ================================
// APP (Root)
// ================================

const App = () => {
  const [loading, setLoading] = useState(() => {
    // Show preloader on first page load per session
    return !sessionStorage.getItem("portfolioPreloaded");
  });

  const location = useLocation();

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem("portfolioPreloaded", "true");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <SmoothScroll>
      {/* High-tech Preloader on initial visit */}
      <AnimatePresence mode="wait">
        {loading && <Preloader key="app-preloader" />}
      </AnimatePresence>

      {/* Dynamic ambient engineering background */}
      <DynamicBackground />

      {/* Glowing scroll progress bar */}
      <ScrollProgressBar />

      {/* Scroll-to-hash and route change coordination */}
      <ScrollToHash />

      {/* Floating glass navbar */}
      <Navbar />

      {/* Animated Routes */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/projects"
            element={
              <Suspense fallback={<RouteFallback />}>
                <ProjectsPage />
              </Suspense>
            }
          />
          <Route
            path="/skills"
            element={
              <Suspense fallback={<RouteFallback />}>
                <SkillsPage />
              </Suspense>
            }
          />
          <Route
            path="/experience"
            element={
              <Suspense fallback={<RouteFallback />}>
                <ExperiencePage />
              </Suspense>
            }
          />
          <Route
            path="/contact"
            element={
              <Suspense fallback={<RouteFallback />}>
                <ContactPage />
              </Suspense>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <Suspense fallback={<RouteFallback />}>
                <PrivacyPolicy />
              </Suspense>
            }
          />
          {blogRoutes}
        </Routes>
      </AnimatePresence>

      {/* AI Assistant Chatbot */}
      <Chatbot />

      {/* Footer */}
      <Footer />
    </SmoothScroll>
  );
};

export default App;
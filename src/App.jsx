import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Routes, Route } from "react-router-dom";

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
import PrivacyPolicy from "./components/PrivacyPolicy";
import ScrollToHash from "./components/ScrollToHash";
import SmoothScroll from "./components/SmoothScroll";
import Certifications from "./components/Certifications/Certifications";

import FloatingSkillsHelix from "./components/FloatingSkillsHelix";

import { blogRoutes } from "./routes/BlogRoutes";


// ================================
// HOME PAGE
// ================================

const HomePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Floating 3D skill helix */}
      <FloatingSkillsHelix />

      {/* Preloader */}
      <AnimatePresence>
        {loading && <Preloader />}
      </AnimatePresence>

      {/* Main portfolio content */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Hero />

          <CodingActivity />

          <Skills />

          <Experience />

          <Projects />

          <Certifications />

          <Education />

          <Contact />

          <Chatbot />
        </motion.div>
      )}
    </>
  );
};


// ================================
// APP
// ================================

const App = () => {
  return (
    <SmoothScroll>

      {/* Scroll-to-hash functionality */}
      <ScrollToHash />

      {/* Navbar */}
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />

        {blogRoutes}
      </Routes>

      {/* Footer */}
      <Footer />

    </SmoothScroll>
  );
};

export default App;
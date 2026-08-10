import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';
import Hero from './Hero';
import Navbar from './Navbar';
import Skills from './Skills';
import Experience from './Experience';
import Projects from './Projects';
import Education from './Education';
import Contact from './Contact';
import Footer from './Footer';
import Preloader from './preLoader'; //  preloader component
import Chatbot from './Chatbot';
import CodingActivity from "./CodingActivity";
import PrivacyPolicy from './PrivacyPolicy';
import ScrollToHash from "./ScrollToHash";
import SmoothScroll from './SmoothScroll';
import { blogRoutes } from "../routes/BlogRoutes";

const HomePage = () => {
  // 1. Create a state to manage the loading status
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. Set a timer to hide the preloader after a delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 3 seconds. can change this duration.

    // Cleanup the timer
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* 3.  component that allows the preloader to have an exit animation */}
      <AnimatePresence>
        {loading && <Preloader />}
      </AnimatePresence>

      {/* 4.conditionally renders portfolio content only when loading is false */}
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
          <Education />
          <Contact />
          <Chatbot />
        </motion.div>
      )}
    </>
  );
};

const App = () => {
  return (
    <SmoothScroll>
      <ScrollToHash />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        {blogRoutes}
      </Routes>
      <Footer />
    </SmoothScroll>
  );
};

export default App;
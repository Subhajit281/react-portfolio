import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Preloader from './components/preLoader'; //  preloader component
import Chatbot from './components/Chatbot';
import CodingActivity from "./components/CodingActivity";
import PrivacyPolicy from './components/PrivacyPolicy';
import ScrollToHash from "./components/ScrollToHash";

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
    <>
      <ScrollToHash />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
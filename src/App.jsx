import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Preloader from './components/preLoader'; // Your preloader component

const App = () => {
  // 1. Create a state to manage the loading status
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. Set a timer to hide the preloader after a delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 seconds. You can change this duration.

    // Cleanup the timer
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* 3. This component allows the preloader to have an exit animation */}
      <AnimatePresence>
        {loading && <Preloader />}
      </AnimatePresence>

      {/* 4. This conditionally renders your portfolio content only when loading is false */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Navbar />
          <Hero />
          <Skills />
          <Experience />
          <Projects />
          <Education />
          <Contact />
          <Footer />
        </motion.div>
      )}
    </>
  );
};

export default App;


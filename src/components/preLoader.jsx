import React from 'react';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';
// Make sure you download a Lottie JSON and place it here
import preloaderAnimation from '../assets/Loading sand clock.json';

const Preloader = () => {
  return (
    // This div covers the entire screen and has a very high z-index to be on top of everything
    <motion.div
      className="fixed inset-0 bg-black flex flex-col justify-center items-center z-[100]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }} // This defines the fade-out animation
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      {/* Your Lottie Animation */}
      <Lottie animationData={preloaderAnimation} loop={true} className="w-48 h-48" />

      {/* Your Portfolio Title */}
      <motion.h1
        className="text-2xl text-slate-200 font-bold mt-4 tracking-widest"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Subhajit's Portfolio
      </motion.h1>
    </motion.div>
  );
};

export default Preloader;

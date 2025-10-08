import React from 'react';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';
import preloaderAnimation from '../assets/sand.json';

const Preloader = () => {
  return (
    <motion.div
      className="fixed inset-0 bg-black flex flex-col justify-center items-center z-[100]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }} // the fade-out animation
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      <Lottie animationData={preloaderAnimation} loop={true} className="w-48 h-48" />
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

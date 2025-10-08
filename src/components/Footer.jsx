import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagramSquare, FaEye } from 'react-icons/fa';
import { RiArrowUpDoubleLine } from "react-icons/ri";
import Lottie from 'lottie-react';
import footerAnimation from '../assets/Robot TFU.json';

// ✨ CHANGE 1: Import the already-initialized 'app' from your config file
import app from '../firebaseConfig'; 
import { getFirestore, doc, updateDoc, increment, onSnapshot } from "firebase/firestore";

// ✨ CHANGE 2: We no longer initialize Firebase here. We just get the database service.
const db = getFirestore(app);


// This is a sub-component for the "Back to Top" button
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-indigo-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-900 transition-colors z-50"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          aria-label="Scroll to top"
        >
          <RiArrowUpDoubleLine size={27} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    const counterDocRef = doc(db, 'visitors', 'counter');

    const incrementCount = async () => {
      if (!sessionStorage.getItem('portfolioVisited')) {
        await updateDoc(counterDocRef, {
          count: increment(1)
        });
        sessionStorage.setItem('portfolioVisited', 'true');
      }
    };

    incrementCount();

    const unsubscribe = onSnapshot(counterDocRef, (doc) => {
      if (doc.exists()) {
        setVisitorCount(doc.data().count);
      }
    });

    return () => unsubscribe();
  }, []);

  const socialLinks = [
    { name: 'GitHub', icon: <FaGithub size={24} />, url: 'https://github.com/Subhajit281' },
    { name: 'LinkedIn', icon: <FaLinkedin size={24} />, url: 'https://www.linkedin.com/in/subhajit-sarkar-57aa432b1/' },
    { name: 'Instagram', icon: <FaInstagramSquare size={24} />, url: 'https://www.instagram.com/_search_for_it/' },
  ];

  const quickLinks = [
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer  className="bg-black border-cyan-400 border-t text-white relative">
      <motion.div
        className="container max-w-6xl mx-auto px-6 py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left items-start">
          
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-cyan-400 ">Subhajit Sarkar</h3>
            <p className="mt-2 text-gray-200">A passionate developer building the future, one line of code at a time.</p>
          </div>

          <div className="lg:col-span-1">
            <h4 className="text-xl font-bold mb-4">Quick Links</h4>
            <ul>
              {quickLinks.map((link) => (
                <li key={link.name} className="mb-2">
                  <a href={link.href} className="hover:text-cyan-400 transition-colors">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h4 className="text-xl font-bold mb-4">Connect With Me</h4>
            <div className="flex justify-center md:justify-start space-x-6">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  aria-label={link.name}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>
          
          <div className="hidden md:flex justify-center items-center lg:col-span-1">
            <Lottie 
              animationData={footerAnimation} 
              loop={true} 
              autoplay={true}
              className="w-48 h-48 lg:w-64 lg:h-64"
            />
          </div>
        </div>

        {/* Copyright Section - NOW RESPONSIVE */}
        <div className="border-t border-gray-600 mt-12 pt-8 text-center text-gray-400 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Subhajit Sarkar. All Rights Reserved.</p>
          
          {/* This is the new Visitor Counter display */}
          {visitorCount !== null && (
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <FaEye />
              <span>{visitorCount.toLocaleString()}</span>
            </div>
          )}
        </div>
      </motion.div>

      <ScrollToTopButton />
    </footer>
  );
};

export default Footer;


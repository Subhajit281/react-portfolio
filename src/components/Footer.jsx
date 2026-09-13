import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagramSquare, FaEye } from 'react-icons/fa';
import { RiArrowUpDoubleLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import footerAnimation from '../assets/Robot TFU.json';
import app from '../firebaseConfig'; 
import { getFirestore, doc, updateDoc, increment, onSnapshot } from "firebase/firestore";

const db = getFirestore(app);

// Sub-component for the "Back to Top" button
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(window.scrollY > 350);
  };

  const scrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.1 });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-slate-900/90 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 border border-cyan-500/40 w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl shadow-black/80 backdrop-blur-md transition-all duration-200 z-40"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          whileHover={{ y: -3 }}
          aria-label="Scroll to top"
        >
          <RiArrowUpDoubleLine size={24} />
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
        try {
          await updateDoc(counterDocRef, {
            count: increment(1)
          });
          sessionStorage.setItem('portfolioVisited', 'true');
        } catch {
          // silently handle if offline or permission restricted
        }
      }
    };

    incrementCount();

    const unsubscribe = onSnapshot(counterDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setVisitorCount(docSnap.data().count);
      }
    }, () => {});

    return () => unsubscribe();
  }, []);

  const socialLinks = [
    { name: 'GitHub', icon: <FaGithub size={20} />, url: 'https://github.com/Subhajit281' },
    { name: 'LinkedIn', icon: <FaLinkedin size={20} />, url: 'https://www.linkedin.com/in/subhajit-sarkar-57aa432b1/' },
    { name: 'Instagram', icon: <FaInstagramSquare size={20} />, url: 'https://www.instagram.com/_search_for_it/' },
  ];

  const quickLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'Projects', href: '/projects' },
    { name: 'Skills', href: '/skills' },
    { name: 'Experience', href: '/experience' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy-policy' }
  ];

  return (
    <footer className="bg-slate-950/80 border-t border-white/10 text-white relative z-10 backdrop-blur-xl">
      <motion.div
        className="container max-w-6xl mx-auto px-6 py-14"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left items-start">
          
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold tracking-tight text-white">
              Subhajit<span className="text-cyan-400">.dev</span>
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Full Stack Engineer & Problem Solver studying CSE at NIT Silchar. Building robust distributed systems and dynamic web applications.
            </p>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-sm font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith('/#') ? (
                    <a href={link.href} className="text-slate-400 hover:text-cyan-300 transition-colors">
                      {link.name}
                    </a>
                  ) : (
                    <Link to={link.href} className="text-slate-400 hover:text-cyan-300 transition-colors">
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-sm font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-4">Connect</h4>
            <div className="flex justify-center md:justify-start space-x-3 mb-6">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  aria-label={link.name}
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition-colors"
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
            <p className="text-xs text-slate-400">
              Open to summer 2026 internships, full-stack projects, and technical writing collaborations.
            </p>
          </div>
          
          <div className="hidden md:flex justify-center items-center md:col-span-1">
            <Lottie 
              animationData={footerAnimation} 
              loop={true} 
              autoplay={true} 
              className="w-40 h-40 lg:w-48 lg:h-48"
            />
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-xs font-mono text-slate-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Subhajit Sarkar. Crafted with React, Tailwind & Framer Motion.</p>
          
          {/* Visitor Counter */}
          {visitorCount !== null && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-300">
              <FaEye className="text-cyan-400" />
              <span>{visitorCount.toLocaleString()} visitors</span>
            </div>
          )}
        </div>
      </motion.div>

      <ScrollToTopButton />
    </footer>
  );
};

export default Footer;

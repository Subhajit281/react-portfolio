import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaCode, FaChevronDown } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);
  const [mobileBlogOpen, setMobileBlogOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setBlogDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setMobileBlogOpen(false);
  }, [location.pathname, location.hash]);

  const navLinks = [
    { to: "/#home", label: "About" },
    { to: "/projects", label: "Projects" },
    { to: "/skills", label: "Skills" },
    { to: "/experience", label: "Experience" },
    { to: "/#education", label: "Education" },
  ];

  const blogLinks = [
    { to: "/blogs", label: "All Posts" },
    { to: "/categories", label: "Categories" },
  ];

  const isActive = (to) => {
    if (to.startsWith("/#")) {
      return location.pathname === "/" && location.hash === to.replace("/", "");
    }
    return location.pathname === to;
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div
          className={`flex justify-between items-center px-4 sm:px-6 py-2.5 rounded-2xl border transition-all duration-300 ${
            isScrolled
              ? "bg-slate-950/80 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/60"
              : "bg-slate-900/45 backdrop-blur-md border-white/5 shadow-lg shadow-black/20"
          }`}
        >
          {/* Logo */}
          <Link
            to="/#home"
            className="flex items-center gap-2 text-lg sm:text-xl font-bold text-white hover:text-cyan-300 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:border-cyan-400 transition-all">
              <FaCode size={16} />
            </div>
            <span className="font-mono tracking-tight font-bold">
              Subhajit<span className="text-cyan-400">.dev</span>
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Blogs Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setBlogDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none ${
                  location.pathname.startsWith("/blogs") ||
                  location.pathname.startsWith("/categories")
                    ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>Blogs</span>
                <FaChevronDown
                  size={10}
                  className={`transition-transform duration-200 text-slate-400 ${
                    blogDropdownOpen ? "rotate-180 text-cyan-400" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {blogDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 mt-2 w-44 bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1.5 z-50"
                  >
                    {blogLinks.map(({ to, label }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setBlogDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-medium text-slate-300 hover:text-cyan-300 hover:bg-white/5 transition-colors"
                      >
                        {label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/contact"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === "/contact"
                  ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right Action: GitHub Button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com/Subhajit281"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-medium text-xs font-mono border border-cyan-500/30 hover:border-cyan-400 transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <FaGithub size={15} />
              <span>GitHub</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-slate-800/60 text-slate-300 hover:text-white focus:outline-none border border-white/5"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-2 p-4 rounded-2xl bg-slate-950/95 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-1"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Blogs */}
              <div>
                <button
                  onClick={() => setMobileBlogOpen(!mobileBlogOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                >
                  <span>Blogs</span>
                  <FaChevronDown
                    size={11}
                    className={`transition-transform duration-200 ${
                      mobileBlogOpen ? "rotate-180 text-cyan-400" : "text-slate-500"
                    }`}
                  />
                </button>
                {mobileBlogOpen && (
                  <div className="ml-4 pl-2 border-l border-white/10 space-y-1 py-1">
                    {blogLinks.map(({ to, label }) => (
                      <Link
                        key={to}
                        to={to}
                        className="block px-3 py-2 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/contact"
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>

              <div className="pt-3 mt-2 border-t border-white/10">
                <a
                  href="https://github.com/Subhajit281"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm shadow-md shadow-cyan-500/20"
                >
                  <FaGithub size={16} />
                  <span>GitHub Profile</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
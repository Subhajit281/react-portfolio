import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaCode, FaChevronDown } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);
    const [mobileBlogOpen, setMobileBlogOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close desktop dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setBlogDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const blogLinks = [
        { to: "/blogs", label: "All Posts" },
        { to: "/categories", label: "Categories" },
    ];

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isOpen ? '' : 'p-4'}`}>
            <div
                className={`container max-w-6xl mx-auto flex justify-between items-center px-12 border-b border-cyan-400 transition-all duration-300 
                           ${isScrolled || isOpen ? 'bg-gray-900/70 backdrop-blur-md rounded-2xl' : 'bg-gray-700/40'} 
                           ${isOpen ? 'p-4 rounded-xl' : 'p-2 rounded-full'}`}
            >
                <Link to="/#home" className="flex items-center gap-2 text-xl md:text-2xl font-bold text-cyan-100 hover:text-white transition-colors p-2">
                    <FaCode size={26} />
                    <span>Subhajit</span>
                </Link>

                {/* Desktop view navbar */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/#home" className="text-gray-300 hover:text-cyan-400 font-semibold transition-colors">About me</Link>
                    <Link to="/#projects" className="text-gray-300 hover:text-cyan-400 font-semibold transition-colors">Projects</Link>
                    <Link to="/#skills" className="text-gray-300 hover:text-cyan-400 font-semibold transition-colors">Skills</Link>
                    <Link to="/#experience" className="text-gray-300 hover:text-cyan-400 font-semibold transition-colors">Experience</Link>
                    <Link to="/#education" className="text-gray-300 hover:text-cyan-400 font-semibold transition-colors">Education</Link>

                    {/* Blogs dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setBlogDropdownOpen((prev) => !prev)}
                            className="flex items-center gap-1 text-gray-300 hover:text-cyan-400 font-semibold transition-colors focus:outline-none"
                        >
                            Blogs
                            <FaChevronDown
                                size={12}
                                className={`transition-transform duration-200 ${blogDropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {blogDropdownOpen && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-40 bg-gray-900/90 backdrop-blur-md border-b-2 border-cyan-400/70 rounded-md shadow-lg shadow-cyan-400/10 overflow-hidden">
                                {blogLinks.map(({ to, label }) => (
                                    <Link
                                        key={to}
                                        to={to}
                                        onClick={() => setBlogDropdownOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-300 hover:text-cyan-400 hover:bg-gray-800/60 transition-colors"
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link to="/#contact" className="text-gray-300 hover:text-cyan-400 font-semibold transition-colors">Contact Me</Link>
                </div>
                <div>
                    <a href="https://github.com/Subhajit281" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-  py-2 px-4
                     bg-gray-900/40 border border-cyan-500 text-cyan-400 font-bold rounded-3xl text-md
                                   transition-all duration-300 transform hover:scale-105
                                   shadow-lg shadow-cyan-400/30 hover:shadow-xl hover:shadow-cyan-400/30">
                        <FaGithub size={20} className="mr-1" />
                        <span>GitHub</span>
                    </a>
                </div>    
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none p-2">
                        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>

                <div className="hidden md:block w-12"></div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} container max-w-6xl mx-auto mt-2 bg-gray-900/80 backdrop-blur-md rounded-xl`}>
                <Link to="/#home" className="text-cyan-400 hover:text-white transition-colors block p-4 text-center" onClick={() => setIsOpen(false)}>About</Link>
                <Link to="/#projects" className="text-cyan-400 hover:text-white transition-colors block p-4 text-center" onClick={() => setIsOpen(false)}>Projects</Link>
                <Link to="/#skills" className="text-cyan-400 hover:text-white transition-colors block p-4 text-center" onClick={() => setIsOpen(false)}>Skills</Link>
                <Link to="/#experience" className="text-cyan-400 hover:text-white transition-colors block p-4 text-center" onClick={() => setIsOpen(false)}>Experience</Link>
                <Link to="/#education" className="text-cyan-400 hover:text-white transition-colors block p-4 text-center" onClick={() => setIsOpen(false)}>Education</Link>

                {/* Mobile Blogs dropdown */}
                <div className="border-t border-gray-600">
                    <button
                        onClick={() => setMobileBlogOpen((prev) => !prev)}
                        className="w-full flex items-center justify-center gap-2 text-cyan-400 hover:text-white transition-colors p-4"
                    >
                        Blogs
                        <FaChevronDown
                            size={12}
                            className={`transition-transform duration-200 ${mobileBlogOpen ? 'rotate-180' : ''}`}
                        />
                    </button>
                    {mobileBlogOpen && (
                        <div className="bg-gray-800/60">
                            {blogLinks.map(({ to, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className="block p-3 text-center text-sm text-gray-300 hover:text-cyan-400 transition-colors"
                                    onClick={() => { setIsOpen(false); setMobileBlogOpen(false); }}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <Link to="/#contact" className="text-cyan-400 hover:text-white transition-colors block p-4 text-center border-t border-gray-600" onClick={() => setIsOpen(false)}>Contact me</Link>
                <a href="https://github.com/Subhajit281" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-white transition-colors block p-4 text-center border-t border-gray-600"> 
                   <span>GitHub</span>
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
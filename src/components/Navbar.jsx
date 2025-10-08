import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaCode } from "react-icons/fa";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Effect to detect scroll and change navbar style
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        // Main wrapper to position the floating navbar
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isOpen ? '' : 'p-4'}`}>
            <div
                className={`container max-w-6xl mx-auto flex justify-between items-center px-12 border-b border-cyan-400 transition-all duration-300 
                           ${isScrolled || isOpen ? 'bg-gray-900/70 backdrop-blur-md rounded-2xl' : 'bg-gray-700/40'} 
                           ${isOpen ? 'p-4 rounded-xl' : 'p-2 rounded-full'}`}
            >
                <a href="#home" className="flex items-center gap-2 text-xl md:text-2xl font-bold text-cyan-100 hover:text-white transition-colors p-2">
                    <FaCode size={26} />
                    <span>Subhajit</span>
                </a>

                {/* Desktop view navbar */}
                <div className="hidden md:flex items-center space-x-8">
                    <a href="#home" className="text-gray-300 hover:text-cyan-400 font-semibold transition-colors">About me</a>
                    <a href="#projects" className="text-gray-300 hover:text-cyan-400 font-semibold transition-colors">Projects</a>
                    <a href="#skills" className="text-gray-300 hover:text-cyan-400 font-semibold transition-colors">Skills</a>
                    <a href="#experience" className="text-gray-300 hover:text-cyan-400 font-semibold transition-colors">Experience</a>
                    <a href="#education" className="text-gray-300 hover:text-cyan-400 font-semibold transition-colors">Education</a>
                    <a href="#contact" className="text-gray-300 hover:text-cyan-400 font-semibold transition-colors">Contact Me</a>
                </div>

                {/* Mobile menu icon */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none p-2">
                        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>

                {/* Placeholder for the right side on desktop to balance the layout */}
                <div className="hidden md:block w-12"></div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} container max-w-6xl mx-auto mt-2 bg-gray-900/80 backdrop-blur-md rounded-xl`}>
                <a href="#home" className="text-cyan-400 hover:text-white transition-colors block p-4 text-center" onClick={() => setIsOpen(false)}>About</a>
                <a href="#projects" className="text-cyan-400 hover:text-white transition-colors block p-4 text-center" onClick={() => setIsOpen(false)}>Projects</a>
                <a href="#skills" className="text-cyan-400 hover:text-white transition-colors block p-4 text-center" onClick={() => setIsOpen(false)}>Skills</a>
                <a href="#experience" className="text-cyan-400 hover:text-white transition-colors block p-4 text-center" onClick={() => setIsOpen(false)}>Experience</a>
                <a href="#education" className="text-cyan-400 hover:text-white transition-colors block p-4 text-center" onClick={() => setIsOpen(false)}>Education</a>
                <a href="#contact" className="text-cyan-400 hover:text-white transition-colors block p-4 text-center" onClick={() => setIsOpen(false)}>Contact me</a>
            </div>
        </nav>
    );
};

export default Navbar;


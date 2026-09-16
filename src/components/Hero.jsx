import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import myProfilePic from '../assets/Subhajit11 (2).png';
import Lottie from "lottie-react";
import hexagonAnimation from "../assets/hexagon.json";
import { TypeAnimation } from 'react-type-animation';
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { FaTerminal } from 'react-icons/fa';

const techBadges = ['React.js', 'Node.js', 'MongoDB', 'PostgreSQL', 'C++', 'Docker'];

const Hero = () => {
    const [isDesktop, setIsDesktop] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia("(min-width: 768px)").matches;
    });

    useEffect(() => {
        const mql = window.matchMedia("(min-width: 768px)");
        const handleChange = (e) => setIsDesktop(e.matches);
        mql.addEventListener("change", handleChange);
        return () => mql.removeEventListener("change", handleChange);
    }, []);

    return (
        <section 
            id="home" 
            role="banner"
            className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-6 pt-28 pb-16 md:px-12"
        >
            {/* Preserved Signature Hexagon Lottie Background Animation (Desktop only for buttery smooth mobile scroll) */}
            {isDesktop && (
                <div className="hidden md:block absolute top-[40%] md:top-1/2 left-1/2 md:left-3/4 -translate-x-1/2 -translate-y-1/2 w-full h-full md:w-[1000px] md:h-[1000px] z-0 opacity-40 md:opacity-60 pointer-events-none">
                    <Lottie
                        animationData={hexagonAnimation}
                        loop={true}
                        autoplay={true}
                        className="w-full h-full"
                    />
                </div>
            )}

            <div className="container max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between">
                
                {/* Text Section */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 text-center md:text-left md:mr-10 order-2 md:order-1"
                >
                    {/* Live Status Pill Badge */}
                    {/* <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md mb-6 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-mono text-slate-300 font-medium tracking-wide">
                            Available for Roles • B.Tech CSE @ NIT Silchar
                        </span>
                    </div> */}

                    <p className="text-lg sm:text-xl font-mono text-cyan-400 font-semibold mb-2 flex items-center justify-center md:justify-start gap-2">
                        <FaTerminal size={14} className="text-cyan-400" />
                        <span>Hello World, I am</span>
                    </p>

                    <h1 itemProp="name" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 text-white">
                        Subhajit <span className="gradient-text-cyan">Sarkar</span>
                    </h1>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-300 mb-6 h-12 md:h-14 flex items-center justify-center md:justify-start">
                        <span className="text-slate-300 mr-2">I am a </span>
                        <TypeAnimation
                            sequence={[
                                'Web Developer', 800,
                                'Problem Solver', 800,
                                'MERN Stack Specialist', 800,
                                'Lifelong Learner', 800,
                            ]}
                            wrapper="span"
                            speed={50}
                            repeat={Infinity}
                            className="text-cyan-400 font-mono"
                        />
                    </h2>

                    <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto md:mx-0 leading-relaxed font-normal">
                        I’m a Computer Science and Engineering student at NIT Silchar, focused on building scalable web applications using modern technologies like React, Node.js, and MongoDB. I enjoy solving problems and continuously improving my development skills.
                    </p>

                    {/* Tech stack ticker / badges */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-6">
                        {techBadges.map((tech) => (
                            <span
                                key={tech}
                                className="px-2.5 py-1 rounded-md bg-slate-900/60 border border-white/5 text-[12px] font-mono text-slate-300 shadow-sm"
                            >
                                #{tech}
                            </span>
                        ))}
                    </div>

                    {/* Hidden SEO keywords */}
                    <p className="hidden">
                        Subhajit Sarkar portfolio, web developer, MERN stack developer, React developer, Node.js developer, 
                        JavaScript developer, frontend developer, backend developer, DSA, LeetCode problem solver, NIT Silchar India.
                    </p>

                    {/* CTA buttons */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8">
                        <a
                            href="./Resume(09092026).pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Open Subhajit Sarkar Web Developer Resume"
                            className="inline-flex items-center gap-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 px-6 rounded-xl text-base 
                                       transition-all duration-200 transform hover:-translate-y-0.5 
                                       shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30"
                        >
                            <span>Check CV</span>
                            <FaArrowUpRightFromSquare className="text-sm" />
                        </a>

                        <Link
                            to="/projects"
                            className="inline-flex items-center gap-2 bg-slate-900/70 hover:bg-slate-800/80 border border-white/10 hover:border-cyan-400/40 text-slate-200 font-semibold py-3 px-6 rounded-xl text-base 
                                       transition-all duration-200 transform hover:-translate-y-0.5 backdrop-blur-md"
                        >
                            View Projects
                        </Link>
                    </div>
                </motion.div>

                {/* Profile Image Section with Glowing Ring */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-shrink-0 relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 order-1 md:order-2 mb-10 md:mb-0"
                >
                    {/* Ambient outer glow */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/40 via-indigo-600/30 to-fuchsia-600/30 filter blur-3xl opacity-70 animate-pulse" />

                    {/* Rotating border gradient halo */}
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 opacity-60 filter blur-sm spin-slow" />

                    {/* Image container */}
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-cyan-400/40 bg-slate-950 shadow-2xl">
                        <img
                            src={myProfilePic}
                            alt="Subhajit Sarkar - Web Developer, MERN Stack Developer, DSA and LeetCode Enthusiast"
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default Hero;

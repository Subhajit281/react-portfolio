import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Projects = () => {
  const projects = [
    {
      title: 'API Monitoring Platform',
      description:
        'A full-stack API monitoring platform that continuously tracks API uptime, response time, and availability.',
      imageUrl: 'https://res.cloudinary.com/dyxbvlzcl/image/upload/v1783605791/Screenshot_2026-06-28_183432_1_bxtnwp.jpg',
      tags: [
        'Node.js',
        'Express.js',
        'PostgreSQL',
        'Prisma',
        'Node-Cron',
        'Redis',
        'JWT',
        'Docker',
        'Swagger',
      ],
      githubUrl: 'https://github.com/Subhajit281/API-Monitoring-Platform-Backend',
      liveUrl: 'https://upflow-monitoring.vercel.app',
    },
    {
      title: 'AgenticAI Document Analyzer',
      description: 'An AI-powered document analysis platform that extracts, processes, and understands information from documents using OCR, Docling, and Large Language Models.',
      imageUrl: 'https://res.cloudinary.com/dyxbvlzcl/image/upload/v1789848419/docai_bnjumw.png',
      tags: ['Python', 'Docling', 'OCR', 'LLM', 'LangGraph'],
      githubUrl: 'https://github.com/Subhajit281/AI-Doc-Analyzer.git',
      liveUrl: 'https://ai-rag-doc-analyzer.vercel.app',
    },
    {
      title: 'CSS Website',
      description: 'A web-based platform for students that allows them to search for any materials and knows about the upcoming events and happenings in the branch.',
      imageUrl: 'https://res.cloudinary.com/dyxbvlzcl/image/upload/v1765553890/Screenshot_2025-12-12_211031_wzltor.png',
      tags: ['ReactJS', 'TailwindCSS', 'Javascript'],
      githubUrl: 'https://github.com/ComputerScienceSoceityNITS/css-official-website-2025-26.git',
      liveUrl: 'https://www.css-nits.in',
    },
    {
      title: 'Agroww CropCare',
      description: 'An all-in-one fullstack platform to manage crops, get weather alerts, and to make better farming decisions.',
      imageUrl: 'https://res.cloudinary.com/dyxbvlzcl/image/upload/v1769956624/agroww_oxe0b9.jpg',
      tags: ['ReactJS', 'TailwindCSS', 'Javascript', 'MongoDB', 'ExpressJS', 'NodeJS'],
      githubUrl: 'https://github.com/Subhajit281/Agroww-CropCare.git',
      liveUrl: 'https://agroww-cropcare.onrender.com',
    },
    {
      title: '2D Physics Simulator',
      description: 'A real-time executable 2D physics simulator for exploring motion, forces, and interactions through interactive visuals and hands-on simulations.',
      imageUrl: 'https://res.cloudinary.com/dyxbvlzcl/image/upload/v1777277718/Screenshot_2026-04-27_134913_aividh.png',
      tags: ['C++', 'Javascript', 'SFML', 'ReactJS', 'NodeJS', 'CMake', 'Electron'],
      githubUrl: 'https://github.com/Subhajit281/PhysicsSimulator.git',
      liveUrl: '#',
    },
    {
      title: '3D Portfolio',
      description: 'A 3D portfolio project built after learning Reactjs and implementing cool animations from Framer Motion.',
      imageUrl: 'https://res.cloudinary.com/dyxbvlzcl/image/upload/v1770632976/portfolio_gi54sk.png',
      tags: ['ReactJS', 'TailwindCSS', 'Javascript'],
      githubUrl: 'https://github.com/Subhajit281/react-portfolio.git',
      liveUrl: 'https://subhajit-sarkar.vercel.app',
    },
  ];

  const AUTOPLAY_DELAY = 3200; // ms
  const SWIPE_THRESHOLD = 50; // px

  const [perView, setPerView] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 3
  );
  const [index, setIndex] = useState(0); // current slide index
  const [isHovering, setIsHovering] = useState(false);

  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);
  const isSwiping = useRef(false);
  const autoplayRef = useRef(null);
  const trackRef = useRef(null);

  // --- Responsive: recalc items-per-view on resize ---
  useEffect(() => {
    const handleResize = () => {
      const next = window.innerWidth < 768 ? 1 : 3;
      setPerView((prev) => {
        if (prev !== next) setIndex(0);
        return next;
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(projects.length / perView);

  // --- Group projects into slides based on perView ---
  const slides = [];
  for (let i = 0; i < projects.length; i += perView) {
    slides.push(projects.slice(i, i + perView));
  }

  const goTo = useCallback(
    (i) => {
      const next = ((i % totalSlides) + totalSlides) % totalSlides;
      setIndex(next);
    },
    [totalSlides]
  );

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  // --- Autoplay ---
  useEffect(() => {
    if (isHovering) return undefined;
    autoplayRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % totalSlides);
    }, AUTOPLAY_DELAY);
    return () => clearInterval(autoplayRef.current);
  }, [isHovering, totalSlides]);

  // --- Touch / swipe handlers ---
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    isSwiping.current = true;
    setIsHovering(true); // pause autoplay while interacting
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchDeltaX.current > SWIPE_THRESHOLD) {
      goPrev();
    } else if (touchDeltaX.current < -SWIPE_THRESHOLD) {
      goNext();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
    isSwiping.current = false;
    setIsHovering(false); // resume autoplay
  };

  return (
    <section id="projects" className="bg-transparent text-white py-20 md:py-28">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="text-center md:text-left mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
            Production & Engineering
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Featured <span className="gradient-text-cyan">Works</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
            Real-world systems, full-stack applications, and real-time simulators I've designed and engineered.
          </p>
        </div>

        {/* Carousel Wrapper */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Prev Button */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous projects"
            className="absolute left-0 md:-left-5 top-1/2 -translate-y-1/2 z-20 
                       bg-slate-950/80 hover:bg-cyan-500 hover:text-slate-950 border border-white/10 hover:border-cyan-400
                       text-cyan-300 rounded-full p-3.5 
                       shadow-xl shadow-black/50 backdrop-blur-md
                       transition-all duration-200 hover:scale-110"
          >
            <FaChevronLeft className="text-base" />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={goNext}
            aria-label="Next projects"
            className="absolute right-0 md:-right-5 top-1/2 -translate-y-1/2 z-20 
                       bg-slate-950/80 hover:bg-cyan-500 hover:text-slate-950 border border-white/10 hover:border-cyan-400
                       text-cyan-300 rounded-full p-3.5 
                       shadow-xl shadow-black/50 backdrop-blur-md
                       transition-all duration-200 hover:scale-110"
          >
            <FaChevronRight className="text-base" />
          </button>

          {/* Track viewport */}
          <div
            className="overflow-hidden mx-6 md:mx-10"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <motion.div
              ref={trackRef}
              className="flex"
              animate={{ x: `-${index * 100}%` }}
              transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
              style={{ touchAction: 'pan-y' }}
            >
              {slides.map((slideGroup, slideIdx) => (
                <div
                  key={slideIdx}
                  className="flex-shrink-0 w-full grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-1"
                >
                  {slideGroup.map((project, projIdx) => (
                    <motion.div
                      key={project.title + projIdx}
                      className="group rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-400/50 backdrop-blur-xl 
                                 transition-all duration-300 shadow-2xl shadow-black/40 overflow-hidden flex flex-col justify-between hover:-translate-y-1.5"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: projIdx * 0.08 }}
                    >
                      <div className="relative h-48 overflow-hidden bg-slate-950">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                          draggable="false"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                        <div className="absolute top-3 right-3 flex gap-2">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`GitHub for ${project.title}`}
                              className="w-9 h-9 rounded-full bg-slate-900/80 hover:bg-cyan-500 hover:text-slate-950 text-white flex items-center justify-center border border-white/10 transition-colors backdrop-blur-md"
                            >
                              <FaGithub className="text-base" />
                            </a>
                          )}
                          {project.liveUrl && project.liveUrl !== '#' && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Live Demo for ${project.title}`}
                              className="w-9 h-9 rounded-full bg-slate-900/80 hover:bg-cyan-500 hover:text-slate-950 text-white flex items-center justify-center border border-white/10 transition-colors backdrop-blur-md"
                            >
                              <FiExternalLink className="text-sm" />
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-slate-300 text-sm mb-4 leading-relaxed line-clamp-3">
                            {project.description}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                          {project.tags.slice(0, 5).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="bg-slate-800/60 text-slate-300 text-[11px] font-mono px-2.5 py-1 rounded-md border border-white/5"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? 'w-7 bg-cyan-400 shadow-md shadow-cyan-400/60'
                    : 'w-2 bg-slate-700 hover:bg-cyan-400/50'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 text-slate-400 text-xs sm:text-sm font-mono border-t border-white/5 pt-6">
          <span>*If you like my works, consider starring the GitHub repositories.</span>
          <Link
            to="/projects"
            className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1 hover:underline"
          >
            View All Projects & Tech Stacks →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Projects;

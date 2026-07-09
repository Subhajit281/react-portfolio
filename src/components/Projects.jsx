import React, { useState, useEffect, useRef, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';

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
      title: 'CSS Website',
      description: 'A web-based platform for students that allows them to search for any materials and knows about the upcoming events and happenings  in the branch.',
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
    // Add more projects here
  ];

  const AUTOPLAY_DELAY = 2800; // ms
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
    <section id="projects" className="bg-transparent text-white py-20 md:py-32">
      <div className="container max-w-7xl mx-auto px-7">
        <h2 className="text-4xl font-bold mb-8 inline-block bg-gray-900/40 px-8 py-1 rounded-lg text-purple-100 [text-shadow:10px_7px_3px_rgba(0,0,0,0.9)]">
          My Works
        </h2>
        <p className="text-lg text-white mb-16 leading-relaxed [text-shadow:6px_4px_2px_rgba(0,0,0,0.9)] max-w-3xl">
          Following projects showcases my skills and experience through real-world examples of my work. Each project is briefly described with links to code repositories and live demos.
        </p>

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
                       bg-gray-900/60 hover:bg-cyan-900/70 border border-cyan-400/50
                       text-cyan-300 hover:text-white rounded-full p-3 
                       shadow-lg shadow-cyan-400/30 backdrop-blur-sm
                       transition-all duration-300 hover:scale-110"
          >
            <FaChevronLeft className="text-lg" />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={goNext}
            aria-label="Next projects"
            className="absolute right-0 md:-right-5 top-1/2 -translate-y-1/2 z-20 
                       bg-gray-900/60 hover:bg-cyan-900/70 border border-cyan-400/50
                       text-cyan-300 hover:text-white rounded-full p-3 
                       shadow-lg shadow-cyan-400/30 backdrop-blur-sm
                       transition-all duration-300 hover:scale-110"
          >
            <FaChevronRight className="text-lg" />
          </button>

          {/* Track viewport */}
          <div
            className="overflow-hidden mx-8 md:mx-12"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <motion.div
              ref={trackRef}
              className="flex"
              animate={{ x: `-${index * 100}%` }}
              transition={{ type: 'tween', ease: [0.20, 1, 0.20, 1], duration: 0.6 }}
              style={{ touchAction: 'pan-y' }}
            >
              {slides.map((slideGroup, slideIdx) => (
                <div
                  key={slideIdx}
                  className="flex-shrink-0 w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-1"
                >
                  {slideGroup.map((project, projIdx) => (
                    <motion.div
                      key={project.title + projIdx}
                      className="rounded-lg bg-gray-900/30 border-b border-cyan-400 backdrop-blur-sm transition-all duration-300 transform hover:scale-93 
                                 shadow-lg shadow-cyan-400/50 hover:shadow-xl hover:shadow-cyan-400/60 animated-gradient-border overflow-hidden"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: projIdx * 0.1 }}
                      whileHover={{ scale: 1.05, y: -10 }}
                    >
                      <div className="relative">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-50 object-cover"
                          draggable="false"
                        />
                        <div className="absolute top-4 right-4 flex gap-3">
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white text-2xl hover:text-cyan-400 transition-colors"
                          >
                            <FaGithub />
                          </a>
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white text-2xl hover:text-cyan-400 transition-colors"
                          >
                            <FiExternalLink />
                          </a>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                        <p className="text-gray-300 mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="bg-cyan-900/50 text-cyan-400 text-sm font-medium px-3 py-1 rounded-full"
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
                    ? 'w-6 bg-cyan-400 shadow-md shadow-cyan-400/60'
                    : 'w-2 bg-gray-500/50 hover:bg-cyan-400/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-14 text-gray-400 text-sm">
        *If you like my works try adding a star to the github repositories, it motivates me a lot
      </div>
    </section>
  );
};

export default Projects;

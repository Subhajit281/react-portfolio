import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useReducedMotion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: 'API Monitoring Platform',
    description:
      'A full-stack API monitoring platform that continuously tracks API uptime, response time, and availability.',
    imageUrl:
      'https://res.cloudinary.com/dyxbvlzcl/image/upload/v1783605791/Screenshot_2026-06-28_183432_1_bxtnwp.jpg',
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
    description:
      'A web-based platform for students that allows them to search for any materials and knows about the upcoming events and happenings in the branch.',
    imageUrl:
      'https://res.cloudinary.com/dyxbvlzcl/image/upload/v1765553890/Screenshot_2025-12-12_211031_wzltor.png',
    tags: ['ReactJS', 'TailwindCSS', 'Javascript'],
    githubUrl: 'https://github.com/ComputerScienceSoceityNITS/css-official-website-2025-26.git',
    liveUrl: 'https://www.css-nits.in',
  },
  {
    title: 'Agroww CropCare',
    description:
      'An all-in-one fullstack platform to manage crops, get weather alerts, and to make better farming decisions.',
    imageUrl: 'https://res.cloudinary.com/dyxbvlzcl/image/upload/v1769956624/agroww_oxe0b9.jpg',
    tags: ['ReactJS', 'TailwindCSS', 'Javascript', 'MongoDB', 'ExpressJS', 'NodeJS'],
    githubUrl: 'https://github.com/Subhajit281/Agroww-CropCare.git',
    liveUrl: 'https://agroww-cropcare.onrender.com',
  },
  {
    title: '2D Physics Simulator',
    description:
      'A real-time executable 2D physics simulator for exploring motion, forces, and interactions through interactive visuals and hands-on simulations.',
    imageUrl:
      'https://res.cloudinary.com/dyxbvlzcl/image/upload/v1777277718/Screenshot_2026-04-27_134913_aividh.png',
    tags: ['C++', 'Javascript', 'SFML', 'ReactJS', 'NodeJS', 'CMake', 'Electron'],
    githubUrl: 'https://github.com/Subhajit281/PhysicsSimulator.git',
    liveUrl: '#',
  },
  {
    title: '3D Portfolio',
    description:
      'A 3D portfolio project built after learning Reactjs and implementing cool animations from Framer Motion.',
    imageUrl: 'https://res.cloudinary.com/dyxbvlzcl/image/upload/v1770632976/portfolio_gi54sk.png',
    tags: ['ReactJS', 'TailwindCSS', 'Javascript'],
    githubUrl: 'https://github.com/Subhajit281/react-portfolio.git',
    liveUrl: 'https://subhajit-sarkar.vercel.app',
  },
  // Add more projects here
];

function ProjectCard({ project }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.04, y: -10 }}
      className="group relative flex h-[74vh] w-[85vw] shrink-0 flex-col overflow-hidden rounded-lg bg-gray-900/30 border-b border-cyan-400 backdrop-blur-sm shadow-lg shadow-cyan-400/50 hover:shadow-xl hover:shadow-cyan-400/60 animated-gradient-border sm:w-[60vw] md:w-[42vw] lg:w-[32vw] xl:w-[26vw]"
    >
      <div className="relative h-[55%] shrink-0 overflow-hidden">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="h-full w-full object-cover"
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

      <div className="flex min-h-0 flex-1 flex-col justify-between p-6">
        <div className="min-h-0">
          <h3 className="text-2xl font-bold mb-2 text-white">{project.title}</h3>
          <p className="text-gray-300 mb-3 line-clamp-3">{project.description}</p>
        </div>
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
  );
}

const Projects = () => {
  const sceneRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const section = sceneRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      // How far the track needs to travel so its last child ends flush
      // with the right edge of the viewport.
      const getScrollDistance = () =>
        Math.max(0, track.scrollWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          // Vertical scroll distance the pin lasts for — tune the
          // multiplier to make the horizontal scroll feel faster/slower.
          end: () => `+=${getScrollDistance() * 1.4}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      return () => tween.scrollTrigger?.kill();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sceneRef}
      className="relative overflow-hidden bg-transparent text-white"
    >
      {/* Sticky header, same treatment as before */}
      <div className="sticky top-0 z-10 shrink-0 px-7 pt-16 pb-4 md:px-16">
        <h2 className="text-4xl font-bold mb-4 inline-block bg-gray-900/40 px-8 py-1 rounded-lg text-purple-100 [text-shadow:10px_7px_3px_rgba(0,0,0,0.9)] md:text-5xl">
          My Works
        </h2>
        <p className="text-lg text-white leading-relaxed [text-shadow:6px_4px_2px_rgba(0,0,0,0.9)] max-w-2xl">
          Following projects showcase my skills and experience through
          real-world examples of my work. Each project is briefly described
          with links to code repositories and live demos.
        </p>
      </div>

      <div
        ref={trackRef}
        className="flex flex-nowrap items-center gap-8 overflow-hidden will-change-transform pl-[6vw]"
        style={{ height: 'calc(100vh - 14rem)', minWidth: 'max-content' }}
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.title + i} project={project} />
        ))}
        {/* Trailing spacer so the last card clears the right edge */}
        <div className="w-[10vw] shrink-0" />
      </div>

      <div className="absolute bottom-6 left-0 right-0 z-10 text-center text-gray-400 text-sm px-4">
        *If you like my works try adding a star to the github repositories, it
        motivates me a lot
      </div>
    </section>
  );
};

export default Projects;
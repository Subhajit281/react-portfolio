import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaSearch, FaStar, FaExternalLinkAlt, FaCode } from "react-icons/fa";
import PageTransition from "../components/PageTransition";

const allProjects = [
  {
    title: "API Monitoring Platform",
    category: "Full Stack",
    duration: "2026",
    description:
      "A full-stack API monitoring platform that continuously tracks API uptime, response time, and availability. It supports secure authentication, scheduled health checks, incident tracking, email notifications, and API documentation.",
    imageUrl:
      "https://res.cloudinary.com/dyxbvlzcl/image/upload/v1783605791/Screenshot_2026-06-28_183432_1_bxtnwp.jpg",
    tags: [
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "Prisma",
      "Node-Cron",
      "Redis",
      "JWT",
      "Docker",
      "Swagger",
      "Render",
      "Vercel",
    ],
    githubUrl: "https://github.com/Subhajit281/API-Monitoring-Platform-Backend",
    liveUrl: "https://upflow-monitoring.vercel.app",
    featured: true,
  },
  {
    title: "AgenticAI Document Analyzer",
    category: "AI / Backend",
    duration: "2026",
    description:
      "An AI-powered document analysis platform that extracts, processes, and understands information from documents using OCR, Docling, and Large Language Models.",
    imageUrl:
      "https://res.cloudinary.com/dyxbvlzcl/image/upload/v1789456016/Screenshot_2026-08-25_123952_i77ggz.png",
    tags: ["Python", "Docling", "OCR", "LLM", "LangGraph"],
    githubUrl: "https://github.com/Subhajit281/AI-Doc-Analyzer.git",
    liveUrl: "https://github.com/Subhajit281/AI-Doc-Analyzer.git",
    featured: true,
    },
  {
    title: "CSS Website",
    category: "Frontend",
    duration: "2025",
    description:
      "Official website of the Computer Science Society, NIT Silchar. The platform provides event information, study resources, announcements, and society updates for students.",
    imageUrl:
      "https://res.cloudinary.com/dyxbvlzcl/image/upload/v1765553890/Screenshot_2025-12-12_211031_wzltor.png",
    tags: ["ReactJS", "TailwindCSS", "Javascript"],
    githubUrl: "https://github.com/ComputerScienceSoceityNITS/css-official-website-2025-26.git",
    liveUrl: "https://www.css-nits.in",
    featured: true,
  },
  {
    title: "Agroww CropCare",
    category: "Full Stack",
    duration: "2026",
    description:
      "An all-in-one fullstack platform to manage crops, get weather alerts, and make better farming decisions through a clean, intuitive dashboard.",
    imageUrl:
      "https://res.cloudinary.com/dyxbvlzcl/image/upload/v1769956624/agroww_oxe0b9.jpg",
    tags: ["ReactJS", "TailwindCSS", "Javascript", "MongoDB", "ExpressJS", "NodeJS"],
    githubUrl: "https://github.com/Subhajit281/Agroww-CropCare.git",
    liveUrl: "https://agroww-cropcare.onrender.com",
    featured: true,
  },
  {
    title: "2D Physics Simulator",
    category: "Systems & C++",
    duration: "2026",
    description:
      "A real-time executable 2D physics simulator for exploring motion, forces, collisions, and interactions through interactive visuals and hands-on simulations with a React and Electron frontend.",
    imageUrl:
      "https://res.cloudinary.com/dyxbvlzcl/image/upload/v1777277718/Screenshot_2026-04-27_134913_aividh.png",
    tags: ["C++", "Javascript", "SFML", "ReactJS", "NodeJS", "CMake", "Electron"],
    githubUrl: "https://github.com/Subhajit281/PhysicsSimulator.git",
    liveUrl: "",
    featured: false,
  },
  {
    title: "3D Portfolio",
    category: "Frontend",
    duration: "2026",
    description:
      "A modern interactive 3D portfolio project built using React.js, Tailwind CSS, and Framer Motion to showcase projects, skills, education, and professional experience.",
    imageUrl:
      "https://res.cloudinary.com/dyxbvlzcl/image/upload/v1770632976/portfolio_gi54sk.png",
    tags: ["ReactJS", "TailwindCSS", "Framer Motion", "Javascript"],
    githubUrl: "https://github.com/Subhajit281/react-portfolio.git",
    liveUrl: "https://subhajit-sarkar.vercel.app",
    featured: false,
  },
];

const CATEGORIES = ["All", "Full Stack", "Frontend", "Systems & C++"];

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some((tag) => tag.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <PageTransition>
      <div className="container max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
            <FaCode className="text-cyan-400" /> Engineering Portfolio
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Featured <span className="gradient-text-cyan">Works & Architecture</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            A comprehensive catalog of applications, distributed backends, algorithms, and real-time systems I've designed and engineered.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  selectedCategory === cat
                    ? "bg-cyan-500 text-slate-950 border-cyan-400 font-semibold shadow-lg shadow-cyan-500/25 scale-[1.02]"
                    : "bg-slate-900/60 text-slate-300 border-white/10 hover:border-cyan-400/50 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tech or project..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900/70 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-white/5">
            <p className="text-slate-400 text-lg">No projects found matching "{searchQuery}".</p>
            <button
              onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
              className="mt-4 text-cyan-400 text-sm hover:underline font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="group relative rounded-2xl bg-slate-900/50 border border-white/10 hover:border-cyan-400/40 backdrop-blur-md overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1"
                >
                  {/* Image container */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Category pill */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-slate-950/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                        {project.category}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`GitHub repo for ${project.title}`}
                          className="w-9 h-9 rounded-full bg-slate-900/80 hover:bg-cyan-500 hover:text-slate-950 text-white flex items-center justify-center border border-white/10 transition-all duration-200 backdrop-blur-md shadow-md"
                        >
                          <FaGithub className="text-base" />
                        </a>
                      )}
                      {project.liveUrl && project.liveUrl !== "#" && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Live demo for ${project.title}`}
                          className="w-9 h-9 rounded-full bg-slate-900/80 hover:bg-cyan-500 hover:text-slate-950 text-white flex items-center justify-center border border-white/10 transition-all duration-200 backdrop-blur-md shadow-md"
                        >
                          <FaExternalLinkAlt className="text-xs" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {project.title}
                        </h3>
                        <span className="text-xs font-mono text-slate-400">
                          {project.duration}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed mb-6">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-300 border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* GitHub Star Motivation Banner */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-slate-900/80 via-indigo-950/40 to-slate-900/80 border border-cyan-500/20 backdrop-blur-md text-center max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="text-left">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <FaStar className="text-amber-400" /> Like what you see?
            </h4>
            <p className="text-slate-300 text-sm mt-1">
              Give a star to my GitHub repositories. It fuels continuous open-source building!
            </p>
          </div>
          <a
            href="https://github.com/Subhajit281"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all duration-200 flex items-center gap-2 shadow-lg shadow-cyan-500/25"
          >
            <FaGithub className="text-base" />
            Explore GitHub
          </a>
        </div>
      </div>
    </PageTransition>
  );
}

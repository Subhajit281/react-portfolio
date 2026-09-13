import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

import {
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaNodeJs,
  FaPython,
  FaDocker,
  FaGitAlt,
  FaGithub,
  FaFigma,
  FaSquareRootAlt
} from "react-icons/fa";

import {
  SiNextdotjs,
  SiTailwindcss,
  SiCplusplus,
  SiC,
  SiExpress,
  SiMysql,
  SiMongodb,
  SiFirebase,
  SiPostgresql,
  SiPrisma,
  SiRedis,
  SiSwagger,
  SiCloudinary,
  SiPostman,
  SiAxios,
  SiJsonwebtokens,
  SiAuth0,
  SiRender,
  SiVercel,
  SiVite,
  SiR,
} from "react-icons/si";

import { IoLogoJavascript } from "react-icons/io5";
import { VscVscode } from "react-icons/vsc";
import { TbApi, TbClock } from "react-icons/tb";

// reusable component for each interactive skill orb
const InteractiveBall = ({ skill }) => {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / rect.width;
    const deltaY = (e.clientY - centerY) / rect.height;
    setTilt({ rotateX: deltaY * -20, rotateY: deltaX * 20 });
  };

  const handleLeave = () => setTilt({ rotateX: 0, rotateY: 0 });

  return (
    <motion.div
      className="flex flex-col items-center justify-center floaty group cursor-pointer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        whileHover={{ scale: 1.15 }}
        animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
        transition={{ type: "spring", stiffness: 140, damping: 12 }}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-800/60 border border-white/10 group-hover:border-cyan-400/50 group-hover:bg-slate-800/90 flex items-center justify-center shadow-lg transition-colors duration-200"
      >
        <div className="text-2xl sm:text-3xl filter drop-shadow-md" style={{ transform: "translateZ(20px)" }}>
          {skill.icon}
        </div>
      </motion.div>
      <span className="mt-3 text-xs sm:text-sm font-medium text-slate-300 group-hover:text-cyan-300 transition-colors">
        {skill.name}
      </span>
    </motion.div>
  );
};

const categories = [
  {
    title: "Languages",
    skills: [
      { name: "C++", icon: <SiCplusplus className="text-blue-500" /> },
      { name: "C", icon: <SiC className="text-blue-600" /> },
      { name: "Python", icon: <FaPython className="text-yellow-400" /> },
      { name: "JavaScript", icon: <IoLogoJavascript className="text-yellow-400" /> },
      { name: "R", icon: <SiR className="text-blue-400" /> },
      { name: "SQL", icon: <SiMysql className="text-sky-400" /> },
      { name: "MATLAB", icon: <FaSquareRootAlt className="text-orange-400" /> },
    ],
  },
  {
    title: "Frontend",
    skills: [
      { name: "React Js", icon: <FaReact className="text-cyan-400" /> },
      { name: "Next Js", icon: <SiNextdotjs className="text-white" /> },
      { name: "JavaScript", icon: <IoLogoJavascript className="text-yellow-400" /> },
      { name: "HTML", icon: <FaHtml5 className="text-orange-500" /> },
      { name: "CSS", icon: <FaCss3Alt className="text-blue-500" /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss className="text-teal-400" /> },
      { name: "Vite", icon: <SiVite className="text-purple-400" /> },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node Js", icon: <FaNodeJs className="text-green-500" /> },
      { name: "Express Js", icon: <SiExpress className="text-white" /> },
      { name: "REST API", icon: <TbApi className="text-cyan-400" /> },
      { name: "JWT Authentication", icon: <SiJsonwebtokens className="text-pink-400" /> },
      { name: "OAuth 2.0", icon: <SiAuth0 className="text-orange-400" /> },
      { name: "Axios", icon: <SiAxios className="text-purple-400" /> },
      { name: "Node Cron", icon: <TbClock className="text-emerald-400" /> },
    ],
  },
  {
    title: "Databases & ORM",
    skills: [
      { name: "MongoDB", icon: <SiMongodb className="text-green-500" /> },
      { name: "MySQL", icon: <SiMysql className="text-blue-400" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="text-blue-400" /> },
      { name: "Prisma ORM", icon: <SiPrisma className="text-teal-300" /> },
      { name: "Redis", icon: <SiRedis className="text-red-500" /> },
      { name: "Firebase", icon: <SiFirebase className="text-yellow-400" /> },
    ],
  },
  {
    title: "DevOps & Cloud",
    skills: [
      { name: "Docker", icon: <FaDocker className="text-blue-400" /> },
      { name: "Git", icon: <FaGitAlt className="text-orange-500" /> },
      { name: "GitHub", icon: <FaGithub className="text-white" /> },
      { name: "Render", icon: <SiRender className="text-emerald-400" /> },
      { name: "Vercel", icon: <SiVercel className="text-white" /> },
    ],
  },
  {
    title: "Tools",
    skills: [
      { name: "Postman", icon: <SiPostman className="text-orange-400" /> },
      { name: "Swagger", icon: <SiSwagger className="text-green-400" /> },
      { name: "Cloudinary", icon: <SiCloudinary className="text-blue-400" /> },
      { name: "VS Code", icon: <VscVscode className="text-blue-400" /> },
      { name: "Figma", icon: <FaFigma className="text-pink-400" /> },
    ],
  },
];

const Skills = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="skills" className="bg-transparent text-white py-20 md:py-28">
      <div className="container max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
          Core Expertise
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
          Technical <span className="gradient-text-cyan">Skills</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
          Technologies, frameworks, and programming languages I work with to build full-stack solutions.
        </p>

        {/* Category Switcher */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat, i) => (
            <button
              key={cat.title}
              onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200
                ${
                  active === i
                    ? "bg-cyan-500 text-slate-950 border-cyan-400 font-semibold shadow-lg shadow-cyan-500/25 scale-[1.02]"
                    : "bg-slate-900/60 text-slate-300 border-white/10 hover:border-cyan-400/40 hover:text-white"
                }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Interactive panel */}
        <div className="rounded-2xl bg-slate-900/50 border border-white/10 p-8 sm:p-10 backdrop-blur-xl shadow-2xl shadow-black/40 min-h-[250px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-y-8 gap-x-4 w-full"
            >
              {categories[active].skills.map((skill, i) => (
                <InteractiveBall key={skill.name + i} skill={skill} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8">
          <Link
            to="/skills"
            className="text-cyan-400 hover:text-cyan-300 text-sm font-mono inline-flex items-center gap-1.5 hover:underline"
          >
            Explore Complete Technical Matrix →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Skills;
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    setTilt({ rotateX: deltaY * -25, rotateY: deltaX * 25 });
  };

  const handleLeave = () => setTilt({ rotateX: 0, rotateY: 0 });

  return (
    <motion.div
      className="flex flex-col items-center justify-center floaty"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        whileHover={{ scale: 1.1 }}
        animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center cursor-pointer"
      >
        <div className="text-2xl sm:text-3xl" style={{ transform: "translateZ(20px)" }}>
          {skill.icon}
        </div>
      </motion.div>
      <span className="mt-4 text-sm font-medium text-gray-300">{skill.name}</span>
    </motion.div>
  );
};

const categories = [
  {
    title: "Languages",
    skills: [
      { name: "C++", icon: <SiCplusplus className="text-blue-600" /> },
      { name: "C", icon: <SiC className="text-blue-700" /> },
      { name: "Python", icon: <FaPython className="text-yellow-500" /> },
      { name: "JavaScript", icon: <IoLogoJavascript className="text-yellow-400" /> },
      { name: "R", icon: <SiR className="text-blue-500" /> },
      { name: "SQL", icon: <SiMysql className="text-blue-500" /> },
      { name: "MATLAB", icon: <FaSquareRootAlt className="text-orange-500" /> },
    ],
  },
  {
    title: "Frontend",
    skills: [
      { name: "React Js", icon: <FaReact className="text-cyan-400" /> },
      { name: "Next Js", icon: <SiNextdotjs /> },
      { name: "JavaScript", icon: <IoLogoJavascript className="text-yellow-400" /> },
      { name: "HTML", icon: <FaHtml5 className="text-orange-500" /> },
      { name: "CSS", icon: <FaCss3Alt className="text-blue-500" /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss className="text-teal-500" /> },
      { name: "Vite", icon: <SiVite className="text-purple-500" /> },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node Js", icon: <FaNodeJs className="text-green-500" /> },
      { name: "Express Js", icon: <SiExpress /> },
      { name: "REST API", icon: <TbApi /> },
      { name: "JWT Authentication", icon: <SiJsonwebtokens className="text-pink-500" /> },
      { name: "OAuth 2.0", icon: <SiAuth0 className="text-orange-500" /> },
      { name: "Axios", icon: <SiAxios className="text-purple-500" /> },
      { name: "Node Cron", icon: <TbClock /> },
    ],
  },
  {
    title: "Databases & ORM",
    skills: [
      { name: "MongoDB", icon: <SiMongodb className="text-green-600" /> },
      { name: "MySQL", icon: <SiMysql className="text-blue-400" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="text-blue-500" /> },
      { name: "Prisma ORM", icon: <SiPrisma /> },
      { name: "Redis", icon: <SiRedis className="text-red-500" /> },
      { name: "Firebase", icon: <SiFirebase className="text-yellow-500" /> },
    ],
  },
  {
    title: "DevOps & Cloud",
    skills: [
      { name: "Docker", icon: <FaDocker className="text-blue-500" /> },
      { name: "Git", icon: <FaGitAlt className="text-orange-600" /> },
      { name: "GitHub", icon: <FaGithub /> },
      { name: "Render", icon: <SiRender className="text-emerald-500" /> },
      { name: "Vercel", icon: <SiVercel /> },
    ],
  },
  {
    title: "Tools",
    skills: [
      { name: "Postman", icon: <SiPostman className="text-orange-500" /> },
      { name: "Swagger", icon: <SiSwagger className="text-green-500" /> },
      { name: "Cloudinary", icon: <SiCloudinary className="text-blue-500" /> },
      { name: "VS Code", icon: <VscVscode className="text-blue-500" /> },
      { name: "Figma", icon: <FaFigma className="text-pink-500" /> },
    ],
  },
  
];

const Skills = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="skills" className="bg-transparent text-white py-20 md:py-32">
      <div className="container max-w-5xl mx-auto px-9 text-center">
        <h2 className="text-4xl font-bold mb-4 inline-block bg-gray-900/40 px-8 py-1 rounded-lg text-purple-100 [text-shadow:10px_7px_3px_rgba(0,0,0,0.9)]">
          Skills
        </h2>
        <p className="text-lg text-gray-300 mb-10">
          Here are some of my skills on which I have been working on.
        </p>

        {/* Category switcher — replaces the stacked boxes */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat, i) => (
            <button
              key={cat.title}
              onClick={() => setActive(i)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-300
                ${
                  active === i
                    ? "bg-cyan-400 text-gray-900 border-cyan-400 shadow-lg shadow-cyan-400/40"
                    : "bg-gray-900/40 text-gray-300 border-gray-700 hover:border-cyan-400 hover:text-cyan-300"
                }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Fixed-height panel — content swaps, layout never grows */}
        <div className="bg-gray-900/40 border-b border-cyan-400 shadow-xl shadow-cyan-300/30 rounded-lg p-6 min-h-[220px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-y-10 gap-x-0 w-full"
            >
              {categories[active].skills.map((skill, i) => (
                <InteractiveBall key={skill.name + i} skill={skill} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Skills;
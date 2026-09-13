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
  FaSquareRootAlt,
  FaLayerGroup,
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
import PageTransition from "../components/PageTransition";

const skillCategories = [
  {
    title: "Languages",
    description: "Core programming languages for algorithmic problem solving and software systems.",
    skills: [
      { name: "C++", icon: <SiCplusplus className="text-blue-500" />, level: "Advanced" },
      { name: "C", icon: <SiC className="text-blue-600" />, level: "Proficient" },
      { name: "Python", icon: <FaPython className="text-yellow-400" />, level: "Advanced" },
      { name: "JavaScript", icon: <IoLogoJavascript className="text-yellow-400" />, level: "Advanced" },
      { name: "R", icon: <SiR className="text-blue-400" />, level: "Intermediate" },
      { name: "SQL", icon: <SiMysql className="text-sky-400" />, level: "Advanced" },
      { name: "MATLAB", icon: <FaSquareRootAlt className="text-orange-400" />, level: "Academic" },
    ],
  },
  {
    title: "Frontend",
    description: "Modern UI/UX frameworks, state management, responsive designs, and animations.",
    skills: [
      { name: "React.js", icon: <FaReact className="text-cyan-400" />, level: "Advanced" },
      { name: "Next.js", icon: <SiNextdotjs className="text-white" />, level: "Proficient" },
      { name: "Tailwind CSS", icon: <SiTailwindcss className="text-teal-400" />, level: "Advanced" },
      { name: "HTML5", icon: <FaHtml5 className="text-orange-500" />, level: "Advanced" },
      { name: "CSS3", icon: <FaCss3Alt className="text-blue-500" />, level: "Advanced" },
      { name: "Vite", icon: <SiVite className="text-purple-400" />, level: "Advanced" },
    ],
  },
  {
    title: "Backend",
    description: "High-performance REST APIs, background workers, authentication, and server architecture.",
    skills: [
      { name: "Node.js", icon: <FaNodeJs className="text-green-500" />, level: "Advanced" },
      { name: "Express.js", icon: <SiExpress className="text-white" />, level: "Advanced" },
      { name: "REST API", icon: <TbApi className="text-cyan-400" />, level: "Advanced" },
      { name: "JWT Authentication", icon: <SiJsonwebtokens className="text-pink-400" />, level: "Proficient" },
      { name: "OAuth 2.0", icon: <SiAuth0 className="text-orange-400" />, level: "Proficient" },
      { name: "Axios", icon: <SiAxios className="text-purple-400" />, level: "Advanced" },
      { name: "Node Cron", icon: <TbClock className="text-emerald-400" />, level: "Proficient" },
    ],
  },
  {
    title: "Databases & ORM",
    description: "Relational, document, and in-memory databases with schema design and query optimization.",
    skills: [
      { name: "PostgreSQL", icon: <SiPostgresql className="text-blue-400" />, level: "Advanced" },
      { name: "MongoDB", icon: <SiMongodb className="text-green-500" />, level: "Advanced" },
      { name: "MySQL", icon: <SiMysql className="text-blue-400" />, level: "Proficient" },
      { name: "Prisma ORM", icon: <SiPrisma className="text-teal-300" />, level: "Advanced" },
      { name: "Redis", icon: <SiRedis className="text-red-500" />, level: "Proficient" },
      { name: "Firebase", icon: <SiFirebase className="text-yellow-400" />, level: "Proficient" },
    ],
  },
  {
    title: "DevOps & Cloud",
    description: "Containerization, version control, automated CI/CD, and deployment infrastructure.",
    skills: [
      { name: "Docker", icon: <FaDocker className="text-blue-400" />, level: "Proficient" },
      { name: "Git", icon: <FaGitAlt className="text-orange-500" />, level: "Advanced" },
      { name: "GitHub", icon: <FaGithub className="text-white" />, level: "Advanced" },
      { name: "Render", icon: <SiRender className="text-emerald-400" />, level: "Proficient" },
      { name: "Vercel", icon: <SiVercel className="text-white" />, level: "Advanced" },
    ],
  },
  {
    title: "Tools",
    description: "API testing, documentation, asset storage, and development toolchains.",
    skills: [
      { name: "Postman", icon: <SiPostman className="text-orange-400" />, level: "Advanced" },
      { name: "Swagger", icon: <SiSwagger className="text-green-400" />, level: "Proficient" },
      { name: "Cloudinary", icon: <SiCloudinary className="text-blue-400" />, level: "Proficient" },
      { name: "VS Code", icon: <VscVscode className="text-blue-400" />, level: "Advanced" },
      { name: "Figma", icon: <FaFigma className="text-pink-400" />, level: "Intermediate" },
    ],
  },
];

export default function SkillsPage() {
  const [activeTab, setActiveTab] = useState("All");

  const displayedCategories =
    activeTab === "All"
      ? skillCategories
      : skillCategories.filter((cat) => cat.title === activeTab);

  return (
    <PageTransition>
      <div className="container max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
            <FaLayerGroup className="text-cyan-400" /> Technical Capabilities
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Skills & <span className="gradient-text-cyan">Tech Ecosystem</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            A comprehensive overview of languages, frameworks, databases, and engineering tools I leverage to build robust software systems.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {["All", ...skillCategories.map((c) => c.title)].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                activeTab === tab
                  ? "bg-cyan-500 text-slate-950 border-cyan-400 font-semibold shadow-lg shadow-cyan-500/25 scale-[1.02]"
                  : "bg-slate-900/60 text-slate-300 border-white/10 hover:border-cyan-400/50 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Categories Stack */}
        <div className="space-y-12">
          {displayedCategories.map((cat, catIdx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: catIdx * 0.08 }}
              className="rounded-2xl bg-slate-900/40 border border-white/10 p-6 sm:p-8 backdrop-blur-md shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 pb-4 border-b border-white/5">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                    {cat.title}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">{cat.description}</p>
                </div>
                <span className="text-xs font-mono text-cyan-400/80 mt-2 sm:mt-0 font-medium">
                  {cat.skills.length} skills listed
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {cat.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-4 rounded-xl bg-slate-800/40 border border-white/5 hover:border-cyan-400/40 hover:bg-slate-800/70 transition-all duration-200 group flex flex-col items-center text-center gap-3 shadow-sm hover:shadow-md hover:shadow-cyan-500/10"
                  >
                    <div className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-200">
                      {skill.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {skill.name}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mt-0.5">
                        {skill.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}


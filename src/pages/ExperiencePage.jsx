import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaBriefcase, FaGraduationCap } from "react-icons/fa";
import PageTransition from "../components/PageTransition";

const experiences = [
  {
    date: "May 2025 - Present",
    title: "React Developer",
    company: "NIT Silchar",
    description:
      "Specializes in building dynamic and interactive user interfaces for web and mobile applications using the React.js library. This involves designing and implementing UI components, translating designs into functional code, and optimizing application performance for a seamless user experience.",
    skills: ["AI Agent", "Web Services", "React"],
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLZDp9FHrjfeJUMVQUOuLss5bUzT0QGWcaZA&s",
  },
  {
    date: "May 2024 - Present",
    title: "Fullstack Developer",
    company: "NIT Silchar",
    description:
      "A passion for creating dynamic, full-featured web applications. Proficient in both front-end and back-end development. Eager to apply and expand my skills on impactful projects.",
    skills: ["ExpressJS", "Javascript", "MERN"],
    imageUrl:
      "https://w7.pngwing.com/pngs/551/946/png-transparent-computer-icons-web-development-software-developer-software-development-icon-design-others-angle-text-logo.png",
  },
  {
    date: "August 2025 - Present",
    title: "Computer Science Society",
    company: "Dev wing",
    description:
      "Currently expanding knowledge in server-side development, complemented by a practical understanding of modern frontend technologies to deliver seamless full-stack applications.",
    skills: ["Frontend development", "Backend development"],
    imageUrl:
      "https://media.licdn.com/dms/image/v2/C4D0BAQGdVxGBlcBALw/company-logo_200_200/company-logo_200_200/0/1674410109310?e=2147483647&v=beta&t=C42T0OBD3fjGoiDHZ1nYkcWO8GFV06Ka0eksNV0LYB8",
  },
  {
    date: "February 2026 - May 2026",
    title: "Tech Content Writer",
    company: "Smartly Creators Program (GirlScript Foundation)",
    description:
      "Contributing as a tech content writer by creating clear, engaging, and beginner-friendly technical articles and documentation. Focused on simplifying complex computer science concepts and promoting tech awareness through structured and impactful content.",
    skills: ["Technical Writing", "Content Creation", "Computer Science Fundamentals"],
    imageUrl:
      "https://res.cloudinary.com/dyxbvlzcl/image/upload/v1771739279/images_v3ov9v.png",
  },
];

const educations = [
  {
    duration: "2024 - 2028",
    degree: "Bachelor of Technology - B.Tech",
    field: "Computer Science and Engineering",
    school: "National Institute of Technology Silchar",
    description:
      "Relevant Coursework: Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Operating Systems, Computer Networks.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrnjsjV_R7jIg0IyXmq0wJRUvt_t1thtTYFA&s",
  },
  {
    duration: "2022 - 2024",
    degree: "Higher Secondary Education (12th Grade)",
    field: "Science Stream",
    school: "Jawahar Navodaya Vidyalaya, Bengaluru Urban",
    description:
      "Focused on Physics, Chemistry, Mathematics, and Computer Science, achieving a strong academic foundation for my engineering studies.",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/Jawahar_Navodaya_Vidyalaya_logo.png/250px-Jawahar_Navodaya_Vidyalaya_logo.png",
  },
  {
    duration: "2017 - 2022",
    degree: "Higher Secondary Education (10th Grade)",
    field: "Science Stream",
    school: "Jawahar Navodaya Vidyalaya, Sonitpur",
    description:
      "Focused on a variety of subjects, achieving a strong academic foundation for my further studies.",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/Jawahar_Navodaya_Vidyalaya_logo.png/250px-Jawahar_Navodaya_Vidyalaya_logo.png",
  },
];

export default function ExperiencePage() {
  const [tab, setTab] = useState("all");

  return (
    <PageTransition>
      <div className="container max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
            <FaBriefcase className="text-cyan-400" /> Career & Education
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Professional <span className="gradient-text-cyan">Journey & Timeline</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            A chronological timeline of hands-on engineering roles, collegiate society contributions, and academic excellence.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-3 mb-14">
          <button
            onClick={() => setTab("all")}
            className={`px-5 py-2 rounded-xl text-sm font-medium border transition-all ${
              tab === "all"
                ? "bg-cyan-500 text-slate-950 border-cyan-400 font-semibold shadow-lg shadow-cyan-500/25"
                : "bg-slate-900/60 text-slate-300 border-white/10 hover:border-cyan-400/40 hover:text-white"
            }`}
          >
            All Milestones
          </button>
          <button
            onClick={() => setTab("experience")}
            className={`px-5 py-2 rounded-xl text-sm font-medium border transition-all flex items-center gap-2 ${
              tab === "experience"
                ? "bg-cyan-500 text-slate-950 border-cyan-400 font-semibold shadow-lg shadow-cyan-500/25"
                : "bg-slate-900/60 text-slate-300 border-white/10 hover:border-cyan-400/40 hover:text-white"
            }`}
          >
            <FaBriefcase className="text-xs" /> Work Experience
          </button>
          <button
            onClick={() => setTab("education")}
            className={`px-5 py-2 rounded-xl text-sm font-medium border transition-all flex items-center gap-2 ${
              tab === "education"
                ? "bg-cyan-500 text-slate-950 border-cyan-400 font-semibold shadow-lg shadow-cyan-500/25"
                : "bg-slate-900/60 text-slate-300 border-white/10 hover:border-cyan-400/40 hover:text-white"
            }`}
          >
            <FaGraduationCap className="text-sm" /> Education
          </button>
        </div>

        {/* Experience Section */}
        {(tab === "all" || tab === "experience") && (
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <FaBriefcase />
              </span>
              Work & Society Experience
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {experiences.map((exp, idx) => (
                <motion.div
                  key={exp.title + idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  className="rounded-2xl bg-slate-900/40 border border-white/10 hover:border-cyan-400/40 p-6 sm:p-8 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={exp.imageUrl}
                        alt={exp.company}
                        className="w-12 h-12 rounded-xl object-cover border border-white/10"
                      />
                      <div>
                        <span className="text-xs font-mono text-cyan-400 font-medium">
                          {exp.date}
                        </span>
                        <h3 className="text-lg font-bold text-white">{exp.title}</h3>
                        <p className="text-sm font-semibold text-slate-400">{exp.company}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6">
                      {exp.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                    {exp.skills.map((s) => (
                      <span
                        key={s}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-800/60 text-slate-300 border border-white/5"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {(tab === "all" || tab === "education") && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <FaGraduationCap />
              </span>
              Academic Qualifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {educations.map((edu, idx) => (
                <motion.div
                  key={edu.degree + idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  className="rounded-2xl bg-slate-900/40 border border-white/10 hover:border-indigo-400/40 p-6 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={edu.imageUrl}
                        alt={edu.school}
                        className="w-11 h-11 rounded-lg object-contain bg-white/10 p-1 border border-white/10"
                      />
                      <div>
                        <span className="text-xs font-mono text-cyan-400 font-medium">
                          {edu.duration}
                        </span>
                        <h3 className="text-base font-bold text-white leading-snug">
                          {edu.degree}
                        </h3>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-300 mb-2">
                      {edu.field}
                    </p>
                    <p className="text-xs italic text-slate-400 mb-4">{edu.school}</p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {edu.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}


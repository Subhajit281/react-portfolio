import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Experience = () => {
  const experiences = [
    {
      date: 'May 2025 - Present',
      title: 'React Developer',
      company: 'NIT Silchar',
      description:
        'Specializes in building dynamic and interactive user interfaces for web and mobile applications using the React.js library. This involves designing and implementing UI components, translating designs into functional code, and optimizing application performance for a seamless user experience.',
      skills: ['AI Agent', 'Web Services', 'React'],
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLZDp9FHrjfeJUMVQUOuLss5bUzT0QGWcaZA&s',
    },
    {
      date: 'May 2024 - Present',
      title: 'Fullstack Developer',
      company: 'NIT Silchar',
      description:
        'A passion for creating dynamic, full-featured web applications. Proficient in both front-end and back-end development. Eager to apply and expand my skills on impactful projects.',
      skills: ['ExpressJS', 'Javascript', 'MERN'],
      imageUrl:
        'https://w7.pngwing.com/pngs/551/946/png-transparent-computer-icons-web-development-software-developer-software-development-icon-design-others-angle-text-logo.png',
    },
    {
      date: 'August 2025 - Present',
      title: 'Computer Science Society',
      company: 'Dev wing',
      description:
        'Currently expanding knowledge in server-side development, complemented by a practical understanding of modern frontend technologies to deliver seamless full-stack applications.',
      skills: ['Frontend development', 'Backend development'],
      imageUrl:
        'https://media.licdn.com/dms/image/v2/C4D0BAQGdVxGBlcBALw/company-logo_200_200/company-logo_200_200/0/1674410109310?e=2147483647&v=beta&t=C42T0OBD3fjGoiDHZ1nYkcWO8GFV06Ka0eksNV0LYB8',
    },
    {
      date: 'February 2026 - May 2026',
      title: 'Tech Content Writer',
      company: 'Smartly Creators Program (GirlScript Foundation)',
      description:
        'Contributing as a tech content writer by creating clear, engaging, and beginner-friendly technical articles and documentation. Focused on simplifying complex computer science concepts and promoting tech awareness through structured and impactful content.',
      skills: ['Technical Writing', 'Content Creation', 'Computer Science Fundamentals'],
      imageUrl:
        'https://res.cloudinary.com/dyxbvlzcl/image/upload/v1771739279/images_v3ov9v.png',
    },
  ];

  return (
    <section id="experience" className="bg-transparent text-white py-20 md:py-28">
      <div className="container max-w-6xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
          Career Milestones
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
          Work <span className="gradient-text-cyan">Experience</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 mb-16 max-w-2xl mx-auto">
          Engineering roles and student society contributions focused on building scalable, user-centric software.
        </p>

        <div className="relative">
          {/* Vertical Timeline Spine Line (Desktop only) */}
          <div className="absolute left-1/2 top-0 h-full -translate-x-1/2 hidden md:block">
            <div className="absolute inset-0 w-[2px] bg-gradient-to-b from-cyan-400 via-indigo-500 to-cyan-400 blur-sm opacity-70" />
            <div className="relative w-[2px] h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
          </div>

          {experiences.map((exp, index) => (
            <div
              key={index}
              className="relative mb-12 flex flex-col items-center md:items-stretch"
            >
              {/* Timeline Node Icon */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="relative md:absolute md:left-1/2 md:top-6 md:-translate-x-1/2 
                           w-14 h-14 bg-slate-950 rounded-2xl border-2 border-cyan-400 
                           flex items-center justify-center z-10 overflow-hidden mb-4 md:mb-0 shadow-lg shadow-cyan-500/30"
              >
                <img
                  src={exp.imageUrl}
                  alt={`${exp.company} logo`}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Card wrapper */}
              <div
                className={`w-full flex justify-center ${
                  index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-lg md:w-[42%] p-6 sm:p-8 
                             rounded-2xl border border-white/10 hover:border-cyan-400/40 
                             bg-slate-900/60 backdrop-blur-xl 
                             transition-all duration-300 shadow-2xl shadow-black/40 hover:-translate-y-1 text-left"
                >
                  <span className="text-xs font-mono text-cyan-400 font-semibold mb-1 block">
                    {exp.date}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-1">{exp.title}</h3>
                  <p className="text-sm font-semibold text-slate-400 mb-4">
                    {exp.company}
                  </p>
                  <p className="text-sm text-slate-300 mb-5 leading-relaxed">
                    {exp.description}
                  </p>

                  <div>
                    <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Core Tech:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-800/60 text-slate-300 border border-white/5"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            to="/experience"
            className="text-cyan-400 hover:text-cyan-300 text-sm font-mono inline-flex items-center gap-1.5 hover:underline"
          >
            View Complete Career Journey & Education →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Experience;

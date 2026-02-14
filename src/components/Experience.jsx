import React from 'react';
import { motion } from 'framer-motion';

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
  ];

  return (
    <section id="experience" className="bg-transparent text-white py-20 md:py-32">
      <div className="container max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-10 inline-block bg-gray-900/40 px-8 py-1 rounded-lg text-purple-100 [text-shadow:10px_7px_3px_rgba(0,0,0,0.9)]">
          Experience
        </h2>

        <p className="text-lg text-white mb-16 leading-relaxed [text-shadow:6px_4px_2px_rgba(0,0,0,0.9)]">
          My work experience on different projects.
        </p>

        <div className="relative">

          {/* 🔥 Enhanced Vertical Timeline Line (Desktop only) */}
          <div className="absolute left-1/2 top-0 h-full -translate-x-1/2 hidden md:block">
            {/* Glow layer */}
            <div
              className="absolute inset-0 w-[3px] 
                         bg-gradient-to-b from-cyan-200 via-cyan-400 to-cyan-200
                         blur-lg opacity-80"
            ></div>

            {/* Main animated line */}
            <div
              className="relative w-[3px] h-full 
                         bg-gradient-to-b from-transparent via-cyan-400 to-transparent
                         animate-pulse"
            ></div>
          </div>

          {experiences.map((exp, index) => (
            <div
              key={index}
              className="relative mb-12 flex flex-col items-center md:items-stretch"
            >
              {/* Timeline Node */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="relative md:absolute md:left-1/2 md:top-6 md:-translate-x-1/2 
                           w-16 h-16 bg-gray-100 rounded-full border-4 border-cyan-800 
                           flex items-center justify-center z-10 overflow-hidden mb-4 md:mb-0"
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
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-lg md:w-[40%] p-10 
                             border-b border-cyan-400 rounded-xl 
                             bg-gray-900/30 backdrop-blur-sm 
                             transition-all duration-300 transform hover:scale-105
                             shadow-xl shadow-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-400/60 
                             animated-gradient-border"
                >
                  <p className="text-sm text-cyan-400 mb-1">{exp.date}</p>
                  <h3 className="text-xl font-bold mb-2">{exp.title}</h3>
                  <p className="text-md font-semibold text-gray-300 mb-4">
                    {exp.company}
                  </p>
                  <p className="text-gray-300 mb-4 text-left">
                    {exp.description}
                  </p>

                  <div className="text-left">
                    <h4 className="font-semibold mb-2">Skills:</h4>
                    <ul className="list-disc list-inside text-gray-300">
                      {exp.skills.map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;

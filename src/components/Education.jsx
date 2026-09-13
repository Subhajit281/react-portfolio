import React from 'react';
import { motion } from 'framer-motion';

const Education = () => {
  const educationHistory = [
    {
      duration: '2024 - 2028',
      degree: 'Bachelor of Technology - B.Tech',
      field: 'Computer Science and Engineering',
      school: 'National Institute of Technology Silchar',
      description:
        'Relevant Coursework: Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Operating Systems, Computer Networks.',
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrnjsjV_R7jIg0IyXmq0wJRUvt_t1thtTYFA&s',
    },
    {
      duration: '2022 - 2024',
      degree: 'Higher Secondary Education (12th Grade)',
      field: 'Science Stream',
      school: 'Jawahar Navodaya Vidyalaya, Bengaluru Urban',
      description:
        'Focused on Physics, Chemistry, Mathematics, and Computer Science, achieving a strong academic foundation for my engineering studies.',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/82/Jawahar_Navodaya_Vidyalaya_logo.png/250px-Jawahar_Navodaya_Vidyalaya_logo.png',
    },
    {
      duration: '2017 - 2022',
      degree: 'Secondary Education (10th Grade)',
      field: 'General Science',
      school: 'Jawahar Navodaya Vidyalaya, Sonitpur',
      description:
        'Completed secondary education with a strong foundation in science and mathematics.',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/82/Jawahar_Navodaya_Vidyalaya_logo.png/250px-Jawahar_Navodaya_Vidyalaya_logo.png',
    },
  ];

  return (
    <section id="education" className="bg-transparent text-white py-20 md:py-28">
      <div className="container max-w-6xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
          Academic Background
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
          Education & <span className="gradient-text-cyan">Qualifications</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 mb-16 max-w-2xl mx-auto">
          Academic credentials and foundational coursework in computer science and engineering.
        </p>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Timeline Spine Line */}
          <div className="absolute left-1/2 top-0 h-full -translate-x-1/2 hidden md:block">
            <div className="absolute inset-0 w-[2px] bg-gradient-to-b from-indigo-500 via-cyan-400 to-indigo-500 blur-sm opacity-70" />
            <div className="relative w-[2px] h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
          </div>

          {educationHistory.map((edu, index) => (
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
                           w-14 h-14 bg-slate-950 rounded-2xl border-2 border-indigo-400 
                           flex items-center justify-center z-10 overflow-hidden mb-4 md:mb-0 shadow-lg shadow-indigo-500/30 p-1"
              >
                <img
                  src={edu.imageUrl}
                  alt={`${edu.school} logo`}
                  className="w-full h-full object-contain"
                />
              </motion.div>

              {/* Card Wrapper */}
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
                             rounded-2xl border border-white/10 hover:border-indigo-400/40 
                             bg-slate-900/60 backdrop-blur-xl 
                             transition-all duration-300 shadow-2xl shadow-black/40 hover:-translate-y-1 text-left"
                >
                  <span className="text-xs font-mono text-cyan-400 font-semibold mb-1 block">
                    {edu.duration}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-1">{edu.degree}</h3>
                  <p className="text-sm font-semibold text-slate-300 mb-1">
                    {edu.field}
                  </p>
                  <p className="text-xs font-mono italic text-slate-400 mb-4">{edu.school}</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{edu.description}</p>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;

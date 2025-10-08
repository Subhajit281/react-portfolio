import React from 'react';
import { motion } from 'framer-motion';

const Education = () => {
  const educationHistory = [
    {
      duration: '2024 - 2028',
      degree: 'Bachelor of Technology - B.Tech',
      field: 'Computer Science and Engineering',
      school: 'National Institute of Technology Silchar',
      description: 'Relevant Coursework: Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Operating Systems, Computer Networks.',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrnjsjV_R7jIg0IyXmq0wJRUvt_t1thtTYFA&s',
    },
    {
      duration: '2022 - 2024',
      degree: 'Higher Secondary Education (12th Grade)',
      field: 'Science Stream',
      school: 'Jawahar Navodaya Vidyalaya, Bengaluru Urban',
      description: 'Focused on Physics, Chemistry, Mathematics, and Computer Science, achieving a strong academic foundation for my engineering studies.',
      imageUrl: 'https://pbs.twimg.com/profile_images/1713141670886133760/l0-yb5OB_400x400.png',
    },
    {
      duration: '2017 - 2022',
      degree: 'Higher Secondary Education (10th Grade)',
      field: 'Science Stream',
      school: 'Jawahar Navodaya Vidyalaya, Sonitpur',
      description: 'Focused on a variety of subjects, achieving a strong academic foundation for my further studies.',
      imageUrl: 'https://pbs.twimg.com/profile_images/1713141670886133760/l0-yb5OB_400x400.png',
    },
  ];

  return (
    <section id="education" className="bg-transparent text-white py-20 md:py-32">
      <div className="container max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-10 inline-block bg-gray-900/40 px-8 py-1 rounded-lg text-purple-100 [text-shadow:10px_7px_3px_rgba(0,0,0,0.9)]">Education</h2>
        <p className="text-lg text-white mb-16 leading-relaxed [text-shadow:6px_4px_2px_rgba(0,0,0,0.9)]">
          My academic journey and qualifications.
        </p>

        {/* Timeline Container */}
        <div className="relative">
          {/* The Vertical Line */}
          <div className="absolute left-1/2 top-0 h-full w-1 bg-gray-700 -translate-x-1/2 hidden md:block"></div>

          {/* Map over the educationHistory array */}
          {educationHistory.map((edu, index) => (
            // This wrapper correctly stacks the node and card on mobile
            <div key={index} className="relative mb-12 flex flex-col items-center md:items-stretch">
              {/* Timeline Node  */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative md:absolute md:left-1/2 md:top-4 md:-translate-x-1/2 w-16 h-16 bg-gray-100 border-gray-100 rounded-full flex items-center justify-center z-10 border-4 overflow-hidden mb-4 md:mb-0"
              >
                <img 
                  src={edu.imageUrl} 
                  alt={`${edu.school} logo`} 
                  className="w-full h-full object-contain p-1" // Use object-contain for logos
                />
              </motion.div>

              {/* This wrapper correctly handles the alignment on desktop and centers on mobile */}
              <div
                className={`w-full flex justify-center ${
                  index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'
                }`}
              >
                {/* Education Card */}
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-lg md:w-[45%] p-10 rounded-lg bg-gray-900/50 transition-all duration-300 transform hover:scale-105 
                             shadow-xl shadow-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-400/50 animated-gradient-border"
                >
                  <p className="text-sm text-cyan-400 mb-1">{edu.duration}</p>
                  <h3 className="text-xl font-bold mb-1">{edu.degree}</h3>
                  <p className="text-md font-semibold text-gray-300 mb-3">{edu.field}</p>
                  <p className="italic text-gray-300 mb-4">{edu.school}</p>
                  <p className="text-gray-300 text-center">{edu.description}</p>
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


import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';

const Projects = () => {
  const projects = [
    {
      title: 'CSS Website',
      description: 'A web-based platform for students that allows them to search for any materials and knows about the upcoming events and happenings  in the branch.',
      imageUrl: 'https://res.cloudinary.com/dyxbvlzcl/image/upload/v1765553890/Screenshot_2025-12-12_211031_wzltor.png', 
      tags: ['ReactJS', 'TailwindCSS', 'Javascript'],
      githubUrl: 'https://github.com/ComputerScienceSoceityNITS/css-official-website-2025-26.git',
      liveUrl: 'https://www.css-nits.in',
    },

    {
      title: 'Agroww CropCare',
      description: 'An all-in-one fullstack platform to manage crops, get weather alerts, and to make better farming decisions.',
      imageUrl: 'https://res.cloudinary.com/dyxbvlzcl/image/upload/v1769956624/agroww_oxe0b9.jpg',
      tags: ['ReactJS', 'TailwindCSS', 'Javascript',"MongoDB", "ExpressJS","NodeJS"],
      githubUrl: 'https://github.com/Subhajit281/Agroww-CropCare.git',
      liveUrl: 'https://agroww-cropcare.onrender.com',
    },

    {
      title: '3D Portfolio',
      description: 'A 3D portfolio project built after learning Reactjs and implementing cool animations from Framer Motion.',
      imageUrl: 'https://res.cloudinary.com/dyxbvlzcl/image/upload/v1765553606/Screenshot_2025-12-12_210517_ehytem.png',
      tags: ['ReactJS', 'TailwindCSS', 'Javascript'],
      githubUrl: 'https://github.com/Subhajit281/react-portfolio.git',
      liveUrl: 'https://subhajit-sarkar.vercel.app',
    },
    
    // Add more projects here
  ];

  return (
    <section id="projects" className="bg-transparent text-white py-20 md:py-32">
      <div className="container max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-8 inline-block bg-gray-900/40 px-8 py-1 rounded-lg text-purple-100 [text-shadow:10px_7px_3px_rgba(0,0,0,0.9)]">My Works</h2>
        <p className="text-lg text-white mb-16 leading-relaxed [text-shadow:6px_4px_2px_rgba(0,0,0,0.9)] max-w-3xl">
          Following projects showcases my skills and experience through real-world examples of my work. Each project is briefly described with links to code repositories and live demos.
        </p>

        {/*  Grid for Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="rounded-lg bg-gray-900/30 border-b border-cyan-400 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 
                         shadow-xl shadow-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-400/60 animated-gradient-border overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }} //  hover moving effect
            >
              <div className="relative">
                <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover" />
                {/* Icons in the top right */}
                <div className="absolute top-4 right-4 flex gap-3">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-white text-2xl hover:text-cyan-400 transition-colors">
                    <FaGithub />
                  </a>
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-white text-2xl hover:text-cyan-400 transition-colors">
                    <FiExternalLink />
                  </a>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="bg-cyan-900/50 text-cyan-400 text-sm font-medium px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-14 text-gray-400 text-sm" >*If you like my works try adding a star to the github repositories, it motivates me a lot</div>
    </section>
  );
};

export default Projects;


import React, { useState } from "react";
import { motion } from "framer-motion";

// All necessary icons, consolidated from our previous discussions
import {
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaNodeJs,
  FaPython,
  FaDocker,
  FaJava,
} from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io5";
import {
  SiTailwindcss,
  SiNextdotjs,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiFirebase,
  SiCplusplus,
  SiC,
  SiTensorflow,
  SiPytorch,
  SiOpencv,
  SiJupyter,
} from "react-icons/si";


// This is the reusable component for each interactive skill orb
const InteractiveBall = ({ skill }) => {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [gradient, setGradient] = useState("50% 50%");

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / rect.width;
    const deltaY = (e.clientY - centerY) / rect.height;

    setTilt({ rotateX: deltaY * -25, rotateY: deltaX * 25 });

    const xPercent = 50 + deltaX * 50;
    const yPercent = 50 + deltaY * 50;
    setGradient(`${xPercent}% ${yPercent}%`);
  };

  const handleLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setGradient("50% 50%");
  };

  return (
    <div className="flex flex-col items-center justify-center floaty">
      <motion.div
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        whileHover={{ scale: 1.1 }}
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center 
                   shadow-lg shadow-cyan-400/60 border border-cyan-400/40 cursor-pointer"
        style={{
          background: `radial-gradient(circle at ${gradient}, rgba(34,216,238,0.35), rgba(17, 24, 39, 0.8))`,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="text-2xl sm:text-3xl" style={{ transform: "translateZ(20px)" }}>
          {skill.icon}
        </div>
      </motion.div>
      <span className="mt-4 text-sm font-medium text-gray-300">{skill.name}</span>
    </div>
  );
};

// This is the main component that lays out the entire skills section
const Skills = () => {
  const categories = [
    {
      title: "Frontend",
      skills: [
        { name: "React Js", icon: <FaReact className="text-cyan-400" /> },
        { name: "Next Js", icon: <SiNextdotjs /> },
        { name: "JavaScript", icon: <IoLogoJavascript className="text-yellow-400" /> },
        { name: "HTML", icon: <FaHtml5 className="text-orange-500" /> },
        { name: "CSS", icon: <FaCss3Alt className="text-blue-500" /> },
        { name: "TailwindCSS", icon: <SiTailwindcss className="text-teal-500" /> },
      ],
    },
    {
      title: "Languages",
      skills: [
        { name: "C++", icon: <SiCplusplus className="text-blue-600" /> },
        { name: "C", icon: <SiC className="text-blue-700" /> },
        { name: "Python", icon: <FaPython className="text-yellow-500" /> },
        { name: "JavaScript", icon: <IoLogoJavascript className="text-yellow-400" /> },
        { name: "Java", icon: <FaJava className="text-red-500" /> },
      ],
    },
    {
      title: "Backend & Services",
      skills: [
        { name: "Node Js", icon: <FaNodeJs className="text-green-500" /> },
        { name: "Express Js", icon: <SiExpress /> },
        { name: "MySQL", icon: <SiMysql className="text-blue-400" /> },
        { name: "MongoDB", icon: <SiMongodb className="text-green-600" /> },
        { name: "Firebase", icon: <SiFirebase className="text-yellow-500" /> },
        { name: "Docker", icon: <FaDocker className="text-blue-500" /> },
      ],
    },
    {
      title: "Machine Learning",
      skills: [
        { name: "Python", icon: <FaPython className="text-yellow-500" /> },
        { name: "Jupyter", icon: <SiJupyter className="text-orange-400" /> },
        { name: "TensorFlow", icon: <SiTensorflow className="text-orange-500" /> },
        { name: "PyTorch", icon: <SiPytorch className="text-red-500" /> },
        { name: "OpenCV", icon: <SiOpencv className="text-blue-400" /> },
      ],
    },
  ];

  return (
    <section id="skills" className="bg-transparent text-white py-20 md:py-32">
      <div className="container max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">Skills</h2>
        <p className="text-lg text-gray-400 mb-12">
          Here are some of my skills on which I have been working on.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {categories.map((category, index) => (
            <div
              key={index}
              className=" bg-gray-900/40 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-cyan-300/40 hover:shadow-2xl hover:shadow-cyan-400/50 animated-gradient-border p-8 rounded-lg "
            >
              <h3 className="text-2xl font-semibold mb-8 text-cyan-400">
                {category.title}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-10 gap-x-4">
                {category.skills.map((skill, skillIndex) => (
                  <InteractiveBall key={skillIndex} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;


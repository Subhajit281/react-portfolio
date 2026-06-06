import React from 'react';
import myProfilePic from '../assets/Subhajit11 (2).png';
import Lottie from "lottie-react";
import hexagonAnimation from "../assets/hexagon.json";
import { TypeAnimation } from 'react-type-animation';
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

const Hero = () => {
    return (
        <div 
            id="home" 
            role="banner"
            className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-24 pb-12 md:px-12"
        >
            <Lottie
                animationData={hexagonAnimation}
                loop={true}
                autoplay={true}
                className="absolute top-[40%] md:top-1/2 left-1/2 md:left-3/4 -translate-x-1/2 -translate-y-1/2 w-full h-full md:w-[1000px] md:h-[1000px] z-0 opacity-80"
            />

            <div className="container max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between text-white">
                
                {/* Image Section */}
                <div className="flex-shrink-0 relative w-75 h-75 md:w-85 md:h-85 lg:w-96 lg:h-96 md:-translate-y-16 md:-translate-x-16 order-1 md:order-2 mb-8 md:mb-0">
                    
                    <div className="absolute inset-0 rounded-full bg-linear-to-br from-purple-600 via-indigo-900 to-fuchsia-600 
                                   filter blur-2xl opacity-60 z-10">
                    </div>

                    <div className="absolute inset-0 rounded-full overflow-hidden z-20">
                        <img
                            src={myProfilePic}
                            alt="Subhajit Sarkar - Web Developer, MERN Stack Developer, DSA and LeetCode Enthusiast"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                
                {/* Text Section */}
                <div className="flex-1 text-center md:text-left md:mr-10 order-2 md:order-1">
                    <p className="text-3xl md:text-4xl mb-2 font-bold text-indigo-200">
                        Hi, I am
                    </p>

                    <h1 itemProp="name" className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight text-blue-100">
                        Subhajit Sarkar
                    </h1>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-300 mb-6 h-12 md:h-16">
                        <span className="text-white">I am a </span>
                        <TypeAnimation
                            sequence={[
                                'Web Developer', 500,
                                'Problem Solver', 500,
                                'Lifelong Learner', 500,
                            ]}
                            wrapper="span"
                            speed={50}
                            repeat={Infinity}
                        />
                    </h2>

                    <p className="text-base md:text-lg text-white max-w-2xl mx-auto md:mx-0 leading-relaxed">
                        I’m a Computer Science and Engineering student at NIT Silchar, focused on building scalable web applications using modern technologies like React, Node.js, and MongoDB. I enjoy solving problems and continuously improving my development skills.
                    </p>

                    {/* Hidden SEO keywords */}
                    <p className="hidden">
                        Subhajit Sarkar portfolio, web developer, MERN stack developer, React developer, Node.js developer, 
                        JavaScript developer, frontend developer, backend developer, DSA, LeetCode problem solver, NIT Silchar India.
                    </p>

                    <a
                        href="/AndrewResumeWorkshop (3).pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open Subhajit Sarkar Web Developer Resume"
                        className="inline-flex items-center gap-3 bg-gray-900/40 border border-cyan-500 text-cyan-400 font-bold py-3 px-6 rounded-lg mt-8 text-lg 
                                   transition-all duration-300 transform hover:scale-105 
                                   shadow-lg shadow-cyan-300/50 hover:shadow-lg hover:shadow-cyan-400/60">
                        Check CV <FaArrowUpRightFromSquare />
                    </a>
                </div>

            </div>
        </div>
    )
}

export default Hero;

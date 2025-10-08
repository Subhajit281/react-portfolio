import React from 'react';
import myProfilePic from '../assets/Subhajit8.png';
import Lottie from "lottie-react";
import hexagonAnimation from "../assets/hexagon.json";
import { TypeAnimation } from 'react-type-animation';
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

const Hero = () => {
    return (
        <div id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-24 pb-12 md:px-12">
            <Lottie
                animationData={hexagonAnimation}
                loop={true}
                autoplay={true}
                // ✨ THIS IS THE LINE I'VE UPDATED FOR RESPONSIVE POSITIONING ✨
                className="absolute top-[40%] md:top-1/2 left-1/2 md:left-3/4 -translate-x-1/2 -translate-y-1/2 w-full h-full md:w-[1000px] md:h-[1000px] z-0 opacity-80"
            />

            {/* Main content container, aligned with navbar */}
            <div className="container max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between text-white">
                
                {/* Image Section (appears first on mobile) */}
                <div className="flex-shrink-0 relative w-75 h-75 md:w-85 md:h-85 lg:w-96 lg:h-96 md:-translate-y-16 md:-translate-x-16 order-1 md:order-2 mb-8 md:mb-0">
                    {/* Layer 1: The Glow (behind) */}
                    <div
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 via-indigo-900 to-fuchsia-600 
                                   filter blur-2xl opacity-60 z-10">
                    </div>
                    {/* Layer 2: The Sharp Image (on top) */}
                    <div className="absolute inset-0 rounded-full overflow-hidden z-20">
                        <img
                            src={myProfilePic}
                            alt="Subhajit"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                
                {/* Left section: text content (appears second on mobile) */}
                <div className="flex-1 text-center md:text-left md:mr-10 order-2 md:order-1">
                    <p className="text-2xl md:text-3xl mb-2 text-purple-100 [text-shadow:2px_2px_4px_rgba(0,0,0,0.7)]"> Hi, I am </p>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight text-blue-100 [text-shadow:2px_2px_4px_rgba(0,0,0,0.7)]"> Subhajit Sarkar</h1>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-300 mb-6 h-12 md:h-16 [text-shadow:2px_2px_4px_rgba(0,0,0,0.7)]">
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
                    <p className="text-base md:text-lg text-white max-w-2xl mx-auto md:mx-0 leading-relaxed [text-shadow:1px_1px_2px_rgba(0,0,0,0.7)]">
                        I’m a Computer Science and Engineering student at NIT Silchar, passionate about coding, problem-solving, and building projects. I love exploring new technologies and am always eager to learn and grow as a developer.
                    </p>
                    

                    <a
                        href="/CV.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-gray-900/40 border border-cyan-500 text-cyan-400 font-bold py-3 px-6 rounded-lg mt-8 text-lg 
                                   transition-all duration-300 transform hover:scale-105 
                                   shadow-lg shadow-cyan-300/20 hover:shadow-xl hover:shadow-cyan-400/30">
                        Check CV <FaArrowUpRightFromSquare />
                    </a>
                </div>

            </div>
        </div>
    )
}

export default Hero;


import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import Lottie from 'lottie-react';
import { FaPaperPlane, FaSpinner, FaCheckCircle, FaExclamationCircle, FaCopy, FaCheck } from 'react-icons/fa';
import contactAnimation from '../assets/Robot.json';
import contactAnimation2 from '../assets/paper plane.json'; 

const Contact = () => {
  const form = useRef();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState({ submitting: false, success: null, message: '' });
  const [copied, setCopied] = useState(false);
  const directEmail = "subhajitsarkar281@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(directEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, success: null, message: '' });

    emailjs.sendForm(
        'service_xfbzcp1',      // EmailJS Service ID
        'template_xw5vudo',     // EmailJS Template ID
        form.current,
        'TFePzcZ9_ZF8waaZd'     // EmailJS Public Key
      )
      .then(() => {
          setFormStatus({ submitting: false, success: true, message: 'Message sent successfully!' });
          setFormData({ name: '', email: '', message: '' });
      }, () => {
          setFormStatus({ submitting: false, success: false, message: 'Failed to send message. Please try again or email directly.' });
      });
  };

  return (
    <section id="contact" className="bg-transparent text-white py-20 md:py-28 overflow-hidden">
      <div className="container max-w-6xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
          Communication Channel
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
          Contact <span className="gradient-text-cyan">Me</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto">
          I'm always open to discussing new projects, creative ideas, or engineering opportunities to be part of your vision.
        </p>

        {/* Quick Email Pill Bar */}
        <div className="mb-12 inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md text-sm font-mono text-slate-300">
          <span className="text-cyan-400">Direct Email:</span>
          <span>{directEmail}</span>
          <button
            onClick={handleCopy}
            className="ml-2 flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-cyan-500/20 transition-all"
            aria-label="Copy email address"
          >
            {copied ? <FaCheck className="text-emerald-400" /> : <FaCopy />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-10 lg:gap-14">

          {/* Form */}
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-400/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/40 text-left transition-all duration-300">
              <form ref={form} onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="name" className="block mb-2 text-xs font-mono uppercase tracking-wider text-slate-300">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Subhajit"
                    className="w-full p-3 rounded-xl bg-slate-800/60 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2 text-xs font-mono uppercase tracking-wider text-slate-300">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    placeholder="user@example.com"
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-xl bg-slate-800/60 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block mb-2 text-xs font-mono uppercase tracking-wider text-slate-300">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    placeholder="Write your message or inquiry..."
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-xl bg-slate-800/60 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={formStatus.submitting}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {formStatus.submitting ? <FaSpinner className="animate-spin text-base" /> : <FaPaperPlane className="text-xs" />}
                  <span>{formStatus.submitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </motion.div>

          {/* Lottie Animations Container */}
          <motion.div
            className="w-full md:w-1/2 hidden md:flex flex-col items-center justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative w-full max-w-md h-80 md:h-96 mx-auto flex items-center justify-center">
              <Lottie 
                animationData={contactAnimation} 
                loop={true} 
                autoplay={true} 
                className="absolute w-[135%] h-[135%] z-20 pointer-events-none"
              />
              <Lottie 
                animationData={contactAnimation2} 
                loop={true} 
                autoplay={true} 
                className="absolute w-full h-full z-10 opacity-70 pointer-events-none"
              />
            </div>
          </motion.div>
        </div>

        {formStatus.message && (  
          <div className={`mt-8 text-sm p-4 rounded-xl flex items-center justify-center gap-2.5 max-w-lg mx-auto ${
            formStatus.success ? 'bg-emerald-950/50 border border-emerald-500/30 text-emerald-300' : 'bg-red-950/50 border border-red-500/30 text-red-300'
          }`}>
            {formStatus.success ? <FaCheckCircle className="shrink-0 text-base" /> : <FaExclamationCircle className="shrink-0 text-base" />}
            <span>{formStatus.message}</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import Lottie from 'lottie-react';
import { FaPaperPlane, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import contactAnimation from '../assets/Robot.json';
import contactAnimation2 from '../assets/paper plane.json'; 


const Contact = () => {
  const form = useRef();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState({ submitting: false, success: null, message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, success: null, message: '' });

    emailjs.sendForm(
        'service_xfbzcp1',      //  EmailJS Service ID
        'template_xw5vudo',     // EmailJS Template ID
        form.current,
        'TFePzcZ9_ZF8waaZd'      //  EmailJS Public Key
      )
      .then((result) => {
          console.log(result.text);
          setFormStatus({ submitting: false, success: true, message: 'Message sent successfully!' });
          setFormData({ name: '', email: '', message: '' }); // Clear the form
      }, (error) => {
          console.log(error.text);
          setFormStatus({ submitting: false, success: false, message: 'Failed to send message. Please try again.' });
      });
  };

  return (
    <section id="contact" className="bg-transparent text-white py-20 md:py-32 overflow-hidden">
      <div className="container max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-10 inline-block bg-gray-900/40 px-8 py-1 rounded-lg text-purple-100 [text-shadow:10px_7px_3px_rgba(0,0,0,0.9)]">Contact Me</h2>
        <p className="text-lg text-white mb-16 leading-relaxed [text-shadow:6px_4px_2px_rgba(0,0,0,0.9)] ">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12">

          {/* On mobile, the form will now take up the full width */}
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative border-t  rounded-lg bg-gray-900/60 border-b border-cyan-400 transition-all duration-300 transform hover:scale-105 
                           shadow-xl shadow-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-400/50 animated-gradient-border p-[1px] ">
              <div className=" w-full h-full rounded-md p-8">
                <form ref={form} onSubmit={handleSubmit} className="text-left">
                  <div className="mb-6">
                    <label htmlFor="name" className="block mb-2 text-lg font-medium text-gray-100">Your Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="bg-gray-800/50 border border-cyan-500 text-white text-md rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-3"/>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="email" className="block mb-2 text-lg font-medium text-gray-100">Your Email</label>
                    <input type="email" id="email" name="email" value={formData.email} placeholder="Your username" onChange={handleChange} required className="bg-gray-800/50 border border-cyan-500 text-white text-md rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-3"/>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="message" className="block mb-2 text-lg font-medium text-gray-100">Your Message</label>
                    <textarea id="message" name="message" rows="5" value={formData.message} placeholder="Do write your reviews on my website" onChange={handleChange} required className="bg-gray-800/50 border border-cyan-500 text-white text-md rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-3"></textarea>
                  </div>
                  <div className="text-center">
                    <button type="submit" disabled={formStatus.submitting} className="bg-gray-900/40 border border-cyan-500 text-cyan-400 font-bold py-3 px-6 rounded-lg mt-5 mb-10 text-lg 
                           transition-all duration-300 transform hover:scale-105 
                           shadow-lg shadow-cyan-300/20 hover:shadow-xl hover:shadow-cyan-400/30 inline-flex items-center gap-3 disabled:bg-gray-500 disabled:cursor-not-allowed">
                      {formStatus.submitting ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                      {formStatus.submitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="w-full md:w-1/2 hidden md:flex flex-col items-center"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-full max-w-md h-80 md:h-96 mx-auto">
              <Lottie 
                animationData={contactAnimation} 
                loop={true} 
                autoplay={true} 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] z-40 opacity-100"
              />
              <Lottie 
                animationData={contactAnimation2} 
                loop={true} 
                autoplay={true} 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-10 opacity-70"
              />
            </div>
          </motion.div>
        </div>

        {formStatus.message && (
          <div className={`mt-8 text-lg p-3 rounded-lg flex items-center justify-center gap-3 max-w-xl mx-auto ${formStatus.success ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
            {formStatus.success ? <FaCheckCircle /> : <FaExclamationCircle />}
            {formStatus.message}
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;


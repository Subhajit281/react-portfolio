import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  FaPaperPlane,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaEnvelope,
  FaCopy,
  FaCheck,
  FaGithub,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import { SiLeetcode, SiCodechef, SiCodeforces } from "react-icons/si";
import PageTransition from "../components/PageTransition";

export default function ContactPage() {
  const form = useRef();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState({ submitting: false, success: null, message: "" });
  const [copied, setCopied] = useState(false);

  const directEmail = "subhajitsarkar281@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(directEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, success: null, message: "" });

    emailjs
      .sendForm(
        "service_xfbzcp1",
        "template_xw5vudo",
        form.current,
        "TFePzcZ9_ZF8waaZd"
      )
      .then(
        () => {
          setFormStatus({
            submitting: false,
            success: true,
            message: "Thank you! Your message has been sent successfully.",
          });
          setFormData({ name: "", email: "", message: "" });
        },
        () => {
          setFormStatus({
            submitting: false,
            success: false,
            message: "Failed to send message. Please reach out directly at my email.",
          });
        }
      );
  };

  const socials = [
    { name: "GitHub", href: "https://github.com/Subhajit281", icon: <FaGithub /> },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/subhajit-sarkar-57aa432b1/", icon: <FaLinkedin /> },
    { name: "LeetCode", href: "https://leetcode.com/u/_vapourX", icon: <SiLeetcode /> },
    { name: "CodeChef", href: "https://www.codechef.com/users/subhajit_s_18", icon: <SiCodechef /> },
    { name: "Codeforces", href: "https://codeforces.com/profile/Subhajit_S", icon: <SiCodeforces /> },
    { name: "Instagram", href: "https://www.instagram.com/_search_for_it", icon: <FaInstagram /> },
  ];

  return (
    <PageTransition>
      <div className="container max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
            <FaEnvelope className="text-cyan-400" /> Let's Connect
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Get In <span className="gradient-text-cyan">Touch</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Whether you have a question about my projects, internship opportunities, engineering collaborations, or just want to connect—my inbox is always open.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Details & Socials Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Email Card */}
            <div className="rounded-2xl bg-slate-900/50 border border-white/10 p-6 backdrop-blur-md">
              <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider block mb-2">
                Direct Communication
              </span>
              <h3 className="text-xl font-bold text-white mb-2">Drop me a line</h3>
              <p className="text-slate-300 text-sm mb-5 leading-relaxed">
                Prefer email? Click below to copy my address directly to your clipboard.
              </p>

              <button
                onClick={handleCopyEmail}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-cyan-500/30 text-slate-200 text-sm font-mono transition-all group"
              >
                <span className="truncate">{directEmail}</span>
                <span className="shrink-0 flex items-center gap-1.5 text-xs text-cyan-400 group-hover:text-cyan-300">
                  {copied ? <FaCheck className="text-emerald-400" /> : <FaCopy />}
                  {copied ? "Copied!" : "Copy"}
                </span>
              </button>
            </div>

            {/* Social & Coding Profiles */}
            <div className="rounded-2xl bg-slate-900/50 border border-white/10 p-6 backdrop-blur-md">
              <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider block mb-4">
                Online Profiles & Network
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-800/50 hover:bg-cyan-950/40 border border-white/5 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-2.5 text-sm font-medium"
                  >
                    <span className="text-base text-cyan-400">{s.icon}</span>
                    <span>{s.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Location & Status */}
            <div className="rounded-2xl bg-slate-900/30 border border-white/5 p-6 backdrop-blur-md text-sm text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-semibold text-emerald-300">Open to Roles & Collaborations</span>
              </div>
              <p>📍 National Institute of Technology Silchar, Assam, India</p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-slate-900/50 border border-white/10 p-6 sm:p-10 backdrop-blur-md shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-2">Send a Message</h3>
              <p className="text-slate-400 text-sm mb-8">
                Fill out the form below and I'll get back to you as soon as possible.
              </p>

              <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="e.g. alex@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell me about your project, idea, or role..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus.submitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {formStatus.submitting ? (
                    <>
                      <FaSpinner className="animate-spin text-base" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="text-sm" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                {formStatus.message && (
                  <div
                    className={`p-4 rounded-xl text-sm flex items-center gap-3 ${
                      formStatus.success
                        ? "bg-emerald-950/40 border border-emerald-500/30 text-emerald-300"
                        : "bg-red-950/40 border border-red-500/30 text-red-300"
                    }`}
                  >
                    {formStatus.success ? <FaCheckCircle className="shrink-0 text-lg" /> : <FaExclamationCircle className="shrink-0 text-lg" />}
                    <span>{formStatus.message}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}


"use client";

import React from "react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { MdEmail, MdCalendarMonth } from "react-icons/md";

export const Contact = () => {
  return (
    <section id="contact" className="w-full min-h-screen py-20 px-8" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-16 text-center text-white">Get In Touch</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <HoverBorderGradient
              containerClassName="w-full rounded-xl"
              className="w-full bg-gray-900/80 rounded-xl overflow-hidden"
              as="div"
              duration={2}
            >
              <form className="p-8">
                <div className="mb-6">
                  <label htmlFor="name" className="block text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-blue-500"
                    placeholder="Your name"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-blue-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-300 mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-blue-500"
                    placeholder="Your message..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  Send Message
                </button>
              </form>
            </HoverBorderGradient>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-4">Connect With Me</h3>
              <p className="text-gray-300 mb-8">
                I&apos;m always interested in hearing about new projects and opportunities.
                Feel free to reach out through any of these channels:
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <MdEmail className="w-6 h-6" />, label: "Email", href: "mailto:tirso@aiis.space" },
                { icon: <FaGithub className="w-6 h-6" />, label: "GitHub", href: "https://github.com/tn-py" },
                { icon: <FaLinkedin className="w-6 h-6" />, label: "LinkedIn", href: "https://linkedin.com/tirso-navarro" },
                { icon: <FaTwitter className="w-6 h-6" />, label: "Twitter", href: "https://x.com/tirso_navarro" }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center md:justify-start gap-3 p-4 bg-gray-800/50 rounded-lg
                    hover:bg-gray-700/60 transition-all duration-300
                    text-gray-300 hover:text-white"
                >
                  {social.icon}
                  <span>{social.label}</span>
                </a>
              ))}
            </div>

            {/* Calendar Block */}
            <a
              href="https://cal.com/tirso-navarro/15min-meeting"
              className="col-span-2 flex items-center justify-center md:justify-start gap-3 p-4 bg-gray-800/50 rounded-lg
                hover:bg-gray-700/60 transition-all duration-300
                text-gray-300 hover:text-white mt-4"
            >
              <MdCalendarMonth className="w-6 h-6" />
              <span>Schedule a Meeting</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
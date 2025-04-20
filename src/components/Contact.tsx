"use client";

import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { MdEmail, MdCalendarMonth } from "react-icons/md";
import { CgSoftwareDownload } from "react-icons/cg";

export const Contact = () => {
  return (
    <section id="contact" className="w-full min-h-screen py-20 px-8" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-16 text-center text-white">Get In Touch</h2>
        
        <div className="flex justify-center">
          {/* Contact Info */}
          <div className="flex flex-col gap-8 max-w-xl w-full">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-4">Connect With Me</h3>
              <p className="text-gray-300 mb-8">
                I&apos;m always interested in hearing about new projects and opportunities.
                Feel free to reach out through any of these channels:
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <FaGithub className="w-6 h-6" />, label: "GitHub", href: "https://github.com/tn-py" },
                { icon: <FaLinkedin className="w-6 h-6" />, label: "LinkedIn", href: "https://www.linkedin.com/in/tirso-navarro" },
                { icon: <MdEmail className="w-6 h-6" />, label: "Email", href: "mailto:tirso@aiis.space", full: true },
                // { icon: <CgSoftwareDownload className="w-6 h-6" />, label: "Resume", href: "https://TN-Pull-Zone.b-cdn.net/resume.pdf" }
              ]
                .filter(Boolean)
                .map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center md:justify-start gap-3 p-4 bg-gray-800/50 rounded-lg
                      hover:bg-gray-700/60 transition-all duration-300
                      text-gray-300 hover:text-white ${social.full ? "col-span-2" : ""}`}
                  >
                    {social.icon}
                    <span>{social.label}</span>
                  </a>
                ))}
            </div>

            {/* Calendar Block */}
            
          {/*
          <a
              href="https://cal.com/tirso-navarro/15min-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 p-4 bg-gray-800/50 rounded-lg
                hover:bg-gray-700/60 transition-all duration-300
                text-gray-300 hover:text-white text-center"
            >
              <MdCalendarMonth className="w-6 h-6" />
              <span>Schedule a Meeting</span>
            </a>
            */}


            
            <a
              href="https://cal.com/tirso-navarro/15min-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 p-4 bg-gray-800/50 rounded-lg
                hover:bg-gray-700/60 transition-all duration-300
                text-gray-300 hover:text-white text-center"
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

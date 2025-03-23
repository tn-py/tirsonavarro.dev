"use client";

import React from "react";

export const About = () => {
  return (
    <section id="about" className="w-full h-screen flex items-center justify-center px-8" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8 text-center text-white">About Me</h2>
        <p className="text-xl text-gray-300 leading-relaxed">
        I'm an aspiring Full-Stack Web Developer based in Miami, FL. I have extensive experience in Shopify theme development, specializing in creating seamless digital solutions that enhance user experience and operational efficiency. I'm proficient in building and optimizing Shopify themes, pages, scripts, and automations. Utilizing tools like Shopify Flow and Matrixify, I perform mass uploads and updates to streamline processes and reduce operational costs. 
        Currently, I'm expanding my skill set in Node.js, React.js, Next.js, and exploring AI technologies such as OpenAI, Google Gemini, and Groq AI. I'm also delving into workflow automation tools like Zapier, n8n, and Botpress. Passionate about gaming, tech blogging, and travel, I'm committed to creating solutions that enhance productivity and make a significant impact. 
Feel free to reach out to discuss web development, AI technologies, or potential collaborations.
        </p>
      </div>
    </section>
  );
};
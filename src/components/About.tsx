"use client";

import React from "react";

export const About = () => {
  return (
    <section
      id="about"
      className="w-full min-h-screen py-20 flex items-center justify-center px-8"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8 text-center text-white">
          About Me
        </h2>

        <p className="text-xl text-gray-300 leading-relaxed">
          I’m an e-commerce specialist and up-and-coming software dev in Miami working at&nbsp;
          <a
            href="https://www.uhs-hardware.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-300"
          >
            UHS Hardware.
          </a>{" "}
          <br />
          <br />
          I make high-SKU Shopify stores faster, smarter, and easier to run by
          creating custom theme sections and templates for marketing campaigns,
          and by bulk-editing data with Matrixify and NetSuite.
          <br />
          <br />
          {/*Highlights this year: swapped Searchanise for Searchspring to boost
          relevance; launched the UHS Hardware&nbsp;
           mobile app for&nbsp;
          <a
            href="https://apps.apple.com/us/app/uhs-hardware/id6744415977"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-300"
          >
            iOS
          </a>{" "}
          &amp;&nbsp;
          <a
            href="https://play.google.com/store/apps/details?id=com.uFsTVLUJsqPv.natively"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-300"
          >
            Android
          </a>{" "}
          to cut ad costs; rolled out a URL-plus-cookie tagging system that
          powers granular Flows and reports; and replaced PushOwl with OneSignal
          for unified web + mobile push at a lower spend.*/}
          <br />
          <br />
          On the learning front, I’m deep into React, Next.js, and Python for
          automation and web scraping, and I’m also exploring AI and automation tools
          like n8n, lovable and claude code to test ideas and speed up workflows. I enjoy
          tinkering with my homelab server, running Coolify to host projects,
          services, and locally served LLMs.
          <br />
          <br />
          I love tackling tough challenges, and I’m always up for teaming up on
          interesting projects.
          <br />
          <br />
          On my time off work, you’ll find me traveling or exploring in the mountains.
        </p>
      </div>
    </section>
  );
};

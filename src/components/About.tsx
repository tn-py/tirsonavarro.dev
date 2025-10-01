"use client";
import React from "react";
import { StickyScroll } from "./ui/sticky-scroll-reveal";

const content = [
  {
    title: "",
    description: (
      <>
        I’m a web developer and e-commerce specialist based in Miami, currently
        working at{" "}
        <a
          href="https://www.uhs-hardware.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline hover:text-blue-300"
        >
          UHS Hardware
        </a>
        , where I’ve spent the past four years growing from Site Merchandiser to
        Web Operations Supervisor. Along the way, I’ve learned how to make
        high-SKU Shopify stores faster, smarter, and easier to manage through
        custom development, automation, and data-driven improvements.
      </>
    ),
  },
  {
    title: "What I Do",
    description: (
      <>
        I focus on building solutions that cut costs and improve performance:
        from replacing third-party apps with custom scripts, to developing
        Shopify theme sections for marketing campaigns, to streamlining bulk
        data operations with tools like Matrixify and NetSuite. Recent
        highlights include overseeing the launch of UHS Hardware’s{" "}
        <a
          href="https://apps.apple.com/us/app/uhs-hardware/id6744415977"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline hover:text-blue-300"
        >
          iOS
        </a>{" "}
        &amp;{" "}
        <a
          href="https://play.google.com/store/apps/details?id=com.uFsTVLUJsqPv.natively"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline hover:text-blue-300"
        >
          Android
        </a>{" "}
        app, implementing SearchSpring for improved product discovery, and
        rolling out a unified push notification system with OneSignal.
      </>
    ),
  },
  {
    title: "What I'm Learning",
    description: (
      <>
        Outside of e-commerce, I’m expanding my technical toolkit. I’m diving
        deep into <strong>React, Next.js, and Python</strong> with projects in
        automation, web scraping, and AI-driven workflows. I also enjoy
        experimenting with self-hosted tools on my homelab server, where I run{" "}
        <strong>Coolify</strong> to deploy projects, services, and even local
        LLMs.
      </>
    ),
  },
  {
    title: "Beyond the Code",
    description: (
      <>
        I love tackling complex challenges, turning ideas into working systems,
        and collaborating on projects that push boundaries. When I’m not
        building or learning, you’ll usually find me{" "}
        <strong>traveling or exploring the mountains</strong>.
      </>
    ),
  },
];

export const About = () => {
  return (
    <section
      id="about"
      className="w-full min-h-screen py-20 flex items-center justify-center px-8"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <div className="max-w-3xl mx-auto text-center md:hidden">
        <h2 className="text-4xl font-bold mb-8 text-center text-white">
          About Me
        </h2>
        <StickyScroll content={content} />
      </div>
      <div className="hidden md:block max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8 text-center text-white">
          About Me
        </h2>

        <p className="text-xl text-gray-300 leading-relaxed">
          I’m a web developer and e-commerce specialist based in Miami,
          currently working at{" "}
          <a
            href="https://www.uhs-hardware.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-300"
          >
            UHS Hardware
          </a>
          , where I’ve spent the past four years growing from Site Merchandiser
          to Web Operations Supervisor. Along the way, I’ve learned how to make
          high-SKU Shopify stores faster, smarter, and easier to manage through
          custom development, automation, and data-driven improvements.
          <br />
          <br />
          I focus on building solutions that cut costs and improve performance:
          from replacing third-party apps with custom scripts, to developing
          Shopify theme sections for marketing campaigns, to streamlining bulk
          data operations with tools like Matrixify and NetSuite. Recent
          highlights include overseeing the launch of UHS Hardware’s{" "}
          <a
            href="https://apps.apple.com/us/app/uhs-hardware/id6744415977"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-300"
          >
            iOS
          </a>{" "}
          &amp;{" "}
          <a
            href="https://play.google.com/store/apps/details?id=com.uFsTVLUJsqPv.natively"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-300"
          >
            Android
          </a>{" "}
          app, implementing SearchSpring for improved product discovery, and
          rolling out a unified push notification system with OneSignal.
          <br />
          <br />
          Outside of e-commerce, I’m expanding my technical toolkit. I’m diving
          deep into <strong>React, Next.js, and Python</strong> with projects
          in automation, web scraping, and AI-driven workflows. I also enjoy
          experimenting with self-hosted tools on my homelab server, where I
          run <strong>Coolify</strong> to deploy projects, services, and even
          local LLMs.
          <br />
          <br />
          I love tackling complex challenges, turning ideas into working
          systems, and collaborating on projects that push boundaries. When I’m
          not building or learning, you’ll usually find me{" "}
          <strong>traveling or exploring the mountains</strong>.
        </p>
      </div>
    </section>
  );
};

"use client";

import React from "react";
import Image from "next/image";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { CardContainer, CardBody, CardItem } from "./ui/3d-card";
import { Meteors } from "./ui/meteors";
import { FaGithub, FaReact, FaNodeJs, FaGit, FaHtml5, FaCss3Alt } from "react-icons/fa";
import { SiNextdotjs, SiTypescript, SiTailwindcss, SiFramer, SiJavascript } from "react-icons/si";
import { VscCode } from "react-icons/vsc";

interface ProjectData {
  id: number;
  title: string;
  description: string;
  image: string;
}

const projectsData: ProjectData[] = [
  {
    id: 1,
    title: "Portfolio Website",
    description:
      "A modern, responsive portfolio website with interactive elements and smooth animations. Showcases projects, skills, and professional experience with a clean, user-friendly interface. Tech stack includes Next.js, React, TypeScript, Tailwind CSS, and Framer Motion. Aceternity UI components.",
    image: "https://tn-pull-zone.b-cdn.net/TirsoNavarroDev.png",
  },
  {
    id: 2,
    title: "My Shopify Store",
    description:
      "This is my development shopify store, where I test theme components, automations, apps and webhooks. It features a clean and modern design, with a focus on user experience and functionality.",
    image: "https://tn-pull-zone.b-cdn.net/NotesandTasksApp.png",
  },
  {
    id: 3,
    title: "Selector Sage",
    description:
      "A tool to extract data from sites using a custom selector. It uses Open AI to check check and verify the selectors are correct, provide a script to locally scrap the data, and generate a CSV file.",
    image: "https://tn-pull-zone.b-cdn.net/NotesandTasksApp.png",
  },
  {
    id: 4,
    title: "Notes and Tasks App",
    description:
      "A productivity application for managing tasks, projects, and team collaboration. Features include task creation, assignment, progress tracking, and deadline management.",
    image: "https://tn-pull-zone.b-cdn.net/NotesandTasksApp.png",
  },
];

export const Projects = () => (
  <section id="projects" className="w-full py-20 px-4 sm:px-8 bg-[#0a0a0a]">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold mb-16 text-center text-white">My Projects</h2>
      <div className="flex flex-col gap-16">
        {projectsData.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
      <div className="mt-20 sm:mt-32">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center text-white">
          Tools I&apos;m Using
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {[
            { name: "React", icon: <FaReact className="w-8 h-8 mb-2" /> },
            { name: "Next.js", icon: <SiNextdotjs className="w-8 h-8 mb-2" /> },
            { name: "TypeScript", icon: <SiTypescript className="w-8 h-8 mb-2" /> },
            { name: "Tailwind CSS", icon: <SiTailwindcss className="w-8 h-8 mb-2" /> },
            { name: "Node.js", icon: <FaNodeJs className="w-8 h-8 mb-2" /> },
            { name: "Git", icon: <FaGit className="w-8 h-8 mb-2" /> },
            { name: "VS Code", icon: <VscCode className="w-8 h-8 mb-2" /> },
            { name: "Framer Motion", icon: <SiFramer className="w-8 h-8 mb-2" /> },
            { name: "JavaScript", icon: <SiJavascript className="w-8 h-8 mb-2" /> },
            { name: "HTML5", icon: <FaHtml5 className="w-8 h-8 mb-2" /> },
            { name: "CSS3", icon: <FaCss3Alt className="w-8 h-8 mb-2" /> },
            { name: "GitHub", icon: <FaGithub className="w-8 h-8 mb-2" /> },
          ].map((tool) => (
            <div
              key={tool.name}
              className="relative overflow-hidden bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 text-center
                hover:bg-gray-700/40 transition-all duration-300 ease-out
                border border-slate-800/50 hover:border-slate-700
                shadow-[0_0_15px_rgba(0,0,0,0.2)]
                hover:shadow-[0_0_25px_rgba(50,117,248,0.2)]
                hover:scale-105 hover:-translate-y-1
                min-h-[120px] sm:min-h-[140px] isolate"
            >
              <div className="flex justify-center">{tool.icon}</div>
              <p className="text-white text-base sm:text-lg font-medium tracking-wide relative z-10">
                {tool.name}
              </p>
              <Meteors number={8} className="absolute inset-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

type ProjectCardProps = ProjectData;

const ProjectCard = ({ title, description, image }: ProjectCardProps) => (
  <HoverBorderGradient
    containerClassName="w-full rounded-xl"
    className="w-full bg-gray-900/80 rounded-xl overflow-hidden"
    as="div"
    duration={2}
  >
    <div className="p-4 sm:p-8 flex flex-col items-center md:flex-row md:items-stretch gap-6 sm:gap-10 relative z-10">
      {/* 3D Card effect on the image */}
      <div className="w-full md:w-1/2 flex-shrink-0 flex justify-center h-[250px] sm:h-[300px] md:h-[400px]">
        <CardContainer containerClassName="py-0 h-full" className="h-full w-full">
          <CardBody className="!w-full !h-full">
            <CardItem
              translateZ={80}
              className="w-full h-full overflow-hidden rounded-lg shadow-[0_0_15px_rgba(50,117,248,0.3)]"
            >
              <div className="relative w-full h-full">
                <Image
                  src={image}
                  alt={title}
                  width={800}
                  height={600}
                  className="w-full h-full object-contain sm:object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  quality={90}
                />
              </div>
            </CardItem>
          </CardBody>
        </CardContainer>
      </div>
      {/* Content section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center py-2 sm:py-4">
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">{title}</h3>
        <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">{description}</p>
        <button className="mt-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
          View Project
        </button>
      </div>
    </div>
  </HoverBorderGradient>
);
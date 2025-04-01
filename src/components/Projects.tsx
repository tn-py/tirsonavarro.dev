"use client";

import React from "react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { CardContainer, CardBody, CardItem } from "./ui/3d-card";
import { Meteors } from "./ui/meteors";
// eslint-disable-next-line no-unused-vars
import Image from "next/image";
import { FaGithub, FaReact, FaNodeJs, FaGit, FaHtml5, FaCss3Alt } from "react-icons/fa";
import { SiNextdotjs, SiTypescript, SiTailwindcss, SiFramer, SiJavascript } from "react-icons/si";
import { VscCode } from "react-icons/vsc";

// Sample project data - this could be moved to a separate data file
const projectsData = [
  {
    id: 1,
    title: "Portfolio Website",
    description: "A modern, responsive portfolio website with interactive elements and smooth animations. Showcases projects, skills, and professional experience with a clean, user-friendly interface.",
    image: "https://tn-pull-zone.b-cdn.net/TirsoNavarroDev.png",
  },
  {
    id: 2,
    title: "Notes and Tasks App",
    description: "A productivity application for managing tasks, projects, and team collaboration. Features include task creation, assignment, progress tracking, and deadline management.",
    image: "https://tn-pull-zone.b-cdn.net/NotesandTasksApp.png",
  }
];

export const Projects = () => {
  return (
    <section id="projects" className="w-full min-h-screen py-20 px-8" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-16 text-center text-white">My Projects</h2>
        
        <div className="flex flex-col gap-16">
          {projectsData.map((project) => (
            <ProjectCard 
              key={project.id}
              title={project.title}
              description={project.description}
              image={project.image}
            />
          ))}
        </div>

        {/* Tools Section */}
        <div className="mt-32">
          <h2 className="text-4xl font-bold mb-12 text-center text-white">Tools I&apos;m Using</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
              { name: "GitHub", icon: <FaGithub className="w-8 h-8 mb-2" /> }
            ].map((tool) => (
              <div
                key={tool.name}
                className="relative overflow-hidden bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 text-center
                  hover:bg-gray-700/40 transition-all duration-300 ease-out
                  border border-slate-800/50 hover:border-slate-700
                  shadow-[0_0_15px_rgba(0,0,0,0.2)]
                  hover:shadow-[0_0_25px_rgba(50,117,248,0.2)]
                  hover:scale-105 hover:-translate-y-1
                  min-h-[140px] isolate"
              >
                {tool.icon}
                <p className="text-white text-lg font-medium tracking-wide relative z-10">{tool.name}</p>
                <Meteors number={8} className="absolute inset-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
}

const ProjectCard = ({ title, description, image }: ProjectCardProps) => {
  return (
    <HoverBorderGradient
      containerClassName="w-full rounded-xl"
      className="w-full bg-gray-900/80 rounded-xl overflow-hidden"
      as="div"
      duration={2}
    >
      <div className="p-8 flex flex-col md:flex-row gap-10 relative z-10" style={{ minHeight: "400px" }}>
        {/* 3D Card effect only for the image */}
        <div className="md:w-1/3 flex-shrink-0">
          <CardContainer containerClassName="py-0">
            <CardBody className="w-full h-64 md:h-full">
              <CardItem
                translateZ={80}
                className="w-full h-full overflow-hidden rounded-lg shadow-[0_0_15px_rgba(50,117,248,0.3)]"
              >
                {/* Use Image component with a fallback for missing images */}
                <div className="relative w-full h-full">
                  <Image
                    src={image}
                    alt={title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // If image fails to load, show fallback
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.classList.add('bg-blue-900', 'flex', 'items-center', 'justify-center');
                      const fallback = document.createElement('p');
                      fallback.innerText = 'Project Image';
                      fallback.className = 'text-white text-sm';
                      target.parentElement!.appendChild(fallback);
                    }}
                  />
                </div>
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>
        
        {/* Content section - not using 3D effect */}
        <div className="md:w-2/3 flex flex-col justify-center py-4">
          <h3 className="text-3xl font-bold text-white mb-4">{title}</h3>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">{description}</p>
          <div className="mt-auto">
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
              View Project
            </button>
          </div>
        </div>
      </div>
    </HoverBorderGradient>
  );
};
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { CardContainer, CardBody, CardItem } from "./ui/3d-card";
import { Meteors } from "./ui/meteors";
import { FaGithub, FaReact, FaNodeJs, FaGit, FaHtml5, FaCss3Alt, FaExternalLinkAlt } from "react-icons/fa";
import { SiNextdotjs, SiTypescript, SiTailwindcss, SiFramer, SiJavascript } from "react-icons/si";
import { VscCode } from "react-icons/vsc";

interface ProjectData {
  id: number;
  title: string;
  description: string;
  image: string;
  githubUrl: string;
  demoUrl: string;
  tasks?: string[];
  active?: boolean;
}

const projectsData: ProjectData[] = [
  {
  id: 1,
  active: true,
  title: "Currently Working at UHS Hardware - Web Operations Supervisor",
  description:
    "At UHS Hardware, I have grown from Site Merchandiser to Web Operations Supervisor over 4+ years, combining e-commerce expertise with hands-on technical development. In my current role, I oversee the technical operations of our Shopify Plus platform, ensuring seamless integrations, optimized site performance, and improved customer experience. A major highlight was leading the launch of UHS Hardware’s mobile app (iOS and Android) through a webview solution, where I managed app store deployment, handled error testing, and ensured a smooth release. Alongside the launch, I optimized our Shopify theme for mobile and built app-specific tracking systems integrated into Shopify automations. These systems enable customer segmentation, tagging, and personalized marketing based on mobile app usage.",
  image: "https://TN-Pull-Zone.b-cdn.net/UHS-Hardware.png",
  githubUrl: "",
  demoUrl: "https://uhs-hardware.com",
  tasks: [
    "Oversaw the successful launch of UHS Hardware’s iOS and Android mobile app, managing deployment, testing, and post-release monitoring",
    "Optimized Shopify theme for mobile performance to ensure a smoother in-app browsing and checkout experience",
    "Built app-specific customer tracking and tagging system integrated into Shopify Flow, enabling personalized marketing campaigns",
    "Implemented a new customer registration system to streamline account creation and improve data accuracy",
    "Migrated push notifications to OneSignal, improving reliability and engagement with mobile users",
    "Rolled out SearchSpring search for faster, more accurate product discovery across a large SKU catalog",
    "Developed custom automations and scripts that reduced reliance on third-party apps and lowered operational costs"
  ]
}
,
  {
    id: 2,
    title: "Portfolio Website",
    description:
      "A modern, responsive portfolio site built with Next.js, React, TypeScript, Tailwind CSS, and Framer Motion. It features smooth animations, interactive elements, and Aceternity UI components. Designed to showcase projects, skills, and professional experience in a clean, user-friendly way.",
    image: "https://tn-pull-zone.b-cdn.net/TirsoNavarroDev.png",
    githubUrl: "https://github.com/username/portfolio-website",
    demoUrl: "https://portfolio-demo.vercel.app",
  },
  {
    id: 3,
    title: "Art Circuits – Web Developer",
    description:
      "A digital guide to Miami’s cultural scene, highlighting art, entertainment, gastronomy, and architecture.",
    image: "https://tn-pull-zone.b-cdn.net/ArtCircuits-DigitalArtGuide.png",
    githubUrl: "#",
    demoUrl: "https://artcircuits.com",
    tasks: [
      "Configured staging site and database via SSH for development efficiency",
      "Updated theme files to improve design consistency",
      "Built a custom homepage calendar component"
    ]
  },
  {
    id: 4,
    title: "My Shopify Store",
    description:
      "A personal development store used to test theme components, automations, apps, and webhooks. Features a clean, modern design with a focus on usability and performance. (Password: SHOPIFY)",
    image: "https://tn-pull-zone.b-cdn.net/ThisisMyShopifyStore.png",
    githubUrl: "https://github.com/tn-py/welcome-this-is.myshopify.com",
    demoUrl: "https://welcome-this-is.myshopify.com",
  },
  {
    id: 5,
    title: "Selector Sage",
    description:
      "An AI-powered web scraping tool for extracting product data. It uses OpenAI to validate CSS selectors, generate custom scraping scripts, and export structured data to CSV.",
    image: "https://tn-pull-zone.b-cdn.net/Selector-Sage.png",
    githubUrl: "https://github.com/tn-py/Selector-Sage",
    demoUrl: "#",
  },
  {
    id: 6,
    title: "Notes and Tasks App",
    description:
      "A productivity app for managing tasks, projects, and collaboration. Features include task creation, assignment, progress tracking, and deadline management.",
    image: "https://tn-pull-zone.b-cdn.net/NotesandTasksApp.png",
    githubUrl: "https://github.com/tn-py/notes-and-tasks",
    demoUrl: "https://notes-and-tasks.vercel.app",
  },
];


export const Projects = () => (
  <section id="projects" className="w-full py-20 px-4 sm:px-8 bg-[#0a0a0a]">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold mb-16 text-center text-white">My Projects</h2>
      <div className="flex flex-col gap-16">
        {projectsData.filter((project) => project.active).map((project) => (
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

const ProjectCard = ({
  title,
  description,
  image,
  githubUrl,
  demoUrl,
  tasks,
}: ProjectCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
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
                    alt={`Screenshot of ${title} project`}
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

          {isExpanded && (
            <>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4">
                {description}
              </p>

              {tasks && tasks.length > 0 && (
                <ul className="mb-4 sm:mb-6 list-disc pl-5 text-gray-300 space-y-1.5 marker:text-blue-400">
                  {tasks.map((task, idx) => (
                    <li key={idx}>{task}</li>
                  ))}
                </ul>
              )}
            </>
          )}

          <p
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-400 cursor-pointer hover:underline mb-4"
          >
            {isExpanded ? "Show Less" : "Click to Learn More"}
          </p>

          <div className="mt-auto flex gap-4">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              <FaGithub className="w-4 h-4" />
              GitHub
            </a>
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              <FaExternalLinkAlt className="w-4 h-4" />
              Live Demo
            </a>
          </div>
        </div>
      </div>
    </HoverBorderGradient>
  );
};


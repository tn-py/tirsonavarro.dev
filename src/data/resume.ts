// ─────────────────────────────────────────────────────────────────────────────
// Resume Data — structured content for the /resume page.
//
// This file is the single source of truth for resume content.
// To update it automatically from LinkedIn, run:
//   node scripts/update-resume.mjs
//
// IMPORTANT: Preserve the structure (keys, types). Only content values change.
// ─────────────────────────────────────────────────────────────────────────────

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;   // e.g. "Jan 2021"
  endDate: string | null; // null = "Present"
  description: string;
  highlights: string[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights?: string[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  url?: string;
  technologies: string[];
}

export interface ResumeData {
  personal: {
    name: string;
    title: string;
    location: string;
    email: string;
    linkedin: string;
    github: string;
    website: string;
    summary: string;
  };
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillCategory[];
  certifications: CertificationEntry[];
  projects: ProjectEntry[];
  /** ISO date string of the last content update — set by update-resume.mjs */
  lastUpdated: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Content — edit values below; never change the keys or top-level structure.
// ─────────────────────────────────────────────────────────────────────────────

export const resumeData: ResumeData = {
  personal: {
    name: "Tirso Navarro",
    title: "Web Developer & E-Commerce Specialist",
    location: "Miami, FL",
    email: "tirso@aiis.space",
    linkedin: "https://www.linkedin.com/in/tirso-navarro",
    github: "https://github.com/tn-py",
    website: "https://tirsonavarro.dev",
    summary:
      "Web developer and e-commerce specialist with 4+ years of experience scaling high-SKU Shopify stores through custom development, automation, and data-driven improvements. Currently expanding into full-stack development with React, Next.js, and Python-powered AI workflows.",
  },

  experience: [
    {
      id: "uhs-hardware",
      company: "UHS Hardware",
      role: "Web Operations Supervisor",
      location: "Miami, FL",
      startDate: "2021",
      endDate: null,
      description:
        "Led web operations and e-commerce development for a high-SKU hardware retailer, growing from Site Merchandiser to Web Operations Supervisor over four years.",
      highlights: [
        "Oversaw the full launch of UHS Hardware's iOS & Android mobile app",
        "Implemented SearchSpring to improve on-site product discovery and relevance",
        "Deployed a unified push notification system via OneSignal across web and mobile",
        "Replaced third-party Shopify apps with custom scripts, reducing monthly SaaS costs",
        "Built and maintained Shopify theme sections and custom storefronts for campaigns",
        "Streamlined bulk catalog operations using Matrixify and NetSuite integrations",
      ],
    },
  ],

  education: [
    {
      id: "fiu",
      institution: "Florida International University",
      degree: "Bachelor of Business Administration",
      field: "Management Information Systems",
      location: "Miami, FL",
      startDate: "2017",
      endDate: "2021",
    },
  ],

  skills: [
    {
      category: "E-Commerce",
      items: [
        "Shopify",
        "Shopify Liquid",
        "Matrixify",
        "NetSuite",
        "SearchSpring",
        "OneSignal",
      ],
    },
    {
      category: "Frontend",
      items: [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "Tailwind CSS",
        "HTML",
        "CSS",
        "Framer Motion",
      ],
    },
    {
      category: "Backend & Scripting",
      items: ["Python", "Node.js", "REST APIs", "Puppeteer", "Web Scraping"],
    },
    {
      category: "Infrastructure & Tools",
      items: ["Git", "GitHub", "Docker", "Coolify", "Linux", "Homelab"],
    },
  ],

  certifications: [],

  projects: [
    {
      id: "portfolio",
      name: "tirsonavarro.dev",
      description:
        "Personal portfolio and resume site built with Next.js, TypeScript, and Tailwind CSS. Features particle animations, 3D card effects, and a Notion-style resume powered by a Claude AI update agent.",
      url: "https://tirsonavarro.dev",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    },
    {
      id: "selector-sage",
      name: "Selector Sage",
      description:
        "AI-driven product recommendation tool that helps users find the right hardware for their needs through a guided selection flow.",
      url: "https://github.com/tn-py",
      technologies: ["Python", "Next.js", "AI/LLM"],
    },
  ],

  lastUpdated: "2025-03-11",
};

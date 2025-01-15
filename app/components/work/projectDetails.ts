import {
    SiCplusplus,
    SiSupabase,
    SiGithub, SiShopify,
    SiNextdotjs,
    SiReact,
    SiRust,
    SiTailwindcss,
    SiTypescript,
    SiDiscord,
    SiZig
} from "react-icons/si";
import {IconType} from "react-icons";

export type ProjectProps = {
  id: number;
  name: string;
  description: string;
  technologies: IconType[];
  techNames: string[];
  techLinks: string[];
  github: string;
  demo: string;
  image: string;
  available: boolean;
};

export const projects = [
    {
        id: 0,
        name: "Search By VIN Tool",
        description:
            "Search By VIN Tool created with TypeScript, React, Next.js, Tailwind CSS, Supabase",
        technologies: [SiTypescript, SiReact, SiNextdotjs, SiTailwindcss, SiSupabase],
        techNames: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Supabase"],
        techLinks: ["https://www.typescriptlang.org/", "https://reactjs.org/", "https://nextjs.org/", "https://tailwindcss.com/", "https://www.framer.com/motion/"],
        github: "https://github.com/tn-py/search-by-vin",
        demo: "https://https://searchbyvin.tirso-coolifyserver.tech/",
        image: "/projects/searchbyvin.png",
        available: true,
    },
    {
        id: 1,
        name: "Shopify Development Store",
        description:
            "Custom Shopify theme. To access the store use code: SHOPIFY",
        technologies: [SiShopify],
        techNames: ["WebGL", "Typescript", "React"],
        techLinks: ["https://get.webgl.org/", "https://www.typescriptlang.org/", "https://reactjs.org/"],
        github: "https://github.com/tn-py/VRMALL",
        demo: "https://welcome-this-is.myshopify.com/",
        image: "/projects/welcome-this.is.png",
        available: true,
    },
    {
        id: 2,
        name: "Shopify Dummy Data Generator Scripts",
        description:
            "Google Apps Script for generating dummy shopify data for testing",
        technologies: [SiShopify],
        techNames: ["WebGL", "Typescript", "React"],
        techLinks: ["https://get.webgl.org/", "https://www.typescriptlang.org/", "https://reactjs.org/"],
        github: "https://github.com/tn-py/Google-Apps-Scripts",
        demo: "https://welcome-this-is.myshopify.com/",
        image: "/projects/Apps-Scripts-Dummy-Data.png",
        available: true,
    },
    {
        id: 3,
        name: "Discord AI Bot",
        description:
            "Discord AI Bot with simple slash commands for chat and image generation",
        technologies: [SiDiscord],
        techNames: ["Discord AI Bot"],
        techLinks: ["https://discord.com/oauth2/authorize?client_id=1326737661733634048"],
        github: "https://github.com/tn-py/discord-ai-bot",
        demo: "https://discord.com/oauth2/authorize?client_id=1326737661733634048",
        image: "/projects/Coolify.png",
        available: true,
    },
];
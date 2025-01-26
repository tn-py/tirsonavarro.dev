import {
    SiCplusplus,
    SiSupabase,
    SiGithub, SiShopify,
    SiNextdotjs,
    SiReact,
    SiTailwindcss,
    SiTypescript,
    SiDiscord,
    SiVite,
    SiGoogleappsscript
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
            "Custom Shopify theme.",
        technologies: [SiShopify],
        techNames: ["Shopify", "Liquid"],
        techLinks: ["https://shopify.com/", "https://shopify.com/liquid"],
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
        technologies: [SiGoogleappsscript],
        techNames: ["Google Apps Script"],
        techLinks: ["https://google.com/apps/script/"],
        github: "https://gist.github.com/tn-py/33daf89971be8025ed80997660f89078",
        demo: "https://docs.google.com/spreadsheets/d/1q2SHI8BC7no7wWqsn32fRfpmLeDTRuTFRCjVmNYIiPI/edit?usp=sharing",
        image: "/projects/Apps-Scripts-Dummy-Data.png",
        available: true,
    },
    {
        id: 3,
        name: "Discord AI Bot",
        description:
            "Discord AI Bot with simple slash commands for chat and image generation. Deployed on a Coolify Server",
        technologies: [SiDiscord],
        techNames: ["Discord Developer API", "OpenAI", "Google Gemini", "OpenweatherAPI"],
        techLinks: ["https://discord.com/developers/", "https://openai.com/", "https://gemini.cafe/", "https://openweathermap.org/", ],
        github: "https://github.com/tn-py/discord-ai-bot",
        demo: "https://discord.com/oauth2/authorize?client_id=1326737661733634048",
        image: "/projects/Coolify.png",
        available: true,
    },
    {
        id: 4,
        name: "Notes and Tasks App",
        description:
            "Simple Notes and Tasks App created with TypeScript, React, Vite, Tailwind CSS. Light and Dark Mode Supported.",
        technologies: [SiVite, SiReact, SiTypescript, SiTailwindcss],
        techNames: ["Vite", "React", "TypeScript", "Tailwind CSS"],
        techLinks: ["https://discord.com/developers/", "https://openai.com/", "https://gemini.cafe/", "https://openweathermap.org/", ],
        github: "https://github.com/tn-py/discord-ai-bot",
        demo: "https://discord.com/oauth2/authorize?client_id=1326737661733634048",
        image: "/projects/NotesandTasks.png",
        available: true,
    },
];
import type { MetaFunction } from "@remix-run/node";
import styles from "../styles/Stack.module.css";

export const meta: MetaFunction = () => {
  return [
    { title: "Stack | Agentic Architect" },
    { name: "description", content: "Technical documentation of my engine and tech stack." },
  ];
};

const stackData = [
  {
    category: "Languages",
    description: "The core syntax that defines the logic and structure of my systems.",
    items: ["TypeScript", "Python", "Rust", "SQL", "MDX", "CSS"],
  },
  {
    category: "Frameworks & UI",
    description: "Building interfaces that are both functional and performant.",
    items: ["Remix", "React", "Next.js", "Vite", "Vanilla CSS", "Tailwind"],
  },
  {
    category: "AI & Agentic Systems",
    description: "Tools for building autonomous agents and integrating LLMs.",
    items: ["MCP (Model Context Protocol)", "OpenClaw", "Hermes", "LangChain", "OpenAI", "Claude"],
  },
  {
    category: "Automation",
    description: "Orchestrating workflows and background tasks.",
    items: ["n8n", "GitHub Actions", "Node-RED", "Cron"],
  },
  {
    category: "Infrastructure",
    description: "The bedrock upon which my applications and agents reside.",
    items: ["Proxmox", "Docker", "Vercel", "Cloudflare", "Linux", "PostgreSQL"],
  },
];

export default function Stack() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>System Stack</h1>
        <p className={styles.subtitle}>Technical engine documentation</p>
      </header>

      <div className={styles.grid}>
        {stackData.map((group) => (
          <section key={group.category} className={styles.category}>
            <h2 className={styles.categoryTitle}>{group.category}</h2>
            <p className={styles.description}>{group.description}</p>
            <div className={styles.itemList}>
              {group.items.map((item) => (
                <span key={item} className={styles.item}>
                  {item}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

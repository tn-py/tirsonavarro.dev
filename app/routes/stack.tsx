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
    category: "AI & Agentic Systems",
    description: "Orchestrating autonomous workflows and high-performance retrieval.",
    items: ["LangGraph", "LangChain", "Multi-agent Systems", "Agentic RAG", "ChromaDB", "Ollama", "OpenAI", "MCP Servers", "Tavily", "Bias Detection", "Embedding Models", "Prompt Engineering"],
  },
  {
    category: "E-Commerce Ops",
    description: "Scaling and managing enterprise-grade retail systems.",
    items: ["Shopify Liquid", "Shopify Flow", "NetSuite", "SearchSpring", "OneSignal", "Matrixify", "Shopify Metafields", "n8n"],
  },
  {
    category: "Frameworks & UI",
    description: "Building interfaces that are both functional and performant.",
    items: ["Remix", "React", "Next.js", "Vite", "Vanilla CSS", "Tailwind", "Framer Motion"],
  },
  {
    category: "Infrastructure",
    description: "The bedrock upon which my applications and agents reside.",
    items: ["Proxmox", "Docker", "Vercel", "Cloudflare", "Linux", "PostgreSQL", "GitHub Actions"],
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

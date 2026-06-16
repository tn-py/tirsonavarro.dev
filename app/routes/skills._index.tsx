import type { MetaFunction } from "@remix-run/node";
import styles from "~/styles/Skills.module.css";

export const meta: MetaFunction = () => {
  return [
    { title: "Skills | Agentic Architect" },
    { name: "description", content: "Agent skills, tools, and frameworks I use daily." },
  ];
};

const everydaySkills = [
  "Claude Code",
  "Gemini CLI",
  "LangChain",
  "LangGraph",
  "ChromaDB",
  "Ollama",
  "MCP Servers",
  "Tavily",
  "Perplexity API",
  "OpenAI",
  "DeepSeek",
  "SMOL Agents",
  "n8n",
  "Shopify Flow",
  "Docker",
  "GitHub Actions",
];

export default function SkillsIndex() {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <h1 className={styles.title}>&gt; SKILLS</h1>
        <p className={styles.subtitle}>// AGENT_CAPABILITIES // TOOL_CHAIN // RUNTIME_INTEGRATIONS</p>
        <p className={styles.description}>
          A curated collection of agent skills, LLM tools, and automation frameworks
          that power my daily workflow. Each skill represents a capability I've built,
          tested, and integrated into real-world systems.
        </p>
        <a
          href="https://github.com/tn-py"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cta}
        >
          <span className={styles.ctaPrefix}>[ VIEW ALL ]</span>
          SKILLS ON GITHUB &rarr;
        </a>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>My every day SKILLS</h2>
          <span className={styles.sectionCount}>{everydaySkills.length} tools</span>
        </div>
        <div className={styles.skillGrid}>
          {everydaySkills.map((skill) => (
            <span key={skill} className={styles.skillBadge}>
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>More skills coming soon</h2>
          <span className={styles.sectionCount}>categories</span>
        </div>
        <div className={styles.placeholderGrid}>
          <div className={styles.placeholderCard}>
            <div className={styles.placeholderIcon}>+</div>
            <p className={styles.placeholderLabel}>Add a category</p>
          </div>
          <div className={styles.placeholderCard}>
            <div className={styles.placeholderIcon}>+</div>
            <p className={styles.placeholderLabel}>Add a category</p>
          </div>
          <div className={styles.placeholderCard}>
            <div className={styles.placeholderIcon}>+</div>
            <p className={styles.placeholderLabel}>Add a category</p>
          </div>
        </div>
      </section>
    </div>
  );
}

import type { MetaFunction } from "@remix-run/node";
import styles from "~/styles/Skills.module.css";

export const meta: MetaFunction = () => {
  return [
    { title: "Skills | Agentic Architect" },
    { name: "description", content: "Agent skills, tools, and frameworks I use daily." },
  ];
};

interface SkillCard {
  title: string;
  subtitle: string;
  repo: string;
}

const everydaySkills: SkillCard[] = [
  {
    title: "Superpowers",
    subtitle: "Project-specific RAG from your codebase, docs, and git history — built for AI coding agents.",
    repo: "https://github.com/obra/superpowers",
  },
  {
    title: "Shopify AI Toolkit",
    subtitle: "Connect AI tools directly to Shopify's platform with skills for docs, API schemas, and code validation.",
    repo: "https://github.com/Shopify/Shopify-AI-Toolkit",
  },
  {
    title: "Vercel CLI Skills",
    subtitle: "The open agent skills tool — create, share, and run skills via `npx skills` across 27+ coding agents.",
    repo: "https://github.com/vercel-labs/skills",
  },
  {
    title: "Supabase CLI Skills",
    subtitle: "Agent skills for Supabase development — database, auth, Edge Functions, and Postgres best practices.",
    repo: "https://github.com/supabase/agent-skills",
  },
  {
    title: "Google Workspace CLI Skills",
    subtitle: "One CLI for all of Google Workspace — Drive, Gmail, Calendar, Sheets, Docs, Chat, Admin. 100+ agent skills.",
    repo: "https://github.com/googleworkspace/cli",
  },
  {
    title: "Tavily Search Skills",
    subtitle: "Web search, content extraction, crawling, and deep research via the Tavily CLI — optimized for AI agents.",
    repo: "https://github.com/tavily-ai/skills",
  },
  {
    title: "Anthropic Skills",
    subtitle: "Anthropic's official skills library — the canonical repository of agent skills for Claude and beyond.",
    repo: "https://github.com/anthropics/skills",
  },
  {
    title: "Graphify Skills",
    subtitle: "Transform any project into a queryable knowledge graph — maps code, docs, PDFs, images, and videos.",
    repo: "https://github.com/safishamsi/graphify",
  },
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
          href="https://github.com/stars/tn-py/lists/skills"
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
            <a
              key={skill.title}
              href={skill.repo}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.skillCard}
            >
              <h3 className={styles.cardTitle}>{skill.title}</h3>
              <p className={styles.cardSubtitle}>{skill.subtitle}</p>
              <span className={styles.cardLink}>View on GitHub &rarr;</span>
            </a>
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

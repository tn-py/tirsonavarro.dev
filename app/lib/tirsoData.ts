export interface SkillEntry {
  title: string;
  subtitle: string;
  repo: string;
}

export const skills: SkillEntry[] = [
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

export interface StackCategory {
  category: string;
  description: string;
  items: string[];
}

export const stackData: StackCategory[] = [
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

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

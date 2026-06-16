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

interface SkillCategory {
  name: string;
  skills: SkillCard[];
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

const skillCategories: SkillCategory[] = [
  {
    name: "Skill Collections & Registries",
    skills: [
      { title: "Awesome Claude Skills", subtitle: "A curated list of Claude skills, resources, and tools for customizing AI workflows.", repo: "https://github.com/ComposioHQ/awesome-claude-skills" },
      { title: "Awesome OpenClaw Skills", subtitle: "5,400+ OpenClaw skills filtered and categorized from the official skills registry.", repo: "https://github.com/VoltAgent/awesome-openclaw-skills" },
      { title: "Agent Skills (addyosmani)", subtitle: "Production-grade engineering skills for AI coding agents — Shell, Python, and workflows.", repo: "https://github.com/addyosmani/agent-skills" },
      { title: "Claude Skills Collection", subtitle: "337 skills for Claude Code, Codex, Gemini CLI, Cursor, and 8 more coding agents.", repo: "https://github.com/alirezarezvani/claude-skills" },
      { title: "Awesome Claude Code", subtitle: "Curated list of skills, hooks, slash-commands, agent orchestrators, and plugins for Claude Code.", repo: "https://github.com/hesreallyhim/awesome-claude-code" },
      { title: "Antigravity Awesome Skills", subtitle: "1,500+ agentic skills for Claude Code, Cursor, Codex CLI, Gemini CLI, and more.", repo: "https://github.com/sickn33/antigravity-awesome-skills" },
      { title: "OpenClaw Master Skills", subtitle: "1,200+ curated OpenClaw skills, weekly updated by the community.", repo: "https://github.com/LeoYeAI/openclaw-master-skills" },
      { title: "AI Labs Claude Skills", subtitle: "A bridge between user projects and Claude skills — removes the hassle of finding and installing skills.", repo: "https://github.com/ailabs-393/ai-labs-claude-skills" },
      { title: "Awesome Agent Skills", subtitle: "Tutorials, guides, and agent skills directories for building with AI coding agents.", repo: "https://github.com/heilcheng/awesome-agent-skills" },
      { title: "Autoskills", subtitle: "One command to install your entire AI skill stack from anywhere.", repo: "https://github.com/midudev/autoskills" },
      { title: "Skill Seekers", subtitle: "Convert documentation websites, GitHub repos, and PDFs into Claude AI skills with conflict detection.", repo: "https://github.com/yusufkaraaslan/Skill_Seekers" },
      { title: "PromptEnhancer", subtitle: "Prompt-rewriting tool that refines prompts into clearer, structured versions for better generation.", repo: "https://github.com/Hunyuan-PromptEnhancer/PromptEnhancer" },
      { title: "ResumeSkills", subtitle: "Agent skills focused on resume optimization, job applications, and career development.", repo: "https://github.com/Paramchoudhary/ResumeSkills" },
      { title: "Lumos Framework", subtitle: "A skill framework for building and managing reusable AI agent capabilities.", repo: "https://github.com/lumosframework/skill" },
    ],
  },
  {
    name: "MCP Servers & Agent Infrastructure",
    skills: [
      { title: "Playwright MCP", subtitle: "Microsoft's official MCP server for Playwright browser automation.", repo: "https://github.com/microsoft/playwright-mcp" },
      { title: "GitHub MCP Server", subtitle: "GitHub's official MCP Server — interact with repos, issues, PRs, and more.", repo: "https://github.com/github/github-mcp-server" },
      { title: "Awesome MCP Servers", subtitle: "A curated collection of MCP servers for every use case.", repo: "https://github.com/punkpeye/awesome-mcp-servers" },
      { title: "MCP Registry", subtitle: "A community-driven registry service for Model Context Protocol (MCP) servers.", repo: "https://github.com/modelcontextprotocol/registry" },
      { title: "MCP Use", subtitle: "The fullstack MCP framework to develop MCP apps for ChatGPT, Claude, and AI agents.", repo: "https://github.com/mcp-use/mcp-use" },
      { title: "n8n MCP", subtitle: "Build n8n workflows for you via MCP — integrate automation with Claude, Cursor, and Windsurf.", repo: "https://github.com/czlonkowski/n8n-mcp" },
      { title: "MCP.so", subtitle: "Directory of Awesome MCP Servers — discover and browse MCP integrations.", repo: "https://github.com/chatmcp/mcpso" },
      { title: "McPorter", subtitle: "Call MCPs via TypeScript, masquerading as simple TypeScript API, or package them as CLI.", repo: "https://github.com/openclaw/mcporter" },
      { title: "mcp2cli", subtitle: "Turn any MCP, OpenAPI, or GraphQL server into a CLI at runtime with zero codegen.", repo: "https://github.com/knowsuchagency/mcp2cli" },
      { title: "Context7", subtitle: "Up-to-date code documentation for LLMs and AI code editors — by Upstash.", repo: "https://github.com/upstash/context7" },
      { title: "OpenViking", subtitle: "Open-source context database for AI agents — unifies memory, resources, and skills.", repo: "https://github.com/volcengine/OpenViking" },
      { title: "Ruflo", subtitle: "Multi-agent swarm harness for Claude — deploy autonomous workflows with adaptive memory.", repo: "https://github.com/ruvnet/ruflo" },
      { title: "Goose", subtitle: "Open-source, extensible AI agent that goes beyond code suggestions — install, execute, edit, test.", repo: "https://github.com/aaif-goose/goose" },
      { title: "Agent Scan", subtitle: "Security scanner for AI agents, MCP servers, and agent skills — by Snyk.", repo: "https://github.com/snyk/agent-scan" },
      { title: "Polymarket Agent Skills", subtitle: "Agent skills for interacting with Polymarket's prediction markets protocol.", repo: "https://github.com/Polymarket/agent-skills" },
    ],
  },
  {
    name: "Specialized Skills & Domain Tools",
    skills: [
      { title: "UI/UX Pro Max Skill", subtitle: "Design intelligence for building professional UI/UX across multiple platforms.", repo: "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill" },
      { title: "Nothing Design Skill", subtitle: "Generate UI in the Nothing design language — monochrome, typographic, industrial.", repo: "https://github.com/dominikmartn/nothing-design-skill" },
      { title: "TypeUI", subtitle: "Build better UI with Codex, Claude, Cursor, and other AI tools.", repo: "https://github.com/bergside/typeui" },
      { title: "WebGPU Claude Skill", subtitle: "Develop WebGPU applications with Three.js using AI coding assistants.", repo: "https://github.com/dgreenheck/webgpu-claude-skill" },
      { title: "Marketing Skills", subtitle: "CRO, copywriting, SEO, analytics, and growth engineering skills for AI agents.", repo: "https://github.com/coreyhaines31/marketingskills" },
      { title: "Distribb Skill", subtitle: "AI-powered SEO — write content with your AI, publish through a backlink network.", repo: "https://github.com/Bomx/distribb-skill" },
      { title: "Last30Days Skill", subtitle: "Research trending topics across Reddit, X, YouTube, HN, and Polymarket, then synthesize summaries.", repo: "https://github.com/mvanhorn/last30days-skill" },
      { title: "NotebookLM Python API", subtitle: "Unofficial Python API and agentic skill for Google NotebookLM — full programmatic access.", repo: "https://github.com/teng-lin/notebooklm-py" },
      { title: "Claude Office Skills", subtitle: "Office document creation — PPTX, DOCX, XLSX, and PDF workflows with automation support.", repo: "https://github.com/tfriedel/claude-office-skills" },
      { title: "Taste Skill", subtitle: "Gives your AI good taste — stops it from generating boring, generic slop.", repo: "https://github.com/Leonxlnx/taste-skill" },
      { title: "Caveman", subtitle: "Cuts 65% of tokens by talking like a caveman — why use many token when few token do trick.", repo: "https://github.com/JuliusBrussee/caveman" },
      { title: "AI Website Cloner", subtitle: "Clone any website with one command using AI coding agents.", repo: "https://github.com/JCodesMore/ai-website-cloner-template" },
      { title: "Prompt Poet", subtitle: "Streamlines prompt design for developers and non-technical users with a low-code approach.", repo: "https://github.com/character-ai/prompt-poet" },
    ],
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

      {skillCategories.map((category) => (
        <section key={category.name} className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{category.name}</h2>
            <span className={styles.sectionCount}>{category.skills.length} tools</span>
          </div>
          <div className={styles.skillGrid}>
            {category.skills.map((skill) => (
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
      ))}
    </div>
  );
}

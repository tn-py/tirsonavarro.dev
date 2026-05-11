# Projects Section Improvement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the portfolio projects section with 7 high-quality technical snapshots derived from GitHub repositories.

**Architecture:** Standardized MDX files for content, updated detail route to handle GitHub links, and a modern "Engineering Report" aesthetic.

**Tech Stack:** Remix, React, MDX, CSS Modules.

---

### Task 1: Style Updates (GitHub Button)

**Files:**
- Modify: `app/styles/Projects.module.css`

- [ ] **Step 1: Add the GitHub Button styles**

Add the following to the end of `app/styles/Projects.module.css`:

```css
.githubButton {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--accent-blue);
  color: var(--bg-primary);
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-family: var(--font-mono);
  font-weight: bold;
  margin-top: 2rem;
  transition: opacity 0.2s;
}

.githubButton:hover {
  opacity: 0.9;
}
```

- [ ] **Step 2: Commit styles**

```bash
git add app/styles/Projects.module.css
git commit -m "style: add github button component styles"
```

---

### Task 2: Update Project Detail Route

**Files:**
- Modify: `app/routes/projects.$slug.tsx`

- [ ] **Step 1: Implement the GitHub link logic**

Update the `ProjectDetail` component in `app/routes/projects.$slug.tsx` to extract and display the `githubUrl` from frontmatter.

```tsx
// Find this section and update it
export default function ProjectDetail() {
  const { slug } = useParams();
  const { frontmatter } = useLoaderData<typeof loader>();
  
  const projects = import.meta.glob("../../content/projects/*.mdx", { eager: true });
  const projectPath = `../../content/projects/${slug}.mdx`;
  const project = projects[projectPath] as any;
  
  if (!project) {
    // ... error handling
  }
  
  const Component = project.default;
  
  return (
    <div className={styles.container}>
      <Link to="/projects" className={styles.backLink}>
        ← Back to Projects
      </Link>
      <div className={styles.mdxContent}>
        <Component />
      </div>
      
      {frontmatter.githubUrl && (
        <a 
          href={frontmatter.githubUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.githubButton}
        >
          [ View Source on GitHub ]
        </a>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify the change**
Run the dev server and check an existing project (e.g., hermes) to ensure the layout hasn't broken (button won't show yet as hermes lacks the frontmatter).

- [ ] **Step 3: Commit component change**

```bash
git add app/routes/projects.$slug.tsx
git commit -m "feat: add github link support to project detail view"
```

---

### Task 3: Create AgentPoker Snapshot

**Files:**
- Create: `content/projects/agent-poker.mdx`

- [ ] **Step 1: Write the MDX content**

```markdown
---
title: AgentPoker
description: Texas Hold'em for Autonomous AI Agents.
tags: ["TypeScript", "AI Agents", "EVM", "REST API"]
githubUrl: "https://github.com/tn-py/agent-poker"
---

# AgentPoker

AgentPoker is a poker platform built for autonomous AI agents. Every interaction is a plain HTTP REST call — no WebSocket or specialized SDK required.

## Technical Highlights

- **Agnostic Interface**: Any agent that can sign wallet messages and make HTTP requests can play.
- **Multi-Chain Auth**: Support for both EVM (0x...) and Solana wallet authentication.
- **Automated Game Loop**: Stateless API design allows agents to poll and act only when required.
```

- [ ] **Step 2: Commit**

```bash
git add content/projects/agent-poker.mdx
git commit -m "content: add agent-poker project"
```

---

### Task 4: Create Shopify Loyalty Rewards Snapshot

**Files:**
- Create: `content/projects/shopify-loyalty-rewards.mdx`

- [ ] **Step 1: Write the MDX content**

```markdown
---
title: Shopify Loyalty Rewards
description: Tiered loyalty program using Shopify Metafields.
tags: ["TypeScript", "Remix", "Shopify API", "Polaris UI"]
githubUrl: "https://github.com/tn-py/shopify-loyalty-rewards-app"
---

# Shopify Loyalty Rewards

A full-stack Remix application providing a tiered loyalty system (Bronze, Silver, Gold) for Shopify merchants.

## Technical Highlights

- **Serverless Storage**: Eliminates external database dependencies by utilizing Shopify Metafields for all persistent data.
- **Event-Driven Upgrades**: Automated tier evaluation triggered via Shopify Order Webhooks.
- **Rolling Period Logic**: Custom implementation of 12-month rolling spend calculations with grace periods.
```

- [ ] **Step 2: Commit**

```bash
git add content/projects/shopify-loyalty-rewards.mdx
git commit -m "content: add shopify-loyalty-rewards project"
```

---

### Task 5: Create OpenClaw Dashboard Snapshot

**Files:**
- Create: `content/projects/openclaw-dashboard.mdx`

- [ ] **Step 1: Write the MDX content**

```markdown
---
title: OpenClaw Dashboard
description: Real-time management UI for local OpenClaw instances.
tags: ["React", "TypeScript", "Tailwind", "Framer Motion"]
githubUrl: "https://github.com/tn-py/openclaw-dashboard"
---

# OpenClaw Dashboard

A modern administrative interface designed to monitor and manage local autonomous agent instances.

## Technical Highlights

- **Reactive State**: Built with React and Framer Motion for smooth, real-time feedback of agent status.
- **Component-Driven Design**: Highly modular UI built using a custom technical design system.
- **Local Connectivity**: Secure integration with local OpenClaw gateway services.
```

- [ ] **Step 2: Commit**

```bash
git add content/projects/openclaw-dashboard.mdx
git commit -m "content: add openclaw-dashboard project"
```

---

### Task 6: Create Scrape-Scripts Snapshot

**Files:**
- Create: `content/projects/scrape-scripts.mdx`

- [ ] **Step 1: Write the MDX content**

```markdown
---
title: Scrape-Scripts
description: Scalable Python scraping system with automated scaffolding.
tags: ["Python", "Scrapy", "FastAPI", "React", "Docker"]
githubUrl: "https://github.com/tn-py/Scrapy-Crawler-UI"
---

# Scrape-Scripts

A high-performance scraping engine that streamlines the transition from target discovery to large-scale data extraction.

## Technical Highlights

- **Spider Scaffolding**: Automated generation of Scrapy spiders, items, and tests via CLI.
- **Selector Repair**: Intelligent tools for diagnosing and repairing broken CSS selectors.
- **Hybrid Architecture**: FastAPI backend wrapped around Scrapy core for easy integration with the React UI.
```

- [ ] **Step 2: Commit**

```bash
git add content/projects/scrape-scripts.mdx
git commit -m "content: add scrape-scripts project"
```

---

### Task 7: Create JHU Agentic AI Snapshot

**Files:**
- Create: `content/projects/jhu-agentic-ai.mdx`

- [ ] **Step 1: Write the MDX content**

```markdown
---
title: JHU Agentic AI
description: Advanced multi-agent orchestration and autonomous systems.
tags: ["Python", "Agentic AI", "LLMs", "Orchestration"]
githubUrl: "https://github.com/tn-py/JHU-AgenticAI-Course"
---

# JHU Agentic AI

A comprehensive collection of engineering projects developed for the JHU Certificate Program in Agentic AI.

## Technical Highlights

- **Agent Orchestration**: Implementation of complex handoffs and collaboration between specialized LLM agents.
- **Autonomous Reasoning**: Focus on developing agents that can plan and execute multi-step technical tasks.
- **Advanced RAG**: Specialized implementations of Retrieval Augmented Generation for domain-specific knowledge.
```

- [ ] **Step 2: Commit**

```bash
git add content/projects/jhu-agentic-ai.mdx
git commit -m "content: add jhu-agentic-ai project"
```

---

### Task 8: Create Transcribe-Script Snapshot

**Files:**
- Create: `content/projects/transcribe-script.mdx`

- [ ] **Step 1: Write the MDX content**

```markdown
---
title: Transcribe-Script
description: Automated Whisper-powered audio transcription pipeline.
tags: ["Python", "Whisper AI", "Obsidian", "Automation"]
githubUrl: "https://github.com/tn-py/Transcribe-Script"
---

# Transcribe-Script

An automated pipeline for converting audio recordings into structured knowledge within an Obsidian vault.

## Technical Highlights

- **Whisper Integration**: High-accuracy local transcription using OpenAI's Whisper models.
- **Automated Workflow**: End-to-end processing from raw audio to formatted Markdown notes.
- **Metadata Extraction**: Automatic generation of Obsidian-compatible YAML frontmatter for each transcript.
```

- [ ] **Step 2: Commit**

```bash
git add content/projects/transcribe-script.mdx
git commit -m "content: add transcribe-script project"
```

---

### Task 9: Create Discord AI Bot Snapshot

**Files:**
- Create: `content/projects/discord-ai-bot.mdx`

- [ ] **Step 1: Write the MDX content**

```markdown
---
title: Discord AI Bot
description: Interactive Discord agent powered by OpenAI Assistants.
tags: ["JavaScript", "OpenAI", "Discord.js", "Docker"]
githubUrl: "https://github.com/tn-py/discord-ai-bot"
---

# Discord AI Bot

A multi-functional Discord agent designed for high interaction and ease of deployment.

## Technical Highlights

- **Assistants API**: Leverages OpenAI's persistent threads for contextual long-form conversations.
- **Voice Support**: Integrated voice channel capabilities for direct verbal interaction.
- **Dockerized Deployment**: Fully containerized architecture for reliable, persistent operation.
```

- [ ] **Step 2: Commit**

```bash
git add content/projects/discord-ai-bot.mdx
git commit -m "content: add discord-ai-bot project"
```

---

### Task 10: Final Cleanup and Verification

**Files:**
- Delete: `content/projects/hermes.mdx`
- Delete: `content/projects/openclaw.mdx`

- [ ] **Step 1: Remove old sample projects**

```bash
rm content/projects/hermes.mdx content/projects/openclaw.mdx
```

- [ ] **Step 2: Verification**
Start the dev server: `npm run dev`
1. Navigate to `/projects`.
2. Verify all 7 cards appear with correct titles, descriptions, and tags.
3. Click into each project and verify:
   - Concise summary is present.
   - The "[ View Source on GitHub ]" button appears and links to the correct repository.
   - The "Back to Projects" link works.

- [ ] **Step 3: Commit cleanup**

```bash
git commit -m "chore: remove sample projects and finalize project list"
```

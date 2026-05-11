# Design Spec: Projects Section Improvement (Technical Snapshots)

**Date:** 2026-05-11
**Topic:** Improving the portfolio projects section by integrating GitHub repository data.

## 1. Goal
Update the `projects` section of `tirsonavarro.dev` to showcase 7 key GitHub repositories as "Technical Snapshots." The goal is to provide concise, high-signal technical overviews that drive users toward the source code on GitHub.

## 2. Approach: Technical Snapshots (Option B)
Every project will have:
- A card on the main `/projects` grid.
- A concise internal MDX page serving as a technical pitch.
- A prominent "View Source on GitHub" call-to-action.

## 3. Architecture & Data Structure

### 3.1 MDX Schema
New files will be created in `content/projects/*.mdx` with the following frontmatter:
- `title`: String
- `description`: One-sentence technical hook
- `tags`: Array of strings (technologies/domains)
- `githubUrl`: Full URL to the GitHub repository

### 3.2 Projects to be Added
1. `agent-poker`: AI-Agent Poker Platform (TypeScript/REST)
2. `shopify-loyalty-rewards-app`: Tiered Loyalty System (Remix/Metafields)
3. `openclaw-dashboard`: OpenClaw Management UI (React/Framer Motion)
4. `scrape-scripts`: Scalable Crawler System (Python/Scrapy/FastAPI)
5. `jhu-agentic-ai`: Multi-agent Orchestration Coursework (Python)
6. `transcribe-script`: Whisper AI Pipeline (Python/Obsidian)
7. `discord-ai-bot`: OpenAI Assistant Bot (JavaScript/Docker)

## 4. UI/UX Changes

### 4.1 Grid View (`/projects`)
- Maintain the current responsive grid and technical aesthetic.
- Ensure tags are consistent across all new projects.

### 4.2 Detail View (`/projects/$slug`)
- Render MDX content using the existing component.
- Add a persistent "View Source on GitHub" button component that pulls the `githubUrl` from frontmatter.

## 5. Implementation Plan
1. **Scaffold MDX:** Create 7 new files in `content/projects/` with synthesized overviews.
2. **Update Detail Route:** Modify `app/routes/projects.$slug.tsx` to display the GitHub link.
3. **Refine Styling:** Add a `githubButton` class to `Projects.module.css` for the CTA.
4. **Cleanup:** Remove old placeholder MDX files (`hermes.mdx`, `openclaw.mdx`).

## 6. Success Criteria
- All 7 projects are navigable and display correct metadata.
- "View Source" buttons correctly link to `tn-py` repositories.
- Visual consistency is maintained with the "Agentic Architect" theme.

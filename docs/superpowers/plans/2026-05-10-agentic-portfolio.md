# Agentic Architect Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-performance developer portfolio using Remix and Vanilla CSS, featuring a Command Palette, MCP Visualization, and a Live Status Terminal.

**Architecture:** A 4-page Remix application (Home, Projects, Research, Stack) using MDX for content and Vanilla CSS for a precise "Agentic" aesthetic.

**Tech Stack:** Remix v2, TypeScript, Vanilla CSS (CSS Modules), MDX, GitHub API.

---

### Task 1: Project Initialization

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`
- Create: `app/root.tsx`, `app/entry.client.tsx`, `app/entry.server.tsx`
- Create: `app/styles/global.css`

- [ ] **Step 1: Scaffold Remix project**
Run: `npx create-remix@latest . --template remix-run/remix/templates/vite --typescript --install --no-git-init`

- [ ] **Step 2: Add global Agentic styles**
```css
/* app/styles/global.css */
:root {
  --bg-primary: #0d1117;
  --bg-secondary: #161b22;
  --text-primary: #c9d1d9;
  --text-secondary: #8b949e;
  --accent-blue: #58a6ff;
  --accent-green: #7ee787;
  --border-color: #30363d;
  --font-mono: 'JetBrains Mono', monospace;
  --font-sans: 'Inter', system-ui, sans-serif;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-sans);
  margin: 0;
}

h1, h2, h3, .mono {
  font-family: var(--font-mono);
}
```

- [ ] **Step 3: Update root.tsx with global styles**
```tsx
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import "./styles/global.css";

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Commit**
```bash
git add .
git commit -m "chore: initialize remix project with agentic styles"
```

---

### Task 2: Layout & Navigation

**Files:**
- Create: `app/components/Layout.tsx`
- Create: `app/components/Navbar.tsx`

- [ ] **Step 1: Implement Navbar**
Include links for Home, Projects, Research, and Stack.

- [ ] **Step 2: Implement Layout component**
Wrap `Outlet` in `root.tsx` with this Layout.

- [ ] **Step 3: Commit**
```bash
git add app/components/
git commit -m "feat: add basic layout and navigation"
```

---

### Task 3: Command Palette (Interactivity)

**Files:**
- Create: `app/components/CommandPalette.tsx`
- Modify: `app/root.tsx`

- [ ] **Step 1: Implement CommandPalette component**
Use `cmdk` or a custom implementation for CMD+K support.

- [ ] **Step 2: Register keyboard listener in root**

- [ ] **Step 3: Commit**
```bash
git add app/components/CommandPalette.tsx
git commit -m "feat: implement CMD+K command palette"
```

---

### Task 4: Home Page & Agent Log

**Files:**
- Create: `app/routes/_index.tsx`
- Create: `app/components/AgentLog.tsx`

- [ ] **Step 1: Implement Hero section**
- [ ] **Step 2: Implement AgentLog (Terminal style feed)**
- [ ] **Step 3: Commit**
```bash
git add app/routes/_index.tsx app/components/AgentLog.tsx
git commit -m "feat: add home page hero and agent log"
```

---

### Task 5: MCP Visualization (Node-Link Diagram)

**Files:**
- Create: `app/components/MCPViz.tsx`

- [ ] **Step 1: Implement SVG-based node diagram**
- [ ] **Step 2: Add hover interactivity to nodes**
- [ ] **Step 3: Commit**
```bash
git add app/components/MCPViz.tsx
git commit -m "feat: implement interactive MCP visualization"
```

---

### Task 6: Projects Section (Harnesses & Shopify)

**Files:**
- Create: `app/routes/projects._index.tsx`
- Create: `app/routes/projects.$slug.tsx`
- Create: `content/projects/openclaw.mdx`
- Create: `content/projects/hermes.mdx`

- [ ] **Step 1: Setup MDX processing**
- [ ] **Step 2: Write project content**
- [ ] **Step 3: Commit**
```bash
git add app/routes/projects* content/projects/
git commit -m "feat: add projects section with MDX"
```

---

### Task 7: Research & Live Status Terminal

**Files:**
- Create: `app/routes/research._index.tsx`
- Create: `app/components/StatusTerminal.tsx`

- [ ] **Step 1: Fetch GitHub activity for StatusTerminal**
- [ ] **Step 2: Implement Research blog list**
- [ ] **Step 3: Commit**
```bash
git add app/routes/research* app/components/StatusTerminal.tsx
git commit -m "feat: add research section and live status terminal"
```

---

### Task 8: Stack Page

**Files:**
- Create: `app/routes/stack.tsx`

- [ ] **Step 1: Implement interactive tech stack breakdown**
- [ ] **Step 2: Commit**
```bash
git add app/routes/stack.tsx
git commit -m "feat: add stack page"
```

---

### Task 9: Final Polish & Deployment Prep

- [ ] **Step 1: Optimize for Core Web Vitals**
- [ ] **Step 2: Add meta tags and SEO**
- [ ] **Step 3: Commit**
```bash
git add .
git commit -m "chore: final polish and SEO optimization"
```

# Research & Live Status Terminal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Research page and a Live Status Terminal component fetching GitHub activity.

**Architecture:** 
- `StatusTerminal` component: Fetches GitHub events via `useEffect` and displays them in a CLI-style interface.
- `ResearchIndex` route: Displays the `StatusTerminal` followed by a list of research posts.
- CSS Modules for component and route styling.

**Tech Stack:** React (Remix), TypeScript, CSS Modules, GitHub Events API.

---

### Task 1: StatusTerminal Component Styles

**Files:**
- Create: `app/components/StatusTerminal.module.css`

- [ ] **Step 1: Write CSS for StatusTerminal**

```css
.container {
  background-color: #1a1a1a;
  color: #00ff00;
  font-family: 'Courier New', Courier, monospace;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #333;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid #333;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #888;
}

.dot {
  width: 10px;
  height: 10px;
  background-color: #00ff00;
  border-radius: 50%;
  animation: blink 1s infinite;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
}

.logEntries {
  height: 200px;
  overflow-y: auto;
  font-size: 0.85rem;
  line-height: 1.4;
}

.entry {
  margin-bottom: 0.4rem;
  display: flex;
  gap: 0.5rem;
}

.timestamp {
  color: #666;
  white-space: nowrap;
}

.type {
  color: #0088ff;
  font-weight: bold;
}

.message {
  color: #ddd;
}

.loading, .error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #888;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/StatusTerminal.module.css
git commit -m "style: add StatusTerminal styles"
```

---

### Task 2: StatusTerminal Component Implementation

**Files:**
- Create: `app/components/StatusTerminal.tsx`

- [ ] **Step 1: Write StatusTerminal component**

```tsx
import { useEffect, useState } from "react";
import styles from "./StatusTerminal.module.css";

interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: {
    name: string;
  };
  payload: {
    commits?: { message: string }[];
    ref?: string;
    ref_type?: string;
    action?: string;
    issue?: { number: number };
  };
}

export function StatusTerminal() {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("https://api.github.com/users/tn-py/events");
        if (!response.ok) throw new Error("Failed to fetch GitHub activity");
        const data = await response.json();
        setEvents(data.slice(0, 10));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Connection failed");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const formatEvent = (event: GitHubEvent) => {
    const timestamp = new Date(event.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    
    let message = "";
    switch (event.type) {
      case "PushEvent":
        const count = event.payload.commits?.length || 0;
        message = `Pushed ${count} commit${count !== 1 ? "s" : ""} to ${event.repo.name}`;
        break;
      case "CreateEvent":
        message = `Created ${event.payload.ref_type} ${event.payload.ref || ""} in ${event.repo.name}`;
        break;
      case "WatchEvent":
        message = `Starred ${event.repo.name}`;
        break;
      case "IssuesEvent":
        message = `${event.payload.action} issue #${event.payload.issue?.number} in ${event.repo.name}`;
        break;
      default:
        message = `${event.type.replace("Event", "")} in ${event.repo.name}`;
    }

    return { timestamp, type: event.type.replace("Event", ""), message };
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.dot} />
        <span>TERMINAL // LIVE_GITHUB_ACTIVITY // STATUS: CONNECTED</span>
      </div>
      <div className={styles.logEntries}>
        {loading ? (
          <div className={styles.loading}>Initializing terminal connection...</div>
        ) : error ? (
          <div className={styles.error}>Error: {error}</div>
        ) : (
          events.map((event) => {
            const formatted = formatEvent(event);
            return (
              <div key={event.id} className={styles.entry}>
                <span className={styles.timestamp}>[{formatted.timestamp}]</span>
                <span className={styles.type}>[{formatted.type}]</span>
                <span className={styles.message}>{formatted.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/StatusTerminal.tsx
git commit -m "feat: implement StatusTerminal component"
```

---

### Task 3: Research Page Styles

**Files:**
- Create: `app/styles/Research.module.css`

- [ ] **Step 1: Write CSS for Research page**

```css
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--text-secondary);
  font-family: var(--font-mono);
  margin-bottom: 2rem;
}

.postsList {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 3rem;
}

.postCard {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 2rem;
  border-radius: 8px;
}

.postHeader {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1rem;
}

.postTitle {
  margin: 0;
  color: var(--accent-blue);
  font-size: 1.75rem;
}

.postDate {
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 0.9rem;
}

.postSummary {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-family: var(--font-mono);
  color: var(--accent-green);
}
```

- [ ] **Step 2: Commit**

```bash
git add app/styles/Research.module.css
git commit -m "style: add Research page styles"
```

---

### Task 4: Research Route Implementation

**Files:**
- Create: `app/routes/research._index.tsx`

- [ ] **Step 1: Write Research index route**

```tsx
import { StatusTerminal } from "~/components/StatusTerminal";
import styles from "~/styles/Research.module.css";

const RESEARCH_POSTS = [
  {
    id: 1,
    title: "The Rise of Agentic Workflows",
    date: "2024-05-10",
    summary: "Exploring how autonomous agents are shifting the paradigm from 'human-in-the-loop' to 'human-on-the-loop' for complex software engineering tasks.",
    tags: ["AI Agents", "Workflows", "Future of Work"],
  },
  {
    id: 2,
    title: "Model Context Protocol: A Deep Dive",
    date: "2024-04-22",
    summary: "An analysis of the MCP architecture and its potential to standardize how LLMs interact with external tools and data sources.",
    tags: ["MCP", "LLMs", "Interoperability"],
  },
  {
    id: 3,
    title: "Autonomous Debugging with Gemini CLI",
    date: "2024-03-15",
    summary: "How CLI-based agents can navigate codebases, identify bugs, and propose fixes with minimal human intervention.",
    tags: ["Gemini", "CLI", "Autonomous Coding"],
  },
];

export default function ResearchIndex() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Research</h1>
      <p className={styles.subtitle}>// EXPLORATION_LOGS</p>
      
      <StatusTerminal />

      <div className={styles.postsList}>
        {RESEARCH_POSTS.map((post) => (
          <div key={post.id} className={styles.postCard}>
            <div className={styles.postHeader}>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <span className={styles.postDate}>// {post.date}</span>
            </div>
            <p className={post.postSummary}>{post.summary}</p>
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/routes/research._index.tsx
git commit -m "feat: add research index route with hardcoded posts"
```

---

### Task 5: Verification

- [ ] **Step 1: Verify the Research page loads**
Navigate to `/research` and ensure the page renders without errors.

- [ ] **Step 2: Verify StatusTerminal fetches data**
Check if the terminal shows real GitHub activity. If you hit rate limits, ensure it shows the error message gracefully.

- [ ] **Step 3: Verify responsive layout**
Check the page on different screen sizes.

# Layout & Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a consistent layout and navigation system for the Agentic portfolio.

**Architecture:** A `Layout` component wrapping the main `Outlet`, containing a `Navbar` with navigation links. Uses CSS Modules for styling.

**Tech Stack:** Remix (React), Vanilla CSS (CSS Modules).

---

### Task 1: Create Navbar Component

**Files:**
- Create: `app/components/Navbar.tsx`
- Create: `app/components/Navbar.module.css`

- [ ] **Step 1: Create Navbar.module.css**
```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  font-family: var(--font-mono);
}

.links {
  display: flex;
  gap: 1.5rem;
}

.link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.link:hover {
  color: var(--accent-blue);
}

.active {
  color: var(--text-primary);
  border-bottom: 2px solid var(--accent-blue);
}
```

- [ ] **Step 2: Create Navbar.tsx**
```tsx
import { NavLink } from "@remix-run/react";
import styles from "./Navbar.module.css";

export function Navbar() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/projects", label: "Projects" },
    { to: "/research", label: "Research" },
    { to: "/stack", label: "Stack" },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <NavLink to="/" className={styles.link}>AGENTIC</NavLink>
      </div>
      <div className={styles.links}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Commit**
```bash
git add app/components/Navbar.tsx app/components/Navbar.module.css
git commit -m "feat: add Navbar component"
```

---

### Task 2: Create Layout Component

**Files:**
- Create: `app/components/Layout.tsx`
- Create: `app/components/Layout.module.css`

- [ ] **Step 1: Create Layout.module.css**
```css
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
```

- [ ] **Step 2: Create Layout.tsx**
```tsx
import React from "react";
import { Navbar } from "./Navbar";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Commit**
```bash
git add app/components/Layout.tsx app/components/Layout.module.css
git commit -m "feat: add Layout component"
```

---

### Task 3: Integrate Layout in Root

**Files:**
- Modify: `app/root.tsx`

- [ ] **Step 1: Update app/root.tsx**
```tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./styles/global.css";
import { Layout } from "./components/Layout";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap",
  },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**
```bash
git add app/root.tsx
git commit -m "feat: integrate Layout in root"
```

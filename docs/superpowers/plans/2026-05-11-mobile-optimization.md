# Mobile Optimization & "Command Center" Nav Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the navigation into a floating "Command Center" HUD and fix all mobile horizontal overflow issues.

**Architecture:** Floating navbar for desktop, fullscreen "Terminal Overlay" for mobile, and global box-sizing reset.

**Tech Stack:** React, Remix, CSS Modules, Framer Motion (for animations).

---

### Task 1: Global Layout & Overflow Fix

**Files:**
- Modify: `app/styles/global.css`
- Modify: `app/components/Layout.module.css`

- [ ] **Step 1: Implement Global Reset**
Update `app/styles/global.css` to include a proper box-sizing reset and responsive gutters.

```css
*, *::before, *::after {
  box-sizing: border-box;
}

:root {
  /* ... existing vars ... */
  --page-gutter: 2rem;
}

@media (max-width: 768px) {
  :root {
    --page-gutter: 1rem;
  }
}

html, body {
  max-width: 100vw;
  overflow-x: hidden;
}
```

- [ ] **Step 2: Update Layout container**
Update `app/components/Layout.module.css` to use the new gutters and fix the width.

```css
.main {
  flex: 1;
  padding: 2rem var(--page-gutter);
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
```

- [ ] **Step 3: Commit global fixes**
```bash
git add app/styles/global.css app/components/Layout.module.css
git commit -m "style: fix global box-sizing and horizontal overflow"
```

---

### Task 2: Redesign Homepage Typography

**Files:**
- Modify: `app/styles/Home.module.css`

- [ ] **Step 1: Make Hero responsive**
Adjust font sizes in `app/styles/Home.module.css` to prevent overflow on mobile.

```css
.hero h1 {
  font-size: clamp(2rem, 8vw, 3.5rem);
  /* ... rest ... */
}
```

- [ ] **Step 2: Commit hero styles**
```bash
git add app/styles/Home.module.css
git commit -m "style: make homepage hero typography responsive"
```

---

### Task 3: Redesign Navbar (Floating HUD)

**Files:**
- Modify: `app/components/Navbar.tsx`
- Modify: `app/components/Navbar.module.css`

- [ ] **Step 1: Update Navbar logic for mobile toggle**
Update `app/components/Navbar.tsx` to handle the `isMenuOpen` state.

- [ ] **Step 2: Add Floating HUD Styles**
Update `app/components/Navbar.module.css` with the "Command Center" aesthetic.

```css
.navbar {
  position: fixed;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  background-color: rgba(22, 27, 34, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border-color);
  padding: 0.75rem 2rem;
  border-radius: 99px;
  width: max-content;
  max-width: calc(100vw - 2rem);
}

/* Add styles for .menuToggle and .terminalOverlay */
```

- [ ] **Step 3: Implement Terminal Overlay for Mobile**
Add the fullscreen overlay logic that triggers on small screens.

- [ ] **Step 4: Commit Navbar redesign**
```bash
git add app/components/Navbar.tsx app/components/Navbar.module.css
git commit -m "feat: implement floating command center navbar and terminal overlay"
```

---

### Task 4: Final Verification

- [ ] **Step 1: Check mobile layout**
Use `agent-browser` to verify `document.documentElement.scrollWidth <= document.documentElement.clientWidth` at 375px width.

- [ ] **Step 2: Verify Navbar interactions**
Test the mobile toggle and navigation links.

- [ ] **Step 3: Final Commit**
```bash
git commit -m "chore: finalize mobile optimization and navigation redesign"
```

# Research & Live Status Terminal Design

**Date:** 2024-05-10
**Topic:** Research Section and GitHub Activity Terminal

## 1. Overview
The Research section serves as a technical blog and activity hub for the portfolio. It highlights active exploration into AI Agents, Model Context Protocol (MCP), and other technical domains.

## 2. Architecture

### 2.1 Components
- `StatusTerminal`: A standalone component that fetches and displays live GitHub activity.
- `ResearchIndex`: The main route for `/research`, managing the layout and research post list.

### 2.2 Data Flow
- `StatusTerminal` uses a client-side `useEffect` to fetch data from `https://api.github.com/users/tn-py/events`.
- Research posts are currently hardcoded in the `ResearchIndex` route.

## 3. UI/UX Design

### 3.1 StatusTerminal
- **Visuals:** Dark background (`#1e1e1e` or similar), `var(--accent-green)` or `var(--accent-blue)` text. Monospaced font.
- **Header:** "TERMINAL // LIVE_ACTIVITY", blinking green dot, "STATUS: CONNECTED".
- **Body:** List of latest 5-10 GitHub events.
- **Event Formatting:**
  - `PushEvent`: `[TIMESTAMP] Pushed [N] commits to [REPO]`
  - `CreateEvent`: `[TIMESTAMP] Created [REF_TYPE] [REF] in [REPO]`
  - `WatchEvent`: `[TIMESTAMP] Starred [REPO]`
  - Default: `[TIMESTAMP] [EVENT_TYPE] in [REPO]`

### 3.2 Research Page Layout
- **Container:** Max-width 1000px, centered.
- **Top Section:** `StatusTerminal`.
- **Bottom Section:** `Research Posts` list. Each post shows:
  - Title
  - Date (e.g., "// 2024-05-10")
  - Summary
  - Tags

## 4. Implementation Plan

### 4.1 StatusTerminal
- Define `GitHubEvent` interface.
- Implement `formatEvent` helper function.
- Use `useState` for events, loading, and error states.
- `useEffect` for fetching data on mount.

### 4.2 Research Route
- Create `app/routes/research._index.tsx`.
- Define hardcoded `RESEARCH_POSTS`.
- Use `Research.module.css` for styling.

## 5. Testing & Verification
- Verify GitHub API response mapping.
- Ensure terminal handles loading and error states (e.g., rate limiting).
- Check responsive layout.

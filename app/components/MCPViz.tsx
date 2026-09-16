import { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  type Node as RFNode,
  type Edge as RFEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TerminalNode } from "./TerminalNode";
import styles from "./MCPViz.module.css";

const nodeTypes = {
  terminal: TerminalNode,
};

const INITIAL_NODES: RFNode[] = [
  // ─── CORE HUB ───
  {
    id: "ops", type: "terminal", position: { x: 550, y: 380 },
    data: { label: "E-COMMERCE OPS", description: "Central command for catalog, inventory, and agentic automation workflows.", type: "CORE", isHarness: true },
  },

  // ─── DOMAIN HUBS ───
  {
    id: "agentic-ai", type: "terminal", position: { x: 550, y: 130 },
    data: { label: "AGENTIC AI", description: "Multi-agent orchestration, RAG pipelines, and LLM-driven tooling.", type: "HUB", isHarness: true },
  },
  {
    id: "ecomm", type: "terminal", position: { x: 200, y: 380 },
    data: { label: "E-COMMERCE SYSTEMS", description: "Core business platforms for storefront and enterprise resource management.", type: "HUB", isHarness: true },
  },
  {
    id: "frontend", type: "terminal", position: { x: 900, y: 380 },
    data: { label: "FRONTEND", description: "Modern UI stack for performant, interactive web applications.", type: "HUB", isHarness: true },
  },
  {
    id: "backend", type: "terminal", position: { x: 300, y: 600 },
    data: { label: "BACKEND & SCRIPTING", description: "Server-side logic, automation scripts, and API integrations.", type: "HUB", isHarness: true },
  },
  {
    id: "infra", type: "terminal", position: { x: 800, y: 600 },
    data: { label: "INFRASTRUCTURE", description: "Self-hosted containerized stack running on homelab hardware.", type: "HUB", isHarness: true },
  },

  // ─── AGENTIC AI ───
  {
    id: "langgraph", type: "terminal", position: { x: 300, y: 20 },
    data: { label: "LANGGRAPH", description: "Stateful multi-agent orchestration framework for complex, cyclic AI workflows.", type: "AI_TOOL" },
  },
  {
    id: "chromadb", type: "terminal", position: { x: 800, y: 20 },
    data: { label: "CHROMADB", description: "Vector database powering high-performance RAG and semantic knowledge retrieval.", type: "DB" },
  },
  {
    id: "claude", type: "terminal", position: { x: 550, y: -60 },
    data: { label: "CLAUDE AI", description: "Anthropic LLM used for agentic coding, tool use, and multi-step orchestration.", type: "LLM" },
  },
  {
    id: "selector-sage", type: "terminal", position: { x: 820, y: 130 },
    data: { label: "SELECTOR SAGE", description: "AI-powered hardware product recommendation agent built with Python and LLM tool calling.", type: "PROJECT" },
  },

  // ─── E-COMMERCE ───
  {
    id: "shopify", type: "terminal", position: { x: -60, y: 240 },
    data: { label: "SHOPIFY", description: "Primary storefront platform — custom themes, Shopify Liquid, Shopify Flow automation, customer segments, and embedded app development.", type: "STOREFRONT" },
  },
  {
    id: "netsuite", type: "terminal", position: { x: -60, y: 380 },
    data: { label: "NETSUITE", description: "Enterprise ERP for synchronized inventory management and financial operations.", type: "ERP" },
  },
  {
    id: "matrixify", type: "terminal", position: { x: -60, y: 510 },
    data: { label: "MATRIXIFY", description: "Bulk catalog import/export pipeline tool for high-SKU Shopify operations.", type: "OPS_TOOL" },
  },
  {
    id: "searchspring", type: "terminal", position: { x: 100, y: 130 },
    data: { label: "SEARCHSPRING", description: "Product discovery platform — custom relevance rules, merchandising, and A/B testing.", type: "SEARCH" },
  },
  {
    id: "onesignal", type: "terminal", position: { x: 100, y: 630 },
    data: { label: "ONESIGNAL", description: "Cross-platform push notification delivery for iOS, Android, and web channels.", type: "NOTIFY" },
  },

  // ─── FRONTEND ───
  {
    id: "react", type: "terminal", position: { x: 1100, y: 240 },
    data: { label: "REACT", description: "Component-based UI library for building dynamic, stateful interfaces.", type: "FRAMEWORK" },
  },
  {
    id: "nextjs", type: "terminal", position: { x: 1250, y: 380 },
    data: { label: "NEXT.JS", description: "Full-stack React framework with SSR, file-based routing, and built-in API routes.", type: "FRAMEWORK" },
  },
  {
    id: "typescript", type: "terminal", position: { x: 1100, y: 510 },
    data: { label: "TYPESCRIPT", description: "Typed JavaScript superset for safer, scalable frontend and backend codebases.", type: "LANGUAGE" },
  },
  {
    id: "framer", type: "terminal", position: { x: 900, y: 560 },
    data: { label: "FRAMER MOTION", description: "Animation library for fluid React transitions, gestures, and layout animations.", type: "ANIMATION" },
  },

  // ─── BACKEND & SCRIPTING ───
  {
    id: "python", type: "terminal", position: { x: 100, y: 690 },
    data: { label: "PYTHON", description: "Primary scripting language for agentic tools, automation pipelines, and data processing.", type: "LANGUAGE" },
  },
  {
    id: "nodejs", type: "terminal", position: { x: 200, y: 790 },
    data: { label: "NODE.JS", description: "JavaScript runtime for backend services, REST APIs, and server-side automation.", type: "RUNTIME" },
  },
  {
    id: "puppeteer", type: "terminal", position: { x: 420, y: 790 },
    data: { label: "PUPPETEER", description: "Headless browser automation for web scraping, data extraction, and UI testing.", type: "AUTOMATION" },
  },

  // ─── INFRASTRUCTURE ───
  {
    id: "docker", type: "terminal", position: { x: 680, y: 760 },
    data: { label: "DOCKER", description: "Containerization layer for reproducible, portable service deployments.", type: "CONTAINER" },
  },
  {
    id: "coolify", type: "terminal", position: { x: 900, y: 760 },
    data: { label: "COOLIFY", description: "Self-hosted PaaS managing containerized apps and deployments on homelab hardware.", type: "PAAS" },
  },
  {
    id: "linux", type: "terminal", position: { x: 1050, y: 640 },
    data: { label: "LINUX", description: "Primary OS for server management, shell scripting, and homelab operations.", type: "OS" },
  },
  {
    id: "github", type: "terminal", position: { x: 660, y: 510 },
    data: { label: "GITHUB", description: "Version control and CI/CD hub for all active projects and open-source work.", type: "VCS" },
  },

  // ─── NEW AGENTIC AI ───
  {
    id: "ollama", type: "terminal", position: { x: 400, y: 0 },
    data: { label: "OLLAMA", description: "Local LLM inference server running open-weight models for private, low-latency agentic workflows.", type: "LLM" },
  },
  {
    id: "openai", type: "terminal", position: { x: 700, y: -60 },
    data: { label: "OPENAI", description: "GPT-series and o-series models used for agentic reasoning, structured outputs, and API-driven automation.", type: "LLM" },
  },
  {
    id: "langchain", type: "terminal", position: { x: 300, y: 90 },
    data: { label: "LANGCHAIN", description: "Orchestration framework for chaining LLM calls, tools, and memory in composable agentic pipelines.", type: "AI_TOOL" },
  },
  {
    id: "mcp-servers", type: "terminal", position: { x: 400, y: -60 },
    data: { label: "MCP SERVERS", description: "Model Context Protocol servers bridging AI agents to external tools, APIs, and real-time data sources.", type: "AI_TOOL" },
  },
  {
    id: "tavily", type: "terminal", position: { x: 800, y: 60 },
    data: { label: "TAVILY", description: "AI-optimized web search API delivering real-time context for agentic research and retrieval-augmented generation.", type: "AI_TOOL" },
  },

  // ─── NEW E-COMMERCE ───
  {
    id: "n8n", type: "terminal", position: { x: -60, y: 70 },
    data: { label: "N8N", description: "Visual workflow automation platform connecting APIs, databases, and e-commerce systems with custom logic.", type: "AUTOMATION" },
  },

  // ─── NEW INFRASTRUCTURE ───
  {
    id: "proxmox", type: "terminal", position: { x: 1050, y: 760 },
    data: { label: "PROXMOX", description: "Open-source virtualization platform managing homelab VMs and LXC containers for self-hosted infrastructure.", type: "HYPERVISOR" },
  },
  {
    id: "cloudflare", type: "terminal", position: { x: 1050, y: 870 },
    data: { label: "CLOUDFLARE", description: "Edge CDN, DNS, DDoS protection, and Workers-based serverless compute for global application delivery.", type: "NETWORK" },
  },

  // ─── AGENT HARNESSES (sub-hub of Agentic AI) ───
  {
    id: "agent-harnesses", type: "terminal", position: { x: 80, y: -220 },
    data: { label: "AGENT HARNESSES", description: "Daily-driver CLI and IDE harnesses used to run LLMs against real coding and automation workflows.", type: "SUB_HUB", isHarness: true },
  },
  {
    id: "claude-code", type: "terminal", position: { x: -180, y: -320 },
    data: { label: "CLAUDE CODE", description: "Anthropic's official agentic CLI — primary daily driver for terminal-based software engineering.", type: "AGENT_HARNESS" },
  },
  {
    id: "opencode", type: "terminal", position: { x: -20, y: -380 },
    data: { label: "OPENCODE", description: "Open-source, model-agnostic terminal coding agent supporting multiple LLM backends.", type: "AGENT_HARNESS" },
  },
  {
    id: "antigravity-cli", type: "terminal", position: { x: 160, y: -380 },
    data: { label: "ANTIGRAVITY CLI", description: "Agentic coding CLI harness used for autonomous, multi-step development workflows.", type: "AGENT_HARNESS" },
  },
  {
    id: "codex", type: "terminal", position: { x: 320, y: -320 },
    data: { label: "CODEX", description: "OpenAI's agentic coding CLI — terminal-based harness for autonomous development tasks.", type: "AGENT_HARNESS" },
  },
  {
    id: "openclaw", type: "terminal", position: { x: -180, y: -140 },
    data: { label: "OPENCLAW", description: "Self-hosted autonomous agent runtime, monitored and controlled via a custom local dashboard.", type: "AGENT_HARNESS" },
  },
  {
    id: "hermes", type: "terminal", position: { x: 320, y: -140 },
    data: { label: "HERMES", description: "Daily-driver agent harness used for everyday task orchestration and automation.", type: "AGENT_HARNESS" },
  },

  // ─── AGENTIC AI (ADDITIONAL) ───
  {
    id: "pinecone", type: "terminal", position: { x: 980, y: 20 },
    data: { label: "PINECONE", description: "Managed vector database for scalable similarity search in production RAG pipelines.", type: "DB" },
  },
  {
    id: "crewai", type: "terminal", position: { x: 130, y: 20 },
    data: { label: "CREWAI", description: "Role-based multi-agent framework for orchestrating collaborative AI agent crews.", type: "AI_TOOL" },
  },
  {
    id: "browser-agents", type: "terminal", position: { x: 980, y: 130 },
    data: { label: "BROWSER AGENTS", description: "AI-driven browser automation — agents that perceive and act on live web pages via computer-use style control.", type: "AI_TOOL" },
  },

  // ─── E-COMMERCE (ADDITIONAL) ───
  {
    id: "klaviyo", type: "terminal", position: { x: -220, y: 630 },
    data: { label: "KLAVIYO", description: "Email/SMS lifecycle marketing platform — flows, segments, lists, and campaign orchestration.", type: "MARKETING" },
  },
  {
    id: "stripe", type: "terminal", position: { x: -220, y: 310 },
    data: { label: "STRIPE", description: "Payment processing integration — checkout, subscriptions, and webhook-driven order flows.", type: "PAYMENT" },
  },
  {
    id: "authorize-net", type: "terminal", position: { x: -220, y: 460 },
    data: { label: "AUTHORIZE.NET", description: "Payment gateway integration for card-present and card-not-present transactions.", type: "PAYMENT" },
  },
  {
    id: "meilisearch", type: "terminal", position: { x: 100, y: 240 },
    data: { label: "MEILISEARCH", description: "Fast, typo-tolerant open-source search engine used as a lightweight alternative to hosted search platforms.", type: "SEARCH" },
  },

  // ─── FRONTEND (ADDITIONAL) ───
  {
    id: "remix", type: "terminal", position: { x: 1400, y: 240 },
    data: { label: "REMIX", description: "Full-stack React framework built on web standards — nested routing, loaders/actions, and progressive enhancement. Powers this site.", type: "FRAMEWORK" },
  },
  {
    id: "tailwind", type: "terminal", position: { x: 1400, y: 380 },
    data: { label: "TAILWIND CSS", description: "Utility-first CSS framework for rapid, consistent UI styling.", type: "STYLING" },
  },
  {
    id: "vite", type: "terminal", position: { x: 1400, y: 510 },
    data: { label: "VITE", description: "Fast dev server and build tool powering modern frontend tooling.", type: "BUILD_TOOL" },
  },
  {
    id: "shadcn", type: "terminal", position: { x: 1550, y: 380 },
    data: { label: "SHADCN/UI", description: "Composable, unstyled component primitives for building accessible design systems on top of Tailwind.", type: "UI_KIT" },
  },

  // ─── MOBILE ───
  {
    id: "mobile", type: "terminal", position: { x: 1400, y: 650 },
    data: { label: "MOBILE", description: "Cross-platform mobile development for consumer-facing e-commerce apps.", type: "HUB", isHarness: true },
  },
  {
    id: "expo", type: "terminal", position: { x: 1550, y: 600 },
    data: { label: "EXPO", description: "React Native tooling and managed workflow for building and shipping cross-platform mobile apps.", type: "FRAMEWORK" },
  },
  {
    id: "react-native", type: "terminal", position: { x: 1550, y: 730 },
    data: { label: "REACT NATIVE", description: "Cross-platform mobile framework for building native iOS/Android apps from a shared React codebase.", type: "FRAMEWORK" },
  },

  // ─── DATABASES ───
  {
    id: "databases", type: "terminal", position: { x: 0, y: 950 },
    data: { label: "DATABASES", description: "Data persistence layer spanning relational, embedded, and backend-as-a-service systems.", type: "HUB", isHarness: true },
  },
  {
    id: "postgres", type: "terminal", position: { x: -180, y: 1050 },
    data: { label: "POSTGRES", description: "Primary relational database for structured application data and transactional workloads.", type: "DB" },
  },
  {
    id: "redis", type: "terminal", position: { x: 0, y: 1080 },
    data: { label: "REDIS", description: "In-memory data store for caching, queues, and session state.", type: "DB" },
  },
  {
    id: "sqlite", type: "terminal", position: { x: 180, y: 1050 },
    data: { label: "SQLITE", description: "Embedded file-based database for lightweight local and edge applications.", type: "DB" },
  },
  {
    id: "supabase", type: "terminal", position: { x: 350, y: 1080 },
    data: { label: "SUPABASE", description: "Postgres-backed backend-as-a-service — auth, storage, and realtime subscriptions for rapid app development.", type: "DB" },
  },
  {
    id: "pocketbase", type: "terminal", position: { x: 520, y: 1050 },
    data: { label: "POCKETBASE", description: "Lightweight self-hosted backend with embedded SQLite, realtime subscriptions, and built-in auth.", type: "DB" },
  },

  // ─── DEVOPS / CI-CD ───
  {
    id: "devops-cicd", type: "terminal", position: { x: 900, y: 950 },
    data: { label: "DEVOPS / CI-CD", description: "Automated pipelines and configuration management for shipping and provisioning infrastructure.", type: "HUB", isHarness: true },
  },
  {
    id: "github-actions", type: "terminal", position: { x: 800, y: 1080 },
    data: { label: "GITHUB ACTIONS", description: "CI/CD pipelines for automated testing, builds, and deployments triggered on GitHub events.", type: "CI_CD" },
  },
  {
    id: "ansible", type: "terminal", position: { x: 1000, y: 1080 },
    data: { label: "ANSIBLE", description: "Configuration management for declaratively provisioning homelab services.", type: "IAC" },
  },

  // ─── TESTING / QA ───
  {
    id: "testing-qa", type: "terminal", position: { x: 600, y: 1000 },
    data: { label: "TESTING / QA", description: "Automated verification tooling for UI, workflow, and regression coverage.", type: "HUB", isHarness: true },
  },
  {
    id: "playwright", type: "terminal", position: { x: 600, y: 1120 },
    data: { label: "PLAYWRIGHT", description: "Cross-browser end-to-end testing framework for automated UI and workflow verification.", type: "TESTING" },
  },

  // ─── FLAGSHIP PROJECTS ───
  {
    id: "agentpoker", type: "terminal", position: { x: 1150, y: -60 },
    data: { label: "AGENTPOKER", description: "Texas Hold'em platform built for autonomous AI agents — stateless REST API with EVM/Solana wallet authentication.", type: "PROJECT" },
  },
  {
    id: "graphiti-mcpserver", type: "terminal", position: { x: 550, y: -220 },
    data: { label: "GRAPHITI MCP SERVER", description: "Self-hosted MCP server exposing a temporal knowledge graph to AI agents, deployed via Coolify.", type: "PROJECT" },
  },
  {
    id: "openclaw-dashboard", type: "terminal", position: { x: 900, y: 130 },
    data: { label: "OPENCLAW DASHBOARD", description: "Real-time management UI for monitoring and controlling local OpenClaw agent instances.", type: "PROJECT" },
  },
  {
    id: "search-by-vin", type: "terminal", position: { x: 1550, y: 130 },
    data: { label: "SEARCH BY VIN", description: "Vehicle lookup application built on Next.js and Supabase with a shadcn/ui component layer.", type: "PROJECT" },
  },
];

const INITIAL_EDGES: RFEdge[] = [
  // Core hub → domain hubs
  { id: "e-ops-ai",       source: "ops", target: "agentic-ai", animated: true },
  { id: "e-ops-ecomm",    source: "ops", target: "ecomm" },
  { id: "e-ops-frontend", source: "ops", target: "frontend" },
  { id: "e-ops-backend",  source: "ops", target: "backend" },
  { id: "e-ops-infra",    source: "ops", target: "infra" },

  // Agentic AI → leaves
  { id: "e-ai-langgraph", source: "agentic-ai", target: "langgraph", animated: true },
  { id: "e-ai-chromadb",  source: "agentic-ai", target: "chromadb" },
  { id: "e-ai-claude",    source: "agentic-ai", target: "claude", animated: true },
  { id: "e-ai-sage",      source: "agentic-ai", target: "selector-sage" },

  // E-Commerce → leaves
  { id: "e-ecomm-shopify",      source: "ecomm", target: "shopify" },
  { id: "e-ecomm-netsuite",     source: "ecomm", target: "netsuite" },
  { id: "e-ecomm-matrixify",    source: "ecomm", target: "matrixify" },
  { id: "e-ecomm-searchspring", source: "ecomm", target: "searchspring" },
  { id: "e-ecomm-onesignal",    source: "ecomm", target: "onesignal" },

  // Frontend → leaves
  { id: "e-fe-react",  source: "frontend", target: "react" },
  { id: "e-fe-nextjs", source: "frontend", target: "nextjs" },
  { id: "e-fe-ts",     source: "frontend", target: "typescript" },
  { id: "e-fe-framer", source: "frontend", target: "framer" },

  // Backend → leaves
  { id: "e-be-python",    source: "backend", target: "python" },
  { id: "e-be-nodejs",    source: "backend", target: "nodejs" },
  { id: "e-be-puppeteer", source: "backend", target: "puppeteer" },

  // Infrastructure → leaves
  { id: "e-infra-docker",  source: "infra", target: "docker" },
  { id: "e-infra-coolify", source: "infra", target: "coolify" },
  { id: "e-infra-linux",   source: "infra", target: "linux" },
  { id: "e-infra-github",  source: "infra", target: "github" },

  // Cross-links (knowledge graph flavor)
  { id: "e-python-sage",     source: "python",    target: "selector-sage" },
  { id: "e-chromadb-sage",   source: "chromadb",  target: "selector-sage" },
  { id: "e-docker-coolify",  source: "docker",    target: "coolify" },
  { id: "e-ts-react",        source: "typescript", target: "react" },

  // Agentic AI → new leaves
  { id: "e-ai-ollama",    source: "agentic-ai", target: "ollama", animated: true },
  { id: "e-ai-openai",    source: "agentic-ai", target: "openai", animated: true },
  { id: "e-ai-langchain", source: "agentic-ai", target: "langchain", animated: true },
  { id: "e-ai-mcp",       source: "agentic-ai", target: "mcp-servers", animated: true },
  { id: "e-ai-tavily",    source: "agentic-ai", target: "tavily" },

  // E-Commerce → new leaves
  { id: "e-ecomm-n8n", source: "ecomm", target: "n8n", animated: true },

  // Infrastructure → new leaves
  { id: "e-infra-proxmox",    source: "infra", target: "proxmox" },
  { id: "e-infra-cloudflare", source: "infra", target: "cloudflare" },

  // Cross-links (new)
  { id: "e-langchain-langgraph", source: "langchain", target: "langgraph" },
  { id: "e-mcp-claude",          source: "mcp-servers", target: "claude" },
  { id: "e-proxmox-coolify",     source: "proxmox", target: "coolify" },
  { id: "e-proxmox-linux",       source: "proxmox", target: "linux" },

  // Core hub → new domain hubs
  { id: "e-ops-mobile",  source: "ops", target: "mobile" },
  { id: "e-ops-db",      source: "ops", target: "databases" },
  { id: "e-ops-devops",  source: "ops", target: "devops-cicd" },
  { id: "e-ops-testing", source: "ops", target: "testing-qa" },

  // Agentic AI → additional leaves
  { id: "e-ai-pinecone",  source: "agentic-ai", target: "pinecone" },
  { id: "e-ai-crewai",    source: "agentic-ai", target: "crewai", animated: true },
  { id: "e-ai-browser",   source: "agentic-ai", target: "browser-agents", animated: true },
  { id: "e-ai-harnesses", source: "agentic-ai", target: "agent-harnesses", animated: true },
  { id: "e-ai-agentpoker",source: "agentic-ai", target: "agentpoker" },
  { id: "e-ai-graphiti",  source: "agentic-ai", target: "graphiti-mcpserver" },

  // Agent Harnesses → leaves
  { id: "e-harness-claudecode",  source: "agent-harnesses", target: "claude-code" },
  { id: "e-harness-opencode",    source: "agent-harnesses", target: "opencode" },
  { id: "e-harness-antigravity", source: "agent-harnesses", target: "antigravity-cli" },
  { id: "e-harness-codex",       source: "agent-harnesses", target: "codex" },
  { id: "e-harness-openclaw",    source: "agent-harnesses", target: "openclaw" },
  { id: "e-harness-hermes",      source: "agent-harnesses", target: "hermes" },

  // Harness cross-links
  { id: "e-claudecode-claude", source: "claude-code", target: "claude" },
  { id: "e-codex-openai",      source: "codex", target: "openai" },
  { id: "e-openclaw-dashboard",source: "openclaw", target: "openclaw-dashboard" },

  // E-Commerce → additional leaves
  { id: "e-ecomm-klaviyo",     source: "ecomm", target: "klaviyo" },
  { id: "e-ecomm-stripe",      source: "ecomm", target: "stripe" },
  { id: "e-ecomm-authnet",     source: "ecomm", target: "authorize-net" },
  { id: "e-ecomm-meilisearch", source: "ecomm", target: "meilisearch" },

  // Frontend → additional leaves
  { id: "e-fe-remix",    source: "frontend", target: "remix" },
  { id: "e-fe-tailwind", source: "frontend", target: "tailwind" },
  { id: "e-fe-vite",     source: "frontend", target: "vite" },
  { id: "e-fe-shadcn",   source: "frontend", target: "shadcn" },

  // Frontend → flagship projects
  { id: "e-fe-openclawdashboard", source: "frontend", target: "openclaw-dashboard" },
  { id: "e-fe-searchbyvin",       source: "frontend", target: "search-by-vin" },

  // Mobile → leaves
  { id: "e-mobile-expo",         source: "mobile", target: "expo" },
  { id: "e-mobile-reactnative",  source: "mobile", target: "react-native" },
  { id: "e-reactnative-react",   source: "react-native", target: "react" },
  { id: "e-expo-shopify",        source: "expo", target: "shopify" },

  // Databases → leaves
  { id: "e-db-postgres",   source: "databases", target: "postgres" },
  { id: "e-db-redis",      source: "databases", target: "redis" },
  { id: "e-db-sqlite",     source: "databases", target: "sqlite" },
  { id: "e-db-supabase",   source: "databases", target: "supabase" },
  { id: "e-db-pocketbase", source: "databases", target: "pocketbase" },
  { id: "e-supabase-searchbyvin", source: "supabase", target: "search-by-vin" },

  // DevOps/CI-CD → leaves
  { id: "e-devops-ghactions", source: "devops-cicd", target: "github-actions" },
  { id: "e-devops-ansible",   source: "devops-cicd", target: "ansible" },
  { id: "e-ghactions-github", source: "github-actions", target: "github" },
  { id: "e-ansible-proxmox",  source: "ansible", target: "proxmox" },

  // Testing/QA → leaf
  { id: "e-testing-playwright", source: "testing-qa", target: "playwright" },
  { id: "e-playwright-nodejs",  source: "playwright", target: "nodejs" },

  // Flagship project cross-links
  { id: "e-agentpoker-typescript", source: "agentpoker", target: "typescript" },
  { id: "e-graphiti-mcp",          source: "graphiti-mcpserver", target: "mcp-servers" },
  { id: "e-graphiti-python",       source: "graphiti-mcpserver", target: "python" },
  { id: "e-graphiti-coolify",      source: "graphiti-mcpserver", target: "coolify" },
  { id: "e-openclawdashboard-tailwind", source: "openclaw-dashboard", target: "tailwind" },
  { id: "e-searchbyvin-nextjs",    source: "search-by-vin", target: "nextjs" },
  { id: "e-searchbyvin-shadcn",    source: "search-by-vin", target: "shadcn" },
];

export function MCPViz() {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId]
  );

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div ref={containerRef} className={`${styles.container} ${isFullscreen ? styles.fullscreen : ''}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>&gt; ARCHITECTURE</h2>
        <button className={styles.fullscreenBtn} onClick={toggleFullscreen}>
          {isFullscreen ? "[ EXIT FULLSCREEN ]" : "[ FULLSCREEN ]"}
        </button>
      </div>

      <div style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: 0 }}>
        <h3>Architecture Details</h3>
        <ul>
          {INITIAL_NODES.map(node => (
            <li key={node.id}>
              <strong>{node.data.label as string}</strong> ({node.data.type as string}): {node.data.description as string}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ width: '100%', height: isFullscreen ? 'calc(100vh - 100px)' : '520px', position: 'relative' }} aria-hidden="true">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => setSelectedNodeId(node.id)}
          onPaneClick={() => setSelectedNodeId(null)}
          fitView
          colorMode="dark"
        >
          <Background color="#1a1a1a" gap={20} />
          {isFullscreen && (
            <>
              <MiniMap
                style={{ background: '#0a0a0a', border: '1px solid #333' }}
                nodeColor={(n) => n.id === 'harness' ? '#00f2ff' : '#666'}
                maskColor="rgba(0, 0, 0, 0.7)"
              />
              <Controls />
            </>
          )}
        </ReactFlow>
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            className={styles.nodeDetail}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <button
              className={styles.closeBtn}
              onClick={() => setSelectedNodeId(null)}
              aria-label="Close detail"
            >
              &times;
            </button>
            <div className={styles.detailHeader}>
              <span className={styles.detailTitle}>{selectedNode.data.label as string}</span>
              <span>{selectedNode.data.type as string}</span>
            </div>
            <div className={styles.detailContent}>
              {selectedNode.data.description as string}
            </div>
            <div className={styles.detailMeta}>
              ID: {selectedNode.id.toUpperCase()}<br />
              STATUS: ACTIVE_NODE
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

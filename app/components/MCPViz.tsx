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
    data: { label: "SHOPIFY", description: "Primary storefront platform — custom themes, Shopify Liquid, and embedded app development.", type: "STOREFRONT" },
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
    id: "tailwind", type: "terminal", position: { x: 900, y: 200 },
    data: { label: "TAILWIND CSS", description: "Utility-first CSS framework enabling rapid, consistent UI development.", type: "STYLING" },
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
  { id: "e-fe-tw",     source: "frontend", target: "tailwind" },
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
        <h2 className={styles.title}>&gt; ARCHITECTURE_VISUALIZATION</h2>
        <button className={styles.fullscreenBtn} onClick={toggleFullscreen}>
          {isFullscreen ? "[ EXIT FULLSCREEN ]" : "[ FULLSCREEN ]"}
        </button>
      </div>

      <div style={{ width: '100%', height: isFullscreen ? 'calc(100vh - 100px)' : '520px', position: 'relative' }}>
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

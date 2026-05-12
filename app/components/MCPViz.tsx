import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForceGraph } from "~/hooks/useForceGraph";
import styles from "./MCPViz.module.css";

type Node = {
  id: string;
  label: string;
  description: string;
  type: string;
  x: number;
  y: number;
};

type Link = {
  source: string;
  target: string;
};

const INITIAL_NODES: Node[] = [
  { 
    id: "harness", 
    label: "AGENT HARNESS", 
    description: "Core orchestration engine and agent runtime environment.",
    type: "CORE",
    x: 400, 
    y: 200 
  },
  { 
    id: "shopify", 
    label: "SHOPIFY", 
    description: "E-commerce platform integration for product and order management.",
    type: "INTEGRATION",
    x: 200, 
    y: 100 
  },
  { 
    id: "n8n", 
    label: "N8N", 
    description: "Workflow automation tool for connecting disparate services.",
    type: "AUTOMATION",
    x: 200, 
    y: 300 
  },
  { 
    id: "ollama", 
    label: "OLLAMA", 
    description: "Local LLM runner for private and secure inference.",
    type: "MODEL",
    x: 600, 
    y: 100 
  },
  { 
    id: "claude", 
    label: "CLAUDE CODE", 
    description: "Advanced CLI tool for agentic software engineering.",
    type: "TOOL",
    x: 600, 
    y: 300 
  },
  { 
    id: "mcp", 
    label: "MCP SERVERS", 
    description: "Standardized Model Context Protocol servers for tool discovery.",
    type: "PROTOCOL",
    x: 400, 
    y: 50 
  },
];

const INITIAL_LINKS: Link[] = [
  { source: "harness", target: "shopify" },
  { source: "harness", target: "n8n" },
  { source: "harness", target: "ollama" },
  { source: "harness", target: "claude" },
  { source: "harness", target: "mcp" },
];

export function MCPViz() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use useMemo to ensure nodes/links are stable for the hook
  const nodes = useMemo(() => INITIAL_NODES.map(n => ({ ...n })), []);
  const links = useMemo(() => INITIAL_LINKS.map(l => ({ ...l })), []);

  const { coords, dragNode } = useForceGraph(nodes, links);

  const isNodeActive = (id: string) => hoveredNode === id || selectedNodeId === id;
  const isLinkActive = (link: any) => {
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    const activeId = hoveredNode || selectedNodeId;
    return activeId === sourceId || activeId === targetId;
  };

  const selectedNode = coords.find(n => n.id === selectedNodeId);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>&gt; MCP_ARCHITECTURE_VISUALIZATION</h2>
        <button className={styles.fullscreenBtn} onClick={toggleFullscreen}>
          [ FULLSCREEN ]
        </button>
      </div>

      <svg
        viewBox="0 0 800 400"
        className={styles.svg}
        onMouseLeave={() => setHoveredNode(null)}
        onClick={() => setSelectedNodeId(null)}
      >
        {/* Links */}
        {links.map((link: any, i) => {
          const sourceNode = coords.find(n => n.id === (typeof link.source === 'object' ? link.source.id : link.source));
          const targetNode = coords.find(n => n.id === (typeof link.target === 'object' ? link.target.id : link.target));
          
          if (!sourceNode || !targetNode) return null;
          
          const active = isLinkActive(link);

          return (
            <motion.line
              key={`${sourceNode.id}-${targetNode.id}`}
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              className={`${styles.link} ${active ? styles.active : ""} ${
                (hoveredNode || selectedNodeId) && !active ? styles.hidden : ""
              }`}
              initial={false}
              animate={{
                x1: sourceNode.x,
                y1: sourceNode.y,
                x2: targetNode.x,
                y2: targetNode.y
              }}
            />
          );
        })}

        {/* Nodes */}
        {coords.map((node) => {
          const active = isNodeActive(node.id);
          const connected =
            (hoveredNode || selectedNodeId) &&
            links.some((l: any) => {
              const sId = typeof l.source === 'object' ? l.source.id : l.source;
              const tId = typeof l.target === 'object' ? l.target.id : l.target;
              const activeId = hoveredNode || selectedNodeId;
              return (sId === node.id && tId === activeId) ||
                     (tId === node.id && sId === activeId);
            });

          return (
            <motion.g
              key={node.id}
              className={styles.node}
              initial={false}
              animate={{ x: node.x, y: node.y }}
              drag
              dragConstraints={containerRef}
              onDrag={(e, info) => {
                // Approximate global to local SVG coordinates
                // This is a simplification; for precision we'd use getScreenCTM
                dragNode(node.id, node.x + info.delta.x, node.y + info.delta.y);
              }}
              onDragEnd={() => dragNode(node.id, null, null)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedNodeId(node.id);
              }}
            >
              <circle
                r={22}
                fill="transparent"
                className={styles.nodeHitArea}
              />
              <circle
                r={node.id === "harness" ? 10 : 6}
                className={`${styles.nodeCircle} ${
                  active ? styles.active : ""
                } ${connected ? styles.highlight : ""}`}
              />
              <text
                y={25}
                textAnchor="middle"
                className={`${styles.label} ${
                  active || connected ? styles.active : ""
                }`}
              >
                {node.label}
              </text>
            </motion.g>
          );
        })}
      </svg>

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
              <span className={styles.detailTitle}>{selectedNode.label}</span>
              <span>{selectedNode.type}</span>
            </div>
            <div className={styles.detailContent}>
              {selectedNode.description}
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

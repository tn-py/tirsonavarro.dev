import { useState } from "react";
import styles from "./MCPViz.module.css";

type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
};

type Link = {
  source: string;
  target: string;
};

const NODES: Node[] = [
  { id: "harness", label: "AGENT HARNESS", x: 400, y: 200 },
  { id: "shopify", label: "SHOPIFY", x: 200, y: 100 },
  { id: "n8n", label: "N8N", x: 200, y: 300 },
  { id: "ollama", label: "OLLAMA", x: 600, y: 100 },
  { id: "claude", label: "CLAUDE CODE", x: 600, y: 300 },
  { id: "mcp", label: "MCP SERVERS", x: 400, y: 50 },
];

const LINKS: Link[] = [
  { source: "harness", target: "shopify" },
  { source: "harness", target: "n8n" },
  { source: "harness", target: "ollama" },
  { source: "harness", target: "claude" },
  { source: "harness", target: "mcp" },
];

export function MCPViz() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const isNodeActive = (id: string) => hoveredNode === id;
  const isLinkActive = (link: Link) =>
    hoveredNode === link.source || hoveredNode === link.target;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>&gt; MCP_ARCHITECTURE_VISUALIZATION</h2>
      <svg
        viewBox="0 0 800 400"
        className={styles.svg}
        onMouseLeave={() => setHoveredNode(null)}
      >
        {/* Links */}
        {LINKS.map((link, i) => {
          const source = NODES.find((n) => n.id === link.source)!;
          const target = NODES.find((n) => n.id === link.target)!;
          const active = isLinkActive(link);

          return (
            <line
              key={`${link.source}-${link.target}`}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              className={`${styles.link} ${active ? styles.active : ""} ${
                hoveredNode && !active ? styles.hidden : ""
              }`}
            />
          );
        })}

        {/* Nodes */}
        {NODES.map((node) => {
          const active = isNodeActive(node.id);
          const connected =
            hoveredNode &&
            LINKS.some(
              (l) =>
                (l.source === node.id && l.target === hoveredNode) ||
                (l.target === node.id && l.source === hoveredNode)
            );

          return (
            <g
              key={node.id}
              className={styles.node}
              onMouseEnter={() => setHoveredNode(node.id)}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={node.id === "harness" ? 10 : 6}
                className={`${styles.nodeCircle} ${
                  active ? styles.active : ""
                } ${connected ? styles.highlight : ""}`}
              />
              <text
                x={node.x}
                y={node.y + 25}
                textAnchor="middle"
                className={`${styles.label} ${
                  active || connected ? styles.active : ""
                }`}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

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
  { 
    id: "harness", 
    type: "terminal",
    position: { x: 400, y: 200 },
    data: { 
      label: "AGENT HARNESS", 
      description: "Core orchestration engine and agent runtime environment.",
      type: "CORE",
      isHarness: true
    }
  },
  { 
    id: "shopify", 
    type: "terminal",
    position: { x: 100, y: 50 },
    data: { 
      label: "SHOPIFY", 
      description: "E-commerce platform integration for product and order management.",
      type: "INTEGRATION"
    }
  },
  { 
    id: "n8n", 
    type: "terminal",
    position: { x: 100, y: 350 },
    data: { 
      label: "N8N", 
      description: "Workflow automation tool for connecting disparate services.",
      type: "AUTOMATION"
    }
  },
  { 
    id: "ollama", 
    type: "terminal",
    position: { x: 700, y: 50 },
    data: { 
      label: "OLLAMA", 
      description: "Local LLM runner for private and secure inference.",
      type: "MODEL"
    }
  },
  { 
    id: "claude", 
    type: "terminal",
    position: { x: 700, y: 350 },
    data: { 
      label: "CLAUDE CODE", 
      description: "Advanced CLI tool for agentic software engineering.",
      type: "TOOL"
    }
  },
  { 
    id: "mcp", 
    type: "terminal",
    position: { x: 400, y: 20 },
    data: { 
      label: "MCP SERVERS", 
      description: "Standardized Model Context Protocol servers for tool discovery.",
      type: "PROTOCOL"
    }
  },
];

const INITIAL_EDGES: RFEdge[] = [
  { id: "e-harness-shopify", source: "harness", target: "shopify" },
  { id: "e-harness-n8n", source: "harness", target: "n8n" },
  { id: "e-harness-ollama", source: "harness", target: "ollama" },
  { id: "e-harness-claude", source: "harness", target: "claude" },
  { id: "e-harness-mcp", source: "harness", target: "mcp" },
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
        <h2 className={styles.title}>&gt; MCP_ARCHITECTURE_VISUALIZATION</h2>
        <button className={styles.fullscreenBtn} onClick={toggleFullscreen}>
          {isFullscreen ? "[ EXIT FULLSCREEN ]" : "[ FULLSCREEN ]"}
        </button>
      </div>

      <div style={{ width: '100%', height: isFullscreen ? 'calc(100vh - 100px)' : '400px', position: 'relative' }}>
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

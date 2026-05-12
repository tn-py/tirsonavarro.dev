import { useEffect, useState, useRef } from "react";
import * as d3 from "d3-force";

export function useForceGraph(nodes: any[], links: any[]) {
  const [coords, setCoords] = useState(nodes);
  const simulation = useRef<any>(null);

  useEffect(() => {
    // Initialize simulation
    simulation.current = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(400, 200))
      .on("tick", () => {
        // Update state on every tick to trigger re-render
        setCoords([...nodes]);
      });

    return () => {
      if (simulation.current) simulation.current.stop();
    };
  }, [nodes, links]);

  // Function to handle manual node dragging
  const dragNode = (id: string, x: number | null, y: number | null) => {
    const node = nodes.find(n => n.id === id);
    if (node) {
      if (x !== null && y !== null) {
        node.fx = x;
        node.fy = y;
        simulation.current.alpha(0.3).restart();
      } else {
        node.fx = null;
        node.fy = null;
      }
    }
  };

  return { coords, dragNode, simulation: simulation.current };
}

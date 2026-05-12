import { Handle, Position } from '@xyflow/react';
import styles from './MCPViz.module.css';

export function TerminalNode({ data, selected }: any) {
  return (
    <div className={styles.customNode}>
      {/* Hidden handles for connection logic */}
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ visibility: 'hidden', pointerEvents: 'none' }} 
      />
      
      <div className={`${styles.nodeCircle} ${data.isHarness ? styles.harness : ""} ${
        selected ? styles.active : ""
      }`} />
      <div className={`${styles.nodeLabel} ${selected ? styles.active : ""}`}>{data.label}</div>
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ visibility: 'hidden', pointerEvents: 'none' }} 
      />
    </div>
  );
}

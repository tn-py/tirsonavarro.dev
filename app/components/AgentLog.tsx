import styles from "./AgentLog.module.css";

const LOG_ENTRIES = [
  { timestamp: "09:00:00", type: "CERTIFICATION", message: "16 Week Certificate Course on Agentic AI - JOHNS HOPKINS UNIVERSITY" },
  { timestamp: "08:00:00", type: "FOUNDER", message: "Founding member of the SoFloDirect. Working on AI-driven e-commerce solutions." },
  { timestamp: "08:05:10", type: "SEARCH_OPS", message: "SearchSpring: custom product discovery rules deployed — relevance tuning active" },
  { timestamp: "08:12:30", type: "MOBILE_LAUNCH", message: "UHS Hardware iOS & Android apps: build verified — push delivery online via OneSignal" },
  { timestamp: "08:18:44", type: "SHOPIFY_OPS", message: "Custom theme sections deployed — replaced 3rd-party app dependencies, cost overhead reduced" },
  { timestamp: "08:25:00", type: "CATALOG_SYNC", message: "Matrixify + NetSuite: bulk catalog pipeline executed — 10,000+ SKUs synced to UHS_CORE_SHOPIFY" },
  { timestamp: "08:31:17", type: "INFRASTRUCTURE", message: "Docker + Coolify: homelab services healthy — self-hosted stack nominal" },
];

export function AgentLog() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.dot} />
        <span>System Log // Active_Monitor</span>
      </div>
      <div className={styles.logEntries}>
        {LOG_ENTRIES.map((entry, index) => (
          <div key={index} className={styles.entry}>
            <span className={styles.timestamp}>[{entry.timestamp}]</span>
            <span className={styles.status}>[{entry.type}]</span>
            <span className={styles.message}>{entry.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

import styles from "./AgentLog.module.css";

const LOG_ENTRIES = [
  {
    timestamp: "2024-03-15 14:22:01",
    status: "[SUCCESS]",
    message: "Optimizing UHS Hardware logistics - Route efficiency increased by 15%.",
  },
  {
    timestamp: "2024-03-15 12:05:44",
    status: "[SUCCESS]",
    message: "Deploying Hermes harness - Multi-node sync active.",
  },
  {
    timestamp: "2024-03-15 09:15:20",
    status: "[INFO]",
    message: "Analyzing regional sales trends for 'Titanium' product line.",
  },
  {
    timestamp: "2024-03-14 18:30:12",
    status: "[SUCCESS]",
    message: "Automated inventory restock for Zone 7 completed.",
  },
];

export function AgentLog() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.dot} />
        <span>Agent System Log // Active_Monitor</span>
      </div>
      <div className={styles.logEntries}>
        {LOG_ENTRIES.map((entry, index) => (
          <div key={index} className={styles.entry}>
            <span className={styles.timestamp}>[{entry.timestamp}]</span>
            <span className={styles.status}>{entry.status}</span>
            <span className={styles.message}>{entry.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import styles from "./StatusTerminal.module.css";

interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: {
    name: string;
  };
  payload: {
    commits?: { message: string }[];
    ref?: string;
    ref_type?: string;
    action?: string;
    issue?: { number: number };
  };
}

interface UnifiedLogEntry {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}


const formatGitHubEvent = (event: GitHubEvent): UnifiedLogEntry => {
  const timestamp = new Date(event.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  
  let message = "";
  switch (event.type) {
    case "PushEvent":
      const count = event.payload.commits?.length || 0;
      message = `Pushed ${count} commit${count !== 1 ? "s" : ""} to ${event.repo.name}`;
      break;
    case "CreateEvent":
      message = `Created ${event.payload.ref_type} ${event.payload.ref || ""} in ${event.repo.name}`;
      break;
    case "WatchEvent":
      message = `Starred ${event.repo.name}`;
      break;
    case "IssuesEvent":
      message = `${event.payload.action} issue #${event.payload.issue?.number} in ${event.repo.name}`;
      break;
    default:
      message = `${event.type.replace("Event", "")} in ${event.repo.name}`;
  }

  return { id: event.id, timestamp, type: event.type.replace("Event", ""), message };
};

export function StatusTerminal() {
  const [events, setEvents] = useState<UnifiedLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("https://api.github.com/users/tn-py/events");
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error("GitHub API rate limit exceeded");
          }
          throw new Error("Failed to fetch GitHub activity");
        }
        const data = await response.json();
        const gitHubEvents = Array.isArray(data)
          ? data.slice(0, 10).map(formatGitHubEvent)
          : [];

        setEvents(gitHubEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Connection failed");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.dot} />
        <span>TERMINAL // GITHUB_ACTIVITY // STATUS: CONNECTED</span>
      </div>
      <div className={styles.logEntries}>
        {loading ? (
          <div className={styles.loading}>Initializing terminal connection...</div>
        ) : error ? (
          <div className={styles.error}>Error: {error}</div>
        ) : (
          events.map((event) => (
            <div key={event.id} className={styles.entry}>
              <span className={styles.timestamp}>[{event.timestamp}]</span>
              <span className={styles.type}>[{event.type}]</span>
              <span className={styles.message}>{event.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

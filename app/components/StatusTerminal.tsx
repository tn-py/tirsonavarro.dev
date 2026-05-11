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

export function StatusTerminal() {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
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
        setEvents(Array.isArray(data) ? data.slice(0, 10) : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Connection failed");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const formatEvent = (event: GitHubEvent) => {
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

    return { timestamp, type: event.type.replace("Event", ""), message };
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.dot} />
        <span>TERMINAL // LIVE_GITHUB_ACTIVITY // STATUS: CONNECTED</span>
      </div>
      <div className={styles.logEntries}>
        {loading ? (
          <div className={styles.loading}>Initializing terminal connection...</div>
        ) : error ? (
          <div className={styles.error}>Error: {error}</div>
        ) : events.length === 0 ? (
          <div className={styles.loading}>No recent activity found.</div>
        ) : (
          events.map((event) => {
            const formatted = formatEvent(event);
            return (
              <div key={event.id} className={styles.entry}>
                <span className={styles.timestamp}>[{formatted.timestamp}]</span>
                <span className={styles.type}>[{formatted.type}]</span>
                <span className={styles.message}>{formatted.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

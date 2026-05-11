import type { MetaFunction } from "@remix-run/node";
import { AgentLog } from "~/components/AgentLog";
import { MCPViz } from "~/components/MCPViz";
import styles from "../styles/Home.module.css";

export const meta: MetaFunction = () => {
  return [
    { title: "Agentic Architect // E-Commerce Ops" },
    { name: "description", content: "Command Center for E-Commerce Operations" },
  ];
};

export default function Index() {
  return (
    <div className="home-page">
      <section className={styles.hero}>
        <h1>
          Agentic <span className={styles.glowingText}>Architect</span>
        </h1>
        <p>// E-COMMERCE OPS // COMMAND_CENTER</p>
      </section>

      <section className={styles.content}>
        <AgentLog />
        <MCPViz />
      </section>
    </div>
  );
}

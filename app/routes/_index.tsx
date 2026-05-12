import type { MetaFunction } from "@remix-run/node";
import { AgentLog } from "~/components/AgentLog";
import { MCPViz } from "~/components/MCPViz";
import { StatusTerminal } from "~/components/StatusTerminal";
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
      <header className={styles.hero}>
        <div className={styles.avatarContainer}>
          <img 
            src="https://github.com/tn-py.png" 
            alt="Tirso Navarro" 
            className={styles.avatar} 
          />
          <div className={styles.statusIndicator}>
            <div className={styles.statusDot} />
            [ STATUS: ACTIVE ]
          </div>
        </div>
        
        <div className={styles.identityInfo}>
          <h1>TIRSO NAVARRO</h1>
          <div className={styles.identityTitle}>
            WEB OPERATIONS SUPERVISOR // E-COMMERCE ARCHITECT
          </div>
          <div className={styles.identitySubTitle}>
            GRADUATE: JOHNS HOPKINS UNIVERSITY [AGENTIC AI]
          </div>
          <p className={styles.identityBio}>
            Miami-based developer specialized in scaling high-SKU Shopify stores. 
            I build custom full-stack systems and agentic workflows to automate 
            complex e-commerce operations.
          </p>
          <div className={styles.identityMeta}>
            LOC: MIAMI_FL // TZ: EST
          </div>
        </div>
      </header>

      <section className={styles.terminalSection}>
        <StatusTerminal />
      </section>

      <section className={styles.content}>
        <AgentLog />
        <MCPViz />
      </section>
    </div>
  );
}

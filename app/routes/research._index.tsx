import type { MetaFunction } from "@remix-run/node";
import { StatusTerminal } from "~/components/StatusTerminal";
import styles from "~/styles/Research.module.css";

const RESEARCH_POSTS = [
  {
    id: 1,
    title: "The Rise of Agentic Workflows",
    date: "2024-05-10",
    summary: "Exploring how autonomous agents are shifting the paradigm from 'human-in-the-loop' to 'human-on-the-loop' for complex software engineering tasks.",
    tags: ["AI Agents", "Workflows", "Future of Work"],
  },
  {
    id: 2,
    title: "Model Context Protocol: A Deep Dive",
    date: "2024-04-22",
    summary: "An analysis of the MCP architecture and its potential to standardize how LLMs interact with external tools and data sources.",
    tags: ["MCP", "LLMs", "Interoperability"],
  },
  {
    id: 3,
    title: "Autonomous Debugging with Gemini CLI",
    date: "2024-03-15",
    summary: "How CLI-based agents can navigate codebases, identify bugs, and propose fixes with minimal human intervention.",
    tags: ["Gemini", "CLI", "Autonomous Coding"],
  },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Research | Agentic Architect" },
    { name: "description", content: "Deep dives into autonomous agents, MCP, and the future of agentic software engineering." },
  ];
};

export default function ResearchIndex() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Research</h1>
      <p className={styles.subtitle}>// EXPLORATION_LOGS</p>
      
      <StatusTerminal />

      <div className={styles.postsList}>
        {RESEARCH_POSTS.map((post) => (
          <div key={post.id} className={styles.postCard}>
            <div className={styles.postHeader}>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <span className={styles.postDate}>// {post.date}</span>
            </div>
            <p className={styles.postSummary}>{post.summary}</p>
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Link, useParams } from "@remix-run/react";
import styles from "~/styles/Projects.module.css";

export default function ProjectDetail() {
  const { slug } = useParams();
  
  // Use import.meta.glob to get all projects
  const projects = import.meta.glob("../../content/projects/*.mdx", { eager: true });
  
  // Find the project that matches the slug
  const projectPath = `../../content/projects/${slug}.mdx`;
  const project = projects[projectPath] as any;
  
  if (!project) {
    return (
      <div className={styles.container}>
        <h1>Project not found</h1>
        <Link to="/projects" className={styles.backLink}>
          ← Back to Projects
        </Link>
      </div>
    );
  }
  
  const Component = project.default;
  
  return (
    <div className={styles.container}>
      <Link to="/projects" className={styles.backLink}>
        ← Back to Projects
      </Link>
      <div className={styles.mdxContent}>
        <Component />
      </div>
    </div>
  );
}

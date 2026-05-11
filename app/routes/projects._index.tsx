import { Link } from "@remix-run/react";
import styles from "~/styles/Projects.module.css";

interface ProjectModule {
  frontmatter: {
    title: string;
    description: string;
    tags: string[];
  };
}

export default function ProjectsIndex() {
  const projectFiles = import.meta.glob<ProjectModule>("../../content/projects/*.mdx", {
    eager: true,
  });

  const projects = Object.entries(projectFiles).map(([path, module]) => {
    const slug = path.split("/").pop()?.replace(".mdx", "");
    return {
      slug,
      ...module.frontmatter,
    };
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Projects</h1>
      <p className={styles.subtitle}>// TECHNICAL_REPERTOIRE</p>
      
      <div className={styles.projectsGrid}>
        {projects.map((project) => (
          <Link
            key={project.slug}
            to={`/projects/${project.slug}`}
            className={styles.projectCard}
          >
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <div className={styles.tags}>
              {project.tags?.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

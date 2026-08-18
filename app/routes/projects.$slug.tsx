import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import styles from "~/styles/Projects.module.css";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { slug } = params;
  const projects = import.meta.glob("../../content/projects/*.mdx", { eager: true });
  const projectPath = `../../content/projects/${slug}.mdx`;
  const project = projects[projectPath] as any;

  if (!project) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({
    frontmatter: project.frontmatter,
  });
};

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  if (!data) {
    return [{ title: "Project Not Found" }];
  }

  return [
    { title: `${data.frontmatter.title} | Projects` },
    { name: "description", content: data.frontmatter.description },
  ];
};

export default function ProjectDetail() {
  const { slug } = useParams();
  const { frontmatter } = useLoaderData<typeof loader>();
  
  // Use import.meta.glob to get all projects
  const projects = import.meta.glob("../../content/projects/*.mdx", { eager: true });
  
  // Find the project that matches the slug
  const projectPath = `../../content/projects/${slug}.mdx`;
  const project = projects[projectPath] as any;
  
  if (!project) {
    return (
      <div className={styles.container}>
        <h1>Project not found</h1>
        <Link to="/" className={styles.backLink}>
          ← Back to Home
        </Link>
      </div>
    );
  }
  
  const Component = project.default;
  
  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backLink}>
        ← Back to Home
      </Link>
      <div className={styles.mdxContent}>
        <Component />
      </div>

      {frontmatter.githubUrl && (
        <a 
          href={frontmatter.githubUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.githubButton}
        >
          [ View Source on GitHub ]
        </a>
      )}

      <div style={{ marginTop: "3rem", padding: "1.5rem", border: "1px solid rgba(126, 231, 135, 0.3)", borderRadius: "8px", backgroundColor: "rgba(126, 231, 135, 0.05)", textAlign: "center" }}>
        <h3 style={{ margin: "0 0 0.5rem 0", color: "#7ee787" }}>Ready to scale your store?</h3>
        <p style={{ margin: "0 0 1.5rem 0", color: "#c9d1d9" }}>Let's discuss how we can build custom solutions for your business.</p>
        <a href="https://cal.com/tirso-navarro/15min-meeting" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "#7ee787", color: "#0d1117", padding: "0.5rem 1.5rem", borderRadius: "4px", textDecoration: "none", fontWeight: "bold" }}>
          Schedule a Call
        </a>
      </div>
    </div>
  );
}

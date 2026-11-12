import { json, type ActionFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ContactSection } from "~/components/ContactSection";
import { HowIHelp } from "~/components/HowIHelp";
import { MobileContactButton } from "~/components/MobileContactButton";
import { contactConfig, handleContact } from "~/lib/contact";
import { sortProjects } from "~/lib/projectOrder";
import { ContributionHeatmap } from "~/components/ContributionHeatmap";
import { ProjectCarousel } from "~/components/ProjectCarousel";
import Shuffle from "~/components/Shuffle";
import styles from "../styles/Home.module.css";

const TITLE = "Tirso Navarro — Agentic E-Commerce Site Ops";
const DESCRIPTION =
  "Miami developer helping Shopify stores with big catalogs automate the busywork. Got a question? Ask me directly or book a 15-minute call.";

export const meta: MetaFunction = () => {
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    { property: "og:title", content: TITLE },
    { property: "og:description", content: DESCRIPTION },
    { property: "og:image", content: "https://tirsonavarro.dev/home-preview.png" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const result = await handleContact(await request.formData(), contactConfig());
  return json(result, { status: result.ok ? 200 : result.errors.form ? 503 : 400 });
};

interface ProjectModule {
  frontmatter: {
    title: string;
    description: string;
    tags?: string[];
    githubUrl?: string;
    order?: number;
    liveUrl?: string;
    status?: string;
  };
}

export const loader = async () => {
  const modules = import.meta.glob<ProjectModule>("../../content/projects/*.mdx", { eager: true });
  const projects = sortProjects(
    Object.entries(modules).map(([path, mod]) => {
      const slug = path.split("/").pop()!.replace(".mdx", "");
      return { slug, ...mod.frontmatter };
    }),
  );
  return json({ projects, publicEmail: process.env.CONTACT_PUBLIC_EMAIL || undefined });
};

export default function Index() {
  const { projects, publicEmail } = useLoaderData<typeof loader>();
  return (
    <div className="home-page">
      <header className={styles.hero}>
        <div className={styles.avatarContainer}>
          <img
            src="/avatar.jpg"
            alt="Tirso Navarro"
            className={styles.avatar}
          />

        </div>
        
        <div className={styles.identityInfo}>
          <Shuffle
            tag="h1"
            text="TIRSO NAVARRO"
            textAlign="left"
            effect="slide"
            shuffleDirection="right"
            duration={0.35}
            animationMode="evenodd"
            shuffleTimes={1}
            ease="power3.out"
            stagger={0.03}
            rootMargin="0px"
            triggerOnce={true}
            triggerOnHover={true}
            respectReducedMotion={true}
          />
          <div className={styles.identityTitle}>
            WEB OPERATIONS // E-COMMERCE ARCHITECT
          </div>
          <div className={styles.identityPanel}>
            <p className={styles.identityBio}>
              Miami-based developer specialized in scaling high-SKU Shopify stores. I build custom full-stack systems and agentic workflows to automate complex e-commerce operations.
            </p>
            <div className={styles.identityMeta}>
              LOC: MIAMI_FL // TZ: EST
            </div>

            <div id="hero-cta" className={styles.ctaRow}>
              <a href="#contact" className={styles.primaryCta}>
                Ask me a question →
              </a>
              <span className={styles.ctaNote}>Replies within a day, no sales pitch.</span>
            </div>

            <div className={styles.socialLinks}>
              <a href="https://github.com/tn-py" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>GITHUB</span>
              </a>
              <a href="https://www.linkedin.com/in/tirso-navarro" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LINKEDIN</span>
              </a>
              <a href="https://cal.com/tirso-navarro/15min-meeting" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>BOOK 15 MIN</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <HowIHelp />

      <section className={styles.terminalSection} aria-label="Projects">
        <h2 style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: 0 }}>Projects</h2>
        <ProjectCarousel projects={projects as any} />
        {/* Plain links so screen readers, crawlers and no-JS visitors can reach every project. */}
        <ul className={styles.srOnly}>
          {projects.map((p) => (
            <li key={p.slug}>
              <a href={`/projects/${p.slug}`}>
                {p.title}: {p.description}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.terminalSection} aria-label="GitHub Contributions">
        <ContributionHeatmap />
      </section>

      <ContactSection publicEmail={publicEmail} />
      <MobileContactButton />
    </div>
  );
}

import Link from "next/link";
import {
  IconBriefcase,
  IconSchool,
  IconCode,
  IconCertificate,
  IconRocket,
  IconMapPin,
  IconMail,
  IconBrandLinkedin,
  IconBrandGithub,
  IconWorld,
  IconArrowLeft,
  IconCalendar,
} from "@tabler/icons-react";
import { resumeData } from "@/data/resume";
import type { ResumeData } from "@/data/resume";
import PrintButton from "./PrintButton";

// ─── Section wrapper ─────────────────────────────────────────────────────────

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10 print:mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-gray-400 print:text-gray-600">{icon}</span>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 print:text-gray-600">
          {title}
        </h2>
      </div>
      <div className="border-t border-white/10 print:border-gray-200 pt-4">
        {children}
      </div>
    </section>
  );
}

// ─── Skill chip ───────────────────────────────────────────────────────────────

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium bg-white/8 text-gray-300 border border-white/10 print:bg-gray-100 print:text-gray-700 print:border-gray-200">
      {label}
    </span>
  );
}

// ─── Experience entry ─────────────────────────────────────────────────────────

function ExperienceItem({
  entry,
}: {
  entry: ResumeData["experience"][number];
}) {
  return (
    <div className="mb-6 last:mb-0 relative pl-4 border-l-2 border-white/10 print:border-gray-200">
      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 print:bg-blue-600" />
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 mb-1">
        <h3 className="font-semibold text-white print:text-gray-900">
          {entry.role}
        </h3>
        <span className="text-xs text-gray-500 tabular-nums shrink-0">
          {entry.startDate} — {entry.endDate ?? "Present"}
        </span>
      </div>
      <p className="text-sm text-blue-400 print:text-blue-700 mb-2">
        {entry.company} · {entry.location}
      </p>
      {entry.description && (
        <p className="text-sm text-gray-400 print:text-gray-600 mb-3 leading-relaxed">
          {entry.description}
        </p>
      )}
      {entry.highlights.length > 0 && (
        <ul className="space-y-1.5">
          {entry.highlights.map((h, i) => (
            <li
              key={i}
              className="text-sm text-gray-300 print:text-gray-700 flex gap-2"
            >
              <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-500 shrink-0" />
              {h}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Education entry ──────────────────────────────────────────────────────────

function EducationItem({
  entry,
}: {
  entry: ResumeData["education"][number];
}) {
  return (
    <div className="mb-6 last:mb-0 relative pl-4 border-l-2 border-white/10 print:border-gray-200">
      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-purple-500 print:bg-purple-600" />
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 mb-1">
        <h3 className="font-semibold text-white print:text-gray-900">
          {entry.degree}
          {entry.field ? `, ${entry.field}` : ""}
        </h3>
        <span className="text-xs text-gray-500 tabular-nums shrink-0">
          {entry.startDate} — {entry.endDate}
        </span>
      </div>
      <p className="text-sm text-blue-400 print:text-blue-700 mb-1">
        {entry.institution} · {entry.location}
      </p>
      {entry.gpa && (
        <p className="text-sm text-gray-400 print:text-gray-600">
          GPA: {entry.gpa}
        </p>
      )}
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {entry.highlights.map((h, i) => (
            <li
              key={i}
              className="text-sm text-gray-300 print:text-gray-700 flex gap-2"
            >
              <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-500 shrink-0" />
              {h}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Certification entry ──────────────────────────────────────────────────────

function CertificationItem({
  entry,
}: {
  entry: ResumeData["certifications"][number];
}) {
  return (
    <div className="flex items-start gap-3 mb-4 last:mb-0">
      <IconCertificate className="w-4 h-4 text-yellow-500 print:text-yellow-700 mt-0.5 shrink-0" />
      <div>
        <p className="text-sm font-medium text-white print:text-gray-900">
          {entry.url ? (
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              {entry.name}
            </a>
          ) : (
            entry.name
          )}
        </p>
        <p className="text-xs text-gray-500">
          {entry.issuer} · {entry.date}
        </p>
      </div>
    </div>
  );
}

// ─── Project entry ────────────────────────────────────────────────────────────

function ProjectItem({ entry }: { entry: ResumeData["projects"][number] }) {
  return (
    <div className="mb-6 last:mb-0 p-4 rounded-lg bg-white/4 border border-white/8 print:bg-gray-50 print:border-gray-200">
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="font-semibold text-white print:text-gray-900 text-sm">
          {entry.url ? (
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              {entry.name} ↗
            </a>
          ) : (
            entry.name
          )}
        </h3>
      </div>
      <p className="text-sm text-gray-400 print:text-gray-600 mb-3 leading-relaxed">
        {entry.description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {entry.technologies.map((t) => (
          <Chip key={t} label={t} />
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResumePage() {
  const { personal, experience, education, skills, certifications, projects, lastUpdated } =
    resumeData;

  const lastUpdatedFormatted = new Date(lastUpdated).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] print:bg-white">
      {/* ── Top nav bar ── */}
      <nav className="sticky top-0 z-20 bg-[#0a0a0a]/80 print:hidden backdrop-blur-md border-b border-white/8">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <IconArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <IconCalendar className="w-3.5 h-3.5" />
            Updated {lastUpdatedFormatted}
          </div>
          <PrintButton />
        </div>
      </nav>

      {/* ── Document ── */}
      <main className="max-w-3xl mx-auto px-6 py-12 print:py-0 print:px-0">

        {/* ── Header / title block ── */}
        <header className="mb-10 print:mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white print:text-gray-900 mb-1">
            {personal.name}
          </h1>
          <p className="text-lg text-gray-400 print:text-gray-600 mb-5">
            {personal.title}
          </p>

          {/* ── Property rows (Notion-style) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {[
              {
                icon: <IconMapPin className="w-4 h-4 shrink-0" />,
                label: "Location",
                value: personal.location,
                href: null,
              },
              {
                icon: <IconMail className="w-4 h-4 shrink-0" />,
                label: "Email",
                value: personal.email,
                href: `mailto:${personal.email}`,
              },
              {
                icon: <IconBrandLinkedin className="w-4 h-4 shrink-0" />,
                label: "LinkedIn",
                value: "tirso-navarro",
                href: personal.linkedin,
              },
              {
                icon: <IconBrandGithub className="w-4 h-4 shrink-0" />,
                label: "GitHub",
                value: "tn-py",
                href: personal.github,
              },
              {
                icon: <IconWorld className="w-4 h-4 shrink-0" />,
                label: "Website",
                value: "tirsonavarro.dev",
                href: personal.website,
              },
            ].map(({ icon, label, value, href }) => (
              <div key={label} className="flex items-center gap-2 text-gray-400 print:text-gray-600">
                {icon}
                <span className="text-gray-600 print:text-gray-400 w-16 shrink-0">
                  {label}
                </span>
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="text-gray-300 print:text-gray-800 hover:text-white transition-colors truncate"
                  >
                    {value}
                  </a>
                ) : (
                  <span className="text-gray-300 print:text-gray-800">
                    {value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </header>

        {/* ── Divider ── */}
        <div className="border-t border-white/10 print:border-gray-200 mb-10 print:mb-8" />

        {/* ── Summary callout ── */}
        {personal.summary && (
          <div className="mb-10 print:mb-8 px-4 py-3 rounded-lg bg-blue-950/30 border border-blue-900/40 print:bg-blue-50 print:border-blue-200">
            <p className="text-sm text-gray-300 print:text-gray-700 leading-relaxed">
              {personal.summary}
            </p>
          </div>
        )}

        {/* ── Experience ── */}
        {experience.length > 0 && (
          <Section
            icon={<IconBriefcase className="w-4 h-4" />}
            title="Experience"
          >
            {experience.map((e) => (
              <ExperienceItem key={e.id} entry={e} />
            ))}
          </Section>
        )}

        {/* ── Education ── */}
        {education.length > 0 && (
          <Section
            icon={<IconSchool className="w-4 h-4" />}
            title="Education"
          >
            {education.map((e) => (
              <EducationItem key={e.id} entry={e} />
            ))}
          </Section>
        )}

        {/* ── Skills ── */}
        {skills.length > 0 && (
          <Section icon={<IconCode className="w-4 h-4" />} title="Skills">
            <div className="space-y-4">
              {skills.map(({ category, items }) => (
                <div key={category}>
                  <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                    {category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <Chip key={item} label={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Certifications ── */}
        {certifications.length > 0 && (
          <Section
            icon={<IconCertificate className="w-4 h-4" />}
            title="Certifications"
          >
            {certifications.map((c) => (
              <CertificationItem key={c.id} entry={c} />
            ))}
          </Section>
        )}

        {/* ── Projects ── */}
        {projects.length > 0 && (
          <Section
            icon={<IconRocket className="w-4 h-4" />}
            title="Projects"
          >
            {projects.map((p) => (
              <ProjectItem key={p.id} entry={p} />
            ))}
          </Section>
        )}

        {/* ── Footer ── */}
        <footer className="mt-16 pt-6 border-t border-white/8 print:border-gray-200 text-center print:hidden">
          <p className="text-xs text-gray-600">
            Last synced from LinkedIn on {lastUpdatedFormatted}
          </p>
        </footer>
      </main>
    </div>
  );
}

import {
  skills,
  stackData,
  slugify,
  profile,
  contactLinks,
  type SkillEntry,
  type ContactEntry,
} from "./tirsoData";

export interface ProjectEntry {
  slug: string;
  title: string;
  description: string;
  tags?: string[];
  githubUrl?: string;
}

export type TirsoAction =
  | { type: "navigate"; to: string }
  | { type: "open"; url: string }
  | { type: "clear" }
  | { type: "contributions"; username?: string }
  | { type: "git-stats"; username?: string };

export interface TirsoResult {
  lines: string[];
  action?: TirsoAction;
}

const HELP_LINES = [
  "Available commands:",
  "",
  "  tirso --help                   show this help",
  "  tirso whoami                   show a quick bio",
  "  tirso contact                  list contact links",
  "  tirso contact <key> --open     open a contact link",
  "  tirso git-contributions       show GitHub contribution graph",
  "  tirso git-stats [user]         show GitHub profile stats",
  "  tirso stack                    list the tech stack",
  "  tirso skills                   list agent skills",
  "  tirso skill <name>             show details for a skill",
  "  tirso skill <name> --open      open the skill's repo",
  "  tirso projects                 list projects",
  "  tirso project <slug>           show details for a project",
  "  tirso project <slug> --open    open the project's full write-up",
  "  clear                          clear the terminal",
];

function padLine(text: string, width: number): string {
  return text.length >= width ? text.slice(0, width) : text + " ".repeat(width - text.length);
}

function wrapText(text: string, width: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > width) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function findContact(query: string): ContactEntry | undefined {
  const q = query.toLowerCase();
  return contactLinks.find((c) => c.key === q);
}

function findSkill(query: string): SkillEntry | undefined {
  const q = slugify(query);
  return (
    skills.find((s) => slugify(s.title) === q) ??
    skills.find((s) => slugify(s.title).includes(q))
  );
}

function findProject(query: string, projects: ProjectEntry[]): ProjectEntry | undefined {
  const q = slugify(query);
  return (
    projects.find((p) => p.slug === q) ??
    projects.find((p) => slugify(p.title) === q)
  );
}

export function runTirsoCommand(rawInput: string, projects: ProjectEntry[]): TirsoResult {
  const argv = rawInput.trim().split(/\s+/).filter(Boolean);
  if (argv.length === 0) return { lines: [] };

  const [head, ...rest] = argv;

  if (head === "clear" || head === "cls") {
    return { lines: [], action: { type: "clear" } };
  }

  if (head !== "tirso") {
    return { lines: [`command not found: ${head}`, "Try `tirso --help`."] };
  }

  const [sub, ...args] = rest;
  const flags = args.filter((a) => a.startsWith("--"));
  const positional = args.filter((a) => !a.startsWith("--"));

  switch (sub) {
    case undefined:
    case "--help":
    case "help":
      return { lines: HELP_LINES };

    case "stack": {
      const lines: string[] = [];
      for (const group of stackData) {
        lines.push(`\x1b[1;34m${group.category}\x1b[0m`);
        lines.push(`  ${group.description}`);
        lines.push(`  ${group.items.join(", ")}`);
        lines.push("");
      }
      return { lines };
    }

    case "skills": {
      const lines = ["Agent skills:", ""];
      for (const skill of skills) {
        lines.push(`  \x1b[1;32m${slugify(skill.title)}\x1b[0m — ${skill.subtitle}`);
      }
      lines.push("");
      lines.push("Run `tirso skill <name>` for details.");
      return { lines };
    }

    case "skill": {
      if (positional.length === 0) {
        return { lines: ["Usage: tirso skill <name> [--open]"] };
      }
      const skill = findSkill(positional.join(" "));
      if (!skill) {
        return {
          lines: [`skill not found: ${positional.join(" ")}`, "Run `tirso skills` to list them."],
        };
      }
      if (flags.includes("--open")) {
        return { lines: [`Opening ${skill.repo} ...`], action: { type: "open", url: skill.repo } };
      }
      return {
        lines: [
          `\x1b[1;32m${skill.title}\x1b[0m`,
          skill.subtitle,
          skill.repo,
          "",
          `Run \`tirso skill ${slugify(skill.title)} --open\` to view the repo.`,
        ],
      };
    }

    case "projects": {
      const lines = ["Projects:", ""];
      for (const project of projects) {
        lines.push(`  \x1b[1;32m${project.slug}\x1b[0m — ${project.title}: ${project.description}`);
      }
      lines.push("");
      lines.push("Run `tirso project <slug>` for details.");
      return { lines };
    }

    case "project": {
      if (positional.length === 0) {
        return { lines: ["Usage: tirso project <slug> [--open]"] };
      }
      const project = findProject(positional.join(" "), projects);
      if (!project) {
        return {
          lines: [`project not found: ${positional.join(" ")}`, "Run `tirso projects` to list them."],
        };
      }
      if (flags.includes("--open")) {
        return {
          lines: [`Opening /projects/${project.slug} ...`],
          action: { type: "navigate", to: `/projects/${project.slug}` },
        };
      }
      const lines = [`\x1b[1;32m${project.title}\x1b[0m`, project.description];
      if (project.tags?.length) lines.push(project.tags.join(", "));
      lines.push("");
      lines.push(`Run \`tirso project ${project.slug} --open\` to view the full write-up.`);
      return { lines };
    }

    case "git-contributions": {
      const username = positional[0] || undefined;
      return {
        lines: [`Fetching contributions for @${username ?? "tn-py"} ...`],
        action: { type: "contributions", username },
      };
    }

    case "git-stats": {
      const username = positional[0] || undefined;
      return {
        lines: [`Fetching GitHub stats for @${username ?? "tn-py"} ...`],
        action: { type: "git-stats", username },
      };
    }

    case "whoami": {
      const width = 56;
      const top = `┌${"─".repeat(width + 2)}┐`;
      const mid = `├${"─".repeat(width + 2)}┤`;
      const bottom = `└${"─".repeat(width + 2)}┘`;
      const row = (text: string, color?: string) => {
        const padded = padLine(text, width);
        return `│ ${color ? `${color}${padded}\x1b[0m` : padded} │`;
      };

      const bioLines = wrapText(profile.bio, width);
      return {
        lines: [
          top,
          row(profile.name, "\x1b[1;32m"),
          row(profile.title, "\x1b[1;34m"),
          mid,
          ...bioLines.map((line) => row(line)),
          mid,
          row(`LOC: ${profile.location}   TZ: ${profile.timezone}`),
          bottom,
        ],
      };
    }

    case "contact": {
      if (positional.length === 0) {
        const lines = ["Contact:", ""];
        for (const c of contactLinks) {
          lines.push(`  \x1b[1;32m${c.key}\x1b[0m — ${c.label}: ${c.value}`);
        }
        lines.push("");
        lines.push("Run `tirso contact <key> --open` to open a link.");
        return { lines };
      }
      const contact = findContact(positional.join(" "));
      if (!contact) {
        return {
          lines: [`contact not found: ${positional.join(" ")}`, "Run `tirso contact` to list them."],
        };
      }
      if (flags.includes("--open")) {
        return { lines: [`Opening ${contact.url} ...`], action: { type: "open", url: contact.url } };
      }
      return { lines: [`\x1b[1;32m${contact.label}\x1b[0m`, contact.value, contact.url] };
    }

    case "sudo": {
      return {
        lines: [
          "We trust you have received the usual lecture from the local System Administrator.",
          "\x1b[1;31mvisitor is not in the sudoers file. This incident will be reported.\x1b[0m",
        ],
      };
    }

    default:
      return { lines: [`command not found: tirso ${sub}`, "Try `tirso --help`."] };
  }
}

import { skills, contactLinks, slugify, type SkillEntry } from "./tirsoData";
import type { ProjectEntry } from "./tirsoCommands";

export interface AutocompleteContext {
  history: string[];
  projects: ProjectEntry[];
}

/**
 * Generate a comprehensive list of all static & dynamic CLI commands.
 */
export function getAllAvailableCommands(projects: ProjectEntry[]): string[] {
  const baseCommands = [
    "tirso --help",
    "tirso whoami",
    "tirso contact",
    "tirso git-contributions",
    "tirso git-stats",
    "tirso stack",
    "tirso skills",
    "tirso projects",
    "clear",
  ];

  const contactCommands = contactLinks.flatMap((c) => [
    `tirso contact ${c.key}`,
    `tirso contact ${c.key} --open`,
  ]);

  const skillCommands = skills.flatMap((s) => {
    const slug = slugify(s.title);
    return [`tirso skill ${slug}`, `tirso skill ${slug} --open`];
  });

  const projectCommands = projects.flatMap((p) => [
    `tirso project ${p.slug}`,
    `tirso project ${p.slug} --open`,
  ]);

  return [
    ...baseCommands,
    ...contactCommands,
    ...skillCommands,
    ...projectCommands,
  ];
}

/**
 * Fish-shell style local autocomplete (< 1ms).
 * Checks:
 * 1. History match (most recent matching command starting with input)
 * 2. Prefix match against candidate CLI commands
 * 3. Keyword / semantic fallback (e.g. 'shopify' -> 'tirso project shopify-loyalty-rewards --open')
 */
export function getLocalSuggestion(
  input: string,
  context: AutocompleteContext
): string | null {
  const trimmed = input.trimStart();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();

  // 1. History match (reverse order for most recent, like fish shell)
  for (let i = context.history.length - 1; i >= 0; i--) {
    const hist = context.history[i].trim();
    if (hist.toLowerCase().startsWith(lower) && hist.length > trimmed.length) {
      return hist;
    }
  }

  // 2. Direct command list prefix match
  const commands = getAllAvailableCommands(context.projects);
  const directMatch = commands.find((cmd) =>
    cmd.toLowerCase().startsWith(lower) && cmd.length > trimmed.length
  );
  if (directMatch) return directMatch;

  // 3. Partial shorthand/subcommand matching (e.g. "whoami" -> "tirso whoami", "skills" -> "tirso skills")
  if (!lower.startsWith("tirso ")) {
    const shorthandMatch = commands.find((cmd) => {
      const withoutTirso = cmd.replace(/^tirso\s+/, "");
      return withoutTirso.toLowerCase().startsWith(lower);
    });
    if (shorthandMatch) return shorthandMatch;
  }

  // 4. Keyword heuristic mapping
  const keywordMappings: Record<string, string> = {
    bio: "tirso whoami",
    about: "tirso whoami",
    me: "tirso whoami",
    email: "tirso contact",
    linkedin: "tirso contact linkedin --open",
    schedule: "tirso contact schedule --open",
    call: "tirso contact schedule --open",
    github: "tirso contact github --open",
    git: "tirso git-stats",
    stats: "tirso git-stats",
    contributions: "tirso git-contributions",
    tech: "tirso stack",
    stack: "tirso stack",
    skills: "tirso skills",
    projects: "tirso projects",
    help: "tirso --help",
  };

  for (const [key, cmd] of Object.entries(keywordMappings)) {
    if (key.startsWith(lower) || lower.includes(key)) {
      if (cmd.length > trimmed.length) {
        return cmd;
      }
    }
  }

  return null;
}

export interface GitLanguage {
  name: string;
  count: number;
}

export interface GitStatsPayload {
  username: string;
  publicRepos: number;
  followers: number;
  totalStars: number;
  topLanguages: GitLanguage[];
  createdAt: string;
}

const BAR_WIDTH = 20;

export function renderGitStats(payload: GitStatsPayload): string[] {
  const sinceYear = new Date(payload.createdAt).getUTCFullYear();

  const lines = [
    `\x1b[1;32m@${payload.username}\x1b[0m — GitHub stats`,
    "",
    `  Public repos     \x1b[1;34m${payload.publicRepos}\x1b[0m`,
    `  Total stars      \x1b[1;33m★ ${payload.totalStars}\x1b[0m`,
    `  Followers        \x1b[1;34m${payload.followers}\x1b[0m`,
    `  On GitHub since  \x1b[1;34m${sinceYear}\x1b[0m`,
  ];

  if (payload.topLanguages.length > 0) {
    lines.push("", "Top languages:");
    const max = payload.topLanguages[0].count;
    for (const lang of payload.topLanguages) {
      const barLen = Math.max(1, Math.round((lang.count / max) * BAR_WIDTH));
      lines.push(
        `  ${lang.name.padEnd(12)} \x1b[1;32m${"█".repeat(barLen)}\x1b[0m ${lang.count}`,
      );
    }
  }

  return lines;
}

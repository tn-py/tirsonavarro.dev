export const GITHUB_USERNAME = "tn-py";

export interface ContributionDay {
  date: string;
  level: number;
  count: number;
}

export interface ContributionsPayload {
  username: string;
  days: ContributionDay[];
}

const LEVEL_COLORS = ["#313244", "#0e4429", "#006d32", "#26a641", "#39d353"];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DAY_MS = 86_400_000;

function rgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function toUtc(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function iso(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseContributionsHtml(html: string): ContributionDay[] {
  const dateByCell = new Map<string, string>();
  const levelByCell = new Map<string, number>();

  const tdRe = /<td\b[^>]*>/g;
  for (const match of html.matchAll(tdRe)) {
    const td = match[0];
    const id = td.match(/\bid="(contribution-day-component-\d+-\d+)"/)?.[1];
    const date = td.match(/\bdata-date="([\d-]+)"/)?.[1];
    const level = td.match(/\bdata-level="(\d)"/)?.[1];
    if (id && date && level) {
      dateByCell.set(id, date);
      levelByCell.set(id, Number(level));
    }
  }

  const countByCell = new Map<string, number>();
  const tipRe = /<tool-tip\b[^>]*\bfor="(contribution-day-component-\d+-\d+)"[^>]*>([^<]*)<\/tool-tip>/g;
  for (const match of html.matchAll(tipRe)) {
    const count = match[2].match(/([\d,]+)\s+contributions?/);
    countByCell.set(match[1], count ? Number(count[1].replace(/,/g, "")) : 0);
  }

  const days: ContributionDay[] = [];
  for (const [cell, date] of dateByCell) {
    days.push({
      date,
      level: levelByCell.get(cell) ?? 0,
      count: countByCell.get(cell) ?? 0,
    });
  }
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

export function renderContributionGraph(days: ContributionDay[], username: string): string[] {
  if (days.length === 0) {
    return ["No contribution data available."];
  }

  const levelByDate = new Map(days.map((d) => [d.date, d.level]));
  const total = days.reduce((sum, d) => sum + d.count, 0);

  const minDate = toUtc(days[0].date);
  const maxDate = toUtc(days[days.length - 1].date);
  const startSunday = new Date(minDate.getTime() - minDate.getUTCDay() * DAY_MS);
  const weeks = Math.floor((maxDate.getTime() - startSunday.getTime()) / DAY_MS / 7) + 1;

  const monthChars = new Array<string>(weeks).fill(" ");
  let prevMonth = -1;
  for (let c = 0; c < weeks; c++) {
    const d = new Date(startSunday.getTime() + c * 7 * DAY_MS);
    const m = d.getUTCMonth();
    if (m !== prevMonth) {
      const abbr = MONTHS[m];
      for (let k = 0; k < abbr.length && c + k < weeks; k++) {
        monthChars[c + k] = abbr[k];
      }
    }
    prevMonth = m;
  }

  const halfCell = (topLevel: number, bottomLevel: number | null): string => {
    const [tr, tg, tb] = rgb(LEVEL_COLORS[topLevel]);
    if (bottomLevel === null) {
      return `\x1b[38;2;${tr};${tg};${tb}m▀\x1b[0m`;
    }
    const [br, bg, bb] = rgb(LEVEL_COLORS[bottomLevel]);
    return `\x1b[38;2;${tr};${tg};${tb}m\x1b[48;2;${br};${bg};${bb}m▀\x1b[0m`;
  };

  const graphRows: string[] = [];
  const rowLabels = ["Mon ", "Wed ", "Fri ", "    "];
  for (let i = 0; i < 4; i++) {
    const top = i * 2;
    const bottom = top + 1;
    let row = rowLabels[i];
    for (let c = 0; c < weeks; c++) {
      const topLevel = levelByDate.get(iso(new Date(startSunday.getTime() + (c * 7 + top) * DAY_MS))) ?? 0;
      const bottomLevel =
        bottom <= 6
          ? levelByDate.get(iso(new Date(startSunday.getTime() + (c * 7 + bottom) * DAY_MS))) ?? 0
          : null;
      row += halfCell(topLevel, bottomLevel);
    }
    graphRows.push(row);
  }

  const legend =
    "Less " +
    [0, 1, 2, 3, 4]
      .map((l) => {
        const [r, g, b] = rgb(LEVEL_COLORS[l]);
        return `\x1b[38;2;${r};${g};${b}m█\x1b[0m`;
      })
      .join(" ") +
    " More";

  return [
    `\x1b[1;32m@${username}\x1b[0m — GitHub contributions`,
    `\x1b[1;34m${total.toLocaleString()}\x1b[0m contributions in the last year`,
    "",
    "    " + monthChars.join(""),
    ...graphRows,
    "",
    legend,
  ];
}
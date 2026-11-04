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

export function buildContributionCalendar(days: ContributionDay[]): {
  weeks: (ContributionDay | null)[][];
  total: number;
} {
  if (days.length === 0) return { weeks: [], total: 0 };

  const sortedDays = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const byDate = new Map(sortedDays.map((day) => [day.date, day]));
  const first = toUtc(sortedDays[0].date);
  const last = toUtc(sortedDays[sortedDays.length - 1].date);
  const startSunday = new Date(first.getTime() - first.getUTCDay() * DAY_MS);
  const weekCount = Math.floor((last.getTime() - startSunday.getTime()) / DAY_MS / 7) + 1;
  const weeks = Array.from({ length: weekCount }, (_, week) =>
    Array.from({ length: 7 }, (_, weekday) => {
      const date = iso(new Date(startSunday.getTime() + (week * 7 + weekday) * DAY_MS));
      return byDate.get(date) ?? null;
    }),
  );

  return { weeks, total: days.reduce((sum, day) => sum + day.count, 0) };
}

export interface CalendarPosition {
  week: number;
  day: number;
}

type CalendarWeeks = (ContributionDay | null)[][];

/** Single source of wording for a day's tooltip and accessible name. */
export function contributionDayLabel(day: ContributionDay): string {
  return `${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`;
}

/** Keys the heatmap grid handles (and must preventDefault), even when the position cannot change. */
export const CALENDAR_NAV_KEYS: ReadonlySet<string> = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
]);

function hasDay(weeks: CalendarWeeks, pos: CalendarPosition): boolean {
  return Boolean(weeks[pos.week]?.[pos.day]);
}

/** Most recent non-null day, or null when the calendar is empty / has no days. */
export function initialCalendarFocus(weeks: CalendarWeeks): CalendarPosition | null {
  for (let week = weeks.length - 1; week >= 0; week--) {
    for (let day = weeks[week].length - 1; day >= 0; day--) {
      if (weeks[week][day]) return { week, day };
    }
  }
  return null;
}

/**
 * Next focus position for a navigation key. Returns `from` itself when the key is not a
 * navigation key, the target is outside the calendar or empty (no skipping over nulls), or
 * `from` does not point at a real day. Never returns an out-of-range position.
 */
export function moveCalendarFocus(
  weeks: CalendarWeeks,
  from: CalendarPosition,
  key: string,
  { ctrl }: { ctrl: boolean } = { ctrl: false },
): CalendarPosition {
  if (!hasDay(weeks, from)) return from;

  let target: CalendarPosition | null = null;
  switch (key) {
    case "ArrowLeft":
      target = { week: from.week - 1, day: from.day };
      break;
    case "ArrowRight":
      target = { week: from.week + 1, day: from.day };
      break;
    case "ArrowUp":
      target = { week: from.week, day: from.day - 1 };
      break;
    case "ArrowDown":
      target = { week: from.week, day: from.day + 1 };
      break;
    case "Home":
    case "End": {
      const first = key === "Home";
      const weekRange = ctrl ? weeks.map((_, week) => week) : [from.week];
      if (!first) weekRange.reverse();
      for (const week of weekRange) {
        const days = weeks[week].map((_, day) => day);
        if (!first) days.reverse();
        const day = days.find((index) => weeks[week][index]);
        if (day !== undefined) {
          target = { week, day };
          break;
        }
      }
      break;
    }
  }

  return target && hasDay(weeks, target) ? target : from;
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

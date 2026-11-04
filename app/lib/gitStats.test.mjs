import assert from "node:assert/strict";
import test from "node:test";
import { renderGitStats } from "./gitStats.ts";

const ANSI = /\x1b\[[0-9;]*m/g;
const strip = (line) => line.replace(ANSI, "");

function payload(overrides = {}) {
  return {
    username: "octocat",
    publicRepos: 12,
    followers: 34,
    totalStars: 56,
    topLanguages: [],
    createdAt: "2015-01-01T00:00:00Z",
    ...overrides,
  };
}

function languageLines(lines) {
  return lines.slice(lines.indexOf("Top languages:") + 1);
}

function barLength(line) {
  return [...line].filter((char) => char === "█").length;
}

test("renders the header and summary lines with exact colour codes", () => {
  const lines = renderGitStats(payload());

  assert.deepEqual(lines, [
    "\x1b[1;32m@octocat\x1b[0m — GitHub stats",
    "",
    "  Public repos     \x1b[1;34m12\x1b[0m",
    "  Total stars      \x1b[1;33m★ 56\x1b[0m",
    "  Followers        \x1b[1;34m34\x1b[0m",
    "  On GitHub since  \x1b[1;34m2015\x1b[0m",
  ]);
});

test("derives the since-year from the UTC date of createdAt", () => {
  const sinceYear = (createdAt) =>
    strip(renderGitStats(payload({ createdAt }))[5]);

  assert.equal(sinceYear("2015-01-01T00:00:00Z"), "  On GitHub since  2015");
  assert.equal(sinceYear("2015-12-31T23:59:59Z"), "  On GitHub since  2015");
  // 23:30 at UTC-5 is 04:30 UTC on the next day, which crosses into 2016.
  assert.equal(sinceYear("2015-12-31T23:30:00-05:00"), "  On GitHub since  2016");
  // 00:30 at UTC+2 is 22:30 UTC the previous day, which stays in 2014.
  assert.equal(sinceYear("2015-01-01T00:30:00+02:00"), "  On GitHub since  2014");
});

test("renders exactly six lines and no language section when topLanguages is empty", () => {
  const lines = renderGitStats(payload({ topLanguages: [] }));

  assert.equal(lines.length, 6);
  assert.ok(!lines.some((line) => line.includes("Top languages:")));
});

test("adds a blank line and a Top languages heading before the language rows", () => {
  const lines = renderGitStats(
    payload({ topLanguages: [{ name: "TypeScript", count: 3 }] }),
  );

  assert.equal(lines.length, 9);
  assert.equal(lines[6], "");
  assert.equal(lines[7], "Top languages:");
});

test("scales language bars against the first entry on a 20 block width", () => {
  const lines = renderGitStats(
    payload({
      topLanguages: [
        { name: "TypeScript", count: 10 },
        { name: "CSS", count: 5 },
        { name: "HTML", count: 1 },
      ],
    }),
  );
  const rows = languageLines(lines);

  assert.equal(rows.length, 3);
  assert.deepEqual(rows.map(barLength), [20, 10, 2]);
});

test("gives a tiny language count a minimum bar of one block", () => {
  const rows = languageLines(
    renderGitStats(
      payload({
        topLanguages: [
          { name: "TypeScript", count: 100 },
          { name: "Shell", count: 1 },
        ],
      }),
    ),
  );

  // 1 / 100 * 20 rounds to 0, so the minimum of one block applies.
  assert.deepEqual(rows.map(barLength), [20, 1]);
});

test("pads the language name to 12 characters and prints the count after the bar", () => {
  const rows = languageLines(
    renderGitStats(
      payload({
        topLanguages: [
          { name: "TypeScript", count: 10 },
          { name: "CSS", count: 5 },
          { name: "HTML", count: 1 },
        ],
      }),
    ),
  );

  assert.deepEqual(rows, [
    `  TypeScript   \x1b[1;32m${"█".repeat(20)}\x1b[0m 10`,
    `  CSS          \x1b[1;32m${"█".repeat(10)}\x1b[0m 5`,
    `  HTML         \x1b[1;32m${"█".repeat(2)}\x1b[0m 1`,
  ]);
});

test("does not truncate language names longer than 12 characters", () => {
  const [row] = languageLines(
    renderGitStats(
      payload({ topLanguages: [{ name: "Jupyter Notebook", count: 4 }] }),
    ),
  );

  assert.equal(strip(row), `  Jupyter Notebook ${"█".repeat(20)} 4`);
});

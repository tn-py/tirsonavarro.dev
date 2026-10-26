import assert from "node:assert/strict";
import test from "node:test";
import { buildContributionCalendar } from "./gitContributions.ts";

test("contribution calendar aligns dates to Sunday-first weeks without inventing activity", () => {
  const calendar = buildContributionCalendar([
    { date: "2026-10-19", count: 2, level: 1 },
    { date: "2026-10-21", count: 5, level: 3 },
  ]);

  assert.equal(calendar.total, 7);
  assert.equal(calendar.weeks.length, 1);
  assert.deepEqual(calendar.weeks[0].map((day) => day?.date ?? null), [
    null, "2026-10-19", null, "2026-10-21", null, null, null,
  ]);
});

test("contribution calendar starts a new column each Sunday", () => {
  const calendar = buildContributionCalendar([
    { date: "2026-10-24", count: 1, level: 1 },
    { date: "2026-10-25", count: 3, level: 2 },
  ]);

  assert.equal(calendar.weeks.length, 2);
  assert.equal(calendar.weeks[0][6]?.date, "2026-10-24");
  assert.equal(calendar.weeks[1][0]?.date, "2026-10-25");
});

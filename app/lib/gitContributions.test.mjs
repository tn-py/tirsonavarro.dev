import assert from "node:assert/strict";
import test from "node:test";
import {
  buildContributionCalendar,
  CALENDAR_NAV_KEYS,
  calendarRows,
  contributionDayLabel,
  initialCalendarFocus,
  moveCalendarFocus,
} from "./gitContributions.ts";

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

const d = (date, count = 1) => ({ date, count, level: 1 });
// Partial first week (Wed-Sat), full middle week, partial last week (Sun-Tue).
const weeks = [
  [null, null, null, d("a3"), d("a4"), d("a5"), d("a6")],
  [d("b0"), d("b1"), d("b2"), d("b3"), d("b4"), d("b5"), d("b6")],
  [d("c0"), d("c1"), d("c2"), null, null, null, null],
];
const allNull = [[null, null, null, null, null, null, null]];

test("contributionDayLabel pluralises like the existing tooltip", () => {
  assert.equal(contributionDayLabel(d("2026-10-19", 1)), "1 contribution on 2026-10-19");
  assert.equal(contributionDayLabel(d("2026-10-19", 0)), "0 contributions on 2026-10-19");
  assert.equal(contributionDayLabel(d("2026-10-19", 2)), "2 contributions on 2026-10-19");
});

test("initialCalendarFocus picks the most recent non-null day", () => {
  // final partial week: last non-null day is Tuesday, not Saturday
  assert.deepEqual(initialCalendarFocus(weeks), { week: 2, day: 2 });
  const full = buildContributionCalendar([d("2026-10-24"), d("2026-10-25")]).weeks;
  assert.deepEqual(initialCalendarFocus(full), { week: 1, day: 0 });
  assert.deepEqual(initialCalendarFocus([[d("x"), null, null, null, null, null, null], allNull[0]]), { week: 0, day: 0 });
});

test("initialCalendarFocus is null for empty and all-null calendars", () => {
  assert.equal(initialCalendarFocus([]), null);
  assert.equal(initialCalendarFocus(allNull), null);
});

test("moveCalendarFocus handles every navigation key from mid-calendar", () => {
  const from = { week: 1, day: 3 };
  assert.deepEqual(moveCalendarFocus(weeks, from, "ArrowLeft"), { week: 0, day: 3 });
  assert.deepEqual(moveCalendarFocus(weeks, { week: 1, day: 1 }, "ArrowRight"), { week: 2, day: 1 });
  assert.deepEqual(moveCalendarFocus(weeks, from, "ArrowUp"), { week: 1, day: 2 });
  assert.deepEqual(moveCalendarFocus(weeks, from, "ArrowDown"), { week: 1, day: 4 });
  assert.deepEqual(moveCalendarFocus(weeks, from, "Home"), { week: 1, day: 0 });
  assert.deepEqual(moveCalendarFocus(weeks, from, "End"), { week: 1, day: 6 });
});

test("moveCalendarFocus stays put at calendar edges", () => {
  assert.deepEqual(moveCalendarFocus(weeks, { week: 0, day: 4 }, "ArrowLeft"), { week: 0, day: 4 });
  assert.deepEqual(moveCalendarFocus(weeks, { week: 2, day: 1 }, "ArrowRight"), { week: 2, day: 1 });
  assert.deepEqual(moveCalendarFocus(weeks, { week: 1, day: 0 }, "ArrowUp"), { week: 1, day: 0 });
  assert.deepEqual(moveCalendarFocus(weeks, { week: 1, day: 6 }, "ArrowDown"), { week: 1, day: 6 });
});

test("moveCalendarFocus does not move onto null cells in partial weeks", () => {
  // Left into a null cell of the partial first week, Right into one of the partial last week
  assert.deepEqual(moveCalendarFocus(weeks, { week: 1, day: 1 }, "ArrowLeft"), { week: 1, day: 1 });
  assert.deepEqual(moveCalendarFocus(weeks, { week: 1, day: 5 }, "ArrowRight"), { week: 1, day: 5 });
  assert.deepEqual(moveCalendarFocus(weeks, { week: 1, day: 3 }, "ArrowRight"), { week: 1, day: 3 });
  // Up/Down into a null cell
  assert.deepEqual(moveCalendarFocus(weeks, { week: 0, day: 3 }, "ArrowUp"), { week: 0, day: 3 });
  assert.deepEqual(moveCalendarFocus(weeks, { week: 2, day: 2 }, "ArrowDown"), { week: 2, day: 2 });
});

test("moveCalendarFocus Home/End use the first/last non-null day of the week", () => {
  assert.deepEqual(moveCalendarFocus(weeks, { week: 0, day: 5 }, "Home"), { week: 0, day: 3 });
  assert.deepEqual(moveCalendarFocus(weeks, { week: 0, day: 3 }, "End"), { week: 0, day: 6 });
  assert.deepEqual(moveCalendarFocus(weeks, { week: 2, day: 0 }, "End"), { week: 2, day: 2 });
  assert.deepEqual(moveCalendarFocus(weeks, { week: 2, day: 2 }, "Home"), { week: 2, day: 0 });
});

test("moveCalendarFocus Ctrl+Home/End jump to the first/last day of the calendar", () => {
  assert.deepEqual(moveCalendarFocus(weeks, { week: 1, day: 4 }, "Home", { ctrl: true }), { week: 0, day: 3 });
  assert.deepEqual(moveCalendarFocus(weeks, { week: 1, day: 4 }, "End", { ctrl: true }), { week: 2, day: 2 });
});

test("moveCalendarFocus leaves position unchanged for unhandled keys", () => {
  const from = { week: 1, day: 3 };
  for (const key of ["Tab", "a", "Enter", " ", "PageDown", ""]) {
    assert.equal(moveCalendarFocus(weeks, from, key), from);
    assert.equal(CALENDAR_NAV_KEYS.has(key), false);
  }
});

test("CALENDAR_NAV_KEYS contains exactly the six handled keys", () => {
  assert.deepEqual(
    [...CALENDAR_NAV_KEYS].sort(),
    ["ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp", "End", "Home"],
  );
});

test("moveCalendarFocus is safe for empty, all-null and out-of-range input", () => {
  const from0 = { week: 0, day: 0 };
  for (const calendar of [[], allNull]) {
    for (const key of CALENDAR_NAV_KEYS) {
      for (const ctrl of [false, true]) {
        assert.deepEqual(moveCalendarFocus(calendar, from0, key, { ctrl }), from0);
      }
    }
  }
  const outOfRange = [{ week: -1, day: 0 }, { week: 9, day: 0 }, { week: 1, day: 7 }, { week: 1, day: -2 }, from0];
  for (const from of outOfRange) {
    for (const key of CALENDAR_NAV_KEYS) {
      assert.deepEqual(moveCalendarFocus(weeks, from, key), from);
      assert.deepEqual(moveCalendarFocus(weeks, from, key, { ctrl: true }), from);
    }
  }
});

test("moveCalendarFocus never returns an out-of-range or null position from a valid one", () => {
  for (let week = 0; week < weeks.length; week++) {
    for (let day = 0; day < 7; day++) {
      if (!weeks[week][day]) continue;
      for (const key of CALENDAR_NAV_KEYS) {
        for (const ctrl of [false, true]) {
          const to = moveCalendarFocus(weeks, { week, day }, key, { ctrl });
          assert.ok(weeks[to.week]?.[to.day], `${key} ctrl=${ctrl} from ${week},${day} -> ${JSON.stringify(to)}`);
        }
      }
    }
  }
});

// ARIA grid orientation: weeks are visual columns, weekdays are rows (Sunday first).
test("calendarRows returns one weekday per row with one position per week, in week order", () => {
  const { weeks: cal } = buildContributionCalendar([
    { date: "2026-10-21", count: 1, level: 1 }, // Wed, partial first week
    ...Array.from({ length: 14 }, (_, i) => ({
      date: new Date(Date.UTC(2026, 9, 25 + i)).toISOString().slice(0, 10), // Sun 10-25 .. Sat 11-07
      count: i,
      level: 0,
    })),
    { date: "2026-11-08", count: 4, level: 2 }, // Sun, partial last week
  ]);
  assert.equal(cal.length, 4);

  const rows = calendarRows(cal);
  assert.equal(rows.length, 7);
  for (let d = 0; d < 7; d++) {
    assert.equal(rows[d].length, cal.length, `row ${d} has one position per week`);
    for (let w = 0; w < cal.length; w++) assert.equal(rows[d][w], cal[w][d], `rows[${d}][${w}]`);
  }

  const dates = (row) => row.map((day) => day?.date ?? null);
  // Row 0 is Sunday across the weeks, ascending; the partial first week keeps its null in place.
  assert.deepEqual(dates(rows[0]), [null, "2026-10-25", "2026-11-01", "2026-11-08"]);
  // Row 3 is Wednesday: the first week's cell exists, the last week's (after the range) is null.
  assert.deepEqual(dates(rows[3]), ["2026-10-21", "2026-10-28", "2026-11-04", null]);
  // Row 6 is Saturday: null before the range in week 0 and after the range in the last week.
  assert.deepEqual(dates(rows[6]), [null, "2026-10-31", "2026-11-07", null]);
});

test("calendarRows is 7 empty rows for an empty calendar and pads missing positions with null", () => {
  assert.deepEqual(calendarRows([]), [[], [], [], [], [], [], []]);
  const rows = calendarRows([[{ date: "2026-10-25", count: 0, level: 0 }]]);
  assert.equal(rows.length, 7);
  assert.equal(rows[0][0]?.date, "2026-10-25");
  for (let d = 1; d < 7; d++) assert.deepEqual(rows[d], [null]);
});

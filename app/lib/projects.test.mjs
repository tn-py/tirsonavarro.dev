import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { sortProjects } from "./projectOrder.ts";

const PROJECTS_DIR = new URL("../../content/projects/", import.meta.url);

const PRIVATE_REPOS = [
  "referral-app",
  "agent-poker",
  "refinery",
  "deal",
  "shopify-ai-shopping",
  "3mf-studio",
  "Transcribe-Script",
  "lead-engine",
  "shopify-loyalty-rewards-app",
];

// Parses the restricted frontmatter subset used by content/projects/*.mdx:
// one `key: value` per line; value is a double-quoted string, an integer, a
// JSON array of double-quoted strings, or a bare string. Throws on anything else.
export function parseFrontmatter(source, label = "input") {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  if (lines[0] !== "---") throw new Error(`${label}: must start with a --- fence`);
  const end = lines.indexOf("---", 1);
  if (end === -1) throw new Error(`${label}: missing closing --- fence`);

  const data = {};
  for (let i = 1; i < end; i++) {
    const line = lines[i];
    const where = `${label}:${i + 1}`;
    const match = /^([A-Za-z][A-Za-z0-9_]*): (.+)$/.exec(line);
    if (!match) throw new Error(`${where}: cannot parse line ${JSON.stringify(line)}`);
    const [, key, raw] = match;
    if (key in data) throw new Error(`${where}: duplicate key ${key}`);
    const value = raw.trim();

    if (value.startsWith('"')) {
      let parsed;
      try {
        parsed = JSON.parse(value);
      } catch {
        throw new Error(`${where}: bad quoted string ${JSON.stringify(value)}`);
      }
      if (typeof parsed !== "string") throw new Error(`${where}: expected a string`);
      data[key] = parsed;
    } else if (value.startsWith("[")) {
      let parsed;
      try {
        parsed = JSON.parse(value);
      } catch {
        throw new Error(`${where}: bad array ${JSON.stringify(value)}`);
      }
      if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== "string")) {
        throw new Error(`${where}: array must contain only double-quoted strings`);
      }
      data[key] = parsed;
    } else if (/^-?\d+$/.test(value)) {
      data[key] = Number(value);
    } else if (/^[{|>&*!#'%@`]/.test(value)) {
      throw new Error(`${where}: unsupported value syntax ${JSON.stringify(value)}`);
    } else {
      data[key] = value;
    }
  }
  return data;
}

// True when a githubUrl points at github.com/tn-py/<repo> for a repo in `repos`.
// The repo name must match exactly: followed by end of string, `/`, `#` or `?`.
export function pointsAtPrivateRepo(url, repos = PRIVATE_REPOS) {
  return repos.some((repo) => {
    const escaped = repo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`github\\.com/tn-py/${escaped}(?:$|[/#?])`, "i").test(url);
  });
}

const entries = readdirSync(PROJECTS_DIR)
  .filter((name) => name.endsWith(".mdx"))
  .sort()
  .map((name) => ({
    name,
    frontmatter: parseFrontmatter(readFileSync(new URL(name, PROJECTS_DIR), "utf8"), name),
  }));

test("there are project entries to check", () => {
  assert.ok(entries.length > 0);
});

for (const { name, frontmatter: fm } of entries) {
  test(`${name}: required fields`, () => {
    assert.equal(typeof fm.title, "string");
    assert.ok(fm.title.trim().length > 0, "title must be non-empty");
    assert.equal(typeof fm.description, "string");
    assert.ok(fm.description.trim().length > 0, "description must be non-empty");
    assert.ok(Array.isArray(fm.tags), "tags must be an array");
    assert.ok(fm.tags.length >= 1 && fm.tags.length <= 4, "tags must have 1-4 entries");
    for (const tag of fm.tags) assert.ok(tag.trim().length > 0, "tags must be non-empty");
  });

  test(`${name}: optional fields`, () => {
    if ("order" in fm) assert.ok(Number.isInteger(fm.order), "order must be an integer");
    if ("liveUrl" in fm) {
      assert.equal(typeof fm.liveUrl, "string");
      assert.ok(fm.liveUrl.startsWith("https://"), "liveUrl must start with https://");
    }
    if ("status" in fm) {
      assert.equal(typeof fm.status, "string");
      assert.ok(fm.status.trim().length > 0, "status must be non-empty");
    }
  });

  test(`${name}: githubUrl is not a private repo`, () => {
    if ("githubUrl" in fm) {
      assert.ok(!pointsAtPrivateRepo(fm.githubUrl), `githubUrl points at a private repo: ${fm.githubUrl}`);
    }
  });
}

test("order values are unique across entries", () => {
  const seen = new Map();
  for (const { name, frontmatter: fm } of entries) {
    if (!("order" in fm)) continue;
    assert.ok(!seen.has(fm.order), `${name} and ${seen.get(fm.order)} share order ${fm.order}`);
    seen.set(fm.order, name);
  }
});

test("parseFrontmatter reads the supported value forms", () => {
  const fm = parseFrontmatter(
    ['---', 'title: Bare Title', 'description: "Quoted: with colon"', 'tags: ["A", "B"]', "order: 3", "---", "# body"].join("\n"),
  );
  assert.deepEqual(fm, { title: "Bare Title", description: "Quoted: with colon", tags: ["A", "B"], order: 3 });
});

test("parseFrontmatter fails on lines it cannot parse", () => {
  const wrap = (line) => ["---", "title: T", line, "---"].join("\n");
  assert.throws(() => parseFrontmatter(wrap("this is not a pair")), /cannot parse line/);
  assert.throws(() => parseFrontmatter(wrap("  indented: value")), /cannot parse line/);
  assert.throws(() => parseFrontmatter(wrap("tags: [\"A\", 'B']")), /bad array/);
  assert.throws(() => parseFrontmatter(wrap("tags: [1, 2]")), /only double-quoted strings/);
  assert.throws(() => parseFrontmatter(wrap('extra: "unterminated')), /bad quoted string/);
  assert.throws(() => parseFrontmatter(wrap("nested: { a: 1 }")), /unsupported value syntax/);
  assert.throws(() => parseFrontmatter(wrap("title: Again")), /duplicate key/);
  assert.throws(() => parseFrontmatter("title: no fence"), /must start with/);
  assert.throws(() => parseFrontmatter("---\ntitle: T\n"), /missing closing/);
});

test("pointsAtPrivateRepo matches the exact repo name only", () => {
  assert.equal(pointsAtPrivateRepo("https://github.com/tn-py/deal"), true);
  assert.equal(pointsAtPrivateRepo("https://github.com/tn-py/deal/"), true);
  assert.equal(pointsAtPrivateRepo("https://github.com/tn-py/deal#readme"), true);
  assert.equal(pointsAtPrivateRepo("https://github.com/tn-py/deal?tab=x"), true);
  assert.equal(pointsAtPrivateRepo("https://github.com/TN-PY/Agent-Poker"), true);
  assert.equal(pointsAtPrivateRepo("https://github.com/tn-py/deal-x"), false);
  assert.equal(pointsAtPrivateRepo("https://github.com/tn-py/dealer"), false);
  assert.equal(pointsAtPrivateRepo("https://github.com/tn-py/expo-shopify-storefront"), false);
  assert.equal(pointsAtPrivateRepo("https://github.com/other/deal"), false);
});

test("sortProjects orders by ascending order", () => {
  const out = sortProjects([
    { title: "A", order: 3 },
    { title: "B", order: 1 },
    { title: "C", order: 2 },
  ]);
  assert.deepEqual(out.map((p) => p.title), ["B", "C", "A"]);
});

test("sortProjects puts entries without order after ordered ones, by title", () => {
  const out = sortProjects([
    { title: "Zed" },
    { title: "Beta", order: 5 },
    { title: "Alpha" },
    { title: "Gamma", order: 2 },
  ]);
  assert.deepEqual(out.map((p) => p.title), ["Gamma", "Beta", "Alpha", "Zed"]);
});

test("sortProjects breaks order ties by title", () => {
  const out = sortProjects([
    { title: "Bravo", order: 1 },
    { title: "Alpha", order: 1 },
  ]);
  assert.deepEqual(out.map((p) => p.title), ["Alpha", "Bravo"]);
});

test("sortProjects treats non-finite order as missing", () => {
  const out = sortProjects([
    { title: "B", order: Number.NaN },
    { title: "A", order: undefined },
    { title: "C", order: 1 },
  ]);
  assert.deepEqual(out.map((p) => p.title), ["C", "A", "B"]);
});

test("sortProjects does not mutate its input", () => {
  const input = [
    { title: "B", order: 2 },
    { title: "A", order: 1 },
  ];
  const snapshot = structuredClone(input);
  const out = sortProjects(input);
  assert.notEqual(out, input);
  assert.deepEqual(input, snapshot);
});

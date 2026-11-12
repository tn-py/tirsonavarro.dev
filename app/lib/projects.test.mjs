import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { sortProjects } from "./projectOrder.ts";

const PROJECTS_DIR = new URL("../../content/projects/", import.meta.url);

// The homepage slider lineup, in display order (`order` is position + 1).
const LINEUP = [
  "expo-shopify-storefront",
  "referral-rewards",
  "agent-poker",
  "uhs-mobile-ecosystem",
  "refinery",
  "deal-stack",
  "shopify-ai-shopping",
  "3mf-studio",
  "transcribe-script",
  "lead-engine",
];
const IN_PROGRESS = ["referral-rewards", "refinery", "shopify-ai-shopping", "3mf-studio", "lead-engine"];
const LIVE_URLS = {
  "agent-poker": "https://agent-poker-aiis.vercel.app",
  "deal-stack": "https://deal-sigma.vercel.app",
};

// Public copy must never contain these (case-insensitive substrings).
const BANNED_TERMS = [
  "Monopoly", "SoFloDirect", "SoFlo", "Best Vapes", "bestvapes", "vape", "kratom", "USDC", "staked",
  "wager", "real-money", "real money", "WebSocket", "NetSuite", "Matrixify", "SearchSpring", "OneSignal",
  "Orchestrated", "Coolify", "ts.net", "tailnet", "tailscale", "omarchy", "Gayou", "cold-call", "cold call",
  "weak or missing websites", "Google Maps", "seamless", "elevate", "unleash", "next-gen", "high-performance",
];
const BANNED_PATTERNS = [
  ["IPv4 address", /\b\d{1,3}(?:\.\d{1,3}){3}\b/],
  ["email address", /[\w.+-]+@[\w-]+\.[\w.-]+/],
  ["US phone number", /(?:\+?1[-.\s])?\(?\b\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/],
  ["UUID", /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i],
];

export function findBanned(text) {
  const lower = text.toLowerCase();
  const hits = BANNED_TERMS.filter((term) => lower.includes(term.toLowerCase()));
  for (const [label, re] of BANNED_PATTERNS) if (re.test(text)) hits.push(label);
  return hits;
}

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
  .map((name) => {
    const text = readFileSync(new URL(name, PROJECTS_DIR), "utf8");
    return { name, text, frontmatter: parseFrontmatter(text, name) };
  });

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

const bodyOf = (text) => text.replace(/\r\n/g, "\n").split("\n---\n").slice(1).join("\n---\n");
const byName = (name) => entries.find((e) => e.name === `${name}.mdx`);

test("S2-1: the listed slugs are exactly the lineup, with order equal to position", () => {
  assert.deepEqual(entries.map((e) => e.name.replace(/\.mdx$/, "")).sort(), [...LINEUP].sort());
  LINEUP.forEach((slug, i) => assert.equal(byName(slug)?.frontmatter.order, i + 1, `${slug} order`));
});

test("S2-1: titles fit the card (<=44) and descriptions fit (<=120)", () => {
  for (const { name, frontmatter: fm } of entries) {
    assert.ok(fm.title.length <= 44, `${name} title is ${fm.title.length} chars`);
    assert.ok(fm.description.length <= 120, `${name} description is ${fm.description.length} chars`);
  }
});

test("S2-1: required titles, status, liveUrl and githubUrl per brief", () => {
  assert.equal(byName("referral-rewards")?.frontmatter.title, "Referral & Rewards for Shopify");
  assert.equal(byName("deal-stack")?.frontmatter.title, "Deal Stack");
  for (const slug of LINEUP) {
    const fm = byName(slug)?.frontmatter ?? {};
    assert.equal(fm.status, IN_PROGRESS.includes(slug) ? "In progress" : undefined, `${slug} status`);
    assert.equal(fm.liveUrl, LIVE_URLS[slug], `${slug} liveUrl`);
    assert.equal("githubUrl" in fm, slug === "expo-shopify-storefront", `${slug} githubUrl`);
  }
});

test("S2-1: each page has a title heading, a short intro and 3-4 'What it does' bullets in 70-110 words", () => {
  for (const { name, text, frontmatter: fm } of entries) {
    const body = bodyOf(text).trim();
    const [head, ...rest] = body.split(/\n## What it does\n/);
    assert.equal(rest.length, 1, `${name}: needs exactly one '## What it does' section`);
    const [h1, ...introLines] = head.trim().split("\n");
    assert.equal(h1, `# ${fm.title}`, `${name}: first heading must be '# <title>'`);
    const sentences = introLines.join(" ").trim().split(/(?<=[.!?])\s+/).filter(Boolean);
    assert.ok(sentences.length >= 1 && sentences.length <= 3, `${name}: intro has ${sentences.length} sentences`);
    const bullets = rest[0].trim().split("\n").filter((l) => l.trim());
    assert.ok(bullets.every((l) => l.startsWith("- ")), `${name}: 'What it does' must contain only bullets`);
    assert.ok(bullets.length >= 3 && bullets.length <= 4, `${name}: ${bullets.length} bullets`);
    const words = body.split(/\s+/).filter(Boolean).length;
    assert.ok(words >= 70 && words <= 110, `${name}: ${words} words in body`);
  }
});

test("S2-2: no banned term or identifier pattern appears in any MDX file", () => {
  for (const { name, text } of entries) assert.deepEqual(findBanned(text), [], `${name} contains banned content`);
});

test("S2-2: findBanned catches each kind of banned content", () => {
  for (const term of BANNED_TERMS) assert.ok(findBanned(`about ${term.toUpperCase()} here`).includes(term), term);
  assert.deepEqual(findBanned("host 10.0.0.12 up"), ["IPv4 address"]);
  assert.deepEqual(findBanned("mail me@example.com"), ["email address"]);
  assert.deepEqual(findBanned("call (305) 555-0123"), ["US phone number"]);
  assert.deepEqual(findBanned("call 305-555-0123"), ["US phone number"]);
  assert.deepEqual(findBanned("id 123e4567-e89b-12d3-a456-426614174000"), ["UUID"]);
  assert.deepEqual(findBanned("Plain store-owner copy with 3 bullets and version 1.2"), []);
});

// The only digit the UHS file may hold is its frontmatter `order` value; everything else is digit-free.
test("S2-2: uhs-mobile-ecosystem.mdx contains no digit characters (besides its order line)", () => {
  const text = byName("uhs-mobile-ecosystem")?.text ?? "x1";
  assert.doesNotMatch(text.replace(/^order: \d+$/m, ""), /\d/);
});

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

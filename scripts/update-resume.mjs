#!/usr/bin/env node
/**
 * update-resume.mjs
 *
 * AI agent that fetches your LinkedIn profile via Firecrawl and uses
 * Google Gemini Flash to extract and update src/data/resume.ts.
 *
 * Usage:
 *   node scripts/update-resume.mjs
 *   node scripts/update-resume.mjs --linkedin-url https://www.linkedin.com/in/your-profile
 *   node scripts/update-resume.mjs --dry-run
 *
 * Required environment variables:
 *   FIRECRAWL_API_KEY   — Firecrawl API key (https://firecrawl.dev)
 *   GEMINI_API_KEY      — Google AI Studio API key (https://aistudio.google.com)
 *
 * Optional environment variables:
 *   GEMINI_MODEL        — Override the model (default: gemini-2.0-flash)
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { parseArgs } from "util";

// ─── Config ───────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const RESUME_DATA_PATH = resolve(ROOT, "src/data/resume.ts");

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";

// Default LinkedIn URL — pulled from the resume data so there's one source of truth
const DEFAULT_LINKEDIN_URL = "https://www.linkedin.com/in/tirso-navarro";

// ─── CLI args ─────────────────────────────────────────────────────────────────

const { values: args } = parseArgs({
  options: {
    "linkedin-url": { type: "string" },
    "dry-run": { type: "boolean", default: false },
    help: { type: "boolean", default: false },
  },
  strict: false,
});

if (args.help) {
  console.log(`
update-resume.mjs — Fetch LinkedIn via Firecrawl + update resume with Gemini Flash

Usage:
  node scripts/update-resume.mjs [options]

Options:
  --linkedin-url <url>   LinkedIn profile URL (default: ${DEFAULT_LINKEDIN_URL})
  --dry-run              Preview the updated TypeScript without writing it
  --help                 Show this message

Environment:
  FIRECRAWL_API_KEY      Firecrawl API key   (https://firecrawl.dev)
  GEMINI_API_KEY         Google AI Studio key (https://aistudio.google.com)
  GEMINI_MODEL           Gemini model to use  (default: gemini-2.0-flash)

Examples:
  FIRECRAWL_API_KEY=fc-... GEMINI_API_KEY=AIza... node scripts/update-resume.mjs
  FIRECRAWL_API_KEY=fc-... GEMINI_API_KEY=AIza... node scripts/update-resume.mjs --dry-run
`);
  process.exit(0);
}

// ─── Validation ───────────────────────────────────────────────────────────────

const missing = [];
if (!FIRECRAWL_API_KEY) missing.push("FIRECRAWL_API_KEY");
if (!GEMINI_API_KEY) missing.push("GEMINI_API_KEY");

if (missing.length) {
  console.error(`❌  Missing required environment variable(s): ${missing.join(", ")}`);
  console.error("    Run with --help for usage.");
  process.exit(1);
}

// ─── Step 1: Firecrawl scrape ─────────────────────────────────────────────────

async function scrapeLinkedIn(url) {
  console.log(`🔍  Fetching LinkedIn profile via Firecrawl...\n    ${url}\n`);

  const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      formats: ["markdown"],
      // Firecrawl's managed browser handles LinkedIn's auth wall as best it can;
      // for a fully authenticated scrape you can use their /connect endpoint.
      onlyMainContent: true,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Firecrawl error ${response.status}: ${err}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(`Firecrawl returned success=false: ${JSON.stringify(data)}`);
  }

  const markdown = data.data?.markdown ?? "";
  if (!markdown.trim()) {
    throw new Error(
      "Firecrawl returned empty content. LinkedIn may have blocked the request.\n" +
      "    Tip: Try authenticating via Firecrawl's /connect endpoint for LinkedIn."
    );
  }

  console.log(`✅  Scraped ${markdown.length} characters of profile content.\n`);
  return markdown;
}

// ─── Step 2: Gemini extraction ────────────────────────────────────────────────

async function callGemini(prompt) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent` +
    `?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.1, // low temperature — we want deterministic structured output
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error(
      `Gemini returned no text. Full response:\n${JSON.stringify(data, null, 2)}`
    );
  }

  return text;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const EXTRACTION_PROMPT = (currentResumeTs, linkedInMarkdown) => `
You are a resume data extraction agent. Your job is to:

1. Read the CURRENT resume TypeScript file (defines a \`ResumeData\` object)
2. Read the LinkedIn profile markdown scraped from the live profile page
3. Return an UPDATED version of ONLY the \`resumeData\` const assignment — starting from
   \`export const resumeData: ResumeData = {\` and ending with the closing \`};\`

CRITICAL RULES — follow these exactly:
- Preserve the exact TypeScript structure (keys, types). Do NOT rename any fields.
- Update content values with accurate information from the LinkedIn markdown.
- If a field has no matching LinkedIn data, keep the existing value from the current file.
- The \`lastUpdated\` field must be set to today's date: ${new Date().toISOString().split("T")[0]}
- Do NOT include the interface definitions or any code above \`export const resumeData\`.
- Do NOT wrap output in markdown code fences — return raw TypeScript only.
- Preserve existing \`id\` values for matched entries. Generate simple slug IDs for new ones.
- \`experience[].endDate\` must be \`null\` for current roles, or a string e.g. "Jan 2023" for past ones.
- Keep \`personal.summary\` concise (2-3 sentences).
- Each \`highlights\` array should have 4-7 bullet points.

Output ONLY the raw TypeScript const block, nothing else.

---

## CURRENT resume.ts:

\`\`\`typescript
${currentResumeTs}
\`\`\`

---

## LINKEDIN PROFILE (scraped markdown):

${linkedInMarkdown}

---

Now output the updated \`export const resumeData: ResumeData = { ... };\` block.
`.trim();

async function main() {
  const linkedInUrl = args["linkedin-url"] ?? DEFAULT_LINKEDIN_URL;
  const currentResumeTs = readFileSync(RESUME_DATA_PATH, "utf-8");

  // 1. Scrape LinkedIn
  let linkedInMarkdown;
  try {
    linkedInMarkdown = await scrapeLinkedIn(linkedInUrl);
  } catch (err) {
    console.error("❌  Firecrawl scrape failed:", err.message);
    process.exit(1);
  }

  // 2. Call Gemini
  console.log(`🤖  Calling ${GEMINI_MODEL} to extract and update resume data...\n`);
  let updatedBlock;
  try {
    updatedBlock = await callGemini(
      EXTRACTION_PROMPT(currentResumeTs, linkedInMarkdown)
    );
  } catch (err) {
    console.error("❌  Gemini API call failed:", err.message);
    process.exit(1);
  }

  // 3. Strip any accidental markdown fences
  updatedBlock = updatedBlock
    .replace(/^```(?:typescript|ts)?\n?/m, "")
    .replace(/```\s*$/m, "")
    .trim();

  // 4. Validate structure
  if (!updatedBlock.startsWith("export const resumeData")) {
    console.error(
      "❌  Unexpected output from Gemini — does not start with `export const resumeData`.\n" +
      "    Got:\n" +
      updatedBlock.slice(0, 400)
    );
    process.exit(1);
  }

  // 5. Reconstruct full file (keep interfaces + comments, replace only the const)
  const exportConstIndex = currentResumeTs.indexOf(
    "export const resumeData: ResumeData ="
  );
  if (exportConstIndex === -1) {
    console.error(
      "❌  Could not find `export const resumeData: ResumeData =` in resume.ts.\n" +
      "    Ensure the file structure is intact."
    );
    process.exit(1);
  }

  const preamble = currentResumeTs.slice(0, exportConstIndex);
  const updatedFile = preamble + updatedBlock + "\n";

  if (args["dry-run"]) {
    console.log("─── DRY RUN — updated resumeData block ───────────────────────\n");
    console.log(updatedBlock);
    console.log("\n─────────────────────────────────────────────────────────────");
    console.log("✅  Dry run complete. No files were written.");
    return;
  }

  writeFileSync(RESUME_DATA_PATH, updatedFile, "utf-8");
  console.log("✅  src/data/resume.ts updated successfully.");
  console.log(`    → lastUpdated set to ${new Date().toISOString().split("T")[0]}`);
  console.log("\n    Review the diff, then commit and deploy to publish the updated resume:");
  console.log("    git diff src/data/resume.ts");
  console.log("    git add src/data/resume.ts && git commit -m 'chore: sync resume from LinkedIn'");
}

main().catch((err) => {
  console.error("❌  Unexpected error:", err);
  process.exit(1);
});

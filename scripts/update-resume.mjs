#!/usr/bin/env node
/**
 * update-resume.mjs
 *
 * AI agent that syncs your LinkedIn profile data into src/data/resume.ts.
 *
 * Usage:
 *   node scripts/update-resume.mjs --linkedin-data ./linkedin-export.json
 *   node scripts/update-resume.mjs --linkedin-text "Paste your LinkedIn About/Experience text here"
 *   node scripts/update-resume.mjs --dry-run   (preview changes without writing)
 *
 * Environment variables:
 *   ANTHROPIC_API_KEY  — required (Claude API key)
 *
 * How it works:
 *   1. Reads your current resume data from src/data/resume.ts
 *   2. Accepts LinkedIn data as a JSON export or plain text
 *   3. Sends both to Claude, asking it to produce an updated ResumeData object
 *      that preserves the existing structure but updates the content
 *   4. Writes the result back to src/data/resume.ts
 *
 * LinkedIn data formats accepted:
 *   - LinkedIn Data Export (JSON files from Settings → Data Privacy → Get a copy of your data)
 *   - Plain text: paste your LinkedIn profile text into a .txt file
 *   - Inline text via --linkedin-text flag
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { parseArgs } from "util";

// ─── Config ───────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const RESUME_DATA_PATH = resolve(ROOT, "src/data/resume.ts");

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = "claude-opus-4-6"; // Most capable for structured data extraction

// ─── CLI args ─────────────────────────────────────────────────────────────────

const { values: args } = parseArgs({
  options: {
    "linkedin-data": { type: "string" },  // path to JSON / text file
    "linkedin-text": { type: "string" },  // inline text
    "dry-run": { type: "boolean", default: false },
    help: { type: "boolean", default: false },
  },
  strict: false,
});

if (args.help) {
  console.log(`
update-resume.mjs — Sync LinkedIn data into your resume page

Usage:
  node scripts/update-resume.mjs [options]

Options:
  --linkedin-data <path>   Path to LinkedIn export JSON or plain text file
  --linkedin-text <text>   Inline LinkedIn profile text
  --dry-run                Preview the updated TypeScript without writing it
  --help                   Show this message

Environment:
  ANTHROPIC_API_KEY        Your Anthropic API key (required)

Examples:
  node scripts/update-resume.mjs --linkedin-data ./Profile.json
  node scripts/update-resume.mjs --linkedin-text "$(cat linkedin-about.txt)"
  node scripts/update-resume.mjs --linkedin-data ./Profile.json --dry-run
`);
  process.exit(0);
}

// ─── Validation ───────────────────────────────────────────────────────────────

if (!ANTHROPIC_API_KEY) {
  console.error("❌  ANTHROPIC_API_KEY environment variable is required.");
  process.exit(1);
}

if (!args["linkedin-data"] && !args["linkedin-text"]) {
  console.error(
    "❌  Provide LinkedIn data via --linkedin-data <file> or --linkedin-text <text>.\n" +
    "    Run with --help for usage."
  );
  process.exit(1);
}

// ─── Load inputs ──────────────────────────────────────────────────────────────

function loadLinkedInData() {
  if (args["linkedin-text"]) return args["linkedin-text"];

  const filePath = resolve(process.cwd(), args["linkedin-data"]);
  if (!existsSync(filePath)) {
    console.error(`❌  File not found: ${filePath}`);
    process.exit(1);
  }
  const raw = readFileSync(filePath, "utf-8");
  // If it's valid JSON, pretty-print it as a string so Claude reads it cleanly
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw; // treat as plain text
  }
}

const currentResumeTs = readFileSync(RESUME_DATA_PATH, "utf-8");
const linkedInData = loadLinkedInData();

// ─── Claude call ──────────────────────────────────────────────────────────────

async function callClaude(prompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a resume data extraction agent. Your job is to:

1. Read the CURRENT resume TypeScript file (which defines a \`ResumeData\` object)
2. Read the LinkedIn profile data provided
3. Return an UPDATED version of ONLY the \`resumeData\` const assignment — starting from
   \`export const resumeData: ResumeData = {\` and ending with the closing \`};\`

CRITICAL RULES — you must follow these exactly:
- Preserve the exact TypeScript structure (keys, types, interfaces). Do NOT change field names.
- Update content values with accurate information from LinkedIn.
- If LinkedIn data is missing a field, keep the existing value from the current file.
- The \`lastUpdated\` field must be set to today's date in YYYY-MM-DD format: ${new Date().toISOString().split("T")[0]}
- Do NOT include the interface definitions or any code above \`export const resumeData\`.
- Do NOT wrap output in markdown code blocks — return raw TypeScript only.
- Preserve existing IDs for entries when updating. For new entries, generate a simple slug ID.
- experience[].endDate must be \`null\` for current positions, or a string like "Jan 2023" for past ones.
- Keep the summary concise (2-3 sentences).
- highlights arrays should have 4-7 bullet points per entry.

Output only the raw TypeScript for the \`resumeData\` const, nothing else.`;

async function main() {
  console.log("🤖  Calling Claude to parse LinkedIn data and update resume...\n");

  const prompt = `${SYSTEM_PROMPT}

---

## CURRENT resume.ts file:

\`\`\`typescript
${currentResumeTs}
\`\`\`

---

## LINKEDIN PROFILE DATA:

${linkedInData}

---

Now produce the updated \`export const resumeData: ResumeData = { ... };\` block.`;

  let updatedBlock;
  try {
    updatedBlock = await callClaude(prompt);
  } catch (err) {
    console.error("❌  Claude API call failed:", err.message);
    process.exit(1);
  }

  // ── Strip any accidental markdown fences ──────────────────────────────────
  updatedBlock = updatedBlock
    .replace(/^```(?:typescript|ts)?\n?/m, "")
    .replace(/```\s*$/m, "")
    .trim();

  // ── Validate the response starts where expected ───────────────────────────
  if (!updatedBlock.startsWith("export const resumeData")) {
    console.error(
      "❌  Unexpected response format from Claude. Got:\n",
      updatedBlock.slice(0, 300)
    );
    process.exit(1);
  }

  // ── Reconstruct the full file: keep everything before the const, replace after ──
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
  console.log(`✅  src/data/resume.ts updated successfully.`);
  console.log(`    → lastUpdated set to ${new Date().toISOString().split("T")[0]}`);
  console.log(`\n    Commit the change and deploy to publish the updated resume.`);
}

main().catch((err) => {
  console.error("❌  Unexpected error:", err);
  process.exit(1);
});

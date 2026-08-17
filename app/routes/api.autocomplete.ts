import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { skills, stackData, profile, contactLinks, slugify } from "~/lib/tirsoData";

interface ProjectModule {
  frontmatter: {
    title: string;
    description: string;
    tags?: string[];
    githubUrl?: string;
  };
}

function getProjectsList() {
  const modules = import.meta.glob<ProjectModule>("../../content/projects/*.mdx", { eager: true });
  return Object.entries(modules).map(([path, mod]) => {
    const slug = path.split("/").pop()!.replace(".mdx", "");
    return { slug, ...mod.frontmatter };
  });
}

const SYSTEM_PROMPT = `
You are the AI autocomplete engine for Tirso Navarro's portfolio terminal (visitor@tirso:~$ ).
Your job is to take whatever the user has typed and output the single best CLI command line that either completes their typing or translates their intent.

Available Commands:
- tirso --help
- tirso whoami
- tirso contact
- tirso contact <github|linkedin|schedule> [--open]
- tirso git-contributions [username]
- tirso git-stats [username]
- tirso stack
- tirso skills
- tirso skill <slug> [--open]
- tirso projects
- tirso project <slug> [--open]
- clear

Portfolio Data:
- Bio: ${profile.bio}
- Location: ${profile.location} (${profile.timezone})
- Skills: ${skills.map((s) => `${slugify(s.title)} (${s.subtitle})`).join("; ")}
- Tech Stack: ${stackData.map((s) => `${s.category}: ${s.items.join(", ")}`).join("; ")}
- Contacts: github (github.com/tn-py), linkedin (linkedin.com/in/tirso-navarro), schedule (cal.com/tirso-navarro/15min-meeting)

CRITICAL OUTPUT RULES:
1. Return ONLY the single line CLI command.
2. Do NOT output markdown code fences, backticks, quotes, or explanatory text.
3. If the user's input starts a command (e.g. "tirso pr"), finish it logically (e.g. "tirso projects" or "tirso project <slug>").
4. If the user typed natural language (e.g. "how do i email you", "show me shopify"), map it to the right command (e.g. "tirso contact", "tirso project shopify-loyalty-rewards --open").
5. The output MUST start with "tirso " or "clear".
`;

async function completeWithGroq(apiKey: string, query: string): Promise<string | null> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      temperature: 0.1,
      max_tokens: 35,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: query },
      ],
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const suggestion = data.choices?.[0]?.message?.content?.trim();
  return cleanOutput(suggestion);
}

async function completeWithGemini(apiKey: string, query: string): Promise<string | null> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: query }],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 35,
      },
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const suggestion = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  return cleanOutput(suggestion);
}

function cleanOutput(raw?: string): string | null {
  if (!raw) return null;
  let cleaned = raw
    .replace(/^```[a-z]*\s*/i, "")
    .replace(/```$/i, "")
    .replace(/^["'`]|["'`]$/g, "")
    .trim()
    .split("\n")[0];

  if (!cleaned.startsWith("tirso ") && cleaned !== "clear" && !cleaned.startsWith("tirso")) {
    cleaned = `tirso ${cleaned}`.trim();
  }

  return cleaned;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return json({ suggestion: null });
  }

  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GOOGLE_API_KEY;

  let suggestion: string | null = null;

  try {
    if (groqKey) {
      suggestion = await completeWithGroq(groqKey, q);
    } else if (geminiKey) {
      suggestion = await completeWithGemini(geminiKey, q);
    }
  } catch (err) {
    // Gracefully handle network / API errors
    suggestion = null;
  }

  return json(
    { suggestion },
    {
      headers: {
        "cache-control": "public, max-age=60, s-maxage=60",
      },
    }
  );
};

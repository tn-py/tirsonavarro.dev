import { useMemo } from "react";
import { useNavigate } from "@remix-run/react";
import type { ComponentType } from "react";
import FlexCarouselSource from "./FlexCarousel";
import type { ProjectEntry } from "~/lib/tirsoCommands";

// The JS component infers every prop as required; loosen it for TS callers.
const FlexCarousel = FlexCarouselSource as unknown as ComponentType<Record<string, unknown>>;

const CARD_WIDTH = 800;
const CARD_HEIGHT = 600;
const WRAP_COLUMNS = 34;
const MAX_DESCRIPTION_LINES = 4;
const MAX_TAGS = 3;
const ACCENTS = ["#58a6ff", "#7ee787", "#d2a8ff", "#ffa657", "#79c0ff", "#ff7b72"];

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrap(text: string, columns: number): string[] {
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(/\s+/)) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > columns && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  if (lines.length > MAX_DESCRIPTION_LINES) {
    const kept = lines.slice(0, MAX_DESCRIPTION_LINES);
    kept[MAX_DESCRIPTION_LINES - 1] = `${kept[MAX_DESCRIPTION_LINES - 1].replace(/[.,;:]?$/, "")}...`;
    return kept;
  }
  return lines;
}

// Terminal-window styled card, rendered as an SVG data URI so the WebGL carousel can use it as a texture.
function projectCard(project: ProjectEntry, index: number): string {
  const accent = ACCENTS[index % ACCENTS.length];
  const title = wrap(project.title, 22).slice(0, 2);
  const description = wrap(project.description, WRAP_COLUMNS);
  const tags = (project.tags ?? []).slice(0, MAX_TAGS);

  let y = 215;
  const titleSvg = title
    .map((line, i) => `<text x="48" y="${y + i * 56}" font-size="46" font-weight="700" fill="${accent}">${escapeXml(line)}</text>`)
    .join("");
  y += title.length * 56 + 14;
  const descSvg = description
    .map((line, i) => `<text x="48" y="${y + i * 34}" font-size="24" fill="#c9d1d9">${escapeXml(line)}</text>`)
    .join("");

  let tagX = 48;
  const tagSvg = tags
    .map((tag) => {
      const w = tag.length * 13 + 28;
      const out = `<rect x="${tagX}" y="508" width="${w}" height="38" rx="4" fill="none" stroke="${accent}" stroke-opacity="0.6"/><text x="${tagX + 14}" y="533" font-size="19" fill="${accent}">${escapeXml(tag)}</text>`;
      tagX += w + 12;
      return out;
    })
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}" font-family="Consolas, 'Courier New', monospace">
<rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="#0d1117"/>
<rect x="0" y="0" width="${CARD_WIDTH}" height="64" fill="#161b22"/>
<rect x="0" y="64" width="${CARD_WIDTH}" height="1" fill="#30363d"/>
<circle cx="36" cy="32" r="8" fill="#ff7b72"/><circle cx="64" cy="32" r="8" fill="#ffa657"/><circle cx="92" cy="32" r="8" fill="#7ee787"/>
<text x="400" y="39" font-size="19" fill="#8b949e" text-anchor="middle">~/projects/${escapeXml(project.slug)}</text>
<text x="48" y="130" font-size="22" fill="#7ee787">$ <tspan fill="#c9d1d9">tirso project ${escapeXml(project.slug)}</tspan></text>
${titleSvg}${descSvg}${tagSvg}
<rect x="0" y="${CARD_HEIGHT - 4}" width="${CARD_WIDTH}" height="4" fill="${accent}"/>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function ProjectCarousel({ projects }: { projects: ProjectEntry[] }) {
  const navigate = useNavigate();

  const items = useMemo(
    () =>
      projects.map((project, index) => ({
        src: projectCard(project, index),
        alt: `${project.title}: ${project.description}`,
        title: project.title,
        subtitle: project.tags?.slice(0, MAX_TAGS).join(" / "),
      })),
    [projects],
  );

  if (items.length === 0) return null;

  return (
    <div style={{ width: "100%", height: "min(560px, 90vw)", minHeight: 360, position: "relative" }}>
      <FlexCarousel
        items={items}
        preset="liquid"
        intro="rise"
        fit="landscape"
        cardHeight={0.5}
        gap={12}
        squeeze={0.2}
        focusOnClick={false}
        captions
        onSelect={(index: number) => navigate(`/projects/${projects[index].slug}`)}
      />
    </div>
  );
}

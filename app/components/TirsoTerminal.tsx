import { useCallback, useMemo, useRef } from "react";
import { useNavigate } from "@remix-run/react";
import { Terminal, type TerminalHandle } from "@wterm/react";
import "@wterm/react/css";
import { runTirsoCommand, type ProjectEntry } from "~/lib/tirsoCommands";
import { renderContributionGraph, type ContributionsPayload } from "~/lib/gitContributions";
import { renderGitStats, type GitStatsPayload } from "~/lib/gitStats";
import styles from "./TirsoTerminal.module.css";

const PROMPT = "\x1b[1;32mvisitor@tirso\x1b[0m:\x1b[1;34m~\x1b[0m$ ";
const BACKSPACE = "\b \b";

interface ProjectModule {
  frontmatter: {
    title: string;
    description: string;
    tags?: string[];
    githubUrl?: string;
  };
}

export function TirsoTerminal() {
  const navigate = useNavigate();
  const termRef = useRef<TerminalHandle>(null);
  const bufferRef = useRef("");
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(0);
  const draftRef = useRef("");

  const write = useCallback((data: string) => {
    termRef.current?.write(data);
    requestAnimationFrame(() => {
      const el = termRef.current?.instance?.element;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, []);

  const focus = useCallback(() => {
    termRef.current?.focus();
  }, []);

  const projects = useMemo<ProjectEntry[]>(() => {
    const modules = import.meta.glob<ProjectModule>("../../content/projects/*.mdx", { eager: true });
    return Object.entries(modules).map(([path, mod]) => {
      const slug = path.split("/").pop()!.replace(".mdx", "");
      return { slug, ...mod.frontmatter };
    });
  }, []);

  const writeLines = useCallback(
    (lines: string[]) => {
      for (const line of lines) write(`${line}\r\n`);
    },
    [write],
  );

  const handleReady = useCallback(() => {
    writeLines(["tirso shell v1.0 — type `tirso --help` to get started", ""]);
    write(PROMPT);
  }, [writeLines, write]);

  const showContributions = useCallback(
    async (username?: string) => {
      const query = username ? `?user=${encodeURIComponent(username)}` : "";
      try {
        const res = await fetch(`/api/contributions${query}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = (await res.json()) as ContributionsPayload;
        writeLines(renderContributionGraph(payload.days, payload.username));
      } catch (err) {
        writeLines([
          "\x1b[1;31mFailed to load GitHub contributions.\x1b[0m",
          err instanceof Error ? err.message : "Unknown error",
        ]);
      } finally {
        write(PROMPT);
      }
    },
    [writeLines, write],
  );

  const showGitStats = useCallback(
    async (username?: string) => {
      const query = username ? `?user=${encodeURIComponent(username)}` : "";
      try {
        const res = await fetch(`/api/git-stats${query}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = (await res.json()) as GitStatsPayload;
        writeLines(renderGitStats(payload));
      } catch (err) {
        writeLines([
          "\x1b[1;31mFailed to load GitHub stats.\x1b[0m",
          err instanceof Error ? err.message : "Unknown error",
        ]);
      } finally {
        write(PROMPT);
      }
    },
    [writeLines, write],
  );

  const replaceLine = useCallback(
    (newText: string) => {
      write(BACKSPACE.repeat(bufferRef.current.length) + newText);
      bufferRef.current = newText;
    },
    [write],
  );

  const handleData = useCallback(
    (data: string) => {
      if (data === "\x03") {
        bufferRef.current = "";
        historyIndexRef.current = historyRef.current.length;
        draftRef.current = "";
        write("^C\r\n" + PROMPT);
        return;
      }

      if (data === "\r" || data === "\n") {
        const input = bufferRef.current;
        bufferRef.current = "";
        write("\r\n");

        if (input.trim().length > 0) {
          if (historyRef.current[historyRef.current.length - 1] !== input) {
            historyRef.current.push(input);
          }
          historyIndexRef.current = historyRef.current.length;
          draftRef.current = "";

          const result = runTirsoCommand(input, projects);
          if (result.action?.type === "clear") {
            write("\x1b[2J\x1b[H");
          } else if (result.action?.type === "contributions") {
            writeLines(result.lines);
            void showContributions(result.action.username);
            return;
          } else if (result.action?.type === "git-stats") {
            writeLines(result.lines);
            void showGitStats(result.action.username);
            return;
          } else {
            if (result.lines.length) writeLines(result.lines);
            if (result.action?.type === "navigate") {
              const to = result.action.to;
              setTimeout(() => navigate(to), 400);
            } else if (result.action?.type === "open") {
              window.open(result.action.url, "_blank", "noopener,noreferrer");
            }
          }
        }

        write(PROMPT);
        return;
      }

      if (data === "\x7f" || data === "\b") {
        if (bufferRef.current.length > 0) {
          bufferRef.current = bufferRef.current.slice(0, -1);
          write(BACKSPACE);
        }
        return;
      }

      if (data === "\x1b[A" || data === "\x1bOA") {
        // Up arrow: step back through history.
        if (historyRef.current.length === 0) return;
        if (historyIndexRef.current === historyRef.current.length) {
          draftRef.current = bufferRef.current;
        }
        if (historyIndexRef.current > 0) {
          historyIndexRef.current -= 1;
          replaceLine(historyRef.current[historyIndexRef.current]);
        }
        return;
      }

      if (data === "\x1b[B" || data === "\x1bOB") {
        // Down arrow: step forward through history, back to the in-progress draft.
        if (historyIndexRef.current >= historyRef.current.length) return;
        historyIndexRef.current += 1;
        const next =
          historyIndexRef.current === historyRef.current.length
            ? draftRef.current
            : historyRef.current[historyIndexRef.current];
        replaceLine(next);
        return;
      }

      // Ignore other escape sequences (left/right arrows, etc.) and control chars.
      if (data.length > 0 && data.charCodeAt(0) < 0x20) {
        return;
      }

      bufferRef.current += data;
      write(data);
    },
    [projects, navigate, write, writeLines, showContributions, showGitStats, replaceLine],
  );

  return (
    <Terminal
      ref={termRef}
      className={styles.terminal}
      autoResize
      cursorBlink
      onData={handleData}
      onReady={handleReady}
      onClick={focus}
    />
  );
}

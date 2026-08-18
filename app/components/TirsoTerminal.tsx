import { useCallback, useMemo, useRef } from "react";
import { useNavigate } from "@remix-run/react";
import { Terminal, type TerminalHandle } from "@wterm/react";
import "@wterm/react/css";
import { runTirsoCommand, type ProjectEntry } from "~/lib/tirsoCommands";
import { renderContributionGraph, type ContributionsPayload } from "~/lib/gitContributions";
import { renderGitStats, type GitStatsPayload } from "~/lib/gitStats";
import { getLocalSuggestion } from "~/lib/terminalAutocomplete";
import styles from "./TirsoTerminal.module.css";

const PROMPT = "\x1b[1;32mvisitor@tirso\x1b[0m:\x1b[1;34m~\x1b[0m$ ";
const BACKSPACE = "\b \b";

export function TirsoTerminal({ projects }: { projects: ProjectEntry[] }) {
  const navigate = useNavigate();
  const termRef = useRef<TerminalHandle>(null);
  const bufferRef = useRef("");
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(0);
  const draftRef = useRef("");
  const ghostRef = useRef("");
  const aiDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const writeLines = useCallback(
    (lines: string[]) => {
      for (const line of lines) write(`${line}\r\n`);
    },
    [write],
  );

  const handleReady = useCallback(() => {
    writeLines(["tirso shell v1.0 — type `tirso --help` to get started", ""]);
    write(PROMPT);
    
    // Prevent mobile keyboard from popping up on load by explicitly blurring
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }, 50);
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
      write(BACKSPACE.repeat(bufferRef.current.length) + "\x1b[K" + newText);
      bufferRef.current = newText;
      ghostRef.current = "";
    },
    [write],
  );

  const renderLine = useCallback(
    (currentBuffer: string, suggestion: string | null) => {
      let out = "\x1b[K"; // clear from cursor to right

      if (
        suggestion &&
        currentBuffer.length > 0 &&
        suggestion.toLowerCase().startsWith(currentBuffer.toLowerCase())
      ) {
        const ghostPart = suggestion.slice(currentBuffer.length);
        if (ghostPart.length > 0) {
          ghostRef.current = suggestion;
          // output ghost text and shift cursor back
          out += `\x1b[90m${ghostPart}\x1b[0m\x1b[${ghostPart.length}D`;
        } else {
          ghostRef.current = "";
        }
      } else {
        ghostRef.current = "";
      }
      write(out);
    },
    [write]
  );

  const triggerAutocomplete = useCallback(
    (currentInput: string) => {
      if (aiDebounceRef.current) clearTimeout(aiDebounceRef.current);

      if (currentInput.trim().length === 0) {
        renderLine(currentInput, null);
        return;
      }

      // 1. Try instant local suggestion (history + keywords + prefix)
      const local = getLocalSuggestion(currentInput, {
        history: historyRef.current,
        projects,
      });

      if (local) {
        renderLine(currentInput, local);
        return;
      }

      // 2. Clear current ghost if no local match
      renderLine(currentInput, null);

      // 3. Debounce API request for generative AI fallback
      aiDebounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(currentInput)}`);
          if (!res.ok) return;
          const data = await res.json();
          // Verify buffer hasn't changed while fetching
          if (bufferRef.current === currentInput && data.suggestion) {
            renderLine(currentInput, data.suggestion);
          }
        } catch (e) {
          // Fail silently on network errors for ghost text
        }
      }, 250);
    },
    [projects, renderLine]
  );

  const handleData = useCallback(
    (data: string) => {
      if (data === "\x03") {
        bufferRef.current = "";
        historyIndexRef.current = historyRef.current.length;
        draftRef.current = "";
        ghostRef.current = "";
        write("\x1b[K^C\r\n" + PROMPT);
        return;
      }

      // TAB or RIGHT ARROW: Accept Ghost Text
      if (data === "\t" || data === "\x1b[C" || data === "\x1bOC") {
        if (ghostRef.current && ghostRef.current.length > bufferRef.current.length) {
          const completion = ghostRef.current.slice(bufferRef.current.length);
          bufferRef.current = ghostRef.current;
          ghostRef.current = "";
          write("\x1b[K" + completion);
          triggerAutocomplete(bufferRef.current);
        }
        return;
      }

      // ENTER
      if (data === "\r" || data === "\n") {
        const input = bufferRef.current;
        bufferRef.current = "";
        ghostRef.current = "";
        write("\x1b[K\r\n");

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

      // BACKSPACE
      if (data === "\x7f" || data === "\b") {
        if (bufferRef.current.length > 0) {
          bufferRef.current = bufferRef.current.slice(0, -1);
          write(BACKSPACE);
          triggerAutocomplete(bufferRef.current);
        }
        return;
      }

      // UP ARROW: history back
      if (data === "\x1b[A" || data === "\x1bOA") {
        if (historyRef.current.length === 0) return;
        if (historyIndexRef.current === historyRef.current.length) {
          draftRef.current = bufferRef.current;
        }
        if (historyIndexRef.current > 0) {
          historyIndexRef.current -= 1;
          replaceLine(historyRef.current[historyIndexRef.current]);
          triggerAutocomplete(bufferRef.current);
        }
        return;
      }

      // DOWN ARROW: history forward
      if (data === "\x1b[B" || data === "\x1bOB") {
        if (historyIndexRef.current >= historyRef.current.length) return;
        historyIndexRef.current += 1;
        const next =
          historyIndexRef.current === historyRef.current.length
            ? draftRef.current
            : historyRef.current[historyIndexRef.current];
        replaceLine(next);
        triggerAutocomplete(bufferRef.current);
        return;
      }

      // Ignore other escape sequences (left arrows, etc.) and control chars.
      if (data.length > 0 && data.charCodeAt(0) < 0x20) {
        return;
      }

      bufferRef.current += data;
      write(data);
      triggerAutocomplete(bufferRef.current);
    },
    [projects, navigate, write, writeLines, showContributions, showGitStats, replaceLine, triggerAutocomplete],
  );

  const triggerCommand = useCallback((cmd: string) => {
    bufferRef.current = cmd;
    handleData("\r");
  }, [handleData]);

  const pillStyle: React.CSSProperties = {
    background: "rgba(88, 166, 255, 0.1)",
    border: "1px solid rgba(88, 166, 255, 0.3)",
    color: "#58a6ff",
    borderRadius: "999px",
    padding: "4px 12px",
    fontSize: "0.85rem",
    cursor: "pointer",
    fontFamily: "var(--font-mono, monospace)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button onClick={() => triggerCommand("tirso --help")} style={pillStyle}>--help</button>
        <button onClick={() => triggerCommand("tirso projects")} style={pillStyle}>projects</button>
        <button onClick={() => triggerCommand("tirso stack")} style={pillStyle}>stack</button>
        <button onClick={() => triggerCommand("tirso whoami")} style={pillStyle}>whoami</button>
      </div>
      <div aria-live="polite" style={{ position: "relative" }}>
        <span style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: 0 }}>
          Interactive terminal. Type 'tirso --help' to get started. Use up and down arrow keys for history.
        </span>
        <Terminal
          ref={termRef}
          className={styles.terminal}
          autoResize
          cursorBlink
          onData={handleData}
          onReady={handleReady}
          onClick={focus}
        />
      </div>
    </div>
  );
}

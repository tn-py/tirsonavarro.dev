import { useCallback, useMemo, useRef } from "react";
import { useNavigate } from "@remix-run/react";
import { Terminal, type TerminalHandle } from "@wterm/react";
import "@wterm/react/css";
import { runTirsoCommand, type ProjectEntry } from "~/lib/tirsoCommands";
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

  const write = useCallback((data: string) => {
    termRef.current?.write(data);
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

  const handleData = useCallback(
    (data: string) => {
      if (data === "\x03") {
        bufferRef.current = "";
        write("^C\r\n" + PROMPT);
        return;
      }

      if (data === "\r" || data === "\n") {
        const input = bufferRef.current;
        bufferRef.current = "";
        write("\r\n");

        if (input.trim().length > 0) {
          const result = runTirsoCommand(input, projects);
          if (result.action?.type === "clear") {
            write("\x1b[2J\x1b[H");
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

      // Ignore escape sequences (arrow keys, etc.) and other control chars.
      if (data.length > 0 && data.charCodeAt(0) < 0x20) {
        return;
      }

      bufferRef.current += data;
      write(data);
    },
    [projects, navigate, write, writeLines],
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.dot} />
        <span>TIRSO_SHELL // INTERACTIVE</span>
      </div>
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
  );
}

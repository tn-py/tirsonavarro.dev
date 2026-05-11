import React from "react";
import { Command } from "cmdk";
import { useNavigate } from "@remix-run/react";
import styles from "./CommandPalette.module.css";

interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const navigate = useNavigate();

  const runCommand = (command: () => void) => {
    command();
    setOpen(false);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Menu"
      className={styles.dialog}
    >
      <div className={styles.overlay} onClick={() => setOpen(false)} />
      <div className={styles.content}>
        <Command.Input
          placeholder="Type a command or search..."
          className={styles.input}
        />
        <Command.List className={styles.list}>
          <Command.Empty className={styles.empty}>No results found.</Command.Empty>

          <Command.Group heading="Navigation" className={styles.group}>
            <Command.Item
              onSelect={() => runCommand(() => navigate("/"))}
              className={styles.item}
            >
              <span>Home</span>
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => navigate("/projects"))}
              className={styles.item}
            >
              <span>Projects</span>
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => navigate("/research"))}
              className={styles.item}
            >
              <span>Research</span>
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => navigate("/stack"))}
              className={styles.item}
            >
              <span>Stack</span>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  );
}

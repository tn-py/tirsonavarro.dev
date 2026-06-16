import { useState, useEffect } from "react";
import { NavLink } from "@remix-run/react";
import styles from "./Navbar.module.css";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: "/", label: "Home", cmd: "HOME" },
    { to: "/projects", label: "Projects", cmd: "LIST PROJECTS" },
    { to: "/stack", label: "Stack", cmd: "VIEW STACK" },
    { to: "/skills", label: "Skills", cmd: "LOAD SKILLS" },
  ];

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <NavLink to="/" className={styles.link} onClick={() => setIsOpen(false)}>
            AGENTIC
          </NavLink>
        </div>
        
        <div className={styles.links}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <button 
          className={styles.menuToggle} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close Menu" : "Open Menu"}
        >
          {isOpen ? "[ X ]" : "[ CMD ]"}
        </button>
      </nav>

      {isOpen && (
        <div className={styles.terminalOverlay}>
          <div className={styles.overlayContent}>
            <div className={styles.terminalHeader}>
              <span className={styles.terminalPrompt}>admin@agentic:~$</span>
              <span className={styles.terminalCursor}>_</span>
            </div>
            <div className={styles.overlayLinks}>
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={styles.overlayLink}
                  onClick={() => setIsOpen(false)}
                >
                  <span className={styles.cmdPrefix}>{"> RUN "}</span>
                  {link.cmd}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

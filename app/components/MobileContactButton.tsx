import { useEffect, useState } from "react";
import styles from "./MobileContactButton.module.css";

// Small-screen shortcut to the contact form.
export function MobileContactButton() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // Only show once the hero CTA has scrolled away, and hide again at the form.
    const targets = ["hero-cta", "contact"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (targets.length === 0 || !("IntersectionObserver" in window)) {
      setHidden(false);
      return;
    }
    const onScreen = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onScreen.add(entry.target);
          else onScreen.delete(entry.target);
        }
        setHidden(onScreen.size > 0);
      },
      { threshold: 0.05 },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <a href="#contact" className={styles.button} data-hidden={hidden || undefined} aria-hidden={hidden || undefined} tabIndex={hidden ? -1 : undefined}>
      Ask me a question
    </a>
  );
}

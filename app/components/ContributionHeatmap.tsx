import { useEffect, useRef, useState } from "react";
import {
  buildContributionCalendar,
  GITHUB_USERNAME,
  type ContributionsPayload,
} from "~/lib/gitContributions";
import styles from "./ContributionHeatmap.module.css";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Skeleton = "dither" · Reveal = "blueprint" — ported from the ascii-reveal vocabulary
 * without pulling in the dependency (kept bespoke so it stays theme-integrated + 0 deps).
 * - Dither skeleton: a block of the box-glyph ramp ( ░▒▓█ ) faint under a sweeping shimmer band,
 *   mirroring SKELETON_VARIANTS.dither (base ░░░░▒, wave ▒▓▓█▓▒, ~55% band).
 * - Blueprint reveal: accent-blue · - + = x # scramble that dissolves onto each tile's level
 *   color, inside a dot-field sheet framed by rounded corner brackets (the preset's "surface").
 */
const DITHER_RAMP = "░▒▓█";
const BP_GLYPHS = ["·", "-", "+", "=", "x", "#"]; // blueprint ramp, scrambled (mode: "random")

/** Deterministic faint block of box glyphs. Bias toward the lighter end, like the dither base. */
function ditherField(rows: number, cols: number, seed = 7): string {
  const out: string[] = [];
  for (let r = 0; r < rows; r++) {
    let line = "";
    for (let i = 0; i < cols; i++) {
      const h = ((i * 37 + r * 91 + seed * 13 + r * i * 7) % 100) / 100;
      line += DITHER_RAMP[Math.floor(Math.pow(h, 0.9) * DITHER_RAMP.length)];
    }
    out.push(line);
  }
  return out.join("\n");
}

export function ContributionHeatmap() {
  const [payload, setPayload] = useState<ContributionsPayload | null>(null);
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadContributions() {
      try {
        const response = await fetch("/api/contributions", { signal: controller.signal });
        if (!response.ok) throw new Error("Failed to load contributions");
        const data = (await response.json()) as ContributionsPayload;
        if (!Array.isArray(data.days) || data.days.length === 0) {
          throw new Error("No contribution data available");
        }
        setPayload(data);
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    }

    void loadContributions();
    return () => controller.abort();
  }, []);

  const { weeks, total } = buildContributionCalendar(payload?.days ?? []);

  useEffect(() => {
    if (weeks.length && scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [weeks.length]);

  useEffect(() => {
    const scrollArea = scrollRef.current;
    if (!payload || !scrollArea) return;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });
    observer.observe(scrollArea);
    return () => observer.disconnect();
  }, [payload]);

  let previousMonth = -1;
  const monthLabels = weeks.map((week) => {
    const date = week.find((day) => day)?.date;
    if (!date) return "";
    const month = Number(date.slice(5, 7)) - 1;
    if (month === previousMonth) return "";
    previousMonth = month;
    return MONTHS[month];
  });

  return (
    <section className={styles.container} aria-label="GitHub contribution activity">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>GITHUB // CONTRIBUTIONS</p>
          <h2 className={styles.title}>Contribution activity</h2>
        </div>
        <a className={styles.profileLink} href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer">
          @{GITHUB_USERNAME} ↗
        </a>
      </div>

      {error ? (
        <p className={styles.status}>Contribution data is unavailable right now. View the graph on GitHub instead.</p>
      ) : !payload ? (
        <div className={styles.skeletonWrap} role="status" aria-live="polite" aria-label="Loading GitHub contributions">
          <pre className={styles.skeleton} aria-hidden="true">{ditherField(7, 52)}</pre>
          <span className={styles.srOnly}>Loading GitHub contributions…</span>
        </div>
      ) : (
        <>
          <p className={styles.summary}>
            <strong>{total.toLocaleString()}</strong> contributions in the last year
          </p>
          <div className={styles.scrollArea} ref={scrollRef}>
            <div className={styles.blueprintSheet}>
              <span className={`${styles.corner} ${styles.cornerTL}`} aria-hidden="true" />
              <span className={`${styles.corner} ${styles.cornerTR}`} aria-hidden="true" />
              <span className={`${styles.corner} ${styles.cornerBL}`} aria-hidden="true" />
              <span className={`${styles.corner} ${styles.cornerBR}`} aria-hidden="true" />
              <div className={styles.calendar} role="img" aria-label={`${total.toLocaleString()} GitHub contributions in the last year, shown by day`}>
                <div className={styles.weekdays} aria-hidden="true">
                  {["", "Mon", "", "Wed", "", "Fri", ""].map((label, index) => <span key={index}>{label}</span>)}
                </div>
                <div className={styles.graph}>
                  <div className={styles.months} aria-hidden="true">
                    {monthLabels.map((label, index) => <span key={index}>{label}</span>)}
                  </div>
                  <div className={`${styles.weeks} ${isVisible ? styles.revealing : ""}`}>
                    {weeks.map((week, weekIndex) => (
                      <div className={styles.week} key={weekIndex}>
                        {week.map((day, weekday) => (
                          <span
                            key={weekday}
                            className={`${styles.day} ${day ? `${styles.revealDay} ${styles[`level${Math.min(4, Math.max(0, day.level))}`]}` : styles.outside}`}
                            data-glyph={day ? BP_GLYPHS[(weekIndex * 3 + weekday * 5) % BP_GLYPHS.length] : undefined}
                            style={day ? { "--reveal-delay": `${(weeks.length - 1 - weekIndex) * 16 + weekday * 22}ms` } as React.CSSProperties : undefined}
                            title={day ? `${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}` : undefined}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.footer}>
            <span>Last 12 months</span>
            <div className={styles.legend} aria-label="Color scale from fewer to more contributions">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((level) => <span key={level} className={`${styles.day} ${styles[`level${level}`]}`} />)}
              <span>More</span>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

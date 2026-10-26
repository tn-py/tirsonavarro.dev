import { useEffect, useRef, useState } from "react";
import {
  buildContributionCalendar,
  GITHUB_USERNAME,
  type ContributionsPayload,
} from "~/lib/gitContributions";
import styles from "./ContributionHeatmap.module.css";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const REVEAL_GLYPHS = ["0", "1", "+", "*", "#"];

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
        <p className={styles.status} role="status">Loading GitHub contributions...</p>
      ) : (
        <>
          <p className={styles.summary}>
            <strong>{total.toLocaleString()}</strong> contributions in the last year
          </p>
          <div className={styles.scrollArea} ref={scrollRef}>
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
                          data-glyph={day ? REVEAL_GLYPHS[(weekIndex + weekday) % REVEAL_GLYPHS.length] : undefined}
                          style={day ? { "--reveal-delay": `${(weeks.length - 1 - weekIndex) * 18 + weekday * 24}ms` } as React.CSSProperties : undefined}
                          title={day ? `${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}` : undefined}
                        />
                      ))}
                    </div>
                  ))}
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

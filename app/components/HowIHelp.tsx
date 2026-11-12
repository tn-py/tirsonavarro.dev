import { Link } from "@remix-run/react";
import styles from "./HowIHelp.module.css";

type Proof = { slug: string; label: string };
type HelpItem = { problem: string; detail: string; proof: Proof[] };

// Written in a store owner's words; each item links to real work that backs it up.
const ITEMS: HelpItem[] = [
  {
    problem: "“My catalog is too big to manage by hand.”",
    detail:
      "Thousands of SKUs, messy variants, supplier data that never lines up. I clean it up, structure it, and keep it in sync automatically.",
    proof: [
      { slug: "uhs-mobile-ecosystem", label: "UHS catalog ops" },
      { slug: "scrape-scripts", label: "Scrape-Scripts" },
    ],
  },
  {
    problem: "“We spend hours copy-pasting between systems.”",
    detail:
      "Shopify, spreadsheets, ERPs, inboxes. I connect them with scripts and agent workflows so the busywork runs itself, with a human check where it matters.",
    proof: [{ slug: "google-apps-scripts", label: "Shopify + Sheets automations" }],
  },
  {
    problem: "“Customers can't find the right product.”",
    detail:
      "Fitment lookups, guided product pickers, better search. Tools that help shoppers land on the right part instead of emailing you to ask.",
    proof: [
      { slug: "selector-sage", label: "Selector Sage" },
      { slug: "search-by-vin", label: "Search by VIN" },
    ],
  },
  {
    problem: "“I want customers to come back.”",
    detail:
      "Native mobile storefronts, loyalty programs and notifications that don't add another monthly app bill.",
    proof: [
      { slug: "expo-shopify-storefront", label: "Expo Shopify Storefront" },
      { slug: "shopify-loyalty-rewards", label: "Loyalty Rewards" },
    ],
  },
];

export function HowIHelp() {
  return (
    <section className={styles.section} aria-labelledby="how-i-help-heading">
      <p className={styles.kicker}>// HOW I CAN HELP</p>
      <h2 id="how-i-help-heading" className={styles.heading}>
        Sound familiar?
      </h2>
      <ul className={styles.list}>
        {ITEMS.map((item) => (
          <li key={item.problem} className={styles.item}>
            <h3 className={styles.problem}>{item.problem}</h3>
            <p className={styles.detail}>{item.detail}</p>
            <p className={styles.proof}>
              <span className={styles.proofLabel}>see:</span>{" "}
              {item.proof.map((p, i) => (
                <span key={p.slug}>
                  {i > 0 && <span aria-hidden="true"> · </span>}
                  <Link to={`/projects/${p.slug}`} className={styles.proofLink}>
                    {p.label}
                  </Link>
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
      <p className={styles.closer}>
        Not sure if I can help? <a href="#contact">Ask me.</a> I&apos;ll tell you straight, even if the answer is
        &ldquo;you don&apos;t need me.&rdquo;
      </p>
    </section>
  );
}

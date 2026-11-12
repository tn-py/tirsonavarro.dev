import styles from "./HowIHelp.module.css";

type HelpItem = { problem: string; detail: string };

// Written in a store owner's words.
const ITEMS: HelpItem[] = [
  {
    problem: "“My catalog is too big to manage by hand.”",
    detail:
      "Thousands of SKUs, messy variants, supplier data that never lines up. I clean it up, structure it, and keep it in sync automatically.",
  },
  {
    problem: "“We spend hours copy-pasting between systems.”",
    detail:
      "Shopify, spreadsheets, ERPs, inboxes. I connect them with scripts and agent workflows so the busywork runs itself, with a human check where it matters.",
  },
  {
    problem: "“Customers can't find the right product.”",
    detail:
      "Fitment lookups, guided product pickers, better search. Tools that help shoppers land on the right part instead of emailing you to ask.",
  },
  {
    problem: "“I want customers to come back.”",
    detail:
      "Native mobile storefronts, loyalty programs and notifications that don't add another monthly app bill.",
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

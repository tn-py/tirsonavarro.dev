import { useEffect, useRef, useState } from "react";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { CONTACT_LIMITS, type ContactResult } from "~/lib/contact";
import styles from "./ContactSection.module.css";

export const CAL_URL = "https://cal.com/tirso-navarro/15min-meeting";
const LINKEDIN_URL = "https://www.linkedin.com/in/tirso-navarro";

export function ContactSection({ publicEmail }: { publicEmail?: string }) {
  const result = useActionData<ContactResult>();
  const navigation = useNavigation();
  const sending = navigation.state === "submitting";
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const [startedAt, setStartedAt] = useState("");

  // Set on the client so the bot-timing check measures real fill time.
  useEffect(() => setStartedAt(String(Date.now())), [result]);

  useEffect(() => {
    if (!result) return;
    if (result.ok) formRef.current?.reset();
    statusRef.current?.focus();
  }, [result]);

  const errors = result && !result.ok ? result.errors : {};
  const values = result && !result.ok ? result.values ?? {} : {};

  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-heading">
      <div className={styles.intro}>
        <p className={styles.kicker}>// SAY HI</p>
        <h2 id="contact-heading" className={styles.heading}>
          Got a question? Just ask.
        </h2>
        <p className={styles.lede}>
          No pitch deck, no pressure. Tell me what&apos;s going on with your store and I&apos;ll reply personally,
          usually within a day.
        </p>
        <ul className={styles.alternatives}>
          <li>
            <span className={styles.altLabel}>rather talk?</span>{" "}
            <a href={CAL_URL} target="_blank" rel="noopener noreferrer">
              Grab 15 minutes
            </a>
          </li>
          {publicEmail && (
            <li>
              <span className={styles.altLabel}>email:</span> <a href={`mailto:${publicEmail}`}>{publicEmail}</a>
            </li>
          )}
          <li>
            <span className={styles.altLabel}>or:</span>{" "}
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              message me on LinkedIn
            </a>
          </li>
        </ul>
      </div>

      {result?.ok ? (
        <div className={styles.success} role="status">
          <p ref={statusRef} tabIndex={-1} className={styles.successTitle}>
            $ message sent ✓
          </p>
          <p>Thanks. I&apos;ll get back to you soon. If it&apos;s urgent, grab a time on my calendar.</p>
        </div>
      ) : (
        <Form ref={formRef} method="post" action="/?index" preventScrollReset className={styles.form} noValidate>
          <input type="hidden" name="started_at" value={startedAt} />
          <div className={styles.honeypot} aria-hidden="true">
            <label>
              Leave this empty
              <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <Field label="Name" name="name" error={errors.name}>
            <input
              id="contact-name"
              name="name"
              autoComplete="name"
              required
              maxLength={CONTACT_LIMITS.name}
              defaultValue={values.name}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
            />
          </Field>
          <Field label="Email" name="email" error={errors.email}>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={CONTACT_LIMITS.email}
              defaultValue={values.email}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
            />
          </Field>
          <Field label="What's going on with your store?" name="message" error={errors.message}>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              required
              maxLength={CONTACT_LIMITS.message}
              placeholder="e.g. We have 8,000 SKUs and updating prices takes a full day."
              defaultValue={values.message}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "contact-message-error" : undefined}
            />
          </Field>

          {errors.form && (
            <p ref={statusRef} tabIndex={-1} className={styles.formError} role="alert">
              {errors.form}
            </p>
          )}

          <button type="submit" className={styles.submit} disabled={sending}>
            {sending ? "Sending…" : "Send message →"}
          </button>
        </Form>
      )}
    </section>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={`contact-${name}`}>{label}</label>
      {children}
      {error && (
        <p id={`contact-${name}-error`} className={styles.fieldError}>
          {error}
        </p>
      )}
    </div>
  );
}

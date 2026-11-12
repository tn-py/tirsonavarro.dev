// Contact form validation and delivery (server-only usage; pure helpers are unit tested).

export const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  message: 4000,
  minMessage: 10,
  // Humans take a few seconds to fill the form; instant submissions are almost always bots.
  minFillMs: 2500,
} as const;

export type ContactFields = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactFields | "form", string>>;

export type ContactResult =
  | { ok: true }
  | { ok: false; errors: ContactErrors; values?: Partial<ContactFields> };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function field(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/** True when the submission looks automated (honeypot filled or submitted too fast). */
export function isLikelyBot(form: FormData, now: number = Date.now()): boolean {
  if (field(form, "company_website")) return true;
  const started = Number(field(form, "started_at"));
  if (!Number.isFinite(started) || started <= 0) return false;
  return now - started < CONTACT_LIMITS.minFillMs;
}

export function validateContact(
  form: FormData,
): { ok: true; fields: ContactFields } | { ok: false; errors: ContactErrors; values: ContactFields } {
  const values = { name: field(form, "name"), email: field(form, "email"), message: field(form, "message") };
  const errors: ContactErrors = {};

  if (!values.name) errors.name = "Tell me what to call you.";
  else if (values.name.length > CONTACT_LIMITS.name) errors.name = "That name is a bit long.";

  if (!values.email) errors.email = "I need an email to reply to.";
  else if (values.email.length > CONTACT_LIMITS.email || !EMAIL.test(values.email))
    errors.email = "That email doesn't look right.";

  if (!values.message) errors.message = "What's going on with your store?";
  else if (values.message.length < CONTACT_LIMITS.minMessage) errors.message = "A little more detail helps.";
  else if (values.message.length > CONTACT_LIMITS.message)
    errors.message = `Keep it under ${CONTACT_LIMITS.message} characters.`;

  return Object.keys(errors).length ? { ok: false, errors, values } : { ok: true, fields: values };
}

export type ContactConfig = { apiKey?: string; to?: string; from: string };

export function contactConfig(env: Record<string, string | undefined> = process.env): ContactConfig {
  return {
    apiKey: env.RESEND_API_KEY || undefined,
    to: env.CONTACT_TO_EMAIL || undefined,
    from: env.CONTACT_FROM_EMAIL || "tirsonavarro.dev <contact@tirsonavarro.dev>",
  };
}

export function isContactConfigured(config: ContactConfig): boolean {
  return Boolean(config.apiKey && config.to);
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function buildEmail(fields: ContactFields, config: ContactConfig) {
  const subject = `Site inquiry from ${fields.name}`.replace(/[\r\n]+/g, " ").slice(0, 150);
  const text = `From: ${fields.name} <${fields.email}>\n\n${fields.message}\n\n— sent from tirsonavarro.dev`;
  const html = `<p><strong>From:</strong> ${escapeHtml(fields.name)} &lt;${escapeHtml(fields.email)}&gt;</p><p style="white-space:pre-wrap">${escapeHtml(fields.message)}</p><p style="color:#888">— sent from tirsonavarro.dev</p>`;
  return { from: config.from, to: [config.to!], reply_to: fields.email, subject, text, html };
}

export async function sendContact(
  fields: ContactFields,
  config: ContactConfig,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  if (!isContactConfigured(config)) return false;
  try {
    const res = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(buildEmail(fields, config)),
    });
    if (!res.ok) console.error("contact: resend responded", res.status, await res.text().catch(() => ""));
    return res.ok;
  } catch (error) {
    console.error("contact: resend request failed", error);
    return false;
  }
}

export async function handleContact(
  form: FormData,
  config: ContactConfig,
  fetchImpl: typeof fetch = fetch,
  now: number = Date.now(),
): Promise<ContactResult> {
  // Pretend success so bots get no signal, but never send.
  if (isLikelyBot(form, now)) return { ok: true };
  const checked = validateContact(form);
  if (!checked.ok) return { ok: false, errors: checked.errors, values: checked.values };
  if (!isContactConfigured(config)) {
    return {
      ok: false,
      values: checked.fields,
      errors: { form: "The form isn't connected yet. Please book a call or message me on LinkedIn instead." },
    };
  }
  const sent = await sendContact(checked.fields, config, fetchImpl);
  return sent
    ? { ok: true }
    : {
        ok: false,
        values: checked.fields,
        errors: { form: "That didn't go through on my end. Try again, or book a call instead." },
      };
}

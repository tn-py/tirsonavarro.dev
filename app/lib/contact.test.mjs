import assert from "node:assert/strict";
import test from "node:test";
import { buildEmail, contactConfig, handleContact, isLikelyBot, validateContact } from "./contact.ts";

const NOW = 1_000_000;
const CONFIG = { apiKey: "re_test", to: "me@example.com", from: "Site <contact@example.com>" };

function form(fields = {}) {
  const data = new FormData();
  const all = {
    name: "Ana Ruiz",
    email: "ana@shop.example",
    message: "We have 8,000 SKUs and pricing updates take a day.",
    started_at: String(NOW - 10_000),
    ...fields,
  };
  for (const [k, v] of Object.entries(all)) data.set(k, v);
  return data;
}

function fakeFetch(ok = true) {
  const calls = [];
  const impl = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    return new Response(ok ? '{"id":"1"}' : "nope", { status: ok ? 200 : 500 });
  };
  return { impl, calls };
}

test("valid submission is sent to Resend with reply_to set to the visitor", async () => {
  const { impl, calls } = fakeFetch();
  const result = await handleContact(form(), CONFIG, impl, NOW);
  assert.deepEqual(result, { ok: true });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.resend.com/emails");
  assert.equal(calls[0].init.headers.Authorization, "Bearer re_test");
  assert.deepEqual(calls[0].body.to, ["me@example.com"]);
  assert.equal(calls[0].body.reply_to, "ana@shop.example");
  assert.match(calls[0].body.subject, /Ana Ruiz/);
});

test("validation errors are returned with the submitted values and nothing is sent", async () => {
  const { impl, calls } = fakeFetch();
  const result = await handleContact(form({ email: "not-an-email", message: "hi" }), CONFIG, impl, NOW);
  assert.equal(result.ok, false);
  assert.ok(result.errors.email);
  assert.ok(result.errors.message);
  assert.equal(result.errors.name, undefined);
  assert.equal(result.values.email, "not-an-email");
  assert.equal(calls.length, 0);
});

test("missing fields are reported", () => {
  const result = validateContact(form({ name: " ", email: "", message: "" }));
  assert.equal(result.ok, false);
  assert.deepEqual(Object.keys(result.errors).sort(), ["email", "message", "name"]);
});

test("honeypot and too-fast submissions look like success but never send", async () => {
  for (const data of [form({ company_website: "spam.example" }), form({ started_at: String(NOW - 500) })]) {
    const { impl, calls } = fakeFetch();
    assert.equal(isLikelyBot(data, NOW), true);
    assert.deepEqual(await handleContact(data, CONFIG, impl, NOW), { ok: true });
    assert.equal(calls.length, 0);
  }
});

test("unconfigured form returns a form-level error instead of pretending to send", async () => {
  const { impl, calls } = fakeFetch();
  const result = await handleContact(form(), { ...CONFIG, apiKey: undefined }, impl, NOW);
  assert.equal(result.ok, false);
  assert.match(result.errors.form, /isn't connected/);
  assert.equal(calls.length, 0);
});

test("provider failure surfaces a retryable error and keeps the values", async () => {
  const { impl } = fakeFetch(false);
  const original = console.error;
  console.error = () => {};
  try {
    const result = await handleContact(form(), CONFIG, impl, NOW);
    assert.equal(result.ok, false);
    assert.match(result.errors.form, /didn't go through/);
    assert.equal(result.values.name, "Ana Ruiz");
  } finally {
    console.error = original;
  }
});

test("email body escapes HTML and strips newlines from the subject", () => {
  const email = buildEmail({ name: "Eve\r\nBcc: x@y.z", email: "e@x.io", message: "<script>alert(1)</script>" }, CONFIG);
  assert.doesNotMatch(email.subject, /[\r\n]/);
  assert.doesNotMatch(email.html, /<script>/);
  assert.match(email.text, /<script>/); // plain text is shown verbatim, not rendered
});

test("config reads env vars and defaults the sender", () => {
  const config = contactConfig({ RESEND_API_KEY: "k", CONTACT_TO_EMAIL: "t@x.io" });
  assert.equal(config.apiKey, "k");
  assert.equal(config.to, "t@x.io");
  assert.match(config.from, /tirsonavarro\.dev/);
});

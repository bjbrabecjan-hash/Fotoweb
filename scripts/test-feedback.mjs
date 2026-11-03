// Exercise the actual route with a mocked mail provider; never sends real mail.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";
const require = createRequire(import.meta.url);
function load(file, replacements = {}) {
  const code = ts.transpileModule(readFileSync(new URL(file, import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function("require", "module", "exports", code)(name => replacements[name] || require(name), module, module.exports);
  return module.exports;
}
const feedback = load("../lib/feedback.ts");
const { POST } = load("../app/api/feedback/route.ts", { "@/lib/feedback": feedback });
const { NextRequest } = require("next/server");
const base = "http://localhost:3000";
const input = { name: "Testovací klient", session: "Rodinné focení", photoConsent: "no", review: "Děkuji za focení.", reviewConsent: "yes", submissionId: "12345678-1234-4123-8123-123456789abc", submittedAt: "2026-11-03T10:00:00.000Z", website: "" };
function call(value, origin = base, contentType = "application/json") {
  const req = new NextRequest(`${base}/api/feedback`, { method: "POST", headers: { origin, "content-type": contentType }, body: typeof value === "string" ? value : JSON.stringify(value) });
  return POST(req);
}
assert.equal((await call(input, "https://foreign.example")).status, 403);
assert.equal((await call(input, base, "text/plain")).status, 415);
assert.equal((await call({ ...input, photoConsent: "" })).status, 400);
assert.equal((await call({ ...input, reviewConsent: "" })).status, 400);
assert.equal((await call({ ...input, name: " " })).status, 400);
assert.equal((await call({ ...input, website: "spam" })).status, 400);
assert.equal((await call("bad json")).status, 400);
assert.equal((await call("x".repeat(30001))).status, 413);
delete process.env.RESEND_API_KEY;
assert.equal((await call(input)).status, 503);
process.env.RESEND_API_KEY = "mock-key";
process.env.PROOFING_EMAIL_FROM = "mock@example.com";
process.env.PROOFING_EMAIL_TO = "recipient@example.com";
let sent;
globalThis.fetch = async (_url, options) => { sent = options; return new Response("{}", { status: 200 }); };
assert.equal((await call(input)).status, 200);
const message = JSON.parse(sent.body);
assert.match(message.text, /FOTOGRAFIE: NESOUHLASÍM/);
assert.match(message.text, /ZVEŘEJNĚNÍ RECENZE SE JMÉNEM: SOUHLASÍM/);
assert.ok(message.text.includes(feedback.photoConsentText));
assert.ok(message.text.includes(feedback.reviewConsentText));
assert.equal(sent.headers["Idempotency-Key"], `feedback-${input.submissionId}`);
const firstBody = sent.body;
assert.equal((await call(input)).status, 200);
assert.equal(sent.body, firstBody, "retry must use an identical provider body");
globalThis.fetch = async () => new Response("{}", { status: 500 });
assert.equal((await call(input)).status, 502);
assert.equal((await call(input)).status, 429);
assert.equal(feedback.parseFeedback({ ...input, review: "", reviewConsent: "no" }).review, "");
assert.throws(() => feedback.parseFeedback({ ...input, photoConsent: ["yes"] }));
assert.throws(() => feedback.parseFeedback({ ...input, reviewConsent: true }));
console.log("Feedback validation, independent consent, retry, mail failure and rate-limit checks passed. No real mail sent.");

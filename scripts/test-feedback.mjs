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
let storeFailure = false;
let notifyFailure = false;
let notification = "sent";
const { POST } = load("../app/api/feedback/route.ts", {
  "@/lib/feedback": feedback,
  "@/lib/proofing-server-types": load("../lib/proofing-server-types.ts"),
  "@/lib/review-store": {
    saveFeedback: async input => { if (storeFailure) throw new Error("db down"); return { data: input, notification: "pending" }; },
    notifyFeedback: async () => { if (notifyFailure) throw new Error("mail status unavailable"); return notification; }
  }
});
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
storeFailure = true;
assert.equal((await call(input)).status, 503);
storeFailure = false;
notification = "unconfigured";
assert.equal((await call(input)).status, 200, "saved response succeeds even without email config");
notification = "failed";
assert.equal((await call(input)).status, 200, "mail outage must not lose a saved response");
notifyFailure = true;
assert.equal((await call(input)).status, 200, "notification write failure must not lose saved response");
assert.equal((await call(input)).status, 429);
assert.equal(feedback.parseFeedback({ ...input, review: "", reviewConsent: "no" }).review, "");
assert.throws(() => feedback.parseFeedback({ ...input, photoConsent: ["yes"] }));
assert.throws(() => feedback.parseFeedback({ ...input, reviewConsent: true }));
console.log("Feedback validation, storage failure, saved mail-outage responses and rate-limit checks passed. No real mail sent.");

// Contract tests for real review storage and authenticated routes. No external writes.
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
const errors = load("../lib/proofing-server-types.ts");
const feedback = load("../lib/feedback.ts");
let row;
const calls = [];
const request = async (endpoint, init = {}) => {
  calls.push({ endpoint, init });
  if (init.method === "POST") { row ||= { ...JSON.parse(init.body), published_at: null, notification: "pending", received_at: new Date().toISOString() }; return new Response(null, { status: 201 }); }
  if (init.method === "PATCH") {
    if (endpoint.includes("reviewConsent=eq.yes") && (row.data.reviewConsent !== "yes" || !row.data.review.trim())) return Response.json([]);
    Object.assign(row, JSON.parse(init.body)); return Response.json([row]);
  }
  if (endpoint.includes("name:data")) return Response.json(row.published_at && row.data.reviewConsent === "yes" ? [{ id: row.id, name: row.data.name, review: row.data.review }] : []);
  return Response.json(row ? [row] : []);
};
const store = load("../lib/review-store.ts", { "./proofing-supabase": { request }, "./proofing-server-types": errors, "./feedback": feedback });
const input = { name: "Klient", session: "Soukromá informace", photoConsent: "no", review: "<script>test</script>", reviewConsent: "yes", submissionId: "12345678-1234-4123-8123-123456789abc", submittedAt: "2026-11-03T10:00:00Z" };
await store.saveFeedback(input);
assert.equal(row.published_at, null, "new reviews must stay private");
assert.deepEqual(await store.publicReviews(), []);
await store.saveFeedback(input);
await assert.rejects(store.saveFeedback({ ...input, name: "Someone else" }), error => error.status === 409);
await store.publishFeedback(row.id, true);
assert.deepEqual(await store.publicReviews(), [{ id: row.id, name: input.name, review: input.review }]);
assert.ok(!JSON.stringify(await store.publicReviews()).includes(input.session));
assert.ok(calls.some(call => call.endpoint.includes("published_at=not.is.null&data->>reviewConsent=eq.yes")));
await store.publishFeedback(row.id, false);
assert.deepEqual(await store.publicReviews(), []);
row.data.reviewConsent = "no";
await assert.rejects(store.publishFeedback(row.id, true), error => error.status === 409);
row.data.reviewConsent = "yes"; row.data.review = "";
await assert.rejects(store.publishFeedback(row.id, true), error => error.status === 409);
await assert.rejects(store.publishFeedback("not-a-uuid", true), error => error.status === 400);
row.data.review = input.review;
delete process.env.RESEND_API_KEY;
assert.equal(await store.notifyFeedback(row), "unconfigured");
process.env.RESEND_API_KEY = "mock"; process.env.PROOFING_EMAIL_FROM = "test@example.com"; process.env.PROOFING_EMAIL_TO = "test@example.com";
globalThis.fetch = async () => new Response(null, { status: 502 });
assert.equal(await store.notifyFeedback(row), "failed");
globalThis.fetch = async () => new Response(null, { status: 200 });
assert.equal(await store.notifyFeedback(row), "sent");
globalThis.fetch = async () => { throw new Error("must not resend"); };
assert.equal(await store.notifyFeedback(row), "sent");

let admin = false;
const auth = { requireAdmin: () => { if (!admin) throw new errors.ProofError(401, "Login required"); }, requireOrigin: req => { if (req.headers.get("origin") !== "http://localhost:3000") throw new errors.ProofError(403, "Wrong origin"); } };
const routes = load("../app/api/proofing/[...segments]/route.ts", { "@/lib/review-store": store, "@/lib/proofing-auth": auth, "@/lib/proofing-store": { ProofError: errors.ProofError } });
const { NextRequest } = require("next/server");
const context = { params: Promise.resolve({ segments: ["admin", "reviews"] }) };
const get = () => routes.GET(new NextRequest("http://localhost:3000/api/proofing/admin/reviews"), context);
const post = (origin = "http://localhost:3000") => routes.POST(new NextRequest("http://localhost:3000/api/proofing/admin/reviews", { method: "POST", headers: { origin, "content-type": "application/json" }, body: JSON.stringify({ id: row.id, action: "publish" }) }), context);
assert.equal((await get()).status, 401);
assert.equal((await post()).status, 401);
admin = true;
assert.equal((await post("https://other.example")).status, 403);
assert.equal((await get()).status, 200);
assert.equal((await post()).status, 200);
const publicRoute = load("../app/api/reviews/route.ts", { "@/lib/review-store": store });
const result = await publicRoute.GET();
assert.match(result.headers.get("cache-control"), /no-store/);
assert.deepEqual(Object.keys((await result.json()).reviews[0]).sort(), ["id", "name", "review"]);
console.log("PASS: private submission, duplicate protection, consent-gated publication, hide, public projection, mail retry, admin auth and origin.");

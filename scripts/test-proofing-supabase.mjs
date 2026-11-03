// Contract/concurrency tests against an in-memory HTTP substitute. No real
// Supabase keys, projects or customer records are accessed by this script.
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
const require = createRequire(import.meta.url);
const ts = require("typescript");
const folder = await mkdtemp(path.join(tmpdir(), "proofing-supabase-contract-"));
const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };
const albums = new Map();
const objects = new Map();
const attempts = new Map();
let publicBucket = false;
let failStorageDelete = false;
let forceConflict = false;
let commitThenDisconnect = false;
let commits = 0;
let requests = 0;
const key = "sb_secret_test_only_not_a_real_key";
const id = "c42fbeaa-b8a9-4b58-9aef-e2d948f5f0cf";
const photo = "39bcfc63-cfd4-4b5c-bdd0-f00a8591f18c";
const reply = data => new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
globalThis.fetch = async (input, init = {}) => {
  requests++;
  const url = new URL(input);
  assert.equal(url.origin, "https://proofing-test.supabase.co");
  assert.equal(init.cache, "no-store"); assert.equal(init.redirect, "error");
  const headers = new Headers(init.headers);
  assert.equal(headers.get("apikey"), key);
  assert.equal(headers.has("Authorization"), false);
  const endpoint = url.pathname;
  if (endpoint === "/rest/v1/photo_proofing_albums") {
    let rows = [...albums.values()];
    if (url.searchParams.has("id")) rows = rows.filter(row => `eq.${row.id}` === url.searchParams.get("id"));
    if (url.searchParams.has("data->>codeHash")) rows = rows.filter(row => `eq.${row.data.codeHash}` === url.searchParams.get("data->>codeHash"));
    if (init.method === "DELETE") {
      assert.ok(url.searchParams.has("id"), "Deletion must target a single gallery");
      rows = rows.filter(row => `eq.${row.storage_version}` === url.searchParams.get("storage_version"));
      for (const row of rows) albums.delete(row.id);
      return reply(rows.map(row => ({ id: row.id })));
    }
    const offset = Number(url.searchParams.get("offset") || 0);
    return reply(structuredClone(rows.slice(offset, offset + Number(url.searchParams.get("limit")))));
  }
  if (endpoint === "/rest/v1/rpc/photo_proofing_commit_album") {
    commits++;
    const value = JSON.parse(init.body);
    if (forceConflict) { forceConflict = false; return reply(false); }
    const current = albums.get(value.p_id);
    if ((current?.storage_version ?? null) !== value.p_expected_version) return reply(false);
    albums.set(value.p_id, { id: value.p_id, data: structuredClone(value.p_data), storage_version: (current?.storage_version || 0) + 1 });
    if (commitThenDisconnect) { commitThenDisconnect = false; throw new Error("Connection lost after commit"); }
    return reply(true);
  }
  if (endpoint === "/rest/v1/rpc/photo_proofing_login_attempt") {
    const { p_role: role } = JSON.parse(init.body);
    // Match the real SQL RPC contract rather than accepting arbitrary roles.
    if (!["admin", "client"].includes(role)) return new Response("Invalid role", { status: 400 });
    attempts.set(role, (attempts.get(role) || 0) + 1);
    return reply(attempts.get(role) <= (role === "admin" ? 20 : 100));
  }
  if (endpoint === "/storage/v1/bucket/client-proofing-previews") return reply({ public: publicBucket });
  const authenticated = "/storage/v1/object/authenticated/client-proofing-previews/";
  const object = "/storage/v1/object/client-proofing-previews/";
  if (endpoint.startsWith(authenticated)) return new Response(objects.get(endpoint.slice(authenticated.length)), { headers: { "Content-Type": "image/jpeg" } });
  if (endpoint.startsWith(object) && init.method === "POST") {
    assert.equal(headers.get("x-upsert"), "false");
    assert.equal(headers.get("Content-Type"), "image/jpeg");
    objects.set(endpoint.slice(object.length), Buffer.from(init.body)); return reply({ Key: "uploaded" });
  }
  if (endpoint === "/storage/v1/object/client-proofing-previews" && init.method === "DELETE") {
    if (failStorageDelete) return new Response("Unavailable", { status: 503 });
    for (const object of JSON.parse(init.body).prefixes) objects.delete(object);
    return reply([]);
  }
  throw new Error(`Unexpected mock request: ${endpoint}`);
};
try {
  for (const name of ["proofing-server-types", "proofing-supabase"]) {
    const source = await readFile(new URL(`../lib/${name}.ts`, import.meta.url), "utf8");
    const result = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } });
    await writeFile(path.join(folder, `${name}.js`), result.outputText);
  }
  process.env.PROOFING_STORAGE = "supabase";
  process.env.SUPABASE_URL = "https://proofing-test.supabase.co";
  process.env.SUPABASE_SECRET_KEY = key;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  const store = require(path.join(folder, "proofing-supabase.js"));
  assert.equal(store.isSupabaseStorage(), true);
  const fixture = { id, title: "Test", clientName: "Test", message: "", codeHash: "a".repeat(64), accessVersion: "test", photos: [], selected: [], note: "", revision: 0, status: "open", notification: "none", createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 86400000).toISOString() };
  await store.supabaseTransaction(db => db.albums.push(structuredClone(fixture)), { create: true });
  const beforeRead = commits;
  await store.supabaseTransaction(db => assert.equal(db.albums[0].id, id), { codeHash: fixture.codeHash });
  assert.equal(commits, beforeRead, "Reads must not rewrite rows");
  forceConflict = true;
  await store.supabaseTransaction(db => { db.albums[0].note = "Retry succeeded"; }, { albumId: id });
  assert.equal(albums.get(id).data.note, "Retry succeeded");
  await Promise.all(["A", "B"].map(marker => store.supabaseTransaction(db => { db.albums[0].selected.push(marker); }, { albumId: id })));
  assert.deepEqual(albums.get(id).data.selected.sort(), ["A", "B"], "Concurrent writes must preserve both changes");
  const bytes = Buffer.from([255, 216, 255, 217]);
  publicBucket = true;
  await assert.rejects(store.supabaseWritePreview(id, photo, bytes), error => error.status === 503);
  assert.equal(objects.size, 0, "No upload to public bucket");
  publicBucket = false;
  await store.supabaseWritePreview(id, photo, bytes);
  assert.deepEqual(await store.supabaseReadPreview(id, photo), bytes);
  await store.supabaseRemovePreview(id, photo);
  assert.equal(objects.size, 0);
  await assert.rejects(store.supabaseDeleteAlbum(id), error => error.status === 409);
  await store.supabaseWritePreview(id, photo, bytes);
  await store.supabaseTransaction(db => { db.albums[0].status = "archived"; db.albums[0].photos = [{ id: photo }]; }, { albumId: id });
  failStorageDelete = true;
  await assert.rejects(store.supabaseDeleteAlbum(id), error => error.status === 503);
  assert.equal(albums.has(id), true, "Keep the manifest so failed cleanup can be retried");
  assert.equal(objects.size, 1);
  failStorageDelete = false;
  await store.supabaseDeleteAlbum(id);
  assert.equal(albums.has(id), false);
  assert.equal(objects.size, 0, "Deleting a gallery must remove its previews");
  await store.supabaseTransaction(db => db.albums.push(structuredClone(fixture)), { create: true });
  await assert.rejects(store.supabaseReadPreview("../escape", photo), error => error.status === 404);
  for (let i = 0; i < 20; i++) assert.equal(await store.supabaseLoginLimit("admin"), true);
  assert.equal(await store.supabaseLoginLimit("admin"), false);
  commitThenDisconnect = true;
  const oldCommits = commits;
  await assert.rejects(store.supabaseTransaction(db => { db.albums[0].note = "Committed before network failure"; }, { albumId: id }), error => error.status === 503);
  assert.equal(commits, oldCommits + 1, "Ambiguous commit must not be blindly retried");
  assert.equal(albums.get(id).data.note, "Committed before network failure");
  for (let i = 0; i < 101; i++) { const uuid = `00000000-0000-4000-8000-${String(i).padStart(12, "0")}`; albums.set(uuid, { id: uuid, data: { ...fixture, id: uuid }, storage_version: 1 }); }
  const count = await store.supabaseTransaction(db => db.albums.length, {});
  assert.equal(count, 102, "List must read all REST pages");
  const oldRequests = requests;
  process.env.SUPABASE_SECRET_KEY = "sb_publishable_this_is_not_a_secret";
  await assert.rejects(store.supabaseLoginLimit("client"), error => error.status === 503);
  assert.equal(requests, oldRequests, "Public credentials must fail before making a request");
  delete process.env.SUPABASE_SECRET_KEY;
  await assert.rejects(store.supabaseLoginLimit("client"), error => error.status === 503);
  process.env.PROOFING_STORAGE = "disk"; process.env.VERCEL = "1";
  assert.throws(() => store.isSupabaseStorage(), error => error.status === 503);
  console.log("PASS: Supabase REST contracts, scoped reads, pagination, atomic concurrent updates, conflict retry, ambiguous commit handling, server-only credentials, private storage, shared login limits, no Vercel disk fallback.");
} finally {
  globalThis.fetch = originalFetch;
  for (const key of Object.keys(process.env)) if (!(key in originalEnv)) delete process.env[key];
  Object.assign(process.env, originalEnv);
  await rm(folder, { recursive: true, force: true });
}

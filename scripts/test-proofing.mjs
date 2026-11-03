// Self-contained integration test: starts Next with a temporary private store,
// exercises real HTTP routes, restarts it, and checks persisted selection.
// It generates random test credentials and never contacts an email service.
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { createServer } from "node:net";

const folder = await mkdtemp(path.join(tmpdir(), "fotoweb-proof-test-"));
const password = randomBytes(24).toString("hex");
const listener = createServer();
await new Promise((resolve, reject) => { listener.once("error", reject); listener.listen(0, "127.0.0.1", resolve); });
const port = listener.address().port;
await new Promise(resolve => listener.close(resolve));
const base = `http://127.0.0.1:${port}`;
const admin = { cookie: "" }, client = { cookie: "" };
let server;
let output = "";
async function start() {
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: process.cwd(), env: { ...process.env, VERCEL: "", PROOFING_STORAGE: "disk", NEXT_TELEMETRY_DISABLED: "1", PROOFING_DATA_DIR: folder, PROOFING_ADMIN_PASSWORD: password, PROOFING_SESSION_SECRET: "integration-test-session-secret-with-at-least-32-characters", RESEND_API_KEY: "", PROOFING_EMAIL_FROM: "", PROOFING_EMAIL_TO: "", PROOFING_PUBLIC_URL: base }, stdio: ["ignore", "pipe", "pipe"]
  });
  server.stdout.on("data", chunk => { output = (output + chunk).slice(-15000); });
  server.stderr.on("data", chunk => { output = (output + chunk).slice(-15000); });
  for (let i = 0; i < 180; i++) {
    if (server.exitCode !== null) throw new Error(`Next exited: ${output}`);
    try { const response = await fetch(`${base}/api/proofing/gallery`); if (response.status === 401) return; }
    catch { /* Starting up */ }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw new Error(`Next did not become ready: ${output}`);
}
async function stop() {
  if (!server || server.exitCode !== null) return;
  const current = server;
  await new Promise(resolve => {
    const timeout = setTimeout(() => current.kill("SIGKILL"), 10000);
    current.once("exit", () => { clearTimeout(timeout); resolve(); });
    current.kill("SIGTERM");
  });
}
async function call(endpoint, data, jar = client, expected = 200, origin = base) {
  const response = await fetch(`${base}/api/proofing/${endpoint}`, {
    method: data === undefined ? "GET" : "POST",
    headers: { ...(data === undefined ? {} : { "Content-Type": "application/json", Origin: origin }), ...(jar.cookie ? { Cookie: jar.cookie } : {}) },
    ...(data === undefined ? {} : { body: JSON.stringify(data) })
  });
  const result = await response.json();
  assert.equal(response.status, expected, `${endpoint}: ${JSON.stringify(result)}`);
  const cookie = response.headers.get("set-cookie");
  if (cookie) jar.cookie = cookie.split(";")[0];
  assert.match(response.headers.get("cache-control"), /no-store/);
  return result;
}
async function create(title = "Testovací rodina") {
  return call("admin/create", { title, clientName: "Test klient", message: "Vyberte své oblíbené snímky.", expiresAt: new Date(Date.now() + 86400000).toISOString() }, admin, 201);
}
try {
  await start();
  await call("admin", undefined, admin, 401);
  await call("admin/test-email", {}, client, 401);
  await call("admin/login", { password }, admin, 403, "https://cizi-web.example");
  await call("admin/login", { password: "wrong" }, admin, 401);
  await call("admin/login", { password }, admin);
  await call("admin/test-email", {}, admin, 403, "https://cizi-web.example");
  await call("admin/test-email", {}, admin, 503);
  const made = await create();
  assert.ok(made.code.length >= 20);
  assert.equal(made.album.codeHash, undefined);
  assert.equal(made.album.accessVersion, undefined);
  await call("login", { code: "wrong-code" }, client, 401);
  await call("login", { code: made.code.toLowerCase().replaceAll("-", " ") });
  // Small embedded JPEG, no customer data or test-only image dependency.
  const image = Buffer.from("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAb/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCygDf/2Q==", "base64");
  const upload = new FormData();
  upload.set("albumId", made.album.id); upload.set("name", "DSC_0001.jpg"); upload.set("width", "1"); upload.set("height", "1"); upload.set("photo", new Blob([image], { type: "image/jpeg" }), "preview.jpg");
  const uploaded = await fetch(`${base}/api/proofing/admin/upload`, { method: "POST", headers: { Origin: base, Cookie: admin.cookie }, body: upload });
  const uploadResult = await uploaded.json();
  assert.equal(uploaded.status, 201, JSON.stringify(uploadResult));
  const photo = uploadResult.album.photos[0];
  const imageUrl = `${base}/api/proofing/photo/${made.album.id}/${photo.id}`;
  assert.equal((await fetch(imageUrl)).status, 401);
  const imageResponse = await fetch(imageUrl, { headers: { Cookie: client.cookie } });
  assert.equal(imageResponse.status, 200); assert.equal(imageResponse.headers.get("content-type"), "image/jpeg");
  assert.deepEqual(Buffer.from(await imageResponse.arrayBuffer()), image);
  let current = (await call("gallery")).album;
  await call("save", { selected: ["invalid-id"], note: "", revision: current.revision }, client, 400);
  const saved = await call("save", { selected: [photo.id], note: "Prosím přirozené barvy.", revision: current.revision });
  await call("save", { selected: [], note: "staré okno", revision: current.revision }, client, 409);
  current = saved.album;
  await call("submit", { selected: [], note: "", revision: current.revision }, client, 400);
  const submitted = await call("submit", { selected: current.selected, note: current.note, revision: current.revision });
  assert.equal(submitted.album.status, "submitted");
  await call("save", { selected: [], note: "", revision: submitted.album.revision }, client, 409);
  await call("submit", { selected: [], note: "", revision: 0 }); // Idempotent retry.
  const overview = await call("admin", undefined, admin);
  assert.equal(overview.albums[0].notification, "unconfigured");
  assert.equal(overview.albums[0].selected.length, 1);
  const second = await create("Jiná rodina");
  const other = { cookie: "" }; await call("login", { code: second.code }, other);
  assert.equal((await fetch(imageUrl, { headers: { Cookie: other.cookie } })).status, 401);
  await stop(); await start();
  const persisted = (await call("gallery")).album;
  assert.deepEqual(persisted.selected, [photo.id]); assert.equal(persisted.note, "Prosím přirozené barvy."); assert.equal(persisted.status, "submitted");
  await call("admin/reopen", { id: made.album.id }, admin);
  const rotated = await call("admin/rotate", { id: made.album.id }, admin);
  await call("gallery", undefined, client, 401);
  await call("login", { code: made.code }, client, 401);
  await call("login", { code: rotated.code });
  await call("admin/archive", { id: made.album.id }, admin);
  await call("gallery", undefined, client, 401);
  await call("login", { code: rotated.code }, client, 410);
  await call("admin/delete", { id: made.album.id, title: made.album.title }, client, 401);
  await call("admin/delete", { id: made.album.id, title: made.album.title }, admin, 403, "https://cizi-web.example");
  await call("admin/delete", { id: made.album.id, title: "Jiný název" }, admin, 409);
  await call("admin/delete", { id: made.album.id, title: made.album.title }, admin);
  await assert.rejects(readFile(path.join(folder, "photos", made.album.id, `${photo.id}.jpg`)), error => error.code === "ENOENT");
  assert.equal((await call("admin", undefined, admin)).albums.some(album => album.id === made.album.id), false);
  assert.equal((await fetch(imageUrl, { headers: { Cookie: admin.cookie } })).status, 404);
  assert.equal((await call("admin", undefined, admin)).albums.some(album => album.id === second.album.id), true);
  await call("login", { code: rotated.code }, client, 401);
  await stop(); await start();
  assert.equal((await call("admin", undefined, admin)).albums.some(album => album.id === made.album.id), false);
  await call("admin/logout", {}, admin);
  await call("admin", undefined, admin, 401);
  console.log("PASS: gallery creation, private upload/media, code access, autosave, conflict detection, submit locking, mail fallback, album isolation, restart persistence, code revocation, archive, CSRF, logout.");
} catch (error) {
  console.error(error); console.error(output); process.exitCode = 1;
} finally { await stop(); await rm(folder, { recursive: true, force: true }); }

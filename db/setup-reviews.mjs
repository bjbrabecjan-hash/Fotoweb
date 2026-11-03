// Opt-in release check. Credentials stay inside the deployment environment.
// Never runs a schema change on an ordinary build.
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

if (process.env.REVIEW_DB_SETUP !== "1") process.exit(0);
const { Client } = await import("pg");
const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
if (!connectionString) throw new Error("Review database connection is not configured.");
const url = new URL(connectionString);
for (const name of ["sslmode", "sslrootcert", "sslcert", "sslkey"]) url.searchParams.delete(name);
const ca = await readFile(new URL("./supabase-ca.crt", import.meta.url), "utf8");
const client = new Client({ connectionString: url.toString(), ssl: { ca, rejectUnauthorized: true }, connectionTimeoutMillis: 20000, query_timeout: 20000, statement_timeout: 15000, application_name: "fotoweb-review-setup" });
try {
  await client.connect();
  await client.query("begin");
  await client.query("select pg_advisory_xact_lock(hashtext('fotoweb-review-setup'))");
  const known = await client.query("select to_regclass('public.photo_proofing_albums') as albums, to_regclass('public.photo_feedback') as feedback");
  if (!known.rows[0].albums) throw new Error("Unexpected database: existing client gallery table was not found.");
  if (!known.rows[0].feedback) {
    await client.query(await readFile(new URL("./feedback-schema.sql", import.meta.url), "utf8"));
    console.log("Review table created; existing gallery tables were preserved.");
  }
  const check = await client.query(`select c.relrowsecurity as rls,
    has_table_privilege('anon','public.photo_feedback','select') as anon_select,
    has_table_privilege('authenticated','public.photo_feedback','select') as user_select,
    has_table_privilege('service_role','public.photo_feedback','insert') as server_insert,
    exists(select 1 from pg_constraint where conrelid=c.oid and conname='feedback_consent_required') as consent_guard
    from pg_class c where c.oid='public.photo_feedback'::regclass`);
  const result = check.rows[0];
  if (!result?.rls || result.anon_select || result.user_select || !result.server_insert || !result.consent_guard) throw new Error("Review table access verification failed.");
  // Exercise publication and withdrawal with a synthetic row, then remove it by rolling back to a savepoint.
  await client.query("savepoint review_test");
  await client.query("set local role service_role");
  const id = randomUUID();
  await client.query("insert into public.photo_feedback(id,data,content_hash) values($1,$2,$3)", [id, { name: "RELEASE TEST — NOT A CLIENT REVIEW", review: "Synthetic verification", reviewConsent: "yes", photoConsent: "no" }, "release-test"]);
  await client.query("update public.photo_feedback set published_at=now() where id=$1", [id]);
  await client.query("update public.photo_feedback set published_at=null where id=$1", [id]);
  await client.query("savepoint consent_test");
  try {
    await client.query("update public.photo_feedback set data=jsonb_set(data,'{reviewConsent}','\"no\"'),published_at=now() where id=$1", [id]);
    throw new Error("Consent guard did not reject publication.");
  } catch (error) {
    if (error.code !== "23514") throw error;
    await client.query("rollback to savepoint consent_test");
  }
  await client.query("rollback to savepoint review_test");
  await client.query("notify pgrst, 'reload schema'");
  await client.query("commit");
  console.log("PASS: review table RLS, private access, publication, withdrawal, consent guard. Synthetic test row rolled back.");
  const restBase = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const restKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!restBase || !restKey) throw new Error("Review REST configuration missing.");
  const restHeaders = { apikey: restKey, ...(restKey.startsWith("sb_secret_") ? {} : { Authorization: `Bearer ${restKey}` }) };
  const endpoint = "/rest/v1/photo_feedback?select=id,name:data->>name,review:data->>review&published_at=not.is.null&data->>reviewConsent=eq.yes&limit=0";
  let ready = false;
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(`${restBase}${endpoint}`, { headers: restHeaders, signal: AbortSignal.timeout(15000) });
    if (response.ok && Array.isArray(await response.json())) { ready = true; break; }
    console.log("Waiting for review REST schema; status:", response.status);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  if (!ready) throw new Error("Review REST verification failed.");
  console.log("PASS: actual review REST projection is accessible using the existing server configuration; no client rows read.");
} catch (error) {
  await client.query("rollback").catch(() => {});
  // Provider messages can contain connection details; log only safe categories.
  console.error("Review database setup failed:", /^[A-Z0-9_]{3,30}$/.test(error.code || "") ? error.code : error.name);
  const categories = [
    ["Tenant or user not found", "Database pooler cannot find the configured tenant/user."],
    ["Circuit breaker", "Database pooler circuit breaker is open."],
    ["Unable to check out connection", "Database pooler cannot acquire a database connection."],
    ["timeout", "Database connection timed out."],
    ["password authentication failed", "Database credentials were rejected."],
    ["Unexpected database", "Configured database does not contain the existing galleries."],
    ["Review table access verification failed", "Existing review table access does not match the required policy."]
  ];
  for (const [match, label] of categories) if (String(error.message).toLowerCase().includes(match.toLowerCase())) console.error(label);
  // Check the existing app's REST transport independently. Never print credentials or row data.
  const base = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (base && key) {
    try {
      const headers = { apikey: key, ...(key.startsWith("sb_secret_") ? {} : { Authorization: `Bearer ${key}` }) };
      const response = await fetch(`${base}/rest/v1/photo_proofing_albums?select=id&limit=0`, { headers, signal: AbortSignal.timeout(15000) });
      console.error("Existing gallery REST status:", response.status);
    } catch (failure) { console.error("Existing gallery REST check failed:", failure.name); }
  }
  process.exitCode = 1;
} finally { await client.end().catch(() => {}); }

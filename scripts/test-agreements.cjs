/* Route integration tests: isolated transport, no production data or e-mail. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(name, ...args) { return resolve.call(this, name.startsWith('@/') ? path.join(root, name.slice(2)) : name, ...args); };
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file,'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, file);
process.env.NODE_ENV = 'production';
process.env.PROOFING_SESSION_SECRET = 'isolated-tests-session-secret-at-least-32-chars';
process.env.PROOFING_ADMIN_PASSWORD = 'isolated-test-admin-password';
process.env.SUPABASE_URL = 'https://isolated-tests.supabase.co';
process.env.SUPABASE_SECRET_KEY = 'sb_secret_isolated';
process.env.PROOFING_PUBLIC_URL = 'https://fotoweb.test';
process.env.PROOFING_EMAIL_FROM = 'test@fotoweb.test';
process.env.RESEND_API_KEY = 'isolated-test-no-transport';
const rows = new Map(), attempts = new Map(), emails = [];
let mailFails = false;
const clone = x => JSON.parse(JSON.stringify(x));
global.fetch = async (url, init={}) => {
  const u = new URL(url); const input = init.body ? JSON.parse(init.body) : null;
  if (u.host === 'api.resend.com') { if (mailFails) return new Response('{}',{status:503}); emails.push(input); return Response.json({id:'test-mail'}); }
  assert.equal(u.host, 'isolated-tests.supabase.co');
  if (u.pathname.endsWith('/agreement_login_attempt')) { const n=(attempts.get(input.p_identity)||0)+1; attempts.set(input.p_identity,n); return Response.json(n<=8); }
  if (u.pathname.endsWith('/agreement_commit')) {
    const old=rows.get(input.p_id); if (input.p_expected===null ? !!old : !old || old.revision!==input.p_expected) return Response.json(false);
    if(old?.snapshot) assert.deepEqual(input.p_data.snapshot,old.snapshot);
    rows.set(input.p_id,clone(input.p_data)); return Response.json(true);
  }
  if (u.pathname === '/rest/v1/client_agreements') {
    const result=[...rows.values()].filter(a => (!u.searchParams.has('id') || u.searchParams.get('id') === 'eq.'+a.id) && (!u.searchParams.has('data->details->>email') || u.searchParams.get('data->details->>email') === 'eq.'+a.details.email) && (!u.searchParams.has('data->>accessHash') || u.searchParams.get('data->>accessHash') === 'eq.'+a.accessHash));
    return Response.json(result.map(data=>({data:clone(data)})));
  }
  throw Error('Unexpected test endpoint '+u.pathname);
};
const {NextRequest,NextResponse}=require('next/server');
const {TERMS_VERSION}=require('../lib/agreements/template.ts');
const {POST,GET}=require('../app/api/agreements/[...segments]/route.ts');
const {setSession,passwordVersion}=require('../lib/proofing-auth.ts');
const cookieResponse=NextResponse.json({}); setSession(cookieResponse,new NextRequest('https://fotoweb.test'),'admin','hanka',passwordVersion());
const admin=cookieResponse.headers.get('set-cookie').split(';')[0];
async function request(endpoint,body,cookie='',origin='https://fotoweb.test') {
  if(endpoint==='submit' && body && !body.termsVersion) body.termsVersion=TERMS_VERSION;
  const req=new NextRequest('https://fotoweb.test/api/agreements/'+endpoint,{method:body===undefined?'GET':'POST',headers:{origin,cookie,'content-type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});
  const r=await (body===undefined?GET:POST)(req,{params:Promise.resolve({segments:endpoint.split('/')})});
  return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0],headers:r.headers};
}
(async()=>{
  assert.equal((await request('admin')).status,401);
  assert.equal((await request('admin/create',{template:'pilot-content-v1'})).status,401);
  assert.equal((await request('admin/create',{template:'pilot-content-v1'},admin,'https://attacker.test')).status,403);
  let r=await request('admin/create',{template:'pilot-content-v1'},admin); assert.equal(r.status,201); let a=r.data.agreement;
  assert.equal(a.details.company,'Capoergi s.r.o.'); assert(!('accessHash' in a));
  assert.equal((await request('admin/password',{id:a.id,revision:a.revision},admin)).status,400);
  r=await request('admin/save',{id:a.id,revision:a.revision,details:{...a.details,representative:'Test osoba',email:'test@example.com',phone:'+420 123 456 789'}},admin); assert.equal(r.status,200); a=r.data.agreement;
  r=await request('admin/password',{id:a.id,revision:a.revision},admin); assert.equal(r.status,200); a=r.data.agreement; let password=r.data.password;
  assert.equal(password.length,32); assert(!JSON.stringify(rows.get(a.id)).includes(password));
  assert.equal((await request('admin/save',{id:a.id,revision:0,details:a.details},admin)).status,409);
  r=await request('admin/invite',{id:a.id,revision:a.revision,password},admin); assert.equal(r.status,200); a=r.data.agreement; assert(emails.at(-1).text.includes(password));
  assert.equal((await request('login',{email:'other@example.com',password})).status,401);
  r=await request('login',{email:a.details.email,password,id:a.id}); assert.equal(r.status,200); const oldCookie=r.cookie; a=r.data.agreement;
  assert(r.headers.get('set-cookie').includes('HttpOnly')); assert(r.headers.get('set-cookie').includes('Secure')); assert(r.headers.get('set-cookie').includes('SameSite=strict'));
  assert.equal((await request('document',undefined,oldCookie)).status,200);
  assert.equal((await request('document',undefined,oldCookie+'tampered')).status,401);
  let other=await request('admin/create',{template:'pilot-content-v1'},admin); assert.equal((await request('login',{email:a.details.email,password,id:other.data.agreement.id})).status,401);
  r=await request('admin/password',{id:a.id,revision:a.revision},admin); a=r.data.agreement; const oldPassword=password; password=r.data.password;
  assert.equal((await request('document',undefined,oldCookie)).status,401);
  assert.equal((await request('login',{email:a.details.email,password:oldPassword})).status,401);
  r=await request('login',{email:a.details.email,password}); assert.equal(r.status,200); const client=r.cookie; a=r.data.agreement;
  const confirmation={name:'Test osoba',role:'jednatel',email:a.details.email,phone:'123456789',place:'Praha',accepted:[true,true,true,false],portfolio:false};
  assert.equal((await request('submit',{revision:a.revision,confirmation},client)).status,400);
  confirmation.accepted=[true,true,true,true];
  assert.equal((await request('submit',{revision:a.revision,termsVersion:'old',confirmation},client)).status,409);
  assert.equal((await request('submit',{revision:a.revision-1,confirmation},client)).status,409);
  mailFails=true; r=await request('submit',{revision:a.revision,confirmation},client); assert.equal(r.status,200); a=r.data.agreement; assert(r.data.warning);
  assert.equal(a.status,'připraveno k podpisu'); assert.equal(a.snapshot.confirmation.portfolio,false); assert(a.snapshot.text.includes('Volba klienta: Nesouhlasím')); assert(a.snapshot.text.includes('Lžovice 5')); assert(a.snapshot.text.includes('4,5 hodiny')); assert(a.snapshot.text.includes('Podpis:')); assert(a.snapshot.text.includes('Europe/Prague'));
  assert.equal((await request('admin/save',{id:a.id,revision:a.revision,details:a.details},admin)).status,409);
  const snapshot=clone(a.snapshot); mailFails=false;
  r=await request('admin/retry-mail',{id:a.id,revision:a.revision},admin); assert.equal(r.status,200); a=r.data.agreement; assert(a.mail.provider&&a.mail.client); assert.equal(emails.length,3);
  r=await request('submit',{revision:a.revision,confirmation},client); assert.equal(r.status,200); assert.deepEqual(r.data.agreement.snapshot,snapshot); assert.equal(emails.length,3);
  r=await request('admin/status',{id:a.id,revision:a.revision,status:'podepsáno'},admin); assert.equal(r.status,200); a=r.data.agreement;
  r=await request('admin/status',{id:a.id,revision:a.revision,status:'archivováno'},admin); assert.equal(r.status,200);
  assert.equal((await request('document',undefined,client)).status,401);
  for(let i=0;i<8;i++) assert.equal((await request('login',{email:'rate@example.com',password:'wrong'})).status,401);
  assert.equal((await request('login',{email:'rate@example.com',password:'wrong'})).status,429);
  assert.equal((await request('logout',{},client)).status,200);
  console.log('PASS: admin authorization, CSRF, validation, hash-only credentials, invitation, per-document access, cookie security, tampering, rotation, revisions, required consent, immutable snapshot, mail retry, idempotent submit, signing, archive, persistent-rate-limit contract and logout.');
})().catch(e=>{console.error(e);process.exitCode=1;});

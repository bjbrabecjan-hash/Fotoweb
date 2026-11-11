-- Additive schema. Existing galleries, feedback and their functions are unchanged.
begin;
create table if not exists public.client_agreements (
  id uuid primary key,
  created_at timestamptz not null default now(),
  revision integer not null default 0,
  data jsonb not null
);
create index if not exists client_agreements_email on public.client_agreements ((data->'details'->>'email'));
create index if not exists client_agreements_access on public.client_agreements ((data->>'accessHash'));
create table if not exists public.agreement_login_limits (
  bucket text primary key, attempts integer not null, until_at timestamptz not null
);
alter table public.client_agreements enable row level security;
alter table public.agreement_login_limits enable row level security;
revoke all on public.client_agreements, public.agreement_login_limits from public, anon, authenticated;
grant select, insert, update on public.client_agreements to service_role;
grant select, insert, update, delete on public.agreement_login_limits to service_role;

create or replace function public.agreement_commit(p_id uuid, p_expected integer, p_data jsonb)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare previous jsonb;
begin
  if p_data->>'id' <> p_id::text or (p_data->>'revision')::integer <> coalesce(p_expected + 1, 0)
    or not (p_data->>'status' = any(array['koncept','připraveno k odeslání','pozvánka odeslána','otevřeno klientem','vyplněno klientem','připraveno k podpisu','podepsáno','archivováno'])) then
    raise exception 'Invalid agreement';
  end if;
  if p_expected is null then
    insert into public.client_agreements(id, data, revision) values(p_id, p_data, 0) on conflict do nothing;
    return found;
  end if;
  select data into previous from public.client_agreements where id = p_id and revision = p_expected for update;
  if not found then return false; end if;
  -- A confirmed document and its parties can never be silently rewritten.
  if previous ? 'snapshot' and (previous->'snapshot' is distinct from p_data->'snapshot' or previous->'details' is distinct from p_data->'details') then
    raise exception 'Confirmed agreement is immutable';
  end if;
  update public.client_agreements set data=p_data, revision=p_expected+1 where id=p_id;
  return true;
end $$;

create or replace function public.agreement_login_attempt(p_identity text, p_ip text)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare k text; n integer; allowed boolean := true; maximum integer;
begin
  if length(p_identity) <> 64 or length(p_ip) <> 64 then return false; end if;
  delete from public.agreement_login_limits where until_at <= now();
  foreach k in array array['global', 'identity:' || p_identity, 'ip:' || p_ip] loop
    maximum := case when k='global' then 300 when k like 'identity:%' then 8 else 30 end;
    insert into public.agreement_login_limits(bucket, attempts, until_at) values(k,1,now()+interval '15 minutes')
    on conflict(bucket) do update set attempts=public.agreement_login_limits.attempts+1 returning attempts into n;
    if n > maximum then allowed := false; end if;
  end loop;
  return allowed;
end $$;
revoke all on function public.agreement_commit(uuid, integer, jsonb), public.agreement_login_attempt(text,text) from public, anon, authenticated;
grant execute on function public.agreement_commit(uuid, integer, jsonb), public.agreement_login_attempt(text,text) to service_role;

-- Initial real draft; no client credential exists until the administrator creates it.
create unique index if not exists client_agreements_seed on public.client_agreements ((data->>'seedKey')) where data ? 'seedKey';
with seed as (select gen_random_uuid() as id)
insert into public.client_agreements(id, data)
select id, jsonb_build_object('id',id::text,'template','pilot-content-v1','seedKey','napoletano-2026','details', $details${"company": "Capoergi s.r.o.", "establishment": "Napoletano Bistro", "ico": "23736615", "address": "Lžovice 5, 281 26 Týnec nad Labem", "vat": "neplátce DPH", "representative": "", "email": "", "phone": "", "scope": "Měsíční paušál zahrnuje:\n\n- 12 dokončených krátkých videí Reels,\n- přibližně 30 upravených fotografií pro sociální sítě,\n- vybrané krátké záběry vhodné pro Stories,\n- návrhy témat a základní plánování obsahu,\n- natáčení a fotografování maximálně při třech návštěvách provozovny,\n- celkový čas natáčení maximálně 4,5 hodiny za jedno měsíční období,\n- střih, základní barevnou úpravu, titulky a textové prvky,\n- standardní odevzdání zpracovaného obsahu do 48 hodin od jednotlivého natáčení, pokud Objednatel poskytl potřebné informace a podklady.\n\nTermíny, témata a konkrétní obsah budou domlouvány průběžně.\n\nHotový obsah si Objednatel zveřejňuje sám.\n\nSoučástí měsíčního paušálu nejsou:\n\n- profesionální produktové fotografie kompletní nabídky pro web,\n- grafické práce,\n- tvorba webových stránek,\n- kompletní správa profilů,\n- odpovídání zákazníkům,\n- nastavení a správa placené reklamy,\n- práce nad sjednaný rozsah.\n\nTyto služby lze domluvit a nacenit samostatně.", "price": 6500}$details$::jsonb,'status','koncept','revision',0,'createdAt',to_char(now() at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),'accessVersion',gen_random_uuid()::text,'events','[]'::jsonb) from seed
on conflict do nothing;
commit;

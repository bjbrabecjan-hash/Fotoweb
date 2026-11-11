-- Run after agreements-schema.sql. All test rows and counters are rolled back.
begin;
set local role service_role;
do $$
declare id uuid := gen_random_uuid(); a jsonb; ok boolean; caught boolean := false; i integer;
begin
  if has_table_privilege('anon','public.client_agreements','SELECT') or has_table_privilege('authenticated','public.client_agreements','SELECT') then raise exception 'Public data access'; end if;
  if has_function_privilege('anon','public.agreement_commit(uuid,integer,jsonb)','EXECUTE') then raise exception 'Public RPC access'; end if;
  a := jsonb_build_object('id',id::text,'revision',0,'status','koncept','details','{}'::jsonb);
  if not public.agreement_commit(id,null,a) then raise exception 'Create failed'; end if;
  if public.agreement_commit(id,null,a) then raise exception 'Duplicate insert'; end if;
  a := a || '{"revision":1,"status":"připraveno k podpisu","snapshot":{"text":"Žluťoučký kůň","number":"test"}}'::jsonb;
  if not public.agreement_commit(id,0,a) then raise exception 'Snapshot commit failed'; end if;
  if public.agreement_commit(id,0,a) then raise exception 'Stale write accepted'; end if;
  begin
    perform public.agreement_commit(id,1,a || '{"revision":2,"snapshot":{"text":"changed"}}'::jsonb);
  exception when others then caught := true;
  end;
  if not caught then raise exception 'Snapshot modification accepted'; end if;
  for i in 1..8 loop
    ok := public.agreement_login_attempt(repeat('a',64),repeat('b',64));
    if not ok then raise exception 'Early limit'; end if;
  end loop;
  if public.agreement_login_attempt(repeat('a',64),repeat('b',64)) then raise exception 'Rate limit bypass'; end if;
end $$;
rollback;

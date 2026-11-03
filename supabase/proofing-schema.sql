-- Bootstrap for an existing Supabase project. Creates only dedicated gallery
-- objects; apply once. No existing application tables or policies are changed.
create table public.photo_proofing_albums (
  id uuid primary key,
  data jsonb not null,
  storage_version integer not null default 1 check (storage_version > 0),
  created_at timestamptz not null default now(),
  constraint photo_proofing_album_identity check (
    jsonb_typeof(data) = 'object' and data ? 'id' and data->>'id' = id::text
    and data ? 'codeHash' and data ? 'photos' and jsonb_typeof(data->'photos') = 'array'
    and jsonb_array_length(data->'photos') <= 500
  )
);
create unique index photo_proofing_code_hash on public.photo_proofing_albums ((data->>'codeHash'));
alter table public.photo_proofing_albums enable row level security;
revoke all on public.photo_proofing_albums from public, anon, authenticated;
grant select, insert, update, delete on public.photo_proofing_albums to service_role;

create table public.photo_proofing_login_limits (
  role text primary key check (role in ('admin', 'client')),
  attempts integer not null,
  window_end timestamptz not null
);
alter table public.photo_proofing_login_limits enable row level security;
revoke all on public.photo_proofing_login_limits from public, anon, authenticated;
grant select, insert, update on public.photo_proofing_login_limits to service_role;

-- Invoker privileges: only the server's service_role can execute these RPCs.
create function public.photo_proofing_commit_album(p_id uuid, p_expected_version integer, p_data jsonb)
returns boolean language plpgsql security invoker set search_path = '' as $$
begin
  if p_id is null or p_data->>'id' is distinct from p_id::text then
    raise exception 'Invalid album identity';
  end if;
  if p_expected_version is null then
    perform pg_catalog.pg_advisory_xact_lock(1758281632, 1);
    if (select count(*) from public.photo_proofing_albums) >= 1000 then
      raise exception 'Album limit reached';
    end if;
    insert into public.photo_proofing_albums(id, data) values(p_id, p_data)
      on conflict (id) do nothing;
  else
    update public.photo_proofing_albums
      set data = p_data, storage_version = storage_version + 1
      where id = p_id and storage_version = p_expected_version;
  end if;
  return found;
end;
$$;
revoke all on function public.photo_proofing_commit_album(uuid, integer, jsonb) from public, anon, authenticated;
grant execute on function public.photo_proofing_commit_album(uuid, integer, jsonb) to service_role;

create function public.photo_proofing_login_attempt(p_role text)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare amount integer;
begin
  if p_role not in ('admin', 'client') or p_role is null then raise exception 'Invalid role'; end if;
  insert into public.photo_proofing_login_limits(role, attempts, window_end)
    values(p_role, 1, pg_catalog.clock_timestamp() + interval '15 minutes')
  on conflict (role) do update set
    attempts = case when photo_proofing_login_limits.window_end <= pg_catalog.clock_timestamp()
      then 1 else photo_proofing_login_limits.attempts + 1 end,
    window_end = case when photo_proofing_login_limits.window_end <= pg_catalog.clock_timestamp()
      then pg_catalog.clock_timestamp() + interval '15 minutes' else photo_proofing_login_limits.window_end end
  returning attempts into amount;
  return amount <= case when p_role = 'admin' then 20 else 100 end;
end;
$$;
revoke all on function public.photo_proofing_login_attempt(text) from public, anon, authenticated;
grant execute on function public.photo_proofing_login_attempt(text) to service_role;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values('client-proofing-previews', 'client-proofing-previews', false, 3145728, array['image/jpeg']);
-- Existing shared-project permissive policies must not accidentally grant
-- access to this new bucket. Other buckets retain their original policy rules.
create policy photo_proofing_server_only on storage.objects as restrictive
for all to anon, authenticated
using (bucket_id <> 'client-proofing-previews')
with check (bucket_id <> 'client-proofing-previews');
-- No anon/authenticated policies: every image goes through the authorized
-- Next.js route. The browser never receives a server key or storage signed URL.

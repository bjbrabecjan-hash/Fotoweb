create table public.photo_feedback (
  id uuid primary key,
  data jsonb not null,
  content_hash text not null,
  received_at timestamptz not null default now(),
  published_at timestamptz,
  notification text not null default 'pending' check (notification in ('pending','sent','failed','unconfigured')),
  constraint feedback_consent_required check (published_at is null or coalesce(
    (data->>'reviewConsent' = 'yes' and length(btrim(data->>'review')) > 0), false))
);
create index photo_feedback_received on public.photo_feedback(received_at desc, id desc);
create index photo_feedback_published on public.photo_feedback(published_at desc, id desc) where published_at is not null;
alter table public.photo_feedback enable row level security;
revoke all on public.photo_feedback from public, anon, authenticated;
grant select, insert, update on public.photo_feedback to service_role;
comment on table public.photo_feedback is 'Private client feedback and independent consent records. Public output is projected by the server after manual approval.';

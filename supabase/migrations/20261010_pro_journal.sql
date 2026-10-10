-- Plans are only written by trusted server code, never the browser.
create table if not exists public.user_entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  pro_until timestamptz,
  updated_at timestamptz not null default now()
);
create table if not exists public.journal_backups (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload text not null,
  revision integer not null default 1 check (revision > 0),
  updated_at timestamptz not null default now()
);
alter table public.user_entitlements enable row level security;
alter table public.journal_backups enable row level security;
revoke all on public.user_entitlements, public.journal_backups from public, anon, authenticated;
grant select, insert, update, delete on public.user_entitlements, public.journal_backups to service_role;

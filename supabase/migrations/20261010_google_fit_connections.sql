-- Server-only credentials. Browser roles have no table access.
create table if not exists public.google_fit_connections (
  user_id uuid primary key references auth.users(id) on delete cascade,
  refresh_token text not null,
  access_token text not null,
  expires_at bigint not null,
  updated_at timestamptz not null default now()
);
alter table public.google_fit_connections enable row level security;
revoke all on public.google_fit_connections from public, anon, authenticated;
grant select, insert, update, delete on public.google_fit_connections to service_role;

create extension if not exists pgcrypto;

create table if not exists public.platform_connections (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  platform text not null,
  platform_account_id text,
  username text,
  access_token_encrypted text,
  refresh_token_encrypted text,
  token_expires_at timestamptz,
  scopes jsonb default '[]'::jsonb,
  status text not null default 'disconnected',
  last_error text,
  metadata jsonb default '{}'::jsonb,
  connected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, platform)
);

create table if not exists public.video_publications (
  id uuid primary key default gen_random_uuid(),
  video_id text not null,
  user_id text not null,
  platform text not null,
  remote_post_id text,
  published_url text,
  status text not null default 'pending',
  title text,
  description text,
  tags jsonb default '[]'::jsonb,
  published_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.platform_metrics_snapshots (
  id uuid primary key default gen_random_uuid(),
  publication_id uuid not null references public.video_publications(id) on delete cascade,
  views integer not null default 0,
  likes integer not null default 0,
  comments integer not null default 0,
  shares integer not null default 0,
  engagement_rate numeric(8,2) not null default 0,
  raw_payload jsonb default '{}'::jsonb,
  synced_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists platform_connections_set_updated_at on public.platform_connections;
create trigger platform_connections_set_updated_at
before update on public.platform_connections
for each row execute procedure public.set_updated_at();

drop trigger if exists video_publications_set_updated_at on public.video_publications;
create trigger video_publications_set_updated_at
before update on public.video_publications
for each row execute procedure public.set_updated_at();

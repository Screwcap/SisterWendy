-- ============================================================================
-- DTTAU — "Deck" beacon telemetry migration (PORTFOLIO, PII-FREE)
-- ============================================================================
-- Paste-run in the DTTAU Supabase SQL editor. Additive + idempotent.
--
-- This table is deliberately SEPARATE from behavioral_events. It carries NO
-- user_id, no names, no free text — only a random per-browser session id, an
-- event name, an optional numeric value, and low-cardinality tags. It exists so
-- the Screwcap "Deck" can read portfolio aggregates without ever touching the
-- privacy-sensitive behavioral engine, and so DTTAU stays independently sellable
-- (the whole subsystem is these two files + one table).
-- ============================================================================

create table if not exists public.deck_events (
  id         bigint generated always as identity primary key,
  title      text not null,                 -- property slug, e.g. 'dttau'
  sid        text not null,                 -- anonymous per-browser session id
  event      text not null,                 -- 'session' | 'trip_logged' | 'revenue' | ...
  value      numeric,                        -- optional numeric (e.g. revenue amount)
  meta       jsonb,                          -- low-cardinality tags only
  mode       text not null default 'live',   -- 'live' | 'demo'
  created_at timestamptz not null default now()
);

create index if not exists idx_deck_events_time  on public.deck_events(created_at desc);
create index if not exists idx_deck_events_title on public.deck_events(title, created_at desc);
create index if not exists idx_deck_events_sid   on public.deck_events(sid);

-- RLS on, with NO client policies at all → the anon/browser key can neither read
-- nor write this table directly. Writes come only from api/deck-collect.js and
-- reads only from api/deck-summary.js, both using the service-role key.
alter table public.deck_events enable row level security;

-- Aggregate views (service-role reads these; they expose counts, never a person).
create or replace view public.deck_daily_sessions as
  select title, date_trunc('day', created_at) as day, count(distinct sid) as sessions
  from public.deck_events where mode = 'live'
  group by title, day;

create or replace view public.deck_event_counts as
  select title, event, count(*) as n
  from public.deck_events where mode = 'live'
  group by title, event;

-- Done! ✦  Next: set nothing new — deck-collect/deck-summary reuse the existing
-- SUPABASE_SERVICE_ROLE_KEY and ADMIN_TOKEN envs already in Vercel.

-- Origen Cupping — initial schema
--
-- All tables live in a dedicated `cupping` schema to avoid colliding with the
-- shared `small-apps` Supabase project (which already has public.sessions,
-- public.participants, etc.).
--
-- Five operational tables (PRODUCT.md "Data model") + five reference tables
-- backed by the JSON in seed/. Reference tables use a single jsonb `data`
-- column so the SCA/WCR lexicon can evolve without a migration each time.
--
-- RLS: enabled on every table with permissive anon policies for v1
-- (single-user, no-auth — see PRODUCT.md). Tighten when auth lands in Phase 2.

create extension if not exists "pgcrypto";
create schema if not exists cupping;

-- ──────────────────────────────────────────────────────────────────────────
-- Operational tables
-- ──────────────────────────────────────────────────────────────────────────

create table if not exists cupping.producers (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  finca           text,
  vereda          text,
  municipio       text,
  departamento    text,
  fnc_member_id   text,
  gps_lat         double precision,
  gps_lon         double precision,
  notes           text,
  created_at      timestamptz not null default now()
);

create table if not exists cupping.coffees (
  id              uuid primary key default gen_random_uuid(),
  producer_id     uuid not null references cupping.producers(id) on delete cascade,
  variety         text,
  process         text,
  harvest_year    integer,
  altitude_min    integer,
  altitude_max    integer,
  notes           text,
  created_at      timestamptz not null default now()
);
create index if not exists coffees_producer_id_idx on cupping.coffees(producer_id);

create table if not exists cupping.samples (
  id              uuid primary key default gen_random_uuid(),
  coffee_id       uuid not null references cupping.coffees(id) on delete cascade,
  lot_code        text,
  roast_level     text,
  roasted_on      date,
  notes           text,
  created_at      timestamptz not null default now()
);
create index if not exists samples_coffee_id_idx on cupping.samples(coffee_id);

create table if not exists cupping.sessions (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  location        text,
  lang            text not null default 'es' check (lang in ('es','en')),
  started_at      timestamptz not null default now(),
  cuppers         jsonb not null default '[]'::jsonb,
  created_at      timestamptz not null default now()
);

create table if not exists cupping.evaluations (
  id                uuid primary key default gen_random_uuid(),
  session_id        uuid not null references cupping.sessions(id) on delete cascade,
  sample_id         uuid not null references cupping.samples(id) on delete cascade,
  cupper_initials   text not null,
  descriptive       jsonb,
  affective         jsonb,
  score             double precision,
  created_at        timestamptz not null default now()
);
create index if not exists evaluations_session_id_idx on cupping.evaluations(session_id);
create index if not exists evaluations_sample_id_idx  on cupping.evaluations(sample_id);

-- ──────────────────────────────────────────────────────────────────────────
-- Reference tables (sourced from seed/*.json — see scripts/seed.ts)
-- ──────────────────────────────────────────────────────────────────────────

create table if not exists cupping.lexicon_attributes (
  attribute_id  text primary key,
  data          jsonb not null,
  updated_at    timestamptz not null default now()
);

create table if not exists cupping.regions (
  id           text primary key,
  zone_id      text not null,
  data         jsonb not null,
  updated_at   timestamptz not null default now()
);
create index if not exists regions_zone_id_idx on cupping.regions(zone_id);

create table if not exists cupping.varieties (
  id           text primary key,
  data         jsonb not null,
  updated_at   timestamptz not null default now()
);

create table if not exists cupping.processes (
  id           text primary key,
  data         jsonb not null,
  updated_at   timestamptz not null default now()
);

create table if not exists cupping.origen_descriptors (
  id           text primary key,
  data         jsonb not null,
  updated_at   timestamptz not null default now()
);

-- ──────────────────────────────────────────────────────────────────────────
-- Row Level Security (v1 — single-user, no-auth, fully permissive)
-- ──────────────────────────────────────────────────────────────────────────

alter table cupping.producers          enable row level security;
alter table cupping.coffees            enable row level security;
alter table cupping.samples            enable row level security;
alter table cupping.sessions           enable row level security;
alter table cupping.evaluations        enable row level security;
alter table cupping.lexicon_attributes enable row level security;
alter table cupping.regions            enable row level security;
alter table cupping.varieties          enable row level security;
alter table cupping.processes          enable row level security;
alter table cupping.origen_descriptors enable row level security;

-- Permissive policies: anon role can do anything in v1. Tighten when adding
-- auth in Phase 2 (replace each policy with one keyed off auth.uid()).
do $$
declare
  t text;
begin
  foreach t in array array[
    'producers','coffees','samples','sessions','evaluations',
    'lexicon_attributes','regions','varieties','processes','origen_descriptors'
  ]
  loop
    execute format(
      'create policy %I on cupping.%I for all to anon, authenticated using (true) with check (true);',
      t || '_anon_all', t
    );
  end loop;
end$$;

-- Expose the cupping schema to PostgREST so supabase-js can query it.
grant usage on schema cupping to anon, authenticated;
grant all on all tables in schema cupping to anon, authenticated;
grant all on all sequences in schema cupping to anon, authenticated;
alter default privileges in schema cupping
  grant all on tables to anon, authenticated;

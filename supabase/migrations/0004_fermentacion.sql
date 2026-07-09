-- Fermentación (CFF-005) — offline-first field module
--
-- Digitizes THE COFFEE FIVE's paper "Formato Control de Fermentación" sheet:
-- a header (finca + fecha) with many timestamped readings. This is a new
-- top-level feature, independent of cupping sessions/samples.
--
-- Written for offline-first sync: `id` is client-generated (crypto.randomUUID)
-- so writes are idempotent under `upsert(onConflict:'id')`, and `updated_at`
-- is *client-managed* (sent in every upsert) to drive last-write-wins
-- reconciliation. Deliberately NO updated_at trigger — a now() trigger would
-- clobber the client timestamp on push and break LWW.

create table if not exists cupping.fermentation_sessions (
  id          uuid primary key default gen_random_uuid(),
  finca       text not null,
  fecha       date not null,
  created_by  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists cupping.fermentation_readings (
  id                    uuid primary key default gen_random_uuid(),
  session_id            uuid not null
                          references cupping.fermentation_sessions(id) on delete cascade,
  lote                  text,
  fecha                 date,
  hora                  time,
  temperatura_ambiente  numeric,
  temperatura_masa      numeric,
  brix                  numeric,
  ph                    numeric,
  ec                    numeric,
  notas                 text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists fermentation_readings_session_idx
  on cupping.fermentation_readings (session_id);

-- ──────────────────────────────────────────────────────────────────────────
-- Row Level Security (v1 — single-user, no-auth, fully permissive), mirroring
-- 0001_init.sql. Tighten alongside the rest of the schema when auth lands.
-- ──────────────────────────────────────────────────────────────────────────

alter table cupping.fermentation_sessions enable row level security;
alter table cupping.fermentation_readings enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array['fermentation_sessions','fermentation_readings']
  loop
    execute format(
      'create policy %I on cupping.%I for all to anon, authenticated using (true) with check (true);',
      t || '_anon_all', t
    );
  end loop;
end$$;

-- Re-issue grants so the new tables are visible to PostgREST regardless of
-- default-privilege ownership from earlier migrations.
grant usage on schema cupping to anon, authenticated;
grant all on all tables in schema cupping to anon, authenticated;
grant all on all sequences in schema cupping to anon, authenticated;
alter default privileges in schema cupping
  grant all on tables to anon, authenticated;

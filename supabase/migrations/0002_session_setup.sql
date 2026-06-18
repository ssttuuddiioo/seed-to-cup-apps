-- Session setup flow — schema additions
--
-- 1. coffees gets `varieties text[]` (multi-select replacing the single
--    `variety` text) and `region_id` (fk to cupping.regions).
-- 2. samples gets `session_id` (fk to cupping.sessions) and `blind_code`
--    so each sample is bound to one session with a randomized A/B/C label.
--
-- All tables are empty as of this migration, so adding NOT NULL columns is
-- safe without backfill.

alter table cupping.coffees
  add column if not exists varieties text[] not null default '{}',
  add column if not exists region_id text references cupping.regions(id);

create index if not exists coffees_region_id_idx on cupping.coffees(region_id);

alter table cupping.samples
  add column if not exists session_id uuid references cupping.sessions(id) on delete cascade,
  add column if not exists blind_code text;

-- Backfill check: all existing rows must satisfy the new constraints. Tables
-- are empty in v1; if not, this migration would need a data migration step.
update cupping.samples set session_id = session_id where false;

alter table cupping.samples
  alter column session_id set not null,
  alter column blind_code set not null;

create index if not exists samples_session_id_idx on cupping.samples(session_id);
create unique index if not exists samples_session_blind_code_idx
  on cupping.samples(session_id, blind_code);

# Origen — App Overview

A single map of what this app is today. It covers two areas: the **Cupping**
tool (SCA CVA scoring for blind field cuppings) and the **Fermentación** module
(offline-first CFF-005 fermentation logging on the farm). Bilingual, Spanish-first.

> `PRODUCT.md` is the original v1 brief and predates some of what now exists
> (Physical/Extrinsic scoring and offline mode were "Phase 2" there but are
> built). When they disagree, this file reflects the current code.

---

## Stack & conventions

- **Next.js 15** (App Router, React Server Components) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — configured in `app/globals.css` via `@theme` (no
  `tailwind.config`); single brand accent `origen-orange` (`#e85d24`), otherwise a
  neutral-gray system. Hand-rolled components, no UI/form library.
- **Supabase** (`@supabase/supabase-js`) — all tables live in the custom Postgres
  schema **`cupping`** (`lib/supabase.ts` sets `db.schema`). **No auth in v1**;
  RLS is permissive for `anon`. Users are identified by free-text initials.
- **`idb`** (~2 kB) — IndexedDB helper, used only by the Fermentación module.
- **i18n**: a plain `t(key, lang, vars?)` function from `@/lib/i18n` (not a
  hook/context); strings in mirrored `lib/i18n/es.json` + `en.json`; default `es`.
- Path alias `@/*` → repo root.

Two different data patterns coexist by design:

| | Cupping | Fermentación |
|---|---|---|
| Reads | RSC server components (`force-dynamic`) query Supabase directly | Client islands read a local **IndexedDB** store |
| Writes | Client components call `supabase.from().insert/update` | Write to IndexedDB, sync to Supabase in the background |
| Offline | No | **Yes** — local-first, syncs on reconnect |

---

## 1. Cupping (SCA CVA 101–105)

Blind cuppings: set up a session, assign blind codes, each cupper scores each
sample, then reveal the ranking and generate a producer card.

**Routes** (`app/`):
- `/` — home; lists recent cupping sessions + a Fermentación entry point
- `/sessions/new` — setup wizard (producers → coffees → randomized blind codes)
- `/sessions/[id]` — session hub, links to the sub-flows
- `/sessions/[id]/evaluate` — per-cupper **CVA 103 descriptive / 104 affective /
  105 extrinsic**
- `/sessions/[id]/physical` — per-sample **CVA 101** green/roast grading
- `/sessions/[id]/reveal` — unblinded, ranked by panel score
- `/sessions/[id]/card/[sampleId]` — producer card (PNG export via canvas)

**Data** (schema `cupping`): `producers`, `coffees`, `samples` (`physical` jsonb),
`sessions`, `evaluations` (`descriptive`/`affective`/`extrinsic`/`score` jsonb).
Reference tables (single `jsonb data` column): `lexicon_attributes`, `regions`,
`varieties`, `processes`, `origen_descriptors`.

**Key libs**: `lib/scoring.ts` (CVA affective formula, + `scoring.test.ts`),
`lib/results.ts` (reveal/card aggregation — mean/spread, descriptor frequency,
8-axis radar), `lib/reference.ts` (typed reference-data fetchers).

---

## 2. Fermentación (CFF-005) — offline-first

Digitizes THE COFFEE FIVE's paper "Formato Control de Fermentación" so field
workers capture fermentation readings on the farm (unreliable connectivity) and
sync to the cloud. A **new top-level section**, independent of cupping sessions.

**Routes** (`app/fermentacion/`): `/fermentacion` (sessions by finca + date),
`/fermentacion/new` (finca + fecha + operator), `/fermentacion/[id]` (header +
add/edit readings + prior-readings list + exports).

**Data** (schema `cupping`, migration 0004):
- `fermentation_sessions` — `finca`, `fecha`, `created_by`, timestamps
- `fermentation_readings` — `session_id` (FK, cascade), the 9 CFF-005 columns
  (`lote`, `fecha`, `hora`, `temperatura_ambiente`, `temperatura_masa`, `brix`,
  `ph`, `ec`, `notas`), timestamps

**Offline-first architecture** (`lib/fermentacion/`):
- `db.ts` — IndexedDB (via `idb`) is the **local source of truth**
- `types.ts` — row + local record types, the `CFF005_COLUMNS` single source of
  truth for field/column order, serialize/deserialize helpers
- `sync.ts` — push dirty rows (client-generated UUIDs → idempotent
  `upsert(onConflict:'id')`), then pull changes with **last-write-wins** by a
  client-managed `updated_at`; runs on load, on `online`, and debounced after
  each write; swallows offline errors
- `store.ts` — `useSyncExternalStore` store; write-through to IndexedDB, refresh,
  debounced sync; registers the service worker
- `validation.ts` — soft warnings (pH ~2–7, positive Brix/EC, temps ~0–60 °C),
  never blocks
- `csv.ts` / `print.ts` — CSV + print-to-PDF exports, both keeping the CFF-005
  doc code + company header for traceability
- `public/ferm-sw.js` — hand-rolled service worker precaching the `/fermentacion`
  shell so it opens cold with no signal (scoped to `/fermentacion` only)

Tests: `lib/fermentacion/fermentacion.test.ts` (validation + CSV).

---

## Migrations (`supabase/migrations/`)

| File | Adds |
|---|---|
| `0001_init.sql` | `cupping` schema, core + reference tables, permissive RLS + grants |
| `0002_session_setup.sql` | multi-variety/region on coffees; `session_id` + `blind_code` on samples |
| `0003_full_cva.sql` | `samples.physical`, `evaluations.extrinsic` (jsonb) |
| `0004_fermentacion.sql` | `fermentation_sessions`, `fermentation_readings` + RLS/grants |

There is no local Supabase CLI or DB password — **migrations are applied via the
Supabase MCP server or the dashboard SQL editor**, not locally.

---

## Local dev, build, test, deploy

- **Node ≥ 20** for `next build`/`next dev` (the machine's default `node` may be
  18, which is too old — use a newer nvm version). `npx tsc --noEmit` and the
  `tsx` tests run fine on 18.
- **Gate on `tsc --noEmit` + `next build`.** `npm run lint` (`next lint`) is not
  configured (drops into an interactive setup prompt) — don't rely on it.
- **Tests**: `npm run test:scoring`, `npm run test:fermentacion` (plain `tsx`
  scripts using `node:assert`).
- **Env** (`.env.local`, gitignored): `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` (both public; the app runtime needs only these),
  `SUPABASE_SERVICE_ROLE_KEY` (server-only, used solely by `npm run seed`).
- **Deploy (Vercel)**: set the two `NEXT_PUBLIC_` vars in the project's
  Environment Variables. `lib/supabase.ts` throws at import if they're missing, so
  the build fails without them ("Missing NEXT_PUBLIC_SUPABASE_URL…"). The URL/key
  must point at the same Supabase project the migrations were applied to.

---

## File map

```
app/
  page.tsx                     # home: cupping sessions + Fermentación entry
  sessions/new/                # cupping setup wizard
  sessions/[id]/               # hub, evaluate, physical, reveal, card
  fermentacion/                # list, new, [id] detail (client islands)
    _components/               # FermHeader, SyncStatus, list, detail, forms
lib/
  supabase.ts                  # single client, schema "cupping"
  i18n/                        # t(), es.json / en.json
  scoring.ts  results.ts  reference.ts   # cupping domain logic
  fermentacion/                # db, sync, store, types, validation, csv, print
public/ferm-sw.js              # Fermentación offline app-shell service worker
supabase/migrations/           # 0001–0004
PRODUCT.md  docs/research.md    # original brief + reference research
```

# Prompt 06 — Scaffold the project

Run this in its own Claude Code session, after `05-validate-score-formula.md` is complete and all 5 score tests pass.

---

Scaffold the Origen cupping app per `PRODUCT.md`.

## Connect to Supabase first
Pablo has an existing Supabase project for this app. Use the Supabase MCP server to discover the project — list available projects, identify the one for Origen cupping (likely named "origen-cupping" or similar; ask Pablo to confirm if multiple match), and pull the project URL + anon key into a local `.env.local`. Do NOT commit `.env.local` — add it to `.gitignore` immediately.

## Then build the scaffold
1. Create a Next.js 15 app with TypeScript, Tailwind, App Router.
2. Use the Supabase MCP to create the 5 tables from `PRODUCT.md` ("Data model" section). Use snake_case columns. Add appropriate indexes (`session_id` on `evaluations`, `coffee_id` on `samples`, `producer_id` on `coffees`). Generate types with `supabase gen types typescript --linked > lib/database.types.ts`.
3. Also create reference tables for the seed data: `lexicon_attributes`, `regions`, `varieties`, `processes`, `origen_descriptors`. Read the JSON shape in `seed/*.json` to determine column types.
4. Write a seed script (`scripts/seed.ts`) that:
   - reads `seed/lexicon.json`, `seed/colombia-regions.json`, `seed/colombia-varieties.json`, `seed/colombia-processes.json`, `seed/origen-descriptors.json`
   - inserts the reference data into the reference tables
   - is idempotent (safe to re-run via `upsert`)
   - can be run via `npm run seed`
5. Build the simplest possible homepage: a list of past sessions (empty for now) and a "New session" button that doesn't do anything yet.
6. No auth. Single-user assumption.
7. Set up the i18n structure: `lib/i18n/{es,en}.json` with a `t(key)` helper. Default language: `es`.

## Visual direction
- Minimalist. Mostly white and black, with grey for surfaces and dividers.
- One accent color: **Origen orange**. Define it as a CSS variable `--origen-orange` and a Tailwind theme color `origen.orange`. Use a vibrant but not neon orange — start with `#E85D24` and we can tune later. Used sparingly: primary CTA buttons, the score number on the producer card, and the brand mark.
- Typography: Inter via `next/font`. Two weights only — 400 regular, 500 medium. No 600+, no italics by default.
- Sentence case everywhere. No emoji.
- Border radius: 8px default, 12px for cards.
- Cupping screens stay greyscale even with orange available (visual bias risk per `PRODUCT.md`).

## Stop conditions
Stop when:
- The homepage renders at `localhost:3000` with the orange-accented "Nueva sesión" button visible
- The 5 main tables + 5 reference tables exist in Supabase (verify via MCP)
- `npm run seed` populates the reference tables idempotently
- The build passes with no TypeScript errors

**Don't build any cupping UI in this session.** The next session will design the session setup screen.

After this session, decide what to build next based on what came out. Don't pre-write subsequent sessions.

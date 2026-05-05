# Origen Cupping

A bilingual (ES/EN) coffee cupping app for small specialty businesses, built around the SCA's Coffee Value Assessment (CVA) protocol. The primary use case is field cupping with Colombian producers — pass-the-tablet sessions where producer and cupper share the form.

## Who it's for
- **Primary:** Pablo (Origen) and Colombian producers like Oscar Castro at Finca Bellavista, Charalá, Santander. Field cupping, on-farm.
- **Secondary:** Small roasters and baristas entering quality control who want CVA without the Cropster/Tastify cost or complexity.

## What it is
A tablet-first web app (Next.js + Supabase + Tailwind) that implements CVA Descriptive (SCA 103) and CVA Affective (SCA 104) with the full 110-attribute WCR Sensory Lexicon, plus a Colombia-first traceability layer (department, vereda, variety, process, FNC grade) and a Spanish-Colombia descriptor extension (panela, mora, lulo, etc.).

## What it is not (yet)
- Not native iOS/Android — PWA only for v1.
- Not offline-first in v1 — but offline is a known Phase 2 priority for field cupping in Colombia. Build the data layer with this in mind (avoid assumptions that will fight an offline retrofit).
- Not a learning platform — the "Aprende a catar" track is Phase 2.
- Not a Cropster replacement — no inventory/roasting integration in v1.

## MVP scope (v1, 6 weeks)
1. **Session setup** — name the visit, add 1–8 coffees with optional lot info, generate blind codes (A/B/C…), pick ES/EN, add cuppers as initials.
2. **Descriptive form (CVA 103)** per cup — intensity sliders (0–15) for fragrance/aroma, flavor/aftertaste, acidity, sweetness, mouthfeel; CATA chips nested under SCA categories; up to 5 olfactory descriptors per box, up to 2 main tastes, up to 2 mouthfeel descriptors.
3. **Affective form (CVA 104)** per cup — 9-point hedonic per category, uniformity, defects. Locked behind descriptive completion to prevent backwards scoring.
4. **Score calculator** — SCA Affective formula, validated against sca.coffee/cuppingscore.
5. **Reveal screen** — unblind codes, show panel mean and spread across cuppers.
6. **Producer card** — bilingual one-pager per coffee with score, radar chart, top descriptors. Exportable as PNG for WhatsApp.
7. **Session history** — list of past sessions, tap into a coffee to see its profile.

## Data model
Five tables. Producers → Coffees → Samples; Sessions → Evaluations ← Samples. See `docs/research.md` §1.5 and the ERD in `docs/data-model.md` (Session 1 will create this).

- `producers` — name, finca, vereda, municipio, departamento, FNC member ID, GPS optional
- `coffees` — producer_id, variety, process, harvest_year, altitude
- `samples` — coffee_id, lot_code, roast_level, roasted_on
- `sessions` — title, location, lang, started_at, cuppers (jsonb array of initials)
- `evaluations` — session_id, sample_id, cupper_initials, descriptive (jsonb), affective (jsonb), score float

The `descriptive` and `affective` blobs are jsonb because the SCA updates the lexicon and form periodically — we don't want a schema migration each time.

## Content model
Reference data lives in `seed/`:
- `seed/lexicon.json` — 110 WCR attributes with EN/ES labels, definitions, references, CATA paths
- `seed/colombia-regions.json` — 18 departments grouped into 4 zones, with PDO badges
- `seed/colombia-varieties.json` — 12+ varieties with cup profiles and parentage
- `seed/colombia-processes.json` — washing, honey, natural, anaeróbico, choque térmico, co-fermentación, etc.
- `seed/origen-descriptors.json` — Spanish-Colombia descriptor extension (panela, mora, lulo, guanábana, bocadillo, mortiño, curuba, tabaco rubio, almíbar, miel de caña), each linked to a parent SCA CATA category

The full source for all of the above is `docs/research.md`.

## Design principles
- **Spanish-first** — default language is ES, EN is the toggle. The producer reads the form too.
- **Bilingual everywhere** — every label, every CATA chip, every descriptor has both languages.
- **Sentence case, no emoji, calm typography.** This is a professional tool, not a consumer app.
- **Pass-the-tablet** — UI works for one device shared between 2–4 cuppers. No accounts; cuppers identified by initials.
- **Descriptive before affective, always.** The form blocks affective input until descriptive is complete. This is the protocol.
- **No visual bias.** Greyscale UI for the cupping screens. Cup names hidden during evaluation, revealed only at the end.

## Visual direction
- **Minimalist.** Mostly white and black, with grey for surfaces and dividers.
- **One accent color: Origen orange.** Used sparingly — primary CTAs, the score number on the producer card, and the brand mark. Nowhere else in v1.
- **Typography:** neutral sans-serif (Inter or similar via `next/font`). Two weights only — 400 regular, 500 medium.
- **Cupping screens stay greyscale** even with the orange accent — the orange appears in setup, history, and the producer card, but not on the form itself (visual bias risk).

## Stack
- Next.js (App Router) + TypeScript
- Tailwind for styling
- Supabase for Postgres (project already exists; Claude Code will discover it via MCP)
- No auth in v1 (single user, Pablo); add Supabase auth in Phase 2
- Deployed on Vercel (default `.vercel.app` URL for v1; custom domain later)

## Out of scope for v1
- Offline mode (Phase 2)
- Inventory / Toditox integration (Phase 3)
- Multi-tenant / accounts for other businesses (Phase 3)
- CVA 101 Physical and CVA 105 Extrinsic (Phase 2)
- COE form export (Phase 2)
- Learning track (separate product, Phase 2)
- Camera / OCR / sensor integration (Phase 3)

## Validation criteria for "done"
- The Affective score calculator agrees with sca.coffee/cuppingscore to within 0.1 on 5 hand-entered test cases.
- Pablo can run a real cupping of 3 coffees, with 2 cuppers, on an iPad in a Brooklyn kitchen, end-to-end, in under 30 minutes.
- The producer card renders identically when viewed on a phone screen.
- Spanish strings come from the SCA's official Spanish CVA materials, not machine translation, except where noted in `docs/research.md` §1.3.

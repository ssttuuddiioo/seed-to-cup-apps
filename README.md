# Origen Cupping — handoff package

Drop the contents of this folder at the root of a fresh git repo, then work through the prompts in order.

## File layout

```
PRODUCT.md                        # The brief. Claude Code reads this first every session.
docs/
  research.md                     # The full 30k-word research doc. Reference, not action.
prompts/
  01-extract-lexicon.md           # Extract the 110-attribute WCR lexicon to JSON
  02-extract-colombia-regions.md  # Extract the 23 producing departments to JSON
  03-extract-varieties-processes.md  # Extract varieties + processes to JSON
  04-extract-origen-descriptors.md   # Extract the Spanish-Colombia descriptor pack
  05-validate-score-formula.md    # Validate SCA Affective score math BEFORE any UI
  06-scaffold-project.md          # Scaffold Next.js + Supabase + seed
README.md                         # This file
```

## Order of operations

### 1. Locked-in decisions

These are confirmed and reflected in `PRODUCT.md` and `prompts/06`:

- **Stack:** Next.js 15 (App Router) + TypeScript + Tailwind + Supabase
- **Auth:** none for v1 (single user, Pablo). Phase 2 if/when shared.
- **Offline:** skip for v1, build for it in Phase 2. Field cupping in Colombia is the eventual use case — keep the data layer offline-friendly so retrofit doesn't fight the architecture.
- **Hosting:** Vercel default `.vercel.app` URL for v1. Custom domain (origencoffee.co subdomain) later.
- **Supabase project:** already exists. Claude Code uses the Supabase MCP to discover it in `prompts/06`.
- **Brand:** minimalist white/black/grey + Origen orange (`#E85D24` placeholder, tune later) as the single accent. Inter typeface, 400/500 only, sentence case, no emoji.

If any of these change, edit `PRODUCT.md` before starting.

### 2. Spend 20 minutes at sca.coffee/cuppingscore

Enter scores yourself, get a feel for the math, the thresholds, the inputs. The whole app's credibility rests on this being right.

### 3. Run the four extraction prompts (one Claude Code session each)

In order: `prompts/01` → `prompts/02` → `prompts/03` → `prompts/04`.

Each one produces a JSON file in `seed/`. Verify each by eye before running the next. These are deterministic, small, and easy to audit.

### 4. Validate the score formula

Run `prompts/05-validate-score-formula.md`. Do not start UI work until all 5 hand-entered test cases agree with sca.coffee/cuppingscore to within 0.1.

### 5. Scaffold the project

Run `prompts/06-scaffold-project.md`. This sets up Next.js, Supabase, the 5 tables, the seed script, and a placeholder homepage.

### 6. Then build session by session

Don't pre-write the next sessions. After each one, decide what's needed next based on what came out. Rough order:

- Session setup + sample list screens
- Descriptive form (the hard one — CATA chips, intensity sliders, bilingual toggle)
- Affective form, gated behind descriptive completion
- Reveal screen + panel aggregation
- Producer card generator (PNG export for WhatsApp)
- History list + simple dashboard

Each session: paste `PRODUCT.md` + the relevant section of `docs/research.md` + a focused task prompt. Don't paste the whole research doc.

## Notes

- The research doc is reference material. Claude Code should read sections of it on demand, not absorb all of it at once.
- The 110-attribute lexicon must be exactly 110 entries. Verify the count after extraction.
- The Spanish strings in the research are validated working translations, but for public release the official SCA Spanish strings should be sourced from the SCA-103-S/2024 standard. See `docs/research.md` §1.2 and caveat #1.
- Pink Bourbon is not actually a Bourbon. The variety library should flag this. See caveat #9.

# Prompt 01 — Extract the WCR lexicon to JSON

Run this in its own Claude Code session.

---

You're working in this repo. Read `docs/research.md` and produce `seed/lexicon.json`.

**Source:** section 1.3 of `docs/research.md` ("The structured lexicon (≈110 attributes)").
**Schema:** section 1.5 of the same doc.

Each entry must have:
- `attribute_id` (lowercase, snake_case, e.g. `"blueberry"`, `"sour_aromatics"`)
- `section`: array of which CVA 103 sections it applies to. Use these exact strings: `"fragrance_aroma"`, `"flavor_aftertaste"`, `"main_tastes"`, `"mouthfeel"`
- `cata_path`: array representing the CATA hierarchy. Examples:
    - Blueberry → `["fruity", "berry"]`
    - Jasmine → `["floral"]`
    - Smooth → `["mouthfeel"]`
    - Sweet (taste) → `["main_tastes"]`
- `labels`: `{ en, es }` — use the exact strings from the markdown table
- `definitions`: `{ en, es }` — same
- `references`: array of `{ name_en, name_es, source }` where `source` is `"WCR_v1"`, `"WCR_v2_FlavorActiV"`, `"SCA_103_2024"`, or `"Le_Nez_du_Cafe"`
- `co_local_reference`: optional object with `{ name_es, notes }` for Andean equivalents (e.g. mortiño for blueberry)

**Validation rules:**
- Must produce exactly 110 entries (109 from the WCR lexicon + umami).
- Every entry must have at least one reference.
- Spanish strings must be lowercase except for proper nouns.
- Output strictly valid JSON. Pretty-print with 2-space indent.

Do not invent attributes that are not in the source markdown. Do not paraphrase definitions — copy them as written. If a row is ambiguous, leave a TODO comment in a sibling file (`notes/lexicon-todos.md`) and continue.

After generating, run a count: print the number of entries grouped by `cata_path[0]`. The expected groups are: floral (5), fruity (~22), sour_fermented (~12), green_vegetative (11), other (~14), roasted (8), spice (7), nutty_cocoa (7), sweet (9), main_tastes (5), mouthfeel (5).

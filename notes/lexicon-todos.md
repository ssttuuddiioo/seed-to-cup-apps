# Lexicon extraction — open items

Notes from running `prompts/01-extract-lexicon.md` against `docs/research.md` §1.3 / §1.5, plus follow-up corrections applied during the same session.

## Total count: 110 ✓

After applying the two corrections below, `seed/lexicon.json` now contains exactly 110 entries, matching the prompt's validation rule.

## Resolved: Tobacco and Cereal moved to top-level CATA buckets

Originally extracted as nested under Roasted (because `docs/research.md` §1.3 uses `Roasted → Tobacco` and `Roasted → Cereal`). Pablo confirmed the `→` notation in the doc is a visual organizer, not a strict hierarchy — on the actual SCA CVA 103 form, Tobacco and Cereal are sibling top-level CATA buckets alongside Roasted.

Updated `cata_path`:
- `tobacco`, `pipe_tobacco` → `["tobacco"]`
- `grain`, `malt` → `["cereal"]`

New top-level groups: `tobacco` (2), `cereal` (2). Roasted now correctly = 8.

## Resolved: Amplitude attributes added as glossary entries

The 4 WCR Amplitude attributes (Overall Impact, Blended, Longevity, Body/Fullness) were not in the original extraction because §1.3 line 244 explicitly says they are *not* CVA 103 CATA boxes. Pablo confirmed they should be kept as glossary entries (per the same line, "Concepts → Amplitude") for experienced/Q-Grader users.

Each is modelled with `section: ["amplitude"]` and `cata_path: ["amplitude"]`. They will not appear in the CATA UI; they live in a separate Concepts/Glossary view.

**Spanish translations are working coffee-trade Spanish, not SCA-official.** `docs/research.md` does not provide Spanish strings for these (only English names appear at line 244). Translations used:

| EN | ES (working) |
|---|---|
| Overall Impact | impacto general |
| Blended | integrado |
| Longevity | persistencia |
| Body / Fullness | cuerpo / plenitud |

The English definitions are reasonable paraphrases of the WCR Amplitude concept set — they are **not copied verbatim from the WCR Sensory Lexicon** because `docs/research.md` does not include the verbatim definitions for these four attributes. Both EN and ES strings here should be replaced with the canonical WCR Lexicon Edition 1/2 text once the source PDF is available, and verified against the SCA Spanish materials before ship.

`body_fullness` carries an explicit note in its definition that it is the legacy WCR amplitude attribute, distinct from the CVA 103 mouthfeel CATA category, to prevent UI confusion.

References for the Amplitude entries are placeholder strings — the WCR Lexicon does not specify aroma/taste reference solutions for these holistic attributes (they're combined-impression measures, not single-aroma standards).

## Group-count discrepancy: sour_fermented = 11, prompt expected ~12

The prompt allowed `~12` for sour_fermented; actual is 11 (6 sour + 5 alcohol/fermented). The §1.3 audit at line 248 says "Sour 7" but the table only has 6 rows (Sour Aromatics, Acetic Acid, Butyric Acid, Isovaleric Acid, Citric Acid, Malic Acid). Treating this as a counting error in the audit rather than a missing attribute.

## Spanish strings

- I lowercased Spanish **labels** per the validation rule ("Spanish strings must be lowercase except for proper nouns"), even where the §1.3 markdown has them in title case (e.g., source says "Té negro", JSON says "té negro").
- I left Spanish **definitions** in sentence case (capital first letter), since they are full sentences, not labels. If the rule was meant to apply to definitions too, do a single pass to lowercase the leading letter of every `definitions.es`.
- Reference `name_es` values are populated everywhere but are working translations, not authoritative SCA Spanish. Branded products (Welch's, Lipton, McCormick, Le Nez du Café, etc.) are kept in their original form because they are proper nouns. PRODUCT.md §"Validation criteria for done" requires SCA-official Spanish, not machine translation — so reference and label Spanish should be reviewed against the SCA Spanish CVA 103 standard and the Spanish flavor wheel poster before shipping (this is also flagged in research.md §1.4 line 251).

## `co_local_reference` coverage

Per the prompt, this field is optional. I populated only the entries the doc explicitly hands us:

- `blueberry` → mortiño (`docs/research.md` §1.5 example, line 275)
- `blackberry` → mora de Castilla (the Spanish label "mora" is the Colombia-local descriptor by default; added a note to match)

Other Andean equivalents (lulo for citrus, panela for caramelised, guanábana, curuba, mortiño elsewhere, etc.) live in §2.8's "Origen / Colombia descriptor extension". The prompt explicitly told me not to read §2.8 in this session. Prompt 02+ should populate `co_local_reference` from `seed/origen-descriptors.json` once that exists, or denormalize the Origen extension into the matching parent SCA attributes here.

## Other notes

- **`brown_roast`** id chosen for "Brown, Roast" (the comma in the source label is unusual; snake_cased as a single id).
- **`hazelnut`** id chosen for "Hazelnut / Filbert" (kept the slash in the EN label string).
- **`overripe`** id chosen for "Overripe / Near-fermented" (kept the slash in the label).
- **Section A entries** all carry `section: ["fragrance_aroma", "flavor_aftertaste"]` because §1.3 line 41 states the same olfactory CATA list is used for both boxes per CVA 103 §6.3.1–6.3.2.
- **`source` values used:** `WCR_v1`, `Le_Nez_du_Cafe`, `SCA_103_2024`. `WCR_v2_FlavorActiV` is in the prompt's allowed list but is not used yet — §1.4 says Edition 2 / FlavorActiV references should be added later as a second reference per attribute. Tracked here as a follow-up.
- **Allowed `section` values now include `"amplitude"`** in addition to the four CVA 103 sections listed in the prompt (`fragrance_aroma`, `flavor_aftertaste`, `main_tastes`, `mouthfeel`). This was a deliberate extension to model the WCR Amplitude glossary entries; the prompt's allowed-values list should be updated to match if a verifier script is created.

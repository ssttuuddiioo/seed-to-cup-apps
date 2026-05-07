# SCA Affective Score — formula validation notes

Source: **SCA Standard 104-2024 Coffee Value Assessment: Affective Assessment**, §5.5 (formula) and §7.1 (two-way lookup table).

## The formula (verbatim from §5.5)

> S = 0.65625 · Σ hᵢ + 52.75 − 2u − 4d   (i = 1..8, rounded to the nearest 0.25 points)

- `S` — cupping score prior to rounding
- `hᵢ` — the 9-point score of each affective section, **i = 1 (fragrance) … i = 8 (overall)**
- `u` — number of non-uniform cups (out of 5)
- `d` — number of defective cups (out of 5)

Rounding to the nearest 0.25 happens after all subtractions. The §7.1 table is the same formula evaluated for Σ ∈ [8, 72] with no deductions, then rounded; deductions of −2 and −4 (both multiples of 0.25) are applied integrally afterward, so the table-then-deduct workflow is mathematically identical to evaluate-then-round.

## Deviations from the prompt's signature

### 1. Fragrance and Aroma scored separately — eight sections, not seven

The prompt's TypeScript signature collapsed them into a single `fragrance_aroma: number` field (seven inputs total). The 2024 SCA Affective Form (§7.2) has **eight** distinct 9-point bubble rows: Fragrance, Aroma, Flavor, Aftertaste, Acidity, Sweetness, Mouthfeel, Overall. The summation index in the formula is explicit: `i = 1..8`.

**Resolution chosen:** the function signature exposes separate `fragrance` and `aroma` 1–9 inputs to match the §7.2 form and the §5.5 summation. Σ hᵢ is the literal eight-term sum. The prompt's mixed-case test ("`fragrance: 5, flavor: 6, aftertaste: 7, ...`") was missing an explicit aroma value; it is interpreted as `aroma = 5` to preserve the original Σh = 49 → 85.00 result.

**Implication for the UI:** expose two olfactory sliders (Fragrance and Aroma) in the cupping form, not one combined slider, to stay faithful to the §7.2 paper form.

### 2. The 2024 standard has no taint/fault distinction — all defective cups are −4

The prompt's signature carries `defect_intensity: 'taint' | 'fault' | null`. That distinction is from the **2004 SCA Cupping Protocol**, which is explicitly superseded by SCA 104-2024 (§1 Preface). Under CVA 104:

- Sensory defects are categorised by **type** (potato, moldy, phenolic — §5.4.1), not by **intensity** (taint vs fault).
- The deduction is a flat **−4 per defective cup** (§5.5), regardless of type.

**Resolution chosen:** kept the `defect_intensity` field in the input type for prompt fidelity, but the field is **ignored by the math**. The defect category (potato / moldy / phenolic) belongs in the evaluation record but does not enter the score. The test case "All 8s, 4 uniform, 1 taint" therefore produces the same score as "All 8s, 4 uniform, 1 fault" or "All 8s, 4 uniform, 1 phenolic": 88.75.

**Implication for the UI:** the defect-entry control should follow the 2024 form — three checkboxes (moldy, phenolic, potato) plus a 5-cup grid for "which cups are defective" — and not a taint/fault selector. Update the input type when the data model is finalised.

## Other interpretation calls

### Uniformity — input is uniform cups, but `u` in the formula is non-uniform cups

The prompt's signature uses `uniformity_cups: number; // 0-5 (count of uniform cups out of 5)`. The standard's `u` is the count of *non-uniform* cups. The function does the conversion internally as `u = TOTAL_CUPS − uniformity_cups` with `TOTAL_CUPS = 5`.

The 5-cup assumption matches §5.4.2 ("number of non-uniform cups (out of 5)") and the §7.2 form (5 boxes). If the cupping uses a different cup count in the future, the constant must change.

### Coherence between defective and non-uniform cups

§5.4.2 final paragraph: "all defective cups shall be also marked as non-uniform, with the sole exception of evenly defective coffees across all cups."

The current `computeAffectiveScore` does not enforce this coherence — it accepts any non-negative integer pair within bounds. This is correct for the math (the formula does not require coherence), but the UI should enforce it at form-entry time so the cupper cannot record `defective_cups = 2, uniformity_cups = 5` accidentally. The all-cups-defective edge case (e.g. `defective_cups = 5, uniformity_cups = 5`) is the documented exception and remains representable.

### Hedonic input range

The 9-point scale is 1..9 (§5.2, integers — Figure 1's rubric only labels integer points). The verifier rejects non-finite values and values outside [1, 9] but does not reject non-integer hedonic scores. This was a deliberate choice: the §5.5 formula is linear and well-defined for fractional inputs (the form's "FINAL" box at the end of each row would in principle allow a half-step), and forbidding fractions would be an opinion not stated in the standard.

### All-1s gives 57.34375 → rounds to 57.25, not 0

A common eyeball test for new users: "what does the lowest possible score look like?" The §7.1 table starts at A=8 → B=58.00, which is the minimum expressible sum (eight sections × 1) with no deductions. So a coffee that is "extremely low impression of quality" across the board, perfectly uniform, defect-free, scores 58. The CVA scale **does not bottom out at zero** — that asymmetry is intentional in the standard (the formula was designed so all-9s = 100 and all-5s = 79 — see §4.2 definition of cupping score) and should not be "fixed" by clamping or rescaling.

The all-5s anchor checks: 0.65625 · 40 + 52.75 = 78.75. The standard says "equals 79 when all sections score at 5"; the formula gives 78.75 which rounds to 78.75 (exact 0.25). The standard's "79" is an approximation in the prose definition — the §7.1 table at A=40 gives 79.00 (rounded). Use the formula, not the prose, as the source of truth: this is exactly the kind of one-decimal-place ambiguity the prompt warned about.

## Validation against sca.coffee/cuppingscore

The online calculator at sca.coffee/cuppingscore is the prompt's named source of truth. It is a JavaScript-rendered widget that does not expose its source over `WebFetch`/`WebSearch`. The expected values in `lib/scoring.test.ts` were instead derived from the §7.1 lookup table inside the same standard that defines the calculator. This is acceptable because §7.1 is *itself* the formula evaluated and rounded — the calculator can only differ from §7.1 if the calculator has a bug.

**Before shipping**, manually enter each of the 5 test cases at sca.coffee/cuppingscore in a browser and confirm the displayed score matches the test expectation. If any case differs by more than 0.1 from this implementation, the calculator's behavior is the tiebreaker per the prompt — log the discrepancy here and adjust the implementation to match.

## Test results

All 5 cases pass with Δ = 0.00 (exact match to the §7.1 table):

| Case | Σh | u | d | Expected | Actual | Δ |
|---|---|---|---|---|---|---|
| All 6s | 48 | 0 | 0 | 84.25 | 84.25 | 0 |
| All 7s | 56 | 0 | 0 | 89.50 | 89.50 | 0 |
| Mixed (5,5,6,7,6,7,7,6) | 49 | 0 | 0 | 85.00 | 85.00 | 0 |
| All 8s, 4 uniform, 1 taint | 64 | 1 | 1 | 88.75 | 88.75 | 0 |
| All 9s | 72 | 0 | 0 | 100.00 | 100.00 | 0 |

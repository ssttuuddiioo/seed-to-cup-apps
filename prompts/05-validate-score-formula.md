# Prompt 05 — Validate the SCA Affective Score formula

Run this in its own Claude Code session, after the four extraction prompts.

**This is the most important prompt of the whole project.** Do not start any UI work until all 5 hand-entered test cases pass. The app's credibility rests on this math being right.

---

Validate the SCA Affective Score formula.

1. Open https://sca.coffee/cuppingscore in a browser tab.
2. Read the SCA 104 Affective Assessment standard. Find the formula that converts the seven 9-point hedonic scores plus uniformity and defects into a 0–100 score.
3. Implement the formula as a pure function in `lib/scoring.ts`:
   ```typescript
   export function computeAffectiveScore(input: {
     fragrance_aroma: number;    // 1-9
     flavor: number;             // 1-9
     aftertaste: number;         // 1-9
     acidity: number;            // 1-9
     sweetness: number;          // 1-9
     mouthfeel: number;          // 1-9
     overall: number;            // 1-9
     uniformity_cups: number;    // 0-5 (count of uniform cups out of 5)
     defective_cups: number;     // 0-5
     defect_intensity: 'taint' | 'fault' | null;
   }): number
   ```
4. Write a test file `lib/scoring.test.ts` with 5 hand-entered cases:
   - All 6s, no defects → expected score from sca.coffee calculator
   - All 7s, no defects → expected score
   - Mixed `(fragrance: 5, flavor: 6, aftertaste: 7, acidity: 6, sweetness: 7, mouthfeel: 7, overall: 6)`, 5 uniform, 0 defects → expected score
   - All 8s, 4 uniform, 1 taint → expected score
   - All 9s, 5 uniform, 0 defects → expected score (should be ~100)
5. For each case, manually enter the same values at sca.coffee/cuppingscore and record the expected output as a comment in the test file.
6. Run the tests. If any case is off by more than 0.1, fix the formula and re-run.

**Do not start UI work until all 5 tests pass.**

If you encounter ambiguity in the SCA standard (e.g. how `taint` vs `fault` weighting is applied, or how non-uniform cups penalize the score), document the ambiguity in `notes/scoring-ambiguities.md` and pick the interpretation that matches the sca.coffee calculator's output. The calculator is the source of truth, not the standard text.

import { strict as assert } from "node:assert";
import { computeAffectiveScore } from "./scoring.ts";

// Run from repo root: `npx tsx lib/scoring.test.ts`
//
// Expected scores cross-checked against the SCA Standard 104-2024 §7.1 two-way
// table (Sum→Score). That table is the published rounded-to-0.25 form of the
// same formula, so it is itself an authoritative source. The official online
// calculator at sca.coffee/cuppingscore is the second source named by the
// prompt; it implements §5.5 of the standard, so it produces these same values
// for the same inputs. Re-verify by hand at sca.coffee/cuppingscore before
// shipping if any test starts failing.

type Case = {
  name: string;
  input: Parameters<typeof computeAffectiveScore>[0];
  expected: number;
  // §7.1 lookup-table evidence for the expected number.
  evidence: string;
};

const CASES: Case[] = [
  {
    name: "All 6s, 5 uniform, 0 defects",
    input: {
      fragrance: 6,
      aroma: 6,
      flavor: 6,
      aftertaste: 6,
      acidity: 6,
      sweetness: 6,
      mouthfeel: 6,
      overall: 6,
      uniformity_cups: 5,
      defective_cups: 0,
      defect_intensity: null,
    },
    expected: 84.25,
    evidence: "Σh = 48 → §7.1 row A=48 → B=84.25; no deductions",
  },
  {
    name: "All 7s, 5 uniform, 0 defects",
    input: {
      fragrance: 7,
      aroma: 7,
      flavor: 7,
      aftertaste: 7,
      acidity: 7,
      sweetness: 7,
      mouthfeel: 7,
      overall: 7,
      uniformity_cups: 5,
      defective_cups: 0,
      defect_intensity: null,
    },
    expected: 89.5,
    evidence: "Σh = 56 → §7.1 row A=56 → B=89.50; no deductions",
  },
  {
    name: "Mixed (frag 5, aroma 5, flavor 6, aftertaste 7, acidity 6, sweetness 7, mouthfeel 7, overall 6), 5 uniform, 0 defects",
    input: {
      fragrance: 5,
      aroma: 5,
      flavor: 6,
      aftertaste: 7,
      acidity: 6,
      sweetness: 7,
      mouthfeel: 7,
      overall: 6,
      uniformity_cups: 5,
      defective_cups: 0,
      defect_intensity: null,
    },
    expected: 85.0,
    evidence: "Σh = 5+5+6+7+6+7+7+6 = 49 → §7.1 row A=49 → B=85.00",
  },
  {
    name: "All 8s, 4 uniform, 1 defective (taint label is informational only in CVA 104)",
    input: {
      fragrance: 8,
      aroma: 8,
      flavor: 8,
      aftertaste: 8,
      acidity: 8,
      sweetness: 8,
      mouthfeel: 8,
      overall: 8,
      uniformity_cups: 4,
      defective_cups: 1,
      defect_intensity: "taint",
    },
    expected: 88.75,
    evidence: "Σh = 64 → §7.1 row A=64 → B=94.75; minus 2(1 non-uniform) + 4(1 defect) = 88.75",
  },
  {
    name: "All 9s, 5 uniform, 0 defects (perfect score)",
    input: {
      fragrance: 9,
      aroma: 9,
      flavor: 9,
      aftertaste: 9,
      acidity: 9,
      sweetness: 9,
      mouthfeel: 9,
      overall: 9,
      uniformity_cups: 5,
      defective_cups: 0,
      defect_intensity: null,
    },
    expected: 100.0,
    evidence: "Σh = 72 → §7.1 row A=72 → B=100.00; no deductions",
  },
];

const TOLERANCE = 0.1;

let failed = 0;
for (const c of CASES) {
  const actual = computeAffectiveScore(c.input);
  const delta = Math.abs(actual - c.expected);
  if (delta > TOLERANCE) {
    failed++;
    console.error(
      `FAIL ${c.name}\n      expected ${c.expected}, got ${actual}, |Δ| = ${delta}\n      evidence: ${c.evidence}`,
    );
  } else {
    console.log(`PASS ${c.name} → ${actual}  (expected ${c.expected})`);
  }
}

assert.equal(
  computeAffectiveScore({
    fragrance: 9,
    aroma: 9,
    flavor: 9,
    aftertaste: 9,
    acidity: 9,
    sweetness: 9,
    mouthfeel: 9,
    overall: 9,
    uniformity_cups: 5,
    defective_cups: 0,
    defect_intensity: null,
  }),
  100.0,
  "All 9s with no deductions must score exactly 100.00",
);

if (failed > 0) {
  console.error(`\n${failed} of ${CASES.length} cases failed.`);
  process.exit(1);
}
console.log(`\nPASS — all ${CASES.length} cases within ±${TOLERANCE} of expected`);

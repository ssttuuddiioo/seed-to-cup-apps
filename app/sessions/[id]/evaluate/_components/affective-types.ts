import { computeAffectiveScore } from "@/lib/scoring";

// ── CVA 104 Affective assessment (per cupper per cup) ───────────────────────
// Stored in evaluations.affective (jsonb); the derived cup score in
// evaluations.score. Eight 9-point hedonic rows + uniformity + defects, per
// SCA Standard 104-2024 §7.2. Math lives in lib/scoring.ts (validated).

export const HEDONIC_KEYS = [
  "fragrance",
  "aroma",
  "flavor",
  "aftertaste",
  "acidity",
  "sweetness",
  "mouthfeel",
  "overall",
] as const;

export type HedonicKey = (typeof HEDONIC_KEYS)[number];

export const DEFECT_KEYS = ["moldy", "phenolic", "potato"] as const;
export type DefectKey = (typeof DEFECT_KEYS)[number];

export const TOTAL_CUPS = 5;

export type AffectiveValue = {
  hedonic: Record<HedonicKey, number | null>;
  uniform_cups: number; // 0–5
  defective_cups: number; // 0–5
  defects: Record<DefectKey, boolean>;
};

export function emptyAffective(): AffectiveValue {
  return {
    hedonic: {
      fragrance: null,
      aroma: null,
      flavor: null,
      aftertaste: null,
      acidity: null,
      sweetness: null,
      mouthfeel: null,
      overall: null,
    },
    uniform_cups: TOTAL_CUPS,
    defective_cups: 0,
    defects: { moldy: false, phenolic: false, potato: false },
  };
}

export function isAffectiveComplete(v: AffectiveValue): boolean {
  return HEDONIC_KEYS.every((k) => v.hedonic[k] !== null);
}

export function isAffectiveStarted(v: AffectiveValue): boolean {
  return (
    HEDONIC_KEYS.some((k) => v.hedonic[k] !== null) ||
    v.uniform_cups !== TOTAL_CUPS ||
    v.defective_cups !== 0
  );
}

/** Live score, or null until all eight hedonic rows are marked. */
export function affectiveScore(v: AffectiveValue): number | null {
  if (!isAffectiveComplete(v)) return null;
  return computeAffectiveScore({
    fragrance: v.hedonic.fragrance!,
    aroma: v.hedonic.aroma!,
    flavor: v.hedonic.flavor!,
    aftertaste: v.hedonic.aftertaste!,
    acidity: v.hedonic.acidity!,
    sweetness: v.hedonic.sweetness!,
    mouthfeel: v.hedonic.mouthfeel!,
    overall: v.hedonic.overall!,
    uniformity_cups: v.uniform_cups,
    defective_cups: v.defective_cups,
    defect_intensity: null,
  });
}

/**
 * §5.4.2 coherence: every defective cup must also be non-uniform, except a
 * coffee defective evenly across all cups. So uniform cups ≤ 5 − defective,
 * unless all five are defective.
 */
export function clampUniformity(uniform: number, defective: number): number {
  if (defective >= TOTAL_CUPS) return uniform;
  return Math.min(uniform, TOTAL_CUPS - defective);
}

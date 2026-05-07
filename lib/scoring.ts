// SCA CVA Affective Score
//
// Source: SCA Standard 104-2024 Coffee Value Assessment: Affective Assessment, §5.5.
//
//   S = 0.65625 · Σ hᵢ + 52.75 − 2u − 4d   (i = 1..8, rounded to nearest 0.25)
//
// where hᵢ are the eight 9-point affective sections (fragrance, aroma, flavor,
// aftertaste, acidity, sweetness, mouthfeel, overall), u is the number of
// non-uniform cups, and d is the number of defective cups. See
// `notes/scoring-ambiguities.md` for one deviation from the prompt's signature:
// the 2024 standard has no taint/fault distinction, so `defect_intensity` is
// recorded but does not enter the math.

const HEDONIC_COEFFICIENT = 0.65625;
const HEDONIC_OFFSET = 52.75;
const NON_UNIFORM_PENALTY = 2;
const DEFECTIVE_PENALTY = 4;
const TOTAL_CUPS = 5;

export type AffectiveInput = {
  fragrance: number;
  aroma: number;
  flavor: number;
  aftertaste: number;
  acidity: number;
  sweetness: number;
  mouthfeel: number;
  overall: number;
  uniformity_cups: number;
  defective_cups: number;
  defect_intensity: "taint" | "fault" | null;
};

function roundToQuarter(x: number): number {
  return Math.round(x * 4) / 4;
}

function assertHedonic(name: string, v: number) {
  if (!Number.isFinite(v) || v < 1 || v > 9) {
    throw new RangeError(`${name} must be an integer 1..9, got ${v}`);
  }
}

function assertCupCount(name: string, v: number) {
  if (!Number.isInteger(v) || v < 0 || v > TOTAL_CUPS) {
    throw new RangeError(`${name} must be an integer 0..${TOTAL_CUPS}, got ${v}`);
  }
}

export function computeAffectiveScore(input: AffectiveInput): number {
  assertHedonic("fragrance", input.fragrance);
  assertHedonic("aroma", input.aroma);
  assertHedonic("flavor", input.flavor);
  assertHedonic("aftertaste", input.aftertaste);
  assertHedonic("acidity", input.acidity);
  assertHedonic("sweetness", input.sweetness);
  assertHedonic("mouthfeel", input.mouthfeel);
  assertHedonic("overall", input.overall);
  assertCupCount("uniformity_cups", input.uniformity_cups);
  assertCupCount("defective_cups", input.defective_cups);

  const hedonicSum =
    input.fragrance +
    input.aroma +
    input.flavor +
    input.aftertaste +
    input.acidity +
    input.sweetness +
    input.mouthfeel +
    input.overall;

  const nonUniform = TOTAL_CUPS - input.uniformity_cups;
  const defective = input.defective_cups;

  const raw =
    HEDONIC_COEFFICIENT * hedonicSum +
    HEDONIC_OFFSET -
    NON_UNIFORM_PENALTY * nonUniform -
    DEFECTIVE_PENALTY * defective;

  return roundToQuarter(raw);
}

// ── CVA 105 Extrinsic assessment (per cupper per cup) ───────────────────────
// Stored in evaluations.extrinsic (jsonb). The extrinsic assessment rates the
// assessor's impression of the coffee's non-sensory value — provenance,
// variety, processing, sustainability, traceability — on the same 1–9 scale,
// plus the certifications/claims attached to the lot.
//
// Note: SCA 104 defines a validated cup-score formula; the extrinsic standard
// does not pin a single derived score we can verify, so we capture the
// impressions and claims rather than computing a number.

export type Bilingual = { es: string; en: string };

export const EXTRINSIC_KEYS = [
  "provenance",
  "variety",
  "process",
  "sustainability",
  "traceability",
] as const;

export type ExtrinsicKey = (typeof EXTRINSIC_KEYS)[number];

/** Common certifications/claims relevant to Colombian specialty lots. */
export const CERTIFICATIONS: { id: string; labels: Bilingual }[] = [
  { id: "organic", labels: { es: "Orgánico", en: "Organic" } },
  { id: "fairtrade", labels: { es: "Comercio justo", en: "Fairtrade" } },
  { id: "rainforest", labels: { es: "Rainforest Alliance", en: "Rainforest Alliance" } },
  { id: "fnc", labels: { es: "FNC / Café de Colombia", en: "FNC / Café de Colombia" } },
  { id: "denomination", labels: { es: "Denominación de origen", en: "Denomination of origin" } },
  { id: "womens", labels: { es: "Café de mujeres", en: "Women-produced" } },
  { id: "direct_trade", labels: { es: "Comercio directo", en: "Direct trade" } },
];

export type ExtrinsicValue = {
  impressions: Record<ExtrinsicKey, number | null>;
  certifications: string[];
  notes: string;
};

export function emptyExtrinsic(): ExtrinsicValue {
  return {
    impressions: {
      provenance: null,
      variety: null,
      process: null,
      sustainability: null,
      traceability: null,
    },
    certifications: [],
    notes: "",
  };
}

export function isExtrinsicStarted(v: ExtrinsicValue): boolean {
  return (
    EXTRINSIC_KEYS.some((k) => v.impressions[k] !== null) ||
    v.certifications.length > 0 ||
    v.notes.trim().length > 0
  );
}

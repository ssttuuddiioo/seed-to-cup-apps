import type { LexiconAttribute, OrigenDescriptor } from "@/lib/reference";

// ── The CVA 103 descriptive blob stored in evaluations.descriptive ──────────

/** Intensity scales, each 0–15. */
export type IntensityKey =
  | "fragrance_aroma"
  | "flavor_aftertaste"
  | "acidity"
  | "sweetness"
  | "mouthfeel";

/** CATA descriptor boxes and their selection caps. */
export type CataKey =
  | "fragrance_aroma"
  | "flavor_aftertaste"
  | "main_tastes"
  | "mouthfeel";

export const CATA_LIMITS: Record<CataKey, number> = {
  fragrance_aroma: 5,
  flavor_aftertaste: 5,
  main_tastes: 2,
  mouthfeel: 2,
};

export type DescriptiveValue = {
  intensity: Record<IntensityKey, number>;
  cata: Record<CataKey, string[]>;
  notes: string;
};

export function emptyDescriptive(): DescriptiveValue {
  return {
    intensity: {
      fragrance_aroma: 0,
      flavor_aftertaste: 0,
      acidity: 0,
      sweetness: 0,
      mouthfeel: 0,
    },
    cata: {
      fragrance_aroma: [],
      flavor_aftertaste: [],
      main_tastes: [],
      mouthfeel: [],
    },
    notes: "",
  };
}

/** True once the cupper has touched anything worth saving. */
export function isDescriptiveStarted(v: DescriptiveValue): boolean {
  return (
    Object.values(v.intensity).some((n) => n > 0) ||
    Object.values(v.cata).some((arr) => arr.length > 0) ||
    v.notes.trim().length > 0
  );
}

// ── CATA option pools, grouped by category for the picker ───────────────────

export type CataOption = {
  id: string;
  labels: { es: string; en: string };
  origen: boolean;
};

export type CataSubgroup = { key: string | null; options: CataOption[] };
export type CataGroup = { key: string; subgroups: CataSubgroup[] };

/** Flavor-wheel ordering for the category roots. */
const ROOT_ORDER = [
  "floral",
  "fruity",
  "sweet",
  "nutty_cocoa",
  "spice",
  "sour_fermented",
  "green_vegetative",
  "cereal",
  "roasted",
  "tobacco",
  "other",
];

function rootRank(key: string): number {
  const i = ROOT_ORDER.indexOf(key);
  return i === -1 ? ROOT_ORDER.length : i;
}

/**
 * Build the grouped option tree for one CATA box. Aroma/flavor boxes merge the
 * WCR lexicon with the Origen Colombia descriptor extension (placed under each
 * descriptor's parent category); the taste/mouthfeel boxes are lexicon-only.
 */
export function buildCataGroups(
  key: CataKey,
  lexicon: LexiconAttribute[],
  origen: OrigenDescriptor[],
): CataGroup[] {
  const olfactory = key === "fragrance_aroma" || key === "flavor_aftertaste";
  const section = key; // section ids line up with the box keys

  const options: Array<CataOption & { path: string[] }> = [];

  for (const attr of lexicon) {
    if (!attr.sections.includes(section)) continue;
    options.push({
      id: attr.id,
      labels: attr.labels,
      origen: false,
      path: attr.cataPath,
    });
  }

  if (olfactory) {
    for (const d of origen) {
      options.push({
        id: d.id,
        labels: d.labels,
        origen: true,
        path: d.parentCataPath,
      });
    }
  }

  const roots = new Map<string, Map<string | null, CataOption[]>>();
  for (const opt of options) {
    const root = opt.path[0] ?? "other";
    const sub = opt.path[1] ?? null;
    if (!roots.has(root)) roots.set(root, new Map());
    const subs = roots.get(root)!;
    if (!subs.has(sub)) subs.set(sub, []);
    subs.get(sub)!.push({ id: opt.id, labels: opt.labels, origen: opt.origen });
  }

  return [...roots.entries()]
    .sort((a, b) => rootRank(a[0]) - rootRank(b[0]))
    .map(([rootKey, subs]) => ({
      key: rootKey,
      subgroups: [...subs.entries()]
        // flat (null) subgroup first, then named subcategories alphabetically
        .sort((a, b) => (a[0] ?? "").localeCompare(b[0] ?? ""))
        .map(([subKey, opts]) => ({ key: subKey, options: opts })),
    }));
}

/** Flat id → option lookup, for rendering selected chips outside the drawer. */
export function buildOptionIndex(
  lexicon: LexiconAttribute[],
  origen: OrigenDescriptor[],
): Map<string, CataOption> {
  const index = new Map<string, CataOption>();
  for (const a of lexicon) {
    index.set(a.id, { id: a.id, labels: a.labels, origen: false });
  }
  for (const d of origen) {
    index.set(d.id, { id: d.id, labels: d.labels, origen: true });
  }
  return index;
}

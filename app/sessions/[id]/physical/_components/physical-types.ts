import type { Lang } from "@/lib/i18n";

// ── CVA 101 Physical assessment (per coffee/sample) ─────────────────────────
// Stored in samples.physical (jsonb). Green + roast grading; no cup score.
// Grounded in docs/research.md §2.4 (FNC grading) and §2.5 (Colombian defects).

export type Bilingual = { es: string; en: string };

/** FNC export grade ladder (research §2.4). */
export const FNC_GRADES: { id: string; labels: Bilingual }[] = [
  { id: "supremo", labels: { es: "Supremo", en: "Supremo" } },
  { id: "extra", labels: { es: "Extra", en: "Extra" } },
  { id: "excelso", labels: { es: "Excelso", en: "Excelso" } },
  { id: "ugq", labels: { es: "UGQ (corriente)", en: "UGQ" } },
  { id: "pasilla", labels: { es: "Pasilla", en: "Pasilla" } },
];

/** Primary screen-size sieve readings used in Colombia (research §2.4). */
export const SCREEN_SIZES = [12, 14, 16, 17, 18] as const;

/** Colombian granular broca (coffee borer) damage (research §2.5). */
export const BROCA_STATES: { id: string; labels: Bilingual }[] = [
  { id: "none", labels: { es: "Sin broca", en: "None" } },
  {
    id: "slight",
    labels: { es: "Levemente dañado", en: "Slightly damaged" },
  },
  { id: "full", labels: { es: "Daño completo", en: "Full damage" } },
];

/** Colombian-specific defect tags (research §2.5). */
export const COLOMBIAN_DEFECTS: { id: string; labels: Bilingual }[] = [
  { id: "pasilla", labels: { es: "Pasilla / flotadores", en: "Pasilla / floaters" } },
  { id: "vinagre", labels: { es: "Vinagre / agrio", en: "Sour / vinegary" } },
  {
    id: "negros_parciales",
    labels: { es: "Negros parciales", en: "Partial blacks" },
  },
  { id: "cardenillo", labels: { es: "Cardenillo / verdín", en: "Cardenillo / mould" } },
];

export const ROAST_LEVELS: { id: string; labels: Bilingual }[] = [
  { id: "light", labels: { es: "Claro", en: "Light" } },
  { id: "medium", labels: { es: "Medio", en: "Medium" } },
  { id: "dark", labels: { es: "Oscuro", en: "Dark" } },
];

export function labelFor(
  list: { id: string; labels: Bilingual }[],
  id: string | null,
  lang: Lang,
): string {
  if (!id) return "";
  return list.find((x) => x.id === id)?.labels[lang] ?? id;
}

export type PhysicalValue = {
  fnc_grade: string | null;
  screen_size: number | null;
  moisture_pct: string;
  water_activity: string;
  primary_defects: string;
  secondary_defects: string;
  broca: string | null;
  colombian_defects: string[];
  roast_level: string | null;
  quakers: string;
  notes: string;
};

export function emptyPhysical(): PhysicalValue {
  return {
    fnc_grade: null,
    screen_size: null,
    moisture_pct: "",
    water_activity: "",
    primary_defects: "",
    secondary_defects: "",
    broca: null,
    colombian_defects: [],
    roast_level: null,
    quakers: "",
    notes: "",
  };
}

/** Parse the string-backed form fields into the numeric jsonb we persist. */
export function serializePhysical(v: PhysicalValue) {
  const num = (s: string): number | null => {
    if (s.trim() === "") return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  };
  return {
    fnc_grade: v.fnc_grade,
    screen_size: v.screen_size,
    moisture_pct: num(v.moisture_pct),
    water_activity: num(v.water_activity),
    primary_defects: num(v.primary_defects),
    secondary_defects: num(v.secondary_defects),
    broca: v.broca,
    colombian_defects: v.colombian_defects,
    roast_level: v.roast_level,
    quakers: num(v.quakers),
    notes: v.notes.trim() || null,
  };
}

/** Rehydrate a persisted physical blob back into editable form state. */
export function deserializePhysical(raw: unknown): PhysicalValue {
  const e = emptyPhysical();
  if (!raw || typeof raw !== "object") return e;
  const r = raw as Record<string, unknown>;
  const str = (x: unknown) => (x === null || x === undefined ? "" : String(x));
  return {
    fnc_grade: (r.fnc_grade as string) ?? null,
    screen_size: typeof r.screen_size === "number" ? r.screen_size : null,
    moisture_pct: str(r.moisture_pct),
    water_activity: str(r.water_activity),
    primary_defects: str(r.primary_defects),
    secondary_defects: str(r.secondary_defects),
    broca: (r.broca as string) ?? null,
    colombian_defects: Array.isArray(r.colombian_defects)
      ? (r.colombian_defects as string[])
      : [],
    roast_level: (r.roast_level as string) ?? null,
    quakers: str(r.quakers),
    notes: str(r.notes),
  };
}

export function isPhysicalStarted(v: PhysicalValue): boolean {
  return (
    v.fnc_grade !== null ||
    v.screen_size !== null ||
    v.broca !== null ||
    v.roast_level !== null ||
    v.colombian_defects.length > 0 ||
    [
      v.moisture_pct,
      v.water_activity,
      v.primary_defects,
      v.secondary_defects,
      v.quakers,
      v.notes,
    ].some((s) => s.trim() !== "")
  );
}

import { supabase } from "./supabase";
import {
  fetchLexicon,
  fetchOrigenDescriptors,
  fetchProcesses,
  fetchRegions,
  fetchVarieties,
} from "./reference";
import type { Lang } from "./i18n";

// Aggregated, unblinded session results. Shared by the Reveal screen and the
// Producer card. The blind code → identity mapping and the per-sample panel
// statistics (mean/spread) and descriptor frequencies live here so both
// surfaces compute them identically.

export type DescriptorCount = { id: string; label: string; count: number };

/** The eight CVA 104 affective dimensions, for the radar chart. */
export const RADAR_KEYS = [
  "fragrance",
  "aroma",
  "flavor",
  "aftertaste",
  "acidity",
  "sweetness",
  "mouthfeel",
  "overall",
] as const;
export type RadarKey = (typeof RADAR_KEYS)[number];

export type SampleResult = {
  sampleId: string;
  blindCode: string;
  coffee: {
    producerName: string;
    finca: string | null;
    varieties: string[];
    process: string | null;
    region: string | null;
    altitude: number | null;
  };
  scores: number[];
  mean: number | null;
  min: number | null;
  max: number | null;
  spread: number | null;
  cupperCount: number;
  topDescriptors: DescriptorCount[];
  radar: Record<RadarKey, number | null>;
  fncGrade: string | null;
  physical: unknown | null;
};

export type SessionResults = {
  session: { id: string; title: string; location: string | null; lang: Lang };
  results: SampleResult[];
};

type SampleRow = {
  id: string;
  blind_code: string;
  physical: unknown;
  coffee_id: string;
};
type CoffeeRow = {
  id: string;
  varieties: string[] | null;
  process: string | null;
  region_id: string | null;
  altitude_min: number | null;
  producer_id: string;
  producers: { name: string; finca: string | null } | null;
};
type EvalRow = {
  sample_id: string;
  cupper_initials: string;
  score: number | null;
  descriptive: { cata?: Record<string, string[]> } | null;
  affective: { hedonic?: Record<string, number | null> } | null;
};

const CATA_BOXES = [
  "fragrance_aroma",
  "flavor_aftertaste",
  "main_tastes",
  "mouthfeel",
];

export async function fetchSessionResults(
  sessionId: string,
  lang: Lang,
): Promise<SessionResults | null> {
  const { data: session } = await supabase
    .from("sessions")
    .select("id, title, location, lang")
    .eq("id", sessionId)
    .maybeSingle<{
      id: string;
      title: string;
      location: string | null;
      lang: Lang;
    }>();
  if (!session) return null;

  const [
    { data: sampleRows },
    { data: evalRows },
    varieties,
    processes,
    regions,
    lexicon,
    origen,
  ] = await Promise.all([
    supabase
      .from("samples")
      .select("id, blind_code, physical, coffee_id")
      .eq("session_id", sessionId)
      .order("blind_code"),
    supabase
      .from("evaluations")
      .select("sample_id, cupper_initials, score, descriptive, affective")
      .eq("session_id", sessionId),
    fetchVarieties(),
    fetchProcesses(),
    fetchRegions(),
    fetchLexicon(),
    fetchOrigenDescriptors(),
  ]);

  const samples = (sampleRows ?? []) as SampleRow[];
  const evals = (evalRows ?? []) as EvalRow[];

  // Coffees for these samples.
  const coffeeIds = [...new Set(samples.map((s) => s.coffee_id))];
  const { data: coffeeRows } = await supabase
    .from("coffees")
    .select(
      "id, varieties, process, region_id, altitude_min, producer_id, producers(name, finca)",
    )
    .in("id", coffeeIds);
  const coffees = new Map(
    ((coffeeRows ?? []) as unknown as CoffeeRow[]).map((c) => [c.id, c]),
  );

  // Label maps.
  const varietyLabel = new Map(varieties.map((v) => [v.id, v.labels[lang]]));
  const processLabel = new Map(processes.map((p) => [p.id, p.labels[lang]]));
  const regionLabel = new Map(regions.map((r) => [r.id, r.label[lang]]));
  const descriptorLabel = new Map<string, string>();
  for (const a of lexicon) descriptorLabel.set(a.id, a.labels[lang]);
  for (const d of origen) descriptorLabel.set(d.id, d.labels[lang]);

  // Group evaluations by sample.
  const bySample = new Map<string, EvalRow[]>();
  for (const e of evals) {
    if (!bySample.has(e.sample_id)) bySample.set(e.sample_id, []);
    bySample.get(e.sample_id)!.push(e);
  }

  const results: SampleResult[] = samples.map((s) => {
    const coffee = coffees.get(s.coffee_id);
    const sampleEvals = bySample.get(s.id) ?? [];
    const scores = sampleEvals
      .map((e) => e.score)
      .filter((n): n is number => typeof n === "number");

    const mean =
      scores.length > 0
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) /
          100
        : null;
    const min = scores.length ? Math.min(...scores) : null;
    const max = scores.length ? Math.max(...scores) : null;

    // Descriptor frequency across cuppers.
    const counts = new Map<string, number>();
    for (const e of sampleEvals) {
      const cata = e.descriptive?.cata ?? {};
      for (const box of CATA_BOXES) {
        for (const id of cata[box] ?? []) {
          counts.set(id, (counts.get(id) ?? 0) + 1);
        }
      }
    }
    const topDescriptors: DescriptorCount[] = [...counts.entries()]
      .map(([id, count]) => ({
        id,
        label: descriptorLabel.get(id) ?? id,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Per-dimension affective averages for the radar chart.
    const radar = {} as Record<RadarKey, number | null>;
    for (const key of RADAR_KEYS) {
      const vals = sampleEvals
        .map((e) => e.affective?.hedonic?.[key])
        .filter((n): n is number => typeof n === "number");
      radar[key] =
        vals.length > 0
          ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) /
            100
          : null;
    }

    const fncGrade =
      s.physical && typeof s.physical === "object"
        ? ((s.physical as Record<string, unknown>).fnc_grade as string) ?? null
        : null;

    return {
      sampleId: s.id,
      blindCode: s.blind_code,
      coffee: {
        producerName: coffee?.producers?.name ?? "—",
        finca: coffee?.producers?.finca ?? null,
        varieties: (coffee?.varieties ?? []).map(
          (id) => varietyLabel.get(id) ?? id,
        ),
        process: coffee?.process
          ? (processLabel.get(coffee.process) ?? coffee.process)
          : null,
        region: coffee?.region_id
          ? (regionLabel.get(coffee.region_id) ?? coffee.region_id)
          : null,
        altitude: coffee?.altitude_min ?? null,
      },
      scores,
      mean,
      min,
      max,
      spread: min !== null && max !== null ? Math.round((max - min) * 100) / 100 : null,
      cupperCount: scores.length,
      topDescriptors,
      radar,
      fncGrade,
      physical: s.physical ?? null,
    };
  });

  // Rank by mean score (unscored sink to the bottom).
  results.sort((a, b) => (b.mean ?? -1) - (a.mean ?? -1));

  return { session: { ...session }, results };
}

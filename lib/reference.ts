import { supabase } from "./supabase";
import type { Lang } from "./i18n";

export type Variety = {
  id: string;
  labels: { es: string; en: string };
  mvp: boolean;
};

export type Process = {
  id: string;
  labels: { es: string; en: string };
  mvp: boolean;
};

export type Region = {
  id: string;
  zone_id: string;
  label: { es: string; en: string };
};

export type Producer = {
  id: string;
  name: string;
  finca: string | null;
  municipio: string | null;
  departamento: string | null;
};

export const ZONE_LABELS: Record<string, Record<Lang, string>> = {
  norte: { es: "Norte", en: "North" },
  centro: { es: "Centro", en: "Central" },
  oriente: { es: "Oriente", en: "Eastern" },
  sur: { es: "Sur", en: "Southern" },
};

export async function fetchVarieties(): Promise<Variety[]> {
  const { data, error } = await supabase.from("varieties").select("id, data");
  if (error) throw error;
  return (data ?? []).map((row: { id: string; data: { labels: { es: string; en: string }; mvp?: boolean } }) => ({
    id: row.id,
    labels: row.data.labels,
    mvp: Boolean(row.data.mvp),
  }));
}

export async function fetchProcesses(): Promise<Process[]> {
  const { data, error } = await supabase.from("processes").select("id, data");
  if (error) throw error;
  return (data ?? []).map((row: { id: string; data: { labels: { es: string; en: string }; mvp?: boolean } }) => ({
    id: row.id,
    labels: row.data.labels,
    mvp: Boolean(row.data.mvp),
  }));
}

export async function fetchRegions(): Promise<Region[]> {
  const { data, error } = await supabase
    .from("regions")
    .select("id, zone_id, data")
    .order("zone_id");
  if (error) throw error;
  return (data ?? []).map((row: { id: string; zone_id: string; data: { label: { es: string; en: string } } }) => ({
    id: row.id,
    zone_id: row.zone_id,
    label: row.data.label,
  }));
}

export async function fetchProducers(): Promise<Producer[]> {
  const { data, error } = await supabase
    .from("producers")
    .select("id, name, finca, municipio, departamento")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

// ── Sensory lexicon (CVA 103 descriptive) ──────────────────────────────────

/** A descriptive-form section a lexicon attribute can be checked under. */
export type LexiconSection =
  | "fragrance_aroma"
  | "flavor_aftertaste"
  | "main_tastes"
  | "mouthfeel"
  | "amplitude";

export type LexiconAttribute = {
  id: string;
  sections: LexiconSection[];
  cataPath: string[];
  labels: { es: string; en: string };
  definitions: { es: string; en: string };
};

export type OrigenDescriptor = {
  id: string;
  labels: { es: string; en: string };
  parentCataPath: string[];
  definition: { es: string; en: string };
};

/**
 * Bilingual labels for the CATA category tree. Roots and the handful of
 * depth-2 subcategories the WCR lexicon uses. Anything missing falls back to
 * a humanized key.
 */
export const CATA_CATEGORY_LABELS: Record<string, { es: string; en: string }> = {
  floral: { es: "Floral", en: "Floral" },
  fruity: { es: "Frutal", en: "Fruity" },
  sour_fermented: { es: "Ácido / fermentado", en: "Sour / fermented" },
  green_vegetative: { es: "Verde / vegetal", en: "Green / vegetative" },
  other: { es: "Otros", en: "Other" },
  roasted: { es: "Tostado", en: "Roasted" },
  tobacco: { es: "Tabaco", en: "Tobacco" },
  cereal: { es: "Cereal", en: "Cereal" },
  spice: { es: "Especias", en: "Spice" },
  nutty_cocoa: { es: "Nuez / cacao", en: "Nutty / cocoa" },
  sweet: { es: "Dulce", en: "Sweet" },
  // subcategories
  berry: { es: "Baya", en: "Berry" },
  dried_fruit: { es: "Fruta seca", en: "Dried fruit" },
  other_fruit: { es: "Otras frutas", en: "Other fruit" },
  citrus: { es: "Cítrico", en: "Citrus" },
  sour: { es: "Ácido", en: "Sour" },
  alcohol_fermented: { es: "Alcohol / fermentado", en: "Alcohol / fermented" },
  stale_papery: { es: "Rancio / papel", en: "Stale / papery" },
  earthy: { es: "Terroso", en: "Earthy" },
  animalic_phenolic: { es: "Animal / fenólico", en: "Animalic / phenolic" },
  chemical: { es: "Químico", en: "Chemical" },
  nutty: { es: "Nuez", en: "Nutty" },
  cocoa: { es: "Cacao", en: "Cocoa" },
};

export async function fetchLexicon(): Promise<LexiconAttribute[]> {
  const { data, error } = await supabase
    .from("lexicon_attributes")
    .select("attribute_id, data");
  if (error) throw error;
  return (data ?? []).map(
    (row: {
      attribute_id: string;
      data: {
        section?: LexiconSection[];
        cata_path?: string[];
        labels: { es: string; en: string };
        definitions?: { es: string; en: string };
      };
    }) => ({
      id: row.attribute_id,
      sections: row.data.section ?? [],
      cataPath: row.data.cata_path ?? [],
      labels: row.data.labels,
      definitions: row.data.definitions ?? { es: "", en: "" },
    }),
  );
}

export async function fetchOrigenDescriptors(): Promise<OrigenDescriptor[]> {
  const { data, error } = await supabase
    .from("origen_descriptors")
    .select("id, data");
  if (error) throw error;
  return (data ?? []).map(
    (row: {
      id: string;
      data: {
        labels: { es: string; en: string };
        parent_cata_path?: string[];
        definition?: { es: string; en: string };
      };
    }) => ({
      id: row.id,
      labels: row.data.labels,
      parentCataPath: row.data.parent_cata_path ?? [],
      definition: row.data.definition ?? { es: "", en: "" },
    }),
  );
}

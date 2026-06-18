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

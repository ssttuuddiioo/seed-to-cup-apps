import esStrings from "./es.json" with { type: "json" };
import enStrings from "./en.json" with { type: "json" };

export type Lang = "es" | "en";

export const DEFAULT_LANG: Lang = "es";
export const SUPPORTED_LANGS: readonly Lang[] = ["es", "en"] as const;

const dictionaries: Record<Lang, unknown> = {
  es: esStrings,
  en: enStrings,
};

function lookup(dict: unknown, path: string[]): string | undefined {
  let cur: unknown = dict;
  for (const segment of path) {
    if (cur && typeof cur === "object" && segment in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
  }
  return typeof cur === "string" ? cur : undefined;
}

export function t(key: string, lang: Lang = DEFAULT_LANG): string {
  const path = key.split(".");
  const hit = lookup(dictionaries[lang], path);
  if (hit !== undefined) return hit;

  if (lang !== DEFAULT_LANG) {
    const fallback = lookup(dictionaries[DEFAULT_LANG], path);
    if (fallback !== undefined) return fallback;
  }
  return key;
}

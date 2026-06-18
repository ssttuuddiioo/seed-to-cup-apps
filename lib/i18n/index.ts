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

export function t(
  key: string,
  lang: Lang = DEFAULT_LANG,
  vars?: Record<string, string | number>,
): string {
  const path = key.split(".");
  let hit = lookup(dictionaries[lang], path);
  if (hit === undefined && lang !== DEFAULT_LANG) {
    hit = lookup(dictionaries[DEFAULT_LANG], path);
  }
  if (hit === undefined) return key;
  if (!vars) return hit;
  return hit.replace(/\{\{(\w+)\}\}/g, (_, name: string) =>
    name in vars ? String(vars[name]) : `{{${name}}}`,
  );
}

export function plural(
  base: string,
  count: number,
  lang: Lang = DEFAULT_LANG,
): string {
  const key = count === 1 ? `${base}_one` : `${base}_other`;
  return t(key, lang, { count });
}

export function formatDate(value: string | Date, lang: Lang = DEFAULT_LANG): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(lang === "es" ? "es-CO" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

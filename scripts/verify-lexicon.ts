import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// ──────────────────────────────────────────────────────────────────────────────
// Config
// ──────────────────────────────────────────────────────────────────────────────
// Run from repo root: `npx tsx scripts/verify-lexicon.ts`

const SEED_PATH = resolve(process.cwd(), "seed/lexicon.json");

const EXPECTED_TOTAL = 110;

const ALLOWED_SECTIONS = new Set([
  "fragrance_aroma",
  "flavor_aftertaste",
  "main_tastes",
  "mouthfeel",
  "amplitude",
]);

const ALLOWED_SOURCES = new Set([
  "WCR_v1",
  "WCR_v2_FlavorActiV",
  "SCA_103_2024",
  "Le_Nez_du_Cafe",
]);

const EXPECTED_GROUPS: Record<string, number> = {
  floral: 5,
  fruity: 22,
  sour_fermented: 11,
  green_vegetative: 11,
  other: 14,
  roasted: 6,
  tobacco: 2,
  cereal: 2,
  spice: 7,
  nutty_cocoa: 7,
  sweet: 9,
  main_tastes: 5,
  mouthfeel: 5,
  amplitude: 4,
};

const ID_PATTERN = /^[a-z][a-z0-9_]*$/;

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

type Reference = {
  name_en: string;
  name_es: string;
  source: string;
};

type Entry = {
  attribute_id: string;
  section: string[];
  cata_path: string[];
  labels: { en: string; es: string };
  definitions: { en: string; es: string };
  references: Reference[];
  co_local_reference?: { name_es: string; notes: string };
};

// ──────────────────────────────────────────────────────────────────────────────
// Verifier
// ──────────────────────────────────────────────────────────────────────────────

const errors: string[] = [];
const fail = (msg: string) => errors.push(msg);

function loadEntries(path: string): Entry[] {
  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch (e) {
    console.error(`Could not read ${path}: ${(e as Error).message}`);
    process.exit(1);
  }
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error(`Invalid JSON in ${path}: ${(e as Error).message}`);
    process.exit(1);
  }
  if (!Array.isArray(data)) {
    console.error(`Expected top-level array in ${path}`);
    process.exit(1);
  }
  return data as Entry[];
}

function countByGroup(entries: Entry[]): Map<string, number> {
  const groups = new Map<string, number>();
  for (const entry of entries) {
    const top = entry.cata_path?.[0] ?? "<missing>";
    groups.set(top, (groups.get(top) ?? 0) + 1);
  }
  return groups;
}

function checkTotal(entries: Entry[]) {
  if (entries.length !== EXPECTED_TOTAL) {
    fail(`Expected ${EXPECTED_TOTAL} entries, got ${entries.length}`);
  }
}

function checkGroups(groups: Map<string, number>) {
  for (const [key, expected] of Object.entries(EXPECTED_GROUPS)) {
    const actual = groups.get(key) ?? 0;
    if (actual !== expected) {
      fail(`Group "${key}": expected ${expected}, got ${actual}`);
    }
  }
  for (const key of groups.keys()) {
    if (!(key in EXPECTED_GROUPS)) {
      fail(`Unexpected top-level group "${key}"`);
    }
  }
}

function checkEntries(entries: Entry[]) {
  const seenIds = new Set<string>();
  const required = [
    "attribute_id",
    "section",
    "cata_path",
    "labels",
    "definitions",
    "references",
  ] as const;

  for (const entry of entries) {
    const id = entry.attribute_id ?? "<missing>";

    for (const field of required) {
      const v = (entry as Record<string, unknown>)[field];
      if (v === undefined || v === null) {
        fail(`${id}: missing required field "${field}"`);
      }
    }

    if (typeof id === "string" && id !== "<missing>") {
      if (seenIds.has(id)) fail(`Duplicate attribute_id: ${id}`);
      seenIds.add(id);
      if (!ID_PATTERN.test(id)) {
        fail(`${id}: attribute_id must be lowercase snake_case`);
      }
    }

    if (Array.isArray(entry.section)) {
      if (entry.section.length === 0) fail(`${id}: section array is empty`);
      for (const s of entry.section) {
        if (!ALLOWED_SECTIONS.has(s)) {
          fail(`${id}: section "${s}" not in allowed set`);
        }
      }
    }

    if (Array.isArray(entry.cata_path) && entry.cata_path.length === 0) {
      fail(`${id}: cata_path is empty`);
    }

    if (entry.labels) {
      if (typeof entry.labels.en !== "string" || !entry.labels.en) {
        fail(`${id}: labels.en missing or empty`);
      }
      if (typeof entry.labels.es !== "string" || !entry.labels.es) {
        fail(`${id}: labels.es missing or empty`);
      }
    }

    if (entry.definitions) {
      if (typeof entry.definitions.en !== "string" || !entry.definitions.en) {
        fail(`${id}: definitions.en missing or empty`);
      }
      if (typeof entry.definitions.es !== "string" || !entry.definitions.es) {
        fail(`${id}: definitions.es missing or empty`);
      }
    }

    if (Array.isArray(entry.references)) {
      if (entry.references.length === 0) {
        fail(`${id}: must have at least one reference`);
      }
      for (const ref of entry.references) {
        if (!ref.name_en) fail(`${id}: reference missing name_en`);
        if (!ref.name_es) fail(`${id}: reference missing name_es`);
        if (!ALLOWED_SOURCES.has(ref.source)) {
          fail(`${id}: reference source "${ref.source}" not in allowed set`);
        }
      }
    }
  }
}

function reportCounts(total: number, groups: Map<string, number>) {
  console.log(`Total entries: ${total}`);
  console.log("\nCounts by cata_path[0]:");
  for (const key of [...groups.keys()].sort()) {
    console.log(`  ${key}: ${groups.get(key)}`);
  }
}

function reportResult() {
  if (errors.length > 0) {
    console.error(`\nFAIL — ${errors.length} error(s):`);
    for (const err of errors) console.error(`  - ${err}`);
    process.exit(1);
  }
  console.log("\nPASS — all checks green");
}

// ──────────────────────────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────────────────────────

const entries = loadEntries(SEED_PATH);
const groups = countByGroup(entries);

reportCounts(entries.length, groups);
checkTotal(entries);
checkGroups(groups);
checkEntries(entries);
reportResult();

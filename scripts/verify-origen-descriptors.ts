import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// ──────────────────────────────────────────────────────────────────────────────
// Config
// ──────────────────────────────────────────────────────────────────────────────
// Run from repo root: `npx tsx scripts/verify-origen-descriptors.ts`

const DESCRIPTORS_PATH = resolve(process.cwd(), "seed/origen-descriptors.json");
const LEXICON_PATH = resolve(process.cwd(), "seed/lexicon.json");

// MVP descriptors per docs/research.md §2.8 (the 10 highest-priority).
// `lulo` and `almibar` are split into two entries each because they fit two
// SCA parents; both halves of each split inherit MVP status.
const EXPECTED_MVP_IDS = new Set<string>([
  "panela",
  "bocadillo",
  "lulo_citrus",
  "lulo_other_fruit",
  "guanabana",
  "mora",
  "mortino",
  "curuba",
  "tabaco_rubio",
  "almibar_sweet",
  "almibar_mouthfeel",
  "miel_de_cana",
]);

// Source row → emitted ids. cafe_de_oro is intentionally omitted (concept,
// not a CATA descriptor — see notes/origen-descriptors-todos.md).
const EXPECTED_NON_MVP_IDS = new Set<string>([
  "maracuya",
  "lulada_green",
  "lulada_other_fruit",
  "tomate_de_arbol",
  "aguardiente",
  "tabaco_negro",
  "achiote",
  "miel_de_abejas",
]);

const ID_PATTERN = /^[a-z][a-z0-9_]*$/;

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

type Bilingual = { es: string; en: string };

type Descriptor = {
  id: string;
  labels: Bilingual;
  parent_cata_path: string[];
  definition: Bilingual;
  closest_wcr_equivalent: string;
  mvp: boolean;
};

type LexiconEntry = {
  attribute_id: string;
  cata_path: string[];
};

// ──────────────────────────────────────────────────────────────────────────────
// Verifier
// ──────────────────────────────────────────────────────────────────────────────

const errors: string[] = [];
const fail = (msg: string) => errors.push(msg);

function loadJson<T>(path: string): T {
  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch (e) {
    console.error(`Could not read ${path}: ${(e as Error).message}`);
    process.exit(1);
  }
  try {
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Invalid JSON in ${path}: ${(e as Error).message}`);
    process.exit(1);
  }
}

function checkBilingual(label: string, b: unknown, owner: string) {
  if (!b || typeof b !== "object") {
    fail(`${owner}: ${label} missing or not an object`);
    return;
  }
  const obj = b as Record<string, unknown>;
  if (typeof obj.es !== "string" || !obj.es) fail(`${owner}: ${label}.es missing or empty`);
  if (typeof obj.en !== "string" || !obj.en) fail(`${owner}: ${label}.en missing or empty`);
}

function checkStructure(descriptors: Descriptor[]) {
  const seenIds = new Set<string>();
  for (const d of descriptors) {
    const owner = `descriptor:${d.id ?? "<missing>"}`;

    if (typeof d.id !== "string" || !d.id) {
      fail(`${owner}: id missing`);
      continue;
    }
    if (!ID_PATTERN.test(d.id)) {
      fail(`${owner}: id must be lowercase snake_case (ASCII)`);
    }
    if (seenIds.has(d.id)) fail(`Duplicate descriptor id: ${d.id}`);
    seenIds.add(d.id);

    checkBilingual("labels", d.labels, owner);
    checkBilingual("definition", d.definition, owner);

    if (!Array.isArray(d.parent_cata_path) || d.parent_cata_path.length === 0) {
      fail(`${owner}: parent_cata_path must be a non-empty array`);
    } else {
      for (const seg of d.parent_cata_path) {
        if (typeof seg !== "string" || !seg) {
          fail(`${owner}: parent_cata_path segments must be non-empty strings`);
        }
      }
    }

    if (typeof d.closest_wcr_equivalent !== "string" || !d.closest_wcr_equivalent) {
      fail(`${owner}: closest_wcr_equivalent missing or empty`);
    }

    if (typeof d.mvp !== "boolean") fail(`${owner}: mvp must be boolean`);
  }
}

function checkMembership(descriptors: Descriptor[]) {
  const ids = new Set(descriptors.map((d) => d.id));
  const mvpIds = new Set(descriptors.filter((d) => d.mvp).map((d) => d.id));

  for (const expected of EXPECTED_MVP_IDS) {
    if (!mvpIds.has(expected)) fail(`MVP id "${expected}" must have mvp:true`);
  }
  for (const id of mvpIds) {
    if (!EXPECTED_MVP_IDS.has(id)) fail(`Unexpected mvp:true descriptor "${id}"`);
  }
  for (const expected of EXPECTED_NON_MVP_IDS) {
    if (!ids.has(expected)) fail(`Missing required non-MVP descriptor "${expected}"`);
  }
}

function checkLexiconRefs(descriptors: Descriptor[], lexicon: LexiconEntry[]) {
  const validCataPaths = new Set(lexicon.map((e) => JSON.stringify(e.cata_path)));
  const validAttrIds = new Set(lexicon.map((e) => e.attribute_id));

  for (const d of descriptors) {
    const owner = `descriptor:${d.id}`;
    const pathKey = JSON.stringify(d.parent_cata_path);
    if (!validCataPaths.has(pathKey)) {
      fail(
        `${owner}: parent_cata_path ${pathKey} does not match any cata_path in seed/lexicon.json`,
      );
    }
    if (!validAttrIds.has(d.closest_wcr_equivalent)) {
      fail(
        `${owner}: closest_wcr_equivalent "${d.closest_wcr_equivalent}" is not an attribute_id in seed/lexicon.json`,
      );
    }
  }
}

function checkSplitConsistency(descriptors: Descriptor[]) {
  // Split descriptors must share a common base id and use distinct parent paths.
  const groups = new Map<string, Descriptor[]>();
  for (const d of descriptors) {
    const idx = d.id.indexOf("_");
    if (idx === -1) continue;
    const base = d.id.slice(0, idx);
    if (!["lulo", "lulada", "almibar"].includes(base)) continue;
    const arr = groups.get(base) ?? [];
    arr.push(d);
    groups.set(base, arr);
  }
  for (const [base, members] of groups) {
    if (members.length < 2) continue;
    const paths = new Set(members.map((m) => JSON.stringify(m.parent_cata_path)));
    if (paths.size !== members.length) {
      fail(`Split id "${base}" has duplicate parent_cata_paths across its variants`);
    }
  }
}

function reportCounts(descriptors: Descriptor[]) {
  console.log(`Total descriptors: ${descriptors.length}`);
  const mvp = descriptors.filter((d) => d.mvp).map((d) => d.id);
  const nonMvp = descriptors.filter((d) => !d.mvp).map((d) => d.id);
  console.log(`MVP (${mvp.length}): ${mvp.join(", ")}`);
  console.log(`Phase 2 (${nonMvp.length}): ${nonMvp.join(", ")}`);
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

const descriptors = loadJson<Descriptor[]>(DESCRIPTORS_PATH);
const lexicon = loadJson<LexiconEntry[]>(LEXICON_PATH);

if (!Array.isArray(descriptors)) {
  console.error(`Expected top-level array in ${DESCRIPTORS_PATH}`);
  process.exit(1);
}
if (!Array.isArray(lexicon)) {
  console.error(`Expected top-level array in ${LEXICON_PATH}`);
  process.exit(1);
}

reportCounts(descriptors);
checkStructure(descriptors);
checkMembership(descriptors);
checkLexiconRefs(descriptors, lexicon);
checkSplitConsistency(descriptors);
reportResult();

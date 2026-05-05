import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// ──────────────────────────────────────────────────────────────────────────────
// Config
// ──────────────────────────────────────────────────────────────────────────────
// Run from repo root: `npx tsx scripts/verify-varieties.ts`

const SEED_PATH = resolve(process.cwd(), "seed/colombia-varieties.json");

const EXPECTED_VARIETY_COUNT = 16;

const EXPECTED_MVP_IDS = new Set<string>([
  "castillo",
  "caturra",
  "variedad_colombia",
  "tabi",
  "cenicafe_1",
  "bourbon",
  "pink_bourbon",
  "geisha",
]);

const EXPECTED_NON_MVP_IDS = new Set<string>([
  "typica",
  "wush_wush",
  "maragogype",
  "pacamara",
  "java",
  "chiroso",
  "sidra",
  "sl28",
]);

const ID_PATTERN = /^[a-z][a-z0-9_]*$/;

const CURRENT_YEAR = new Date().getFullYear();

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

type Bilingual = { es: string; en: string };

type Variety = {
  id: string;
  labels: Bilingual;
  parentage: string | null;
  released_by: string | null;
  released_year: number | null;
  rust_resistant: boolean | null;
  cup_profile: Bilingual;
  notes: Bilingual;
  mvp: boolean;
};

// ──────────────────────────────────────────────────────────────────────────────
// Verifier
// ──────────────────────────────────────────────────────────────────────────────

const errors: string[] = [];
const fail = (msg: string) => errors.push(msg);

function loadVarieties(path: string): Variety[] {
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
  return data as Variety[];
}

function checkBilingual(label: string, b: unknown, owner: string) {
  if (!b || typeof b !== "object") {
    fail(`${owner}: ${label} missing or not an object`);
    return;
  }
  const obj = b as Record<string, unknown>;
  if (typeof obj.es !== "string" || !obj.es) {
    fail(`${owner}: ${label}.es missing or empty`);
  }
  if (typeof obj.en !== "string" || !obj.en) {
    fail(`${owner}: ${label}.en missing or empty`);
  }
}

function checkStructure(varieties: Variety[]) {
  const seenIds = new Set<string>();

  if (varieties.length !== EXPECTED_VARIETY_COUNT) {
    fail(
      `Expected ${EXPECTED_VARIETY_COUNT} varieties, got ${varieties.length}`,
    );
  }

  for (const v of varieties) {
    const owner = `variety:${v.id ?? "<missing>"}`;

    if (typeof v.id !== "string" || !v.id) {
      fail(`${owner}: id missing`);
      continue;
    }
    if (!ID_PATTERN.test(v.id)) {
      fail(`${owner}: id must be lowercase snake_case (ASCII)`);
    }
    if (seenIds.has(v.id)) {
      fail(`Duplicate variety id: ${v.id}`);
    }
    seenIds.add(v.id);

    checkBilingual("labels", v.labels, owner);
    checkBilingual("cup_profile", v.cup_profile, owner);
    checkBilingual("notes", v.notes, owner);

    if (v.parentage !== null && (typeof v.parentage !== "string" || !v.parentage)) {
      fail(`${owner}: parentage must be a non-empty string or null`);
    }

    if (
      v.released_by !== null &&
      (typeof v.released_by !== "string" || !v.released_by)
    ) {
      fail(`${owner}: released_by must be a non-empty string or null`);
    }

    if (v.released_year !== null) {
      if (
        typeof v.released_year !== "number" ||
        !Number.isInteger(v.released_year) ||
        v.released_year < 1800 ||
        v.released_year > CURRENT_YEAR
      ) {
        fail(
          `${owner}: released_year must be an integer 1800..${CURRENT_YEAR} or null`,
        );
      }
    }

    if (v.rust_resistant !== null && typeof v.rust_resistant !== "boolean") {
      fail(`${owner}: rust_resistant must be boolean or null`);
    }

    if (typeof v.mvp !== "boolean") {
      fail(`${owner}: mvp must be boolean`);
    }
  }
}

function checkMvpSet(varieties: Variety[]) {
  const mvpIds = new Set(varieties.filter((v) => v.mvp).map((v) => v.id));

  for (const expected of EXPECTED_MVP_IDS) {
    if (!mvpIds.has(expected)) {
      fail(`MVP id "${expected}" must have mvp:true`);
    }
  }
  for (const id of mvpIds) {
    if (!EXPECTED_MVP_IDS.has(id)) {
      fail(`Unexpected mvp:true variety "${id}"`);
    }
  }
  if (mvpIds.size !== EXPECTED_MVP_IDS.size) {
    fail(`Expected exactly ${EXPECTED_MVP_IDS.size} MVP varieties, got ${mvpIds.size}`);
  }

  const ids = new Set(varieties.map((v) => v.id));
  for (const expected of EXPECTED_NON_MVP_IDS) {
    if (!ids.has(expected)) {
      fail(`Missing required non-MVP variety "${expected}"`);
    }
  }
}

function checkContent(varieties: Variety[]) {
  const byId = new Map(varieties.map((v) => [v.id, v]));

  // Castillo: parentage must mention Caturra and Timor; rust_resistant true; Cenicafé.
  const castillo = byId.get("castillo");
  if (!castillo) {
    fail(`Missing required variety "castillo"`);
  } else {
    const parent = (castillo.parentage ?? "").toLowerCase();
    if (!parent.includes("caturra") || !parent.includes("timor")) {
      fail(`castillo: parentage must mention Caturra and Timor`);
    }
    if (castillo.rust_resistant !== true) {
      fail(`castillo: rust_resistant must be true`);
    }
    if (castillo.released_by !== "Cenicafé") {
      fail(`castillo: released_by must be "Cenicafé"`);
    }
  }

  // Caturra: rust_resistant must be false (susceptible).
  const caturra = byId.get("caturra");
  if (caturra && caturra.rust_resistant !== false) {
    fail(`caturra: rust_resistant must be false (susceptible to leaf rust)`);
  }

  // Cenicafé 1: must be released by Cenicafé and rust_resistant true.
  const cenicafe1 = byId.get("cenicafe_1");
  if (cenicafe1) {
    if (cenicafe1.released_by !== "Cenicafé") {
      fail(`cenicafe_1: released_by must be "Cenicafé"`);
    }
    if (cenicafe1.rust_resistant !== true) {
      fail(`cenicafe_1: rust_resistant must be true`);
    }
  }

  // Pink Bourbon: notes must include the genetic caveat (Café Imports / RD2 Vision,
  // Ethiopian landrace, NOT a Bourbon). Required by prompt 03.
  const pink = byId.get("pink_bourbon");
  if (!pink) {
    fail(`Missing required variety "pink_bourbon"`);
  } else {
    const blob = `${pink.notes?.es ?? ""} ${pink.notes?.en ?? ""}`.toLowerCase();
    if (!blob.includes("café imports") && !blob.includes("cafe imports")) {
      fail(`pink_bourbon: notes must mention "Café Imports"`);
    }
    if (!blob.includes("rd2")) {
      fail(`pink_bourbon: notes must mention "RD2 Vision"`);
    }
    if (!blob.includes("ethiopian") && !blob.includes("etíope") && !blob.includes("etiope")) {
      fail(`pink_bourbon: notes must call out the Ethiopian landrace origin`);
    }
    if (!blob.includes("2023")) {
      fail(`pink_bourbon: notes must reference the 2023 genetic testing year`);
    }
    if (!blob.includes("not") && !blob.includes("no es")) {
      fail(`pink_bourbon: notes must explicitly state it is NOT a Bourbon`);
    }
  }
}

function reportCounts(varieties: Variety[]) {
  console.log(`Total varieties: ${varieties.length}`);
  const mvp = varieties.filter((v) => v.mvp).map((v) => v.id);
  const nonMvp = varieties.filter((v) => !v.mvp).map((v) => v.id);
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

const varieties = loadVarieties(SEED_PATH);

reportCounts(varieties);
checkStructure(varieties);
checkMvpSet(varieties);
checkContent(varieties);
reportResult();

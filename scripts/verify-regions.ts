import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// ──────────────────────────────────────────────────────────────────────────────
// Config
// ──────────────────────────────────────────────────────────────────────────────
// Run from repo root: `npx tsx scripts/verify-regions.ts`

const SEED_PATH = resolve(process.cwd(), "seed/colombia-regions.json");

const EXPECTED_ZONE_IDS = ["norte", "centro", "sur", "oriente"] as const;

const EXPECTED_DEPARTMENT_COUNT = 18;

const EXPECTED_DEPARTMENTS_BY_ZONE: Record<string, number> = {
  norte: 6,
  centro: 5,
  sur: 4,
  oriente: 3,
};

const EXPECTED_PDOS = new Set([
  "Café de Cauca",
  "Café de Nariño",
  "Café de Huila",
  "Café de Tolima",
  "Café de Santander",
  "Café de la Sierra Nevada",
]);

const ID_PATTERN = /^[a-z][a-z0-9_]*$/;

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

type Bilingual = { es: string; en: string };

type Department = {
  id: string;
  label: Bilingual;
  pdo: string | null;
  notes: Bilingual | null;
};

type Zone = {
  id: string;
  label: Bilingual;
  altitude_band_masl: [number, number] | null;
  typical_profile: Bilingual;
  departments: Department[];
};

type Root = { zones: Zone[] };

// ──────────────────────────────────────────────────────────────────────────────
// Verifier
// ──────────────────────────────────────────────────────────────────────────────

const errors: string[] = [];
const fail = (msg: string) => errors.push(msg);

function loadRoot(path: string): Root {
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
  if (
    !data ||
    typeof data !== "object" ||
    !Array.isArray((data as Root).zones)
  ) {
    console.error(`Expected top-level object with "zones" array in ${path}`);
    process.exit(1);
  }
  return data as Root;
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

function checkZones(root: Root) {
  const zoneIds = root.zones.map((z) => z.id);

  if (zoneIds.length !== EXPECTED_ZONE_IDS.length) {
    fail(`Expected ${EXPECTED_ZONE_IDS.length} zones, got ${zoneIds.length}`);
  }
  for (const expected of EXPECTED_ZONE_IDS) {
    if (!zoneIds.includes(expected)) {
      fail(`Missing required zone id "${expected}"`);
    }
  }
  for (const id of zoneIds) {
    if (!(EXPECTED_ZONE_IDS as readonly string[]).includes(id)) {
      fail(`Unexpected zone id "${id}"`);
    }
  }

  for (const zone of root.zones) {
    const owner = `zone:${zone.id ?? "<missing>"}`;
    if (typeof zone.id !== "string" || !ID_PATTERN.test(zone.id)) {
      fail(`${owner}: zone id must be lowercase snake_case`);
    }
    checkBilingual("label", zone.label, owner);
    checkBilingual("typical_profile", zone.typical_profile, owner);

    if (zone.altitude_band_masl !== null) {
      if (
        !Array.isArray(zone.altitude_band_masl) ||
        zone.altitude_band_masl.length !== 2 ||
        typeof zone.altitude_band_masl[0] !== "number" ||
        typeof zone.altitude_band_masl[1] !== "number"
      ) {
        fail(`${owner}: altitude_band_masl must be [number, number] or null`);
      } else if (zone.altitude_band_masl[0] >= zone.altitude_band_masl[1]) {
        fail(`${owner}: altitude_band_masl low must be < high`);
      }
    }

    if (!Array.isArray(zone.departments)) {
      fail(`${owner}: departments must be an array`);
      continue;
    }
    const expectedCount = EXPECTED_DEPARTMENTS_BY_ZONE[zone.id];
    if (
      typeof expectedCount === "number" &&
      zone.departments.length !== expectedCount
    ) {
      fail(
        `${owner}: expected ${expectedCount} departments, got ${zone.departments.length}`,
      );
    }
  }
}

function checkDepartments(root: Root) {
  const seenIds = new Set<string>();
  const seenPdos = new Set<string>();
  let total = 0;
  let santanderChecked = false;

  for (const zone of root.zones) {
    if (!Array.isArray(zone.departments)) continue;
    for (const dept of zone.departments) {
      total++;
      const owner = `dept:${dept.id ?? "<missing>"}`;

      if (typeof dept.id !== "string" || !dept.id) {
        fail(`${owner}: id missing`);
      } else {
        if (!ID_PATTERN.test(dept.id)) {
          fail(`${owner}: id must be lowercase snake_case`);
        }
        if (seenIds.has(dept.id)) {
          fail(`Duplicate department id: ${dept.id}`);
        }
        seenIds.add(dept.id);
      }

      checkBilingual("label", dept.label, owner);

      if (dept.pdo !== null) {
        if (typeof dept.pdo !== "string" || !dept.pdo) {
          fail(`${owner}: pdo must be a non-empty string or null`);
        } else {
          if (!EXPECTED_PDOS.has(dept.pdo)) {
            fail(`${owner}: pdo "${dept.pdo}" not in approved set`);
          }
          if (seenPdos.has(dept.pdo)) {
            fail(`${owner}: pdo "${dept.pdo}" duplicated across departments`);
          }
          seenPdos.add(dept.pdo);
        }
      }

      if (dept.notes !== null) {
        checkBilingual("notes", dept.notes, owner);
      }

      if (dept.id === "santander") {
        santanderChecked = true;
        if (dept.pdo !== "Café de Santander") {
          fail(`${owner}: must carry pdo "Café de Santander"`);
        }
        if (!dept.notes) {
          fail(`${owner}: must include notes about Charalá and shade-grown`);
        } else {
          const blob = `${dept.notes.es} ${dept.notes.en}`.toLowerCase();
          if (!blob.includes("charalá") && !blob.includes("charala")) {
            fail(`${owner}: notes must mention Charalá`);
          }
          if (!blob.includes("sombra") && !blob.includes("shade")) {
            fail(`${owner}: notes must mention shade-grown / cultivo bajo sombra`);
          }
        }
      }
    }
  }

  if (!santanderChecked) {
    fail(`Missing required department "santander"`);
  }

  if (total !== EXPECTED_DEPARTMENT_COUNT) {
    fail(`Expected ${EXPECTED_DEPARTMENT_COUNT} departments total, got ${total}`);
  }

  for (const expected of EXPECTED_PDOS) {
    if (!seenPdos.has(expected)) {
      fail(`Missing required PDO badge: "${expected}"`);
    }
  }
}

function reportCounts(root: Root) {
  let total = 0;
  console.log("Zones and department counts:");
  for (const zone of root.zones) {
    const n = Array.isArray(zone.departments) ? zone.departments.length : 0;
    total += n;
    console.log(`  ${zone.id}: ${n}`);
  }
  console.log(`Total departments: ${total}`);

  const pdos: string[] = [];
  for (const zone of root.zones) {
    for (const dept of zone.departments ?? []) {
      if (dept.pdo) pdos.push(`${dept.id} → ${dept.pdo}`);
    }
  }
  console.log("\nPDO badges:");
  for (const p of pdos.sort()) console.log(`  ${p}`);
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

const root = loadRoot(SEED_PATH);

reportCounts(root);
checkZones(root);
checkDepartments(root);
reportResult();

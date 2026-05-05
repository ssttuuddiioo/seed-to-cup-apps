import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// ──────────────────────────────────────────────────────────────────────────────
// Config
// ──────────────────────────────────────────────────────────────────────────────
// Run from repo root: `npx tsx scripts/verify-processes.ts`

const SEED_PATH = resolve(process.cwd(), "seed/colombia-processes.json");

const EXPECTED_PROCESS_COUNT = 11;

const EXPECTED_MVP_IDS = new Set<string>([
  "lavado",
  "honey",
  "natural",
  "anaerobico",
  "choque_termico",
  "cofermentacion",
]);

const EXPECTED_NON_MVP_IDS = new Set<string>([
  "maceracion_carbonica",
  "lactico",
  "doble_fermentacion",
  "honey_color",
  "lavado_mecanico",
]);

const ID_PATTERN = /^[a-z][a-z0-9_]*$/;

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

type Bilingual = { es: string; en: string };

type Process = {
  id: string;
  labels: Bilingual;
  description: Bilingual;
  typical_fermentation_hours: [number, number] | null;
  mvp: boolean;
};

// ──────────────────────────────────────────────────────────────────────────────
// Verifier
// ──────────────────────────────────────────────────────────────────────────────

const errors: string[] = [];
const fail = (msg: string) => errors.push(msg);

function loadProcesses(path: string): Process[] {
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
  return data as Process[];
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

function checkStructure(processes: Process[]) {
  const seenIds = new Set<string>();

  if (processes.length !== EXPECTED_PROCESS_COUNT) {
    fail(
      `Expected ${EXPECTED_PROCESS_COUNT} processes, got ${processes.length}`,
    );
  }

  for (const p of processes) {
    const owner = `process:${p.id ?? "<missing>"}`;

    if (typeof p.id !== "string" || !p.id) {
      fail(`${owner}: id missing`);
      continue;
    }
    if (!ID_PATTERN.test(p.id)) {
      fail(`${owner}: id must be lowercase snake_case (ASCII)`);
    }
    if (seenIds.has(p.id)) {
      fail(`Duplicate process id: ${p.id}`);
    }
    seenIds.add(p.id);

    checkBilingual("labels", p.labels, owner);
    checkBilingual("description", p.description, owner);

    if (p.typical_fermentation_hours !== null) {
      if (
        !Array.isArray(p.typical_fermentation_hours) ||
        p.typical_fermentation_hours.length !== 2 ||
        typeof p.typical_fermentation_hours[0] !== "number" ||
        typeof p.typical_fermentation_hours[1] !== "number"
      ) {
        fail(
          `${owner}: typical_fermentation_hours must be [number, number] or null`,
        );
      } else {
        const [lo, hi] = p.typical_fermentation_hours;
        if (lo <= 0 || hi <= 0) {
          fail(`${owner}: typical_fermentation_hours values must be > 0`);
        }
        if (lo >= hi) {
          fail(`${owner}: typical_fermentation_hours low must be < high`);
        }
        if (hi > 240) {
          fail(`${owner}: typical_fermentation_hours upper bound suspiciously high (>240h)`);
        }
      }
    }

    if (typeof p.mvp !== "boolean") {
      fail(`${owner}: mvp must be boolean`);
    }
  }
}

function checkMvpSet(processes: Process[]) {
  const mvpIds = new Set(processes.filter((p) => p.mvp).map((p) => p.id));

  for (const expected of EXPECTED_MVP_IDS) {
    if (!mvpIds.has(expected)) {
      fail(`MVP id "${expected}" must have mvp:true`);
    }
  }
  for (const id of mvpIds) {
    if (!EXPECTED_MVP_IDS.has(id)) {
      fail(`Unexpected mvp:true process "${id}"`);
    }
  }
  if (mvpIds.size !== EXPECTED_MVP_IDS.size) {
    fail(`Expected exactly ${EXPECTED_MVP_IDS.size} MVP processes, got ${mvpIds.size}`);
  }

  const ids = new Set(processes.map((p) => p.id));
  for (const expected of EXPECTED_NON_MVP_IDS) {
    if (!ids.has(expected)) {
      fail(`Missing required non-MVP process "${expected}"`);
    }
  }
}

function checkContent(processes: Process[]) {
  const byId = new Map(processes.map((p) => [p.id, p]));

  // Lavado: must have a fermentation range that brackets 12–36h (per FNC).
  const lavado = byId.get("lavado");
  if (lavado) {
    const range = lavado.typical_fermentation_hours;
    if (!range || range[0] !== 12 || range[1] !== 36) {
      fail(`lavado: typical_fermentation_hours must be [12, 36]`);
    }
  }

  // Anaeróbico: range must bracket the canonical 36–120h window.
  const ana = byId.get("anaerobico");
  if (ana) {
    const range = ana.typical_fermentation_hours;
    if (!range || range[0] > 36 || range[1] < 120) {
      fail(`anaerobico: typical_fermentation_hours must cover at least [36, 120]`);
    }
  }

  // Natural: must explicitly carry null fermentation hours.
  const natural = byId.get("natural");
  if (natural && natural.typical_fermentation_hours !== null) {
    fail(`natural: typical_fermentation_hours must be null`);
  }

  // Choque térmico: description must mention Bermúdez and El Paraíso (signature process).
  const ct = byId.get("choque_termico");
  if (!ct) {
    fail(`Missing required process "choque_termico"`);
  } else {
    const blob = `${ct.description?.es ?? ""} ${ct.description?.en ?? ""}`.toLowerCase();
    if (!blob.includes("bermúdez") && !blob.includes("bermudez")) {
      fail(`choque_termico: description must credit Diego Bermúdez`);
    }
    if (!blob.includes("paraíso") && !blob.includes("paraiso")) {
      fail(`choque_termico: description must reference Finca El Paraíso`);
    }
    if (!blob.includes("cauca")) {
      fail(`choque_termico: description must reference Cauca`);
    }
  }

  // Co-fermentación: description must reference Sebastián Ramírez exemplar lots.
  const co = byId.get("cofermentacion");
  if (co) {
    const blob = `${co.description?.es ?? ""} ${co.description?.en ?? ""}`.toLowerCase();
    if (!blob.includes("ramírez") && !blob.includes("ramirez")) {
      fail(`cofermentacion: description should credit Sebastián Ramírez`);
    }
  }
}

function reportCounts(processes: Process[]) {
  console.log(`Total processes: ${processes.length}`);
  const mvp = processes.filter((p) => p.mvp).map((p) => p.id);
  const nonMvp = processes.filter((p) => !p.mvp).map((p) => p.id);
  console.log(`MVP (${mvp.length}): ${mvp.join(", ")}`);
  console.log(`Phase 2 (${nonMvp.length}): ${nonMvp.join(", ")}`);

  console.log("\nFermentation ranges:");
  for (const p of processes) {
    const r = p.typical_fermentation_hours;
    console.log(`  ${p.id}: ${r ? `${r[0]}–${r[1]} h` : "n/a"}`);
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

const processes = loadProcesses(SEED_PATH);

reportCounts(processes);
checkStructure(processes);
checkMvpSet(processes);
checkContent(processes);
reportResult();

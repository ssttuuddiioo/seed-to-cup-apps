import { strict as assert } from "node:assert";
import { validateReading } from "./validation.ts";
import { buildSessionCsv } from "./csv.ts";
import type { LocalReading, LocalSession } from "./types.ts";

// Run from repo root: `npx tsx lib/fermentacion/fermentacion.test.ts`
//
// Covers the two pure pieces of the Fermentación module: soft validation
// (warn-not-block plausibility rules) and CSV assembly (CFF-005 header + RFC-4180
// quoting). The IndexedDB/sync layer is exercised manually in the browser.

// ── Fixtures ────────────────────────────────────────────────────────────────

function reading(over: Partial<LocalReading> = {}): LocalReading {
  return {
    id: "r1",
    session_id: "s1",
    lote: "",
    fecha: "2026-07-09",
    hora: "08:00",
    temperatura_ambiente: "",
    temperatura_masa: "",
    brix: "",
    ph: "",
    ec: "",
    notas: "",
    created_at: "2026-07-09T08:00:00.000Z",
    updated_at: "2026-07-09T08:00:00.000Z",
    _dirty: true,
    _deleted: false,
    ...over,
  };
}

const session: LocalSession = {
  id: "s1",
  finca: "Finca Bellavista",
  fecha: "2026-07-09",
  created_by: "PG",
  created_at: "2026-07-09T08:00:00.000Z",
  updated_at: "2026-07-09T08:00:00.000Z",
  _dirty: true,
  _deleted: false,
};

let passed = 0;
function check(name: string, cond: boolean) {
  assert.ok(cond, name);
  passed++;
}

// ── Validation ──────────────────────────────────────────────────────────────

function fields(r: LocalReading) {
  return validateReading(r).map((w) => w.field);
}

check("valid reading → no warnings", fields(
  reading({ ph: "4.2", brix: "18", ec: "1.2", temperatura_masa: "24" }),
).length === 0);

check("blank fields → no warnings", fields(reading()).length === 0);

check("ph above range warns", fields(reading({ ph: "8" })).includes("ph"));
check("ph below range warns", fields(reading({ ph: "1.5" })).includes("ph"));
check("ph boundary 2 ok", !fields(reading({ ph: "2" })).includes("ph"));
check("ph boundary 7 ok", !fields(reading({ ph: "7" })).includes("ph"));

check("negative brix warns", fields(reading({ brix: "-1" })).includes("brix"));
check("negative ec warns", fields(reading({ ec: "-0.5" })).includes("ec"));

check(
  "hot ambient temp warns",
  fields(reading({ temperatura_ambiente: "70" })).includes(
    "temperatura_ambiente",
  ),
);
check(
  "sub-zero mass temp warns",
  fields(reading({ temperatura_masa: "-5" })).includes("temperatura_masa"),
);
check(
  "plausible temp ok",
  !fields(reading({ temperatura_masa: "26.5" })).includes("temperatura_masa"),
);

// ── CSV ─────────────────────────────────────────────────────────────────────

const csv = buildSessionCsv(
  session,
  [
    reading({ lote: "BV-1", hora: "08:00", temperatura_masa: "24", brix: "18" }),
    reading({ id: "r2", lote: "BV-1", notas: "olor a vinagre, subir agua" }),
  ],
  "es",
);

check("csv carries the company name", csv.includes("THE COFFEE FIVE S.A.S"));
check("csv carries the doc code", csv.includes("CFF-005 Version 1"));
check("csv carries the finca", csv.includes("Finca Bellavista"));
check("csv has the Lote header", csv.includes("Lote"));
check("csv has a data value", csv.includes("BV-1"));
check(
  "csv quotes a field containing a comma",
  csv.includes('"olor a vinagre, subir agua"'),
);
check("csv uses CRLF line endings", csv.includes("\r\n"));

console.log(`ok — ${passed} checks passed`);

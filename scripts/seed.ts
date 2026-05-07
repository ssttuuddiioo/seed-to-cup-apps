import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
// Node 20 lacks native WebSocket; supabase-js eagerly initialises a Realtime
// client even when we don't use it. Provide ws as the transport.
import WebSocket from "ws";

// Run from repo root: `npm run seed`
//
// Reads every file in seed/, upserts each row into the matching reference
// table by primary key. Idempotent — safe to re-run.

// Lightweight .env.local loader — Node doesn't auto-load it for plain scripts.
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Service role preferred (bypasses RLS); falls back to the publishable/anon
// key, which works in v1 thanks to the permissive RLS policies in 0001_init.
const WRITE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !WRITE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or a Supabase key. " +
      "Copy .env.local.example to .env.local and fill in the values.",
  );
  process.exit(1);
}

const usingServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
console.log(
  `Authenticating with ${usingServiceRole ? "service role" : "publishable/anon"} key.`,
);

const supabase = createClient(SUPABASE_URL, WRITE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
  db: { schema: "cupping" },
  realtime: { transport: WebSocket as never },
});

function readSeed<T>(filename: string): T {
  const raw = readFileSync(resolve(process.cwd(), "seed", filename), "utf8");
  return JSON.parse(raw) as T;
}

async function upsertRows(
  table: string,
  rows: Record<string, unknown>[],
  conflictTarget = "id",
) {
  if (rows.length === 0) return;
  const { error } = await supabase
    .from(table)
    .upsert(rows, { onConflict: conflictTarget });
  if (error) {
    throw new Error(`upsert ${table} failed: ${error.message}`);
  }
  console.log(`  ${table}: upserted ${rows.length} rows`);
}

async function seedLexicon() {
  type LexiconEntry = { attribute_id: string };
  const items = readSeed<LexiconEntry[]>("lexicon.json");
  const rows = items.map((item) => ({
    attribute_id: item.attribute_id,
    data: item,
  }));
  await upsertRows("lexicon_attributes", rows, "attribute_id");
}

async function seedRegions() {
  type Department = {
    id: string;
    label: { es: string; en: string };
    pdo: string | null;
    notes: string | null;
  };
  type Zone = {
    id: string;
    label: { es: string; en: string };
    altitude_band_masl: [number, number];
    typical_profile: { es: string; en: string };
    departments: Department[];
  };
  const file = readSeed<{ zones: Zone[] }>("colombia-regions.json");
  const rows = file.zones.flatMap((zone) =>
    zone.departments.map((dept) => ({
      id: dept.id,
      zone_id: zone.id,
      data: { ...dept, zone: { id: zone.id, label: zone.label } },
    })),
  );
  await upsertRows("regions", rows);
}

async function seedVarieties() {
  type Variety = { id: string };
  const items = readSeed<Variety[]>("colombia-varieties.json");
  const rows = items.map((item) => ({ id: item.id, data: item }));
  await upsertRows("varieties", rows);
}

async function seedProcesses() {
  type Process = { id: string };
  const items = readSeed<Process[]>("colombia-processes.json");
  const rows = items.map((item) => ({ id: item.id, data: item }));
  await upsertRows("processes", rows);
}

async function seedOrigenDescriptors() {
  type Descriptor = { id: string };
  const items = readSeed<Descriptor[]>("origen-descriptors.json");
  const rows = items.map((item) => ({ id: item.id, data: item }));
  await upsertRows("origen_descriptors", rows);
}

async function main() {
  console.log("Seeding reference tables...");
  await seedLexicon();
  await seedRegions();
  await seedVarieties();
  await seedProcesses();
  await seedOrigenDescriptors();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

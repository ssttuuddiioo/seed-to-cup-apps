import type { Lang } from "@/lib/i18n";

// ── Fermentación (CFF-005) domain + local-record types ──────────────────────
//
// Two entities mirroring the paper sheet: a session header (finca + fecha) and
// many timestamped readings. Rows carry client-managed `updated_at` and local
// sync metadata (`_dirty`, `_deleted`) so the IndexedDB store can reconcile to
// Supabase with last-write-wins. Numeric reading fields are held as strings in
// the editing layer (repo convention, cf. PhysicalValue) and parsed to
// numbers|null at push time.

export type Bilingual = { es: string; en: string };

/** The nine CFF-005 columns, in sheet order. Single source of truth for the
 *  form field order, CSV headers, and the print view so they never drift. */
export type ReadingColumnKey =
  | "lote"
  | "fecha"
  | "hora"
  | "temperatura_ambiente"
  | "temperatura_masa"
  | "brix"
  | "ph"
  | "ec"
  | "notas";

export type ColumnKind = "text" | "date" | "time" | "decimal";

export const CFF005_COLUMNS: {
  key: ReadingColumnKey;
  labels: Bilingual;
  kind: ColumnKind;
  unit?: string;
  step?: string;
}[] = [
  { key: "lote", labels: { es: "Lote", en: "Lot" }, kind: "text" },
  { key: "fecha", labels: { es: "Fecha", en: "Date" }, kind: "date" },
  { key: "hora", labels: { es: "Hora", en: "Time" }, kind: "time" },
  {
    key: "temperatura_ambiente",
    labels: { es: "Temp. ambiente", en: "Ambient temp." },
    kind: "decimal",
    unit: "°C",
    step: "0.1",
  },
  {
    key: "temperatura_masa",
    labels: { es: "Temp. masa", en: "Mass temp." },
    kind: "decimal",
    unit: "°C",
    step: "0.1",
  },
  { key: "brix", labels: { es: "Brix", en: "Brix" }, kind: "decimal", step: "0.1" },
  { key: "ph", labels: { es: "pH", en: "pH" }, kind: "decimal", step: "0.01" },
  { key: "ec", labels: { es: "EC", en: "EC" }, kind: "decimal", step: "0.01" },
  { key: "notas", labels: { es: "Notas", en: "Notes" }, kind: "text" },
];

// ── Supabase row shapes (snake_case, what supabase-js reads/writes) ──────────

export type FermentationSessionRow = {
  id: string;
  finca: string;
  fecha: string; // date "YYYY-MM-DD"
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type FermentationReadingRow = {
  id: string;
  session_id: string;
  lote: string | null;
  fecha: string | null; // date
  hora: string | null; // time "HH:MM" / "HH:MM:SS"
  temperatura_ambiente: number | null;
  temperatura_masa: number | null;
  brix: number | null;
  ph: number | null;
  ec: number | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
};

// ── Local records (row + sync metadata) ─────────────────────────────────────

export type SyncMeta = {
  updated_at: string; // ISO, client-managed
  _dirty: boolean; // has unpushed local changes
  _deleted: boolean; // tombstone awaiting delete propagation
};

export type LocalSession = FermentationSessionRow & SyncMeta;

/** Reading in the editing layer: numeric columns held as strings. */
export type LocalReading = {
  id: string;
  session_id: string;
  lote: string;
  fecha: string;
  hora: string;
  temperatura_ambiente: string;
  temperatura_masa: string;
  brix: string;
  ph: string;
  ec: string;
  notas: string;
  created_at: string;
} & SyncMeta;

// ── Serialization helpers ───────────────────────────────────────────────────

/** Parse a string form field into the numeric value we persist. */
function num(s: string): number | null {
  if (s.trim() === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function str(x: unknown): string {
  return x === null || x === undefined ? "" : String(x);
}

/** Local editing reading → Supabase row (strings parsed to numbers|null). */
export function serializeReading(r: LocalReading): FermentationReadingRow {
  return {
    id: r.id,
    session_id: r.session_id,
    lote: r.lote.trim() || null,
    fecha: r.fecha || null,
    hora: r.hora || null,
    temperatura_ambiente: num(r.temperatura_ambiente),
    temperatura_masa: num(r.temperatura_masa),
    brix: num(r.brix),
    ph: num(r.ph),
    ec: num(r.ec),
    notas: r.notas.trim() || null,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

/** Supabase row → local editing reading. */
export function deserializeReading(row: FermentationReadingRow): LocalReading {
  return {
    id: row.id,
    session_id: row.session_id,
    lote: str(row.lote),
    fecha: str(row.fecha),
    hora: normalizeTime(str(row.hora)),
    temperatura_ambiente: str(row.temperatura_ambiente),
    temperatura_masa: str(row.temperatura_masa),
    brix: str(row.brix),
    ph: str(row.ph),
    ec: str(row.ec),
    notas: str(row.notas),
    created_at: row.created_at,
    updated_at: row.updated_at,
    _dirty: false,
    _deleted: false,
  };
}

/** Postgres `time` returns "HH:MM:SS"; the <input type=time> wants "HH:MM". */
function normalizeTime(s: string): string {
  const m = s.match(/^(\d{2}:\d{2})/);
  return m ? m[1] : s;
}

export function serializeSession(s: LocalSession): FermentationSessionRow {
  return {
    id: s.id,
    finca: s.finca.trim(),
    fecha: s.fecha,
    created_by: s.created_by?.trim() || null,
    created_at: s.created_at,
    updated_at: s.updated_at,
  };
}

export function labelFor(col: ReadingColumnKey, lang: Lang): string {
  return CFF005_COLUMNS.find((c) => c.key === col)?.labels[lang] ?? col;
}

/** True once a reading has any user-entered value (used to gate "save"). */
export function isReadingStarted(r: LocalReading): boolean {
  return [
    r.lote,
    r.temperatura_ambiente,
    r.temperatura_masa,
    r.brix,
    r.ph,
    r.ec,
    r.notas,
  ].some((s) => s.trim() !== "");
}

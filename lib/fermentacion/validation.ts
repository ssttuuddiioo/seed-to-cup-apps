import type { LocalReading, ReadingColumnKey } from "./types";

// ── Soft validation ─────────────────────────────────────────────────────────
//
// Field data is messy: these rules WARN, they never block saving. Each warning
// carries an i18n message key resolved in the UI (`fermentacion.warn.*`).

export type Warning = {
  field: ReadingColumnKey;
  messageKey: string;
  severity: "warn";
};

function n(s: string): number | null {
  if (s.trim() === "") return null;
  const v = Number(s);
  return Number.isFinite(v) ? v : null;
}

/** The numeric fields these rules inspect — satisfied by both a full
 *  LocalReading and an in-progress draft (ReadingInput). */
type Checkable = Pick<
  LocalReading,
  "ph" | "brix" | "ec" | "temperatura_ambiente" | "temperatura_masa"
>;

/** Plausibility checks per the brief: pH ~2–7, Brix/EC positive, temps ~0–60°C. */
export function validateReading(r: Checkable): Warning[] {
  const w: Warning[] = [];
  const warn = (field: ReadingColumnKey, messageKey: string) =>
    w.push({ field, messageKey, severity: "warn" });

  const ph = n(r.ph);
  if (ph !== null && (ph < 2 || ph > 7)) warn("ph", "fermentacion.warn.ph_range");

  const brix = n(r.brix);
  if (brix !== null && brix < 0) warn("brix", "fermentacion.warn.brix_positive");

  const ec = n(r.ec);
  if (ec !== null && ec < 0) warn("ec", "fermentacion.warn.ec_positive");

  const amb = n(r.temperatura_ambiente);
  if (amb !== null && (amb < 0 || amb > 60))
    warn("temperatura_ambiente", "fermentacion.warn.temp_range");

  const masa = n(r.temperatura_masa);
  if (masa !== null && (masa < 0 || masa > 60))
    warn("temperatura_masa", "fermentacion.warn.temp_range");

  return w;
}

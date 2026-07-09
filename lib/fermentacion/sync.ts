import { supabase } from "@/lib/supabase";
import {
  deleteReadingLocal,
  deleteSessionLocal,
  getDirty,
  getReadings,
  getSession,
  markReadingsClean,
  markSessionsClean,
  metaGet,
  metaSet,
  putReading,
  putSession,
} from "./db";
import {
  deserializeReading,
  serializeReading,
  serializeSession,
  type FermentationReadingRow,
  type FermentationSessionRow,
  type LocalSession,
} from "./types";

// ── Sync — reconcile the IndexedDB local store with Supabase ────────────────
//
// push: upsert dirty records (idempotent on the client-generated uuid), then
//       propagate tombstones as deletes.
// pull: fetch rows changed since lastPulledAt and merge last-write-wins;
//       a locally dirty record always wins until it has been pushed.
//
// All network errors are swallowed — being offline is the normal case. Reads
// never depend on a successful sync.

const EPOCH = "1970-01-01T00:00:00Z";

function newer(a: string, b: string): boolean {
  return new Date(a).getTime() > new Date(b).getTime();
}

// ── Push ────────────────────────────────────────────────────────────────────

async function pushDirty(): Promise<void> {
  const { sessions, readings } = await getDirty();

  // Upsert sessions first (readings FK them), then upsert readings.
  const sessionUpserts = sessions.filter((s) => !s._deleted);
  if (sessionUpserts.length) {
    const { error } = await supabase
      .from("fermentation_sessions")
      .upsert(sessionUpserts.map(serializeSession), { onConflict: "id" });
    if (error) throw error;
    await markSessionsClean(sessionUpserts.map((s) => s.id));
  }

  const readingUpserts = readings.filter((r) => !r._deleted);
  if (readingUpserts.length) {
    const { error } = await supabase
      .from("fermentation_readings")
      .upsert(readingUpserts.map(serializeReading), { onConflict: "id" });
    if (error) throw error;
    await markReadingsClean(readingUpserts.map((r) => r.id));
  }

  // Propagate deletes (readings before sessions; a session delete cascades).
  for (const r of readings.filter((r) => r._deleted)) {
    const { error } = await supabase
      .from("fermentation_readings")
      .delete()
      .eq("id", r.id);
    if (error) throw error;
    await deleteReadingLocal(r.id);
  }
  for (const s of sessions.filter((s) => s._deleted)) {
    const { error } = await supabase
      .from("fermentation_sessions")
      .delete()
      .eq("id", s.id);
    if (error) throw error;
    await deleteSessionLocal(s.id);
  }
}

// ── Pull ────────────────────────────────────────────────────────────────────

async function pull(): Promise<void> {
  const lastPulledAt = (await metaGet<string>("lastPulledAt")) ?? EPOCH;

  const [sRes, rRes] = await Promise.all([
    supabase
      .from("fermentation_sessions")
      .select("*")
      .gt("updated_at", lastPulledAt),
    supabase
      .from("fermentation_readings")
      .select("*")
      .gt("updated_at", lastPulledAt),
  ]);
  if (sRes.error) throw sRes.error;
  if (rRes.error) throw rRes.error;

  let maxSeen = lastPulledAt;

  for (const row of (sRes.data as FermentationSessionRow[]) ?? []) {
    if (newer(row.updated_at, maxSeen)) maxSeen = row.updated_at;
    const local = await getSession(row.id);
    if (local?._dirty || local?._deleted) continue; // local wins until pushed
    if (!local || newer(row.updated_at, local.updated_at)) {
      const rec: LocalSession = { ...row, _dirty: false, _deleted: false };
      await putSession(rec);
    }
  }

  for (const row of (rRes.data as FermentationReadingRow[]) ?? []) {
    if (newer(row.updated_at, maxSeen)) maxSeen = row.updated_at;
    const existing = (await getReadings(row.session_id)).find(
      (x) => x.id === row.id,
    );
    if (existing?._dirty || existing?._deleted) continue;
    if (!existing || newer(row.updated_at, existing.updated_at)) {
      await putReading(deserializeReading(row));
    }
  }

  if (newer(maxSeen, lastPulledAt)) await metaSet("lastPulledAt", maxSeen);
}

// ── Orchestration ───────────────────────────────────────────────────────────

let inFlight: Promise<void> | null = null;

/** Push then pull, guarded so overlapping triggers coalesce. Never throws. */
export function sync(): Promise<void> {
  if (inFlight) return inFlight;
  inFlight = (async () => {
    try {
      await pushDirty();
      await pull();
    } catch {
      // Offline / transient — dirty records stay queued for the next attempt.
    } finally {
      inFlight = null;
    }
  })();
  return inFlight;
}

let registered = false;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

/** Attach the reconnect listener once. Safe to call repeatedly. */
export function registerSync(onDone?: () => void): void {
  if (registered || typeof window === "undefined") return;
  registered = true;
  window.addEventListener("online", () => {
    void sync().then(() => onDone?.());
  });
}

/** Debounced sync trigger used after each local mutation. */
export function scheduleSync(onDone?: () => void): void {
  if (typeof window === "undefined") return;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    void sync().then(() => onDone?.());
  }, 800);
}

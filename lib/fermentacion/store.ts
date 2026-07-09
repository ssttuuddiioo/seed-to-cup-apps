import { useSyncExternalStore } from "react";
import {
  deleteReadingLocal,
  getAllSessions,
  getDirty,
  getReading,
  getReadings,
  getSession,
  metaGet,
  metaSet,
  putReading,
  putSession,
} from "./db";
import { registerSync, scheduleSync, sync } from "./sync";
import type { LocalReading, LocalSession } from "./types";

// ── Fermentación store — in-memory mirror of IndexedDB for React ────────────
//
// A minimal external store (module cache + subscribe/getSnapshot) consumed via
// React's built-in useSyncExternalStore — the repo has no state library. Every
// mutation writes through to IndexedDB, refreshes the cache from it, notifies
// subscribers, then debounce-triggers a background sync. The cache is always
// re-read from IndexedDB (source of truth) so it never drifts.

export type Snapshot = {
  sessions: LocalSession[];
  readings: Record<string, LocalReading[]>;
  pendingCount: number;
  online: boolean;
  hydrated: boolean;
};

const EMPTY: Snapshot = {
  sessions: [],
  readings: {},
  pendingCount: 0,
  online: true,
  hydrated: false,
};

let snapshot: Snapshot = EMPTY;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

/** Rebuild the snapshot from IndexedDB. */
async function refresh() {
  const all = await getAllSessions();
  const sessions = all
    .filter((s) => !s._deleted)
    .sort(
      (a, b) =>
        b.fecha.localeCompare(a.fecha) ||
        b.created_at.localeCompare(a.created_at),
    );

  const readings: Record<string, LocalReading[]> = {};
  for (const s of sessions) {
    readings[s.id] = (await getReadings(s.id))
      .filter((r) => !r._deleted)
      .sort(
        (a, b) =>
          a.fecha.localeCompare(b.fecha) ||
          a.hora.localeCompare(b.hora) ||
          a.created_at.localeCompare(b.created_at),
      );
  }

  const dirty = await getDirty();
  snapshot = {
    sessions,
    readings,
    pendingCount: dirty.sessions.length + dirty.readings.length,
    online: typeof navigator === "undefined" ? true : navigator.onLine,
    hydrated: true,
  };
  emit();
}

let initialized = false;
function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  const onOnline = () => {
    snapshot = { ...snapshot, online: true };
    emit();
  };
  const onOffline = () => {
    snapshot = { ...snapshot, online: false };
    emit();
  };
  window.addEventListener("online", onOnline);
  window.addEventListener("offline", onOffline);

  // Precache the /fermentacion app shell so it opens with no signal.
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/ferm-sw.js", { scope: "/fermentacion" })
      .catch(() => {
        /* SW is a progressive enhancement — ignore failures. */
      });
  }

  // After a background sync completes, IndexedDB may have new server data.
  registerSync(() => void refresh());

  void refresh().then(() => void sync().then(() => void refresh()));
}

// ── React binding ────────────────────────────────────────────────────────────

function subscribe(cb: () => void): () => void {
  ensureInit();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): Snapshot {
  return snapshot;
}

function getServerSnapshot(): Snapshot {
  return EMPTY;
}

export function useFermentacion(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// ── Actions ──────────────────────────────────────────────────────────────────

function now(): string {
  return new Date().toISOString();
}

function uuid(): string {
  return crypto.randomUUID();
}

export async function createSession(input: {
  finca: string;
  fecha: string;
  created_by: string | null;
}): Promise<string> {
  const ts = now();
  const rec: LocalSession = {
    id: uuid(),
    finca: input.finca.trim(),
    fecha: input.fecha,
    created_by: input.created_by?.trim() || null,
    created_at: ts,
    updated_at: ts,
    _dirty: true,
    _deleted: false,
  };
  await putSession(rec);
  await refresh();
  scheduleSync(() => void refresh());
  return rec.id;
}

export async function updateSession(
  id: string,
  patch: Partial<Pick<LocalSession, "finca" | "fecha" | "created_by">>,
): Promise<void> {
  const cur = await getSession(id);
  if (!cur) return;
  const next: LocalSession = {
    ...cur,
    ...patch,
    updated_at: now(),
    _dirty: true,
  };
  await putSession(next);
  await refresh();
  scheduleSync(() => void refresh());
}

/** The subset of a reading a caller supplies; sync + identity fields are set here. */
export type ReadingInput = Pick<
  LocalReading,
  | "lote"
  | "fecha"
  | "hora"
  | "temperatura_ambiente"
  | "temperatura_masa"
  | "brix"
  | "ph"
  | "ec"
  | "notas"
>;

export async function addReading(
  sessionId: string,
  input: ReadingInput,
): Promise<string> {
  const ts = now();
  const rec: LocalReading = {
    id: uuid(),
    session_id: sessionId,
    ...input,
    created_at: ts,
    updated_at: ts,
    _dirty: true,
    _deleted: false,
  };
  await putReading(rec);
  await refresh();
  scheduleSync(() => void refresh());
  return rec.id;
}

export async function updateReading(
  id: string,
  input: ReadingInput,
): Promise<void> {
  const cur = await getReading(id);
  if (!cur) return;
  const next: LocalReading = {
    ...cur,
    ...input,
    updated_at: now(),
    _dirty: true,
  };
  await putReading(next);
  await refresh();
  scheduleSync(() => void refresh());
}

export async function deleteReading(id: string): Promise<void> {
  const cur = await getReading(id);
  if (!cur) return;
  if (cur._dirty && cur.updated_at === cur.created_at) {
    // Never synced to the server — safe to drop outright, no tombstone needed.
    await deleteReadingLocal(id);
  } else {
    await putReading({
      ...cur,
      _deleted: true,
      _dirty: true,
      updated_at: now(),
    });
  }
  await refresh();
  scheduleSync(() => void refresh());
}

// ── Operator name (createdBy substitute, no auth in v1) ──────────────────────

export async function getOperator(): Promise<string> {
  return (await metaGet<string>("operator")) ?? "";
}

export async function setOperator(name: string): Promise<void> {
  await metaSet("operator", name.trim());
}

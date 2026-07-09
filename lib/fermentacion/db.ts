import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { LocalReading, LocalSession } from "./types";

// ── IndexedDB — the local source of truth for Fermentación ──────────────────
//
// Browser-only. Three stores keyed by `id`: sessions, readings (indexed by
// session_id), and meta (key/value: lastPulledAt, operator). All access is
// through this module; nothing here touches React or Supabase.

const DB_NAME = "ferm";
const DB_VERSION = 1;

interface FermDb extends DBSchema {
  sessions: {
    key: string;
    value: LocalSession;
  };
  readings: {
    key: string;
    value: LocalReading;
    indexes: { "by-session": string };
  };
  meta: {
    key: string;
    value: unknown;
  };
}

let dbPromise: Promise<IDBPDatabase<FermDb>> | null = null;

export function openFermDb(): Promise<IDBPDatabase<FermDb>> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB unavailable (server context)"));
  }
  if (!dbPromise) {
    dbPromise = openDB<FermDb>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore("sessions", { keyPath: "id" });
        const readings = db.createObjectStore("readings", { keyPath: "id" });
        readings.createIndex("by-session", "session_id");
        db.createObjectStore("meta");
      },
    });
  }
  return dbPromise;
}

// ── Sessions ────────────────────────────────────────────────────────────────

export async function getAllSessions(): Promise<LocalSession[]> {
  const db = await openFermDb();
  return db.getAll("sessions");
}

export async function getSession(id: string): Promise<LocalSession | undefined> {
  const db = await openFermDb();
  return db.get("sessions", id);
}

export async function putSession(rec: LocalSession): Promise<void> {
  const db = await openFermDb();
  await db.put("sessions", rec);
}

export async function deleteSessionLocal(id: string): Promise<void> {
  const db = await openFermDb();
  await db.delete("sessions", id);
}

// ── Readings ────────────────────────────────────────────────────────────────

export async function getReadings(sessionId: string): Promise<LocalReading[]> {
  const db = await openFermDb();
  return db.getAllFromIndex("readings", "by-session", sessionId);
}

export async function getReading(id: string): Promise<LocalReading | undefined> {
  const db = await openFermDb();
  return db.get("readings", id);
}

export async function putReading(rec: LocalReading): Promise<void> {
  const db = await openFermDb();
  await db.put("readings", rec);
}

export async function deleteReadingLocal(id: string): Promise<void> {
  const db = await openFermDb();
  await db.delete("readings", id);
}

// ── Dirty tracking (both stores) ────────────────────────────────────────────

export type DirtySet = {
  sessions: LocalSession[];
  readings: LocalReading[];
};

export async function getDirty(): Promise<DirtySet> {
  const db = await openFermDb();
  const [sessions, readings] = await Promise.all([
    db.getAll("sessions"),
    db.getAll("readings"),
  ]);
  return {
    sessions: sessions.filter((s) => s._dirty || s._deleted),
    readings: readings.filter((r) => r._dirty || r._deleted),
  };
}

/** Clear the dirty flag on records that pushed successfully. */
export async function markSessionsClean(ids: string[]): Promise<void> {
  const db = await openFermDb();
  const tx = db.transaction("sessions", "readwrite");
  await Promise.all(
    ids.map(async (id) => {
      const rec = await tx.store.get(id);
      if (rec && !rec._deleted) {
        rec._dirty = false;
        await tx.store.put(rec);
      }
    }),
  );
  await tx.done;
}

export async function markReadingsClean(ids: string[]): Promise<void> {
  const db = await openFermDb();
  const tx = db.transaction("readings", "readwrite");
  await Promise.all(
    ids.map(async (id) => {
      const rec = await tx.store.get(id);
      if (rec && !rec._deleted) {
        rec._dirty = false;
        await tx.store.put(rec);
      }
    }),
  );
  await tx.done;
}

// ── Meta ────────────────────────────────────────────────────────────────────

export async function metaGet<T>(key: string): Promise<T | undefined> {
  const db = await openFermDb();
  return (await db.get("meta", key)) as T | undefined;
}

export async function metaSet(key: string, value: unknown): Promise<void> {
  const db = await openFermDb();
  await db.put("meta", value, key);
}

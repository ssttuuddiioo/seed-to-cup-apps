import type { Lang } from "@/lib/i18n";
import { CFF005_COLUMNS, type LocalReading, type LocalSession } from "./types";

// ── CSV export (hand-rolled, RFC-4180) ──────────────────────────────────────
//
// Leading metadata rows keep the CFF-005 doc code + company on the record for
// traceability, then the nine sheet columns in order.

function field(v: string): string {
  // Quote when the value contains a comma, quote, or newline; double inner quotes.
  if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

function row(cells: string[]): string {
  return cells.map((c) => field(c)).join(",");
}

export function buildSessionCsv(
  session: LocalSession,
  readings: LocalReading[],
  lang: Lang,
): string {
  const fincaLabel = lang === "es" ? "Finca" : "Farm";
  const fechaLabel = lang === "es" ? "Fecha" : "Date";
  const byLabel = lang === "es" ? "Registrado por" : "Recorded by";

  const lines: string[] = [
    row(["THE COFFEE FIVE S.A.S"]),
    row(["Formato Control de Fermentación — CFF-005 Version 1"]),
    row([fincaLabel, session.finca]),
    row([fechaLabel, session.fecha]),
    row([byLabel, session.created_by ?? ""]),
    "",
    row(CFF005_COLUMNS.map((c) => c.labels[lang])),
  ];

  for (const r of readings) {
    lines.push(row(CFF005_COLUMNS.map((c) => r[c.key] ?? "")));
  }

  return lines.join("\r\n");
}

function safe(s: string): string {
  return s.replace(/[^\p{L}\p{N}_-]+/gu, "-").replace(/^-+|-+$/g, "") || "sesion";
}

export function sessionCsvFilename(session: LocalSession): string {
  return `CFF-005-${safe(session.finca)}-${session.fecha}.csv`;
}

/** Trigger a browser download of the CSV text (Blob + anchor, as in ProducerCard). */
export function downloadCsv(filename: string, text: string): void {
  // Prepend a UTF-8 BOM so Excel reads accents (Fermentación) correctly.
  const blob = new Blob(["﻿" + text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

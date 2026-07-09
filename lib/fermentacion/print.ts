import { formatDate, type Lang } from "@/lib/i18n";
import { CFF005_COLUMNS, type LocalReading, type LocalSession } from "./types";

// ── PDF export via a self-contained print window ────────────────────────────
//
// Opens an isolated document laid out like the paper CFF-005 sheet and triggers
// the browser print dialog (→ "Save as PDF"). Zero dependencies, and it can't
// disturb the app's own styles. Keeps the doc code + company for traceability.

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(
  session: LocalSession,
  readings: LocalReading[],
  lang: Lang,
): string {
  const fincaLabel = lang === "es" ? "Finca" : "Farm";
  const fechaLabel = lang === "es" ? "Fecha" : "Date";
  const byLabel = lang === "es" ? "Registrado por" : "Recorded by";
  const titleEs = "Formato Control de Fermentación";
  const titleEn = "Fermentation Control Log";

  const headCells = CFF005_COLUMNS.map((c) => `<th>${esc(c.labels[lang])}</th>`).join(
    "",
  );

  const bodyRows = readings
    .map(
      (r) =>
        "<tr>" +
        CFF005_COLUMNS.map((c) => `<td>${esc(r[c.key] ?? "")}</td>`).join("") +
        "</tr>",
    )
    .join("");

  // Pad to a minimum row count so the printed sheet resembles the blank form.
  const padCount = Math.max(0, 20 - readings.length);
  const padRows = Array.from({ length: padCount })
    .map(
      () =>
        "<tr>" +
        CFF005_COLUMNS.map(() => "<td>&nbsp;</td>").join("") +
        "</tr>",
    )
    .join("");

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8" />
<title>CFF-005 · ${esc(session.finca)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #000; margin: 24px; }
  .doc { display: flex; justify-content: space-between; align-items: flex-start;
         border: 1px solid #000; padding: 8px 12px; margin-bottom: 12px; }
  .doc h1 { font-size: 18px; margin: 0; text-transform: uppercase; }
  .doc h2 { font-size: 13px; margin: 2px 0 0; font-weight: bold; }
  .code { text-align: right; font-size: 11px; line-height: 1.4; white-space: nowrap; }
  .meta { font-size: 12px; margin-bottom: 10px; }
  .meta span { margin-right: 24px; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th, td { border: 1px solid #000; padding: 4px 6px; text-align: left; }
  th { background: #eee; }
  footer { margin-top: 16px; text-align: center; font-size: 10px; line-height: 1.5; }
  @media print { body { margin: 0; } @page { margin: 12mm; } }
</style>
</head>
<body>
  <div class="doc">
    <div>
      <h1>THE COFFEE FIVE</h1>
      <h2>${esc(lang === "es" ? titleEs : titleEn)}</h2>
    </div>
    <div class="code">CFF-005<br/>VERSION 1<br/>06-11-2024</div>
  </div>
  <div class="meta">
    <span><strong>${fincaLabel}:</strong> ${esc(session.finca)}</span>
    <span><strong>${fechaLabel}:</strong> ${esc(formatDate(session.fecha, lang))}</span>
    ${session.created_by ? `<span><strong>${byLabel}:</strong> ${esc(session.created_by)}</span>` : ""}
  </div>
  <table>
    <thead><tr>${headCells}</tr></thead>
    <tbody>${bodyRows}${padRows}</tbody>
  </table>
  <footer>THE COFFEE FIVE S.A.S<br/>NIT 902.068.454-5<br/>TEL: 3168302691</footer>
  <script>window.onload = function () { window.print(); };<\/script>
</body>
</html>`;
}

/** Open the print-formatted sheet in a new window and invoke the print dialog. */
export function printSession(
  session: LocalSession,
  readings: LocalReading[],
  lang: Lang,
): boolean {
  const w = window.open("", "_blank");
  if (!w) return false; // popup blocked — caller surfaces a hint
  w.document.write(buildHtml(session, readings, lang));
  w.document.close();
  w.focus();
  return true;
}

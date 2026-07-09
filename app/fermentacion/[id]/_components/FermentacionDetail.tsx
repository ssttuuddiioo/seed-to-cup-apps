"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DEFAULT_LANG, formatDate, plural, t, type Lang } from "@/lib/i18n";
import {
  addReading,
  deleteReading,
  updateReading,
  updateSession,
  useFermentacion,
  type ReadingInput,
} from "@/lib/fermentacion/store";
import { todayISO, nowHM } from "@/lib/fermentacion/datetime";
import {
  buildSessionCsv,
  downloadCsv,
  sessionCsvFilename,
} from "@/lib/fermentacion/csv";
import { printSession } from "@/lib/fermentacion/print";
import { FermHeader } from "../../_components/FermHeader";
import { SyncStatus } from "../../_components/SyncStatus";
import { ReadingForm } from "./ReadingForm";
import { ReadingList } from "./ReadingList";

function emptyInput(): ReadingInput {
  return {
    lote: "",
    fecha: "",
    hora: "",
    temperatura_ambiente: "",
    temperatura_masa: "",
    brix: "",
    ph: "",
    ec: "",
    notas: "",
  };
}

function hasContent(d: ReadingInput): boolean {
  return [
    d.lote,
    d.temperatura_ambiente,
    d.temperatura_masa,
    d.brix,
    d.ph,
    d.ec,
    d.notas,
  ].some((s) => s.trim() !== "");
}

export function FermentacionDetail({ sessionId }: { sessionId: string }) {
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
  const { sessions, readings, pendingCount, online, hydrated } =
    useFermentacion();

  const session = sessions.find((s) => s.id === sessionId);
  const list = readings[sessionId] ?? [];

  const [draft, setDraft] = useState<ReadingInput>(emptyInput);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [popupBlocked, setPopupBlocked] = useState(false);

  // Header (finca / fecha) inline editing — buffered in local state so the
  // inputs stay snappy, committed to the store on "Done".
  const [editHeader, setEditHeader] = useState(false);
  const [hdrFinca, setHdrFinca] = useState("");
  const [hdrFecha, setHdrFecha] = useState("");

  function openHeaderEdit() {
    if (!session) return;
    setHdrFinca(session.finca);
    setHdrFecha(session.fecha);
    setEditHeader(true);
  }

  async function commitHeaderEdit() {
    const patch: { finca?: string; fecha?: string } = {};
    if (hdrFinca.trim()) patch.finca = hdrFinca;
    if (hdrFecha) patch.fecha = hdrFecha;
    await updateSession(sessionId, patch);
    setEditHeader(false);
  }

  const lastLote = list.length ? list[list.length - 1].lote : "";

  // Seed a fresh reading with device date/time (and the previous lot) once the
  // store has hydrated and we're in "new" mode with an untouched draft.
  useEffect(() => {
    if (!hydrated || editingId !== null) return;
    setDraft((d) =>
      d.fecha === "" && d.hora === ""
        ? { ...d, fecha: todayISO(), hora: nowHM(), lote: d.lote || lastLote }
        : d,
    );
  }, [hydrated, editingId, lastLote]);

  function resetForNew() {
    setEditingId(null);
    setDraft({ ...emptyInput(), lote: lastLote, fecha: todayISO(), hora: nowHM() });
  }

  function startEdit(id: string) {
    const r = list.find((x) => x.id === id);
    if (!r) return;
    setEditingId(id);
    setDraft({
      lote: r.lote,
      fecha: r.fecha,
      hora: r.hora,
      temperatura_ambiente: r.temperatura_ambiente,
      temperatura_masa: r.temperatura_masa,
      brix: r.brix,
      ph: r.ph,
      ec: r.ec,
      notas: r.notas,
    });
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSave() {
    if (!hasContent(draft) || saving) return;
    setSaving(true);
    setError(null);
    try {
      if (editingId) await updateReading(editingId, draft);
      else await addReading(sessionId, draft);
      resetForNew();
    } catch (err) {
      console.error(err);
      setError(t("fermentacion.reading.save_error", lang));
    } finally {
      setSaving(false);
    }
  }

  function onExportCsv() {
    if (!session) return;
    downloadCsv(sessionCsvFilename(session), buildSessionCsv(session, list, lang));
  }

  function onExportPdf() {
    if (!session) return;
    const ok = printSession(session, list, lang);
    setPopupBlocked(!ok);
  }

  // ── Loading / not-found ────────────────────────────────────────────────────
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-white">
        <FermHeader
          backHref="/fermentacion"
          backLabel={t("fermentacion.title", lang)}
          lang={lang}
          onLangChange={setLang}
        />
        <p className="mx-auto max-w-2xl px-6 py-16 text-center text-sm text-neutral-400">
          {t("common.saving", lang)}
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-white">
        <FermHeader
          backHref="/fermentacion"
          backLabel={t("fermentacion.title", lang)}
          lang={lang}
          onLangChange={setLang}
        />
        <div className="mx-auto max-w-2xl px-6 py-16 text-center">
          <p className="text-sm text-neutral-500">
            {t("fermentacion.not_found", lang)}
          </p>
          <Link
            href="/fermentacion"
            className="mt-4 inline-block text-sm text-origen-orange hover:underline"
          >
            {t("fermentacion.back_to_list", lang)}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="sticky top-0 z-10 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <FermHeader
          backHref="/fermentacion"
          backLabel={t("fermentacion.title", lang)}
          lang={lang}
          onLangChange={setLang}
          right={
            <SyncStatus online={online} pendingCount={pendingCount} lang={lang} />
          }
        />
      </div>

      <main className="mx-auto max-w-2xl px-6 pb-40 pt-6">
        {/* Session header (finca / fecha), inline-editable */}
        {editHeader ? (
          <div className="mb-8 space-y-3 rounded-xl border border-neutral-200 p-4">
            <input
              type="text"
              value={hdrFinca}
              onChange={(e) => setHdrFinca(e.target.value)}
              className="block w-full rounded-md border border-neutral-200 px-3 py-2 text-base focus:border-neutral-900 focus:outline-none"
            />
            <input
              type="date"
              value={hdrFecha}
              onChange={(e) => setHdrFecha(e.target.value)}
              className="block w-full rounded-md border border-neutral-200 px-3 py-2 text-base focus:border-neutral-900 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => void commitHeaderEdit()}
              className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
            >
              {t("common.done", lang)}
            </button>
          </div>
        ) : (
          <header className="mb-8 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-medium tracking-tight text-neutral-900">
                {session.finca}
              </h1>
              <div className="mt-1 text-sm text-neutral-500">
                {[
                  formatDate(session.fecha, lang),
                  session.created_by,
                  plural("fermentacion.readings_count", list.length, lang),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
            </div>
            <button
              type="button"
              onClick={openHeaderEdit}
              className="shrink-0 text-xs text-neutral-400 hover:text-neutral-900"
            >
              {t("fermentacion.edit_header", lang)}
            </button>
          </header>
        )}

        {/* Export toolbar */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onExportCsv}
            disabled={list.length === 0}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-900 disabled:opacity-40"
          >
            {t("fermentacion.export_csv", lang)}
          </button>
          <button
            type="button"
            onClick={onExportPdf}
            disabled={list.length === 0}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-900 disabled:opacity-40"
          >
            {t("fermentacion.export_pdf", lang)}
          </button>
          {popupBlocked && (
            <span className="text-xs text-amber-600">
              {t("fermentacion.popup_blocked", lang)}
            </span>
          )}
        </div>

        {/* Add / edit reading */}
        <section className="mb-10 rounded-xl border border-neutral-200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-medium uppercase tracking-[0.08em] text-neutral-500">
              {editingId
                ? t("fermentacion.reading.edit_heading", lang)
                : t("fermentacion.reading.new_heading", lang)}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForNew}
                className="text-xs text-neutral-400 hover:text-neutral-900"
              >
                {t("fermentacion.reading.cancel_edit", lang)}
              </button>
            )}
          </div>
          <ReadingForm lang={lang} value={draft} onChange={setDraft} />
        </section>

        {/* Prior readings */}
        <section>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-neutral-500">
            {t("fermentacion.reading.list_heading", lang)}
          </h2>
          <ReadingList
            readings={list}
            lang={lang}
            editingId={editingId}
            onEdit={startEdit}
            onDelete={(id) => void deleteReading(id)}
          />
        </section>
      </main>

      {/* Fixed action bar */}
      <footer className="fixed inset-x-0 bottom-0 border-t border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-6 py-4">
          <SyncStatus online={online} pendingCount={pendingCount} lang={lang} />
          <div className="flex items-center gap-3">
            {error && <span className="text-xs text-red-600">{error}</span>}
            <button
              type="button"
              onClick={onSave}
              disabled={!hasContent(draft) || saving}
              className={
                "rounded-md px-5 py-2.5 text-sm font-medium text-white transition-opacity " +
                (hasContent(draft) && !saving
                  ? "bg-origen-orange hover:opacity-90"
                  : "bg-neutral-300")
              }
            >
              {saving
                ? t("common.saving", lang)
                : editingId
                  ? t("fermentacion.reading.save_edit", lang)
                  : t("fermentacion.reading.add", lang)}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

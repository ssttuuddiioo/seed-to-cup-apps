"use client";

import { t, type Lang } from "@/lib/i18n";
import { CFF005_COLUMNS } from "@/lib/fermentacion/types";
import type { ReadingInput } from "@/lib/fermentacion/store";
import { validateReading, type Warning } from "@/lib/fermentacion/validation";

type Props = {
  lang: Lang;
  value: ReadingInput;
  onChange: (next: ReadingInput) => void;
};

/** Mobile-first stacked form — one field per row (the 9 CFF-005 columns won't
 *  fit a phone horizontally). Soft-validation warnings render inline in amber. */
export function ReadingForm({ lang, value, onChange }: Props) {
  const set = <K extends keyof ReadingInput>(key: K, v: ReadingInput[K]) =>
    onChange({ ...value, [key]: v });

  const warnings = validateReading(value);
  const warningFor = (field: string): Warning | undefined =>
    warnings.find((w) => w.field === field);

  return (
    <div className="space-y-4">
      {CFF005_COLUMNS.map((col) => {
        const warning = warningFor(col.key);
        return (
          <div key={col.key}>
            <label className="block">
              <span className="mb-1.5 flex items-baseline gap-2 text-sm font-medium text-neutral-900">
                {col.labels[lang]}
                {col.unit && (
                  <span className="text-xs font-normal text-neutral-400">
                    {col.unit}
                  </span>
                )}
              </span>

              {col.key === "notas" ? (
                <textarea
                  value={value.notas}
                  onChange={(e) => set("notas", e.target.value)}
                  rows={2}
                  placeholder={t("fermentacion.reading.notas_placeholder", lang)}
                  className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                />
              ) : col.kind === "date" ? (
                <input
                  type="date"
                  value={value.fecha}
                  onChange={(e) => set("fecha", e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-base outline-none focus:border-neutral-400"
                />
              ) : col.kind === "time" ? (
                <input
                  type="time"
                  value={value.hora}
                  onChange={(e) => set("hora", e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-base outline-none focus:border-neutral-400"
                />
              ) : col.kind === "decimal" ? (
                <input
                  type="number"
                  inputMode="decimal"
                  step={col.step}
                  value={value[col.key]}
                  onChange={(e) => set(col.key, e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-base outline-none focus:border-neutral-400"
                />
              ) : (
                <input
                  type="text"
                  value={value.lote}
                  onChange={(e) => set("lote", e.target.value)}
                  placeholder={t("fermentacion.reading.lote_placeholder", lang)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-base outline-none focus:border-neutral-400"
                />
              )}
            </label>

            {warning && (
              <p className="mt-1 text-xs text-amber-600">
                {t(warning.messageKey, lang)}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

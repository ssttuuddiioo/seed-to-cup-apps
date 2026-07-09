"use client";

import { t, type Lang } from "@/lib/i18n";
import type { LocalReading } from "@/lib/fermentacion/types";

type Props = {
  readings: LocalReading[];
  lang: Lang;
  editingId: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

/** Compact reference list of prior readings; tap a row to edit it in place. */
export function ReadingList({
  readings,
  lang,
  editingId,
  onEdit,
  onDelete,
}: Props) {
  if (readings.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-neutral-200 px-4 py-6 text-center text-sm text-neutral-400">
        {t("fermentacion.reading.none_yet", lang)}
      </p>
    );
  }

  return (
    <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200">
      {readings.map((r) => {
        const active = r.id === editingId;
        const metrics = [
          r.temperatura_masa && `${r.temperatura_masa}°`,
          r.brix && `Bx ${r.brix}`,
          r.ph && `pH ${r.ph}`,
        ]
          .filter(Boolean)
          .join(" · ");
        return (
          <li
            key={r.id}
            className={active ? "bg-neutral-50" : "hover:bg-neutral-50"}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <button
                type="button"
                onClick={() => onEdit(r.id)}
                className="min-w-0 flex-1 text-left"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-neutral-900">
                    {r.hora || "—"}
                  </span>
                  {r.lote && (
                    <span className="truncate text-xs text-neutral-500">
                      {r.lote}
                    </span>
                  )}
                </div>
                {metrics && (
                  <div className="mt-0.5 truncate text-xs text-neutral-500">
                    {metrics}
                  </div>
                )}
              </button>
              <button
                type="button"
                onClick={() => onDelete(r.id)}
                className="shrink-0 rounded px-2 py-1 text-xs text-neutral-400 hover:text-red-600"
                aria-label={t("common.remove", lang)}
              >
                {t("common.remove", lang)}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

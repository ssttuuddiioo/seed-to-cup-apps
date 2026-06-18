"use client";

import { useMemo, useRef, useState } from "react";
import { t, type Lang } from "@/lib/i18n";
import type { Producer } from "@/lib/reference";
import type { ProducerChoice } from "./types";

type Props = {
  lang: Lang;
  producers: Producer[];
  value: ProducerChoice | null;
  onChange: (v: ProducerChoice | null) => void;
};

export function ProducerTypeahead({ lang, producers, value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return producers.slice(0, 8);
    return producers
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.finca ?? "").toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [query, producers]);

  const exactMatch = useMemo(
    () =>
      producers.some(
        (p) => p.name.toLowerCase() === query.trim().toLowerCase(),
      ),
    [query, producers],
  );

  if (value) {
    const display =
      value.kind === "existing"
        ? {
            name: value.producer.name,
            finca: value.producer.finca,
            sub: [value.producer.municipio, value.producer.departamento]
              .filter(Boolean)
              .join(", "),
          }
        : { name: value.name, finca: value.finca, sub: null };

    return (
      <div className="rounded-md border border-neutral-200 bg-white px-3 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-base font-medium text-neutral-900">
              {display.name}
              {display.finca && (
                <span className="font-normal text-neutral-500"> · {display.finca}</span>
              )}
            </div>
            {display.sub && (
              <div className="truncate text-xs text-neutral-500">{display.sub}</div>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setQuery("");
            }}
            className="shrink-0 text-xs text-neutral-500 hover:text-neutral-900"
          >
            ×
          </button>
        </div>
        {value.kind === "new" && (
          <div className="mt-3 border-t border-neutral-100 pt-3">
            <label className="mb-1 block text-xs font-medium text-neutral-600">
              {t("setup.step2.producer_finca_label", lang)}
              <span className="ml-2 font-normal text-neutral-400">
                {t("common.optional", lang)}
              </span>
            </label>
            <input
              type="text"
              value={value.finca}
              onChange={(e) =>
                onChange({ kind: "new", name: value.name, finca: e.target.value })
              }
              placeholder={t("setup.step2.producer_finca_placeholder", lang)}
              className="block w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          // Defer so click on dropdown row can register first.
          setTimeout(() => setOpen(false), 120);
        }}
        placeholder={t("setup.step2.producer_placeholder", lang)}
        className="block w-full rounded-md border border-neutral-200 bg-white px-3 py-3 text-base text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none"
      />
      {open && (matches.length > 0 || query.trim().length > 0) && (
        <div className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-neutral-200 bg-white py-1 shadow-sm">
          {matches.map((p) => (
            <button
              key={p.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange({ kind: "existing", producer: p });
                setQuery("");
                setOpen(false);
              }}
              className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-50"
            >
              <div className="font-medium text-neutral-900">{p.name}</div>
              {(p.finca || p.municipio || p.departamento) && (
                <div className="text-xs text-neutral-500">
                  {[p.finca, p.municipio, p.departamento].filter(Boolean).join(" · ")}
                </div>
              )}
            </button>
          ))}
          {query.trim().length > 0 && !exactMatch && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange({ kind: "new", name: query.trim(), finca: "" });
                setQuery("");
                setOpen(false);
              }}
              className="block w-full border-t border-neutral-100 px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
            >
              + {t("setup.step2.producer_new", lang)}: <span className="font-medium text-neutral-900">{query.trim()}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { t, type Lang } from "@/lib/i18n";
import { CATA_CATEGORY_LABELS } from "@/lib/reference";
import type { CataGroup, CataOption } from "./descriptive-types";

type Props = {
  title: string;
  lang: Lang;
  groups: CataGroup[];
  selected: string[];
  max: number;
  onToggle: (id: string) => void;
  onClose: () => void;
};

function categoryLabel(key: string | null, lang: Lang): string {
  if (!key) return "";
  return CATA_CATEGORY_LABELS[key]?.[lang] ?? key.replace(/_/g, " ");
}

export function CataDrawer({
  title,
  lang,
  groups,
  selected,
  max,
  onToggle,
  onClose,
}: Props) {
  const [query, setQuery] = useState("");
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const full = selected.length >= max;

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        subgroups: g.subgroups
          .map((sg) => ({
            ...sg,
            options: sg.options.filter((o) =>
              o.labels[lang].toLowerCase().includes(q),
            ),
          }))
          .filter((sg) => sg.options.length > 0),
      }))
      .filter((g) => g.subgroups.length > 0);
  }, [groups, q, lang]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label={t("common.done", lang)}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/40"
      />
      <div className="relative flex max-h-[85vh] flex-col rounded-t-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div>
            <div className="text-sm font-medium text-neutral-900">{title}</div>
            <div className="text-xs text-neutral-500">
              {t("descriptive.picker_count", lang, {
                count: selected.length,
                max,
              })}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
          >
            {t("common.done", lang)}
          </button>
        </div>

        <div className="border-b border-neutral-200 px-5 py-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("common.search", lang)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
        </div>

        <div className="overflow-y-auto px-5 py-4">
          {filtered.map((group) => (
            <CategoryBlock
              key={group.key}
              group={group}
              lang={lang}
              selectedSet={selectedSet}
              full={full}
              defaultOpen={Boolean(q)}
              onToggle={onToggle}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryBlock({
  group,
  lang,
  selectedSet,
  full,
  defaultOpen,
  onToggle,
}: {
  group: CataGroup;
  lang: Lang;
  selectedSet: Set<string>;
  full: boolean;
  defaultOpen: boolean;
  onToggle: (id: string) => void;
}) {
  const selectedHere = group.subgroups.reduce(
    (n, sg) => n + sg.options.filter((o) => selectedSet.has(o.id)).length,
    0,
  );
  const [open, setOpen] = useState(defaultOpen || selectedHere > 0);

  return (
    <div className="border-b border-neutral-100 py-1 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-2 text-left"
      >
        <span className="text-sm font-medium text-neutral-700">
          {categoryLabel(group.key, lang)}
          {selectedHere > 0 && (
            <span className="ml-2 text-xs text-neutral-400">
              {selectedHere}
            </span>
          )}
        </span>
        <span className="text-neutral-400">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="pb-3">
          {group.subgroups.map((sg) => (
            <div key={sg.key ?? "_"} className="mb-2 last:mb-0">
              {sg.key && (
                <div className="mb-1 text-xs uppercase tracking-wide text-neutral-400">
                  {categoryLabel(sg.key, lang)}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {sg.options.map((opt) => (
                  <Chip
                    key={opt.id}
                    option={opt}
                    lang={lang}
                    selected={selectedSet.has(opt.id)}
                    disabled={full && !selectedSet.has(opt.id)}
                    onToggle={onToggle}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({
  option,
  lang,
  selected,
  disabled,
  onToggle,
}: {
  option: CataOption;
  lang: Lang;
  selected: boolean;
  disabled: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onToggle(option.id)}
      className={[
        "rounded-full border px-3 py-1.5 text-sm transition-colors",
        selected
          ? "border-neutral-900 bg-neutral-900 text-white"
          : "border-neutral-300 bg-white text-neutral-700",
        disabled ? "cursor-not-allowed opacity-40" : "",
      ].join(" ")}
    >
      {option.labels[lang]}
      {option.origen && (
        <span
          className={[
            "ml-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle",
            selected ? "bg-white" : "bg-neutral-400",
          ].join(" ")}
        />
      )}
    </button>
  );
}

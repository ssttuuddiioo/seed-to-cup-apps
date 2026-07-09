"use client";

import { useState } from "react";
import { t, type Lang } from "@/lib/i18n";
import { CataDrawer } from "./CataDrawer";
import type { CataGroup, CataOption } from "./descriptive-types";

type Props = {
  label: string;
  lang: Lang;
  groups: CataGroup[];
  optionIndex: Record<string, CataOption>;
  selected: string[];
  max: number;
  onChange: (ids: string[]) => void;
};

export function CataField({
  label,
  lang,
  groups,
  optionIndex,
  selected,
  max,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id));
    } else if (selected.length < max) {
      onChange([...selected, id]);
    }
  }

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-medium text-neutral-900">{label}</span>
        <span className="text-xs text-neutral-400">
          {t("descriptive.limit_hint", lang, { n: max })}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {selected.map((id) => {
          const opt = optionIndex[id];
          const text = opt ? opt.labels[lang] : id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-900 bg-neutral-900 px-3 py-1.5 text-sm text-white"
            >
              {text}
              {opt?.origen && (
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
              )}
              <span className="text-neutral-400">×</span>
            </button>
          );
        })}

        {selected.length < max && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full border border-dashed border-neutral-300 px-3 py-1.5 text-sm text-neutral-500 hover:border-neutral-400 hover:text-neutral-700"
          >
            + {t("descriptive.add_descriptors", lang)}
          </button>
        )}
      </div>

      {open && (
        <CataDrawer
          title={label}
          lang={lang}
          groups={groups}
          selected={selected}
          max={max}
          onToggle={toggle}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import type { Lang } from "@/lib/i18n";

type Props = {
  backHref: string;
  backLabel: string;
  lang: Lang;
  onLangChange: (l: Lang) => void;
  right?: React.ReactNode;
};

/** Shared top bar: back link, optional right slot (e.g. SyncStatus), ES/EN toggle.
 *  Mirrors the header used across the cupping flows. */
export function FermHeader({
  backHref,
  backLabel,
  lang,
  onLangChange,
  right,
}: Props) {
  return (
    <header className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-6 py-3">
      <Link
        href={backHref}
        className="min-w-0 truncate text-xs text-neutral-500 hover:text-neutral-900"
      >
        ← {backLabel}
      </Link>
      <div className="flex shrink-0 items-center gap-3">
        {right}
        <div className="flex items-center gap-1 text-xs">
          {(["es", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => onLangChange(l)}
              className={
                l === lang
                  ? "rounded px-2 py-1 font-medium text-neutral-900"
                  : "rounded px-2 py-1 text-neutral-400"
              }
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

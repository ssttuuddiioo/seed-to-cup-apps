"use client";

import { t, type Lang } from "@/lib/i18n";

type Props = {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
};

export function HeaderBar({ lang, onLangChange }: Props) {
  return (
    <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 sm:px-8">
      <span className="text-sm font-medium tracking-tight text-neutral-900">origen</span>
      <div className="flex items-center gap-1 text-xs text-neutral-500">
        <button
          type="button"
          onClick={() => onLangChange("es")}
          className={
            "rounded px-2 py-1 transition-colors " +
            (lang === "es" ? "text-neutral-900" : "hover:text-neutral-700")
          }
          aria-pressed={lang === "es"}
        >
          ES
        </button>
        <span className="text-neutral-300">/</span>
        <button
          type="button"
          onClick={() => onLangChange("en")}
          className={
            "rounded px-2 py-1 transition-colors " +
            (lang === "en" ? "text-neutral-900" : "hover:text-neutral-700")
          }
          aria-pressed={lang === "en"}
        >
          EN
        </button>
        <span className="sr-only">{t("setup.step1.lang_label", lang)}</span>
      </div>
    </header>
  );
}

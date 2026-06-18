"use client";

import { useState, type KeyboardEvent } from "react";
import { t, type Lang } from "@/lib/i18n";

type Props = {
  lang: Lang;
  title: string;
  location: string;
  cuppers: string[];
  onLangChange: (lang: Lang) => void;
  onTitleChange: (v: string) => void;
  onLocationChange: (v: string) => void;
  onCuppersChange: (v: string[]) => void;
  onContinue: () => void;
};

const MAX_CUPPERS = 5;

export function Step1Details({
  lang,
  title,
  location,
  cuppers,
  onLangChange,
  onTitleChange,
  onLocationChange,
  onCuppersChange,
  onContinue,
}: Props) {
  const [cupperInput, setCupperInput] = useState("");

  const canContinue = title.trim().length > 0 && cuppers.length > 0;

  function addCupper() {
    const v = cupperInput.trim().toUpperCase();
    if (!v) return;
    if (cuppers.length >= MAX_CUPPERS) return;
    if (cuppers.includes(v)) {
      setCupperInput("");
      return;
    }
    onCuppersChange([...cuppers, v]);
    setCupperInput("");
  }

  function onCupperKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addCupper();
    } else if (e.key === "Backspace" && cupperInput === "" && cuppers.length > 0) {
      onCuppersChange(cuppers.slice(0, -1));
    }
  }

  return (
    <div className="mx-auto w-full max-w-[640px] px-6 py-12 sm:py-16">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl font-medium tracking-tight text-neutral-900">
          {t("setup.step1.title", lang)}
        </h1>
        <p className="mt-2 text-base text-neutral-500">
          {t("setup.step1.subtitle", lang)}
        </p>
      </div>

      <div className="space-y-6">
        <Field
          label={t("setup.step1.title_label", lang)}
          hint={t("common.required", lang)}
        >
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder={t("setup.step1.title_placeholder", lang)}
            className="block w-full rounded-md border border-neutral-200 bg-white px-3 py-3 text-base text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none"
          />
        </Field>

        <Field
          label={t("setup.step1.location_label", lang)}
          hint={t("common.optional", lang)}
        >
          <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder={t("setup.step1.location_placeholder", lang)}
            className="block w-full rounded-md border border-neutral-200 bg-white px-3 py-3 text-base text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none"
          />
        </Field>

        <Field label={t("setup.step1.lang_label", lang)}>
          <div className="inline-flex rounded-md border border-neutral-200 bg-white p-1">
            <SegmentBtn active={lang === "es"} onClick={() => onLangChange("es")}>
              {t("lang.es", lang)}
            </SegmentBtn>
            <SegmentBtn active={lang === "en"} onClick={() => onLangChange("en")}>
              {t("lang.en", lang)}
            </SegmentBtn>
          </div>
        </Field>

        <Field
          label={t("setup.step1.cuppers_label", lang)}
          hint={t("setup.step1.cuppers_hint", lang)}
        >
          <div className="flex flex-wrap items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2">
            {cuppers.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-900"
              >
                {c}
                <button
                  type="button"
                  onClick={() => onCuppersChange(cuppers.filter((x) => x !== c))}
                  className="text-neutral-400 hover:text-neutral-700"
                  aria-label={t("common.remove", lang)}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              value={cupperInput}
              onChange={(e) => setCupperInput(e.target.value.slice(0, 4))}
              onKeyDown={onCupperKey}
              onBlur={addCupper}
              placeholder={
                cuppers.length === 0 ? t("setup.step1.cuppers_placeholder", lang) : ""
              }
              disabled={cuppers.length >= MAX_CUPPERS}
              className="flex-1 min-w-[60px] bg-transparent py-1 text-base uppercase tracking-widest text-neutral-900 placeholder-neutral-400 focus:outline-none"
            />
          </div>
          {cuppers.length >= MAX_CUPPERS && (
            <p className="mt-1 text-xs text-neutral-400">
              {t("setup.step1.cuppers_max_reached", lang)}
            </p>
          )}
        </Field>
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        className={
          "mt-10 block h-12 w-full rounded-md text-sm font-medium transition-opacity " +
          (canContinue
            ? "bg-origen-orange text-white hover:opacity-90"
            : "bg-neutral-200 text-neutral-400")
        }
      >
        {t("common.continue", lang)}
      </button>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="text-sm font-medium text-neutral-900">{label}</label>
        {hint && <span className="text-xs text-neutral-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function SegmentBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded px-4 py-2 text-sm font-medium transition-colors " +
        (active
          ? "bg-neutral-900 text-white"
          : "text-neutral-600 hover:text-neutral-900")
      }
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

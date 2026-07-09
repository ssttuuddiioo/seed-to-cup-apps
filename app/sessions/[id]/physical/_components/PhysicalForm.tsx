"use client";

import { t, type Lang } from "@/lib/i18n";
import {
  BROCA_STATES,
  COLOMBIAN_DEFECTS,
  FNC_GRADES,
  ROAST_LEVELS,
  SCREEN_SIZES,
  type Bilingual,
  type PhysicalValue,
} from "./physical-types";

type Props = {
  lang: Lang;
  value: PhysicalValue;
  onChange: (next: PhysicalValue) => void;
};

export function PhysicalForm({ lang, value, onChange }: Props) {
  const set = <K extends keyof PhysicalValue>(key: K, v: PhysicalValue[K]) =>
    onChange({ ...value, [key]: v });

  function toggleDefect(id: string) {
    const has = value.colombian_defects.includes(id);
    set(
      "colombian_defects",
      has
        ? value.colombian_defects.filter((x) => x !== id)
        : [...value.colombian_defects, id],
    );
  }

  return (
    <div className="space-y-8">
      <section className="space-y-5">
        <Heading>{t("physical.green_heading", lang)}</Heading>

        <Field label={t("physical.fnc_grade", lang)}>
          <PillGroup
            options={FNC_GRADES}
            lang={lang}
            value={value.fnc_grade}
            onChange={(v) => set("fnc_grade", v)}
          />
        </Field>

        <Field label={t("physical.screen_size", lang)}>
          <PillGroup
            options={SCREEN_SIZES.map((n) => ({
              id: String(n),
              labels: { es: `${n}/64`, en: `${n}/64` },
            }))}
            lang={lang}
            value={value.screen_size === null ? null : String(value.screen_size)}
            onChange={(v) => set("screen_size", v === null ? null : Number(v))}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label={t("physical.moisture", lang)}
            value={value.moisture_pct}
            onChange={(v) => set("moisture_pct", v)}
            step="0.1"
          />
          <NumberField
            label={t("physical.water_activity", lang)}
            value={value.water_activity}
            onChange={(v) => set("water_activity", v)}
            step="0.01"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label={t("physical.primary_defects", lang)}
            value={value.primary_defects}
            onChange={(v) => set("primary_defects", v)}
          />
          <NumberField
            label={t("physical.secondary_defects", lang)}
            value={value.secondary_defects}
            onChange={(v) => set("secondary_defects", v)}
          />
        </div>

        <Field label={t("physical.broca", lang)}>
          <PillGroup
            options={BROCA_STATES}
            lang={lang}
            value={value.broca}
            onChange={(v) => set("broca", v)}
          />
        </Field>

        <Field label={t("physical.colombian_defects", lang)}>
          <div className="flex flex-wrap gap-2">
            {COLOMBIAN_DEFECTS.map((d) => {
              const on = value.colombian_defects.includes(d.id);
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggleDefect(d.id)}
                  className={[
                    "rounded-full border px-3 py-1.5 text-sm transition-colors",
                    on
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-300 bg-white text-neutral-700",
                  ].join(" ")}
                >
                  {d.labels[lang]}
                </button>
              );
            })}
          </div>
        </Field>
      </section>

      <section className="space-y-5 border-t border-neutral-100 pt-8">
        <Heading>{t("physical.roast_heading", lang)}</Heading>

        <Field label={t("physical.roast_level", lang)}>
          <PillGroup
            options={ROAST_LEVELS}
            lang={lang}
            value={value.roast_level}
            onChange={(v) => set("roast_level", v)}
          />
        </Field>

        <NumberField
          label={t("physical.quakers", lang)}
          value={value.quakers}
          onChange={(v) => set("quakers", v)}
        />
      </section>

      <section className="border-t border-neutral-100 pt-8">
        <Field label={t("physical.notes_label", lang)}>
          <textarea
            value={value.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder={t("physical.notes_placeholder", lang)}
            rows={2}
            className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
        </Field>
      </section>
    </div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-medium uppercase tracking-[0.08em] text-neutral-400">
      {children}
    </h2>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 text-sm font-medium text-neutral-900">{label}</div>
      {children}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-neutral-900">
        {label}
      </span>
      <input
        type="number"
        inputMode="decimal"
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
      />
    </label>
  );
}

function PillGroup({
  options,
  lang,
  value,
  onChange,
}: {
  options: { id: string; labels: Bilingual }[];
  lang: Lang;
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const on = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(on ? null : opt.id)}
            className={[
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              on
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-300 bg-white text-neutral-700",
            ].join(" ")}
          >
            {opt.labels[lang]}
          </button>
        );
      })}
    </div>
  );
}

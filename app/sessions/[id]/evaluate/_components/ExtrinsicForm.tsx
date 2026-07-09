"use client";

import { t, type Lang } from "@/lib/i18n";
import { HedonicScale } from "./HedonicScale";
import {
  CERTIFICATIONS,
  EXTRINSIC_KEYS,
  type ExtrinsicKey,
  type ExtrinsicValue,
} from "./extrinsic-types";

type Props = {
  lang: Lang;
  value: ExtrinsicValue;
  onChange: (next: ExtrinsicValue) => void;
};

export function ExtrinsicForm({ lang, value, onChange }: Props) {
  function setImpression(key: ExtrinsicKey, n: number) {
    onChange({ ...value, impressions: { ...value.impressions, [key]: n } });
  }
  function toggleCert(id: string) {
    const has = value.certifications.includes(id);
    onChange({
      ...value,
      certifications: has
        ? value.certifications.filter((x) => x !== id)
        : [...value.certifications, id],
    });
  }

  return (
    <div className="space-y-7">
      <section className="space-y-5">
        {EXTRINSIC_KEYS.map((key) => (
          <HedonicScale
            key={key}
            label={t(`extrinsic.dimension.${key}`, lang)}
            value={value.impressions[key]}
            onChange={(n) => setImpression(key, n)}
          />
        ))}
      </section>

      <section className="space-y-3 border-t border-neutral-100 pt-7">
        <div className="text-sm font-medium text-neutral-900">
          {t("extrinsic.certifications", lang)}
        </div>
        <div className="flex flex-wrap gap-2">
          {CERTIFICATIONS.map((c) => {
            const on = value.certifications.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCert(c.id)}
                className={[
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  on
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 bg-white text-neutral-700",
                ].join(" ")}
              >
                {c.labels[lang]}
              </button>
            );
          })}
        </div>
      </section>

      <section className="border-t border-neutral-100 pt-7">
        <label className="mb-2 block text-sm font-medium text-neutral-900">
          {t("extrinsic.notes_label", lang)}
        </label>
        <textarea
          value={value.notes}
          onChange={(e) => onChange({ ...value, notes: e.target.value })}
          placeholder={t("extrinsic.notes_placeholder", lang)}
          rows={2}
          className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
        />
      </section>
    </div>
  );
}

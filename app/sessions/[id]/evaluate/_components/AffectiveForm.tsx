"use client";

import { t, type Lang } from "@/lib/i18n";
import { HedonicScale } from "./HedonicScale";
import {
  DEFECT_KEYS,
  HEDONIC_KEYS,
  TOTAL_CUPS,
  affectiveScore,
  clampUniformity,
  type AffectiveValue,
  type HedonicKey,
} from "./affective-types";

type Props = {
  lang: Lang;
  value: AffectiveValue;
  onChange: (next: AffectiveValue) => void;
};

export function AffectiveForm({ lang, value, onChange }: Props) {
  const score = affectiveScore(value);

  function setHedonic(key: HedonicKey, n: number) {
    onChange({ ...value, hedonic: { ...value.hedonic, [key]: n } });
  }
  function setUniform(n: number) {
    onChange({ ...value, uniform_cups: clampUniformity(n, value.defective_cups) });
  }
  function setDefective(n: number) {
    onChange({
      ...value,
      defective_cups: n,
      uniform_cups: clampUniformity(value.uniform_cups, n),
      defects:
        n === 0 ? { moldy: false, phenolic: false, potato: false } : value.defects,
    });
  }
  function toggleDefect(key: (typeof DEFECT_KEYS)[number]) {
    onChange({
      ...value,
      defects: { ...value.defects, [key]: !value.defects[key] },
    });
  }

  return (
    <div className="space-y-7">
      <section className="space-y-5">
        {HEDONIC_KEYS.map((key) => (
          <HedonicScale
            key={key}
            label={t(`affective.hedonic.${key}`, lang)}
            value={value.hedonic[key]}
            onChange={(n) => setHedonic(key, n)}
          />
        ))}
      </section>

      <section className="space-y-5 border-t border-neutral-100 pt-7">
        <CupCount
          label={t("affective.uniformity", lang)}
          help={t("affective.uniformity_help", lang)}
          value={value.uniform_cups}
          onChange={setUniform}
        />
        <CupCount
          label={t("affective.defects", lang)}
          help={t("affective.defects_help", lang)}
          value={value.defective_cups}
          onChange={setDefective}
        />

        {value.defective_cups > 0 && (
          <div className="flex flex-wrap gap-2">
            {DEFECT_KEYS.map((d) => {
              const on = value.defects[d];
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDefect(d)}
                  className={[
                    "rounded-full border px-3 py-1.5 text-sm transition-colors",
                    on
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-300 bg-white text-neutral-700",
                  ].join(" ")}
                >
                  {t(`affective.defect.${d}`, lang)}
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="flex items-baseline justify-between border-t border-neutral-100 pt-7">
        <span className="text-sm font-medium text-neutral-900">
          {t("affective.score_label", lang)}
        </span>
        <span className="tabular-nums text-3xl font-medium text-neutral-900">
          {score === null ? "–" : score.toFixed(2)}
        </span>
      </section>
    </div>
  );
}

function CupCount({
  label,
  help,
  value,
  onChange,
}: {
  label: string;
  help: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-sm font-medium text-neutral-900">{label}</span>
        <span className="text-xs text-neutral-400">{help}</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: TOTAL_CUPS + 1 }, (_, i) => i).map((n) => {
          const on = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={[
                "h-9 flex-1 rounded-md text-sm font-medium transition-colors",
                on
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200",
              ].join(" ")}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

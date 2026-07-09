"use client";

import { t, type Lang } from "@/lib/i18n";
import { IntensitySlider } from "./IntensitySlider";
import { CataField } from "./CataField";
import {
  CATA_LIMITS,
  type CataGroup,
  type CataKey,
  type CataOption,
  type DescriptiveValue,
  type IntensityKey,
} from "./descriptive-types";

type Props = {
  lang: Lang;
  value: DescriptiveValue;
  cataGroups: Record<CataKey, CataGroup[]>;
  optionIndex: Record<string, CataOption>;
  onChange: (next: DescriptiveValue) => void;
};

export function DescriptiveForm({
  lang,
  value,
  cataGroups,
  optionIndex,
  onChange,
}: Props) {
  function setIntensity(key: IntensityKey, n: number) {
    onChange({ ...value, intensity: { ...value.intensity, [key]: n } });
  }
  function setCata(key: CataKey, ids: string[]) {
    onChange({ ...value, cata: { ...value.cata, [key]: ids } });
  }

  const slider = (key: IntensityKey) => (
    <IntensitySlider
      label={t(`descriptive.intensity.${key}`, lang)}
      value={value.intensity[key]}
      onChange={(n) => setIntensity(key, n)}
    />
  );

  const field = (key: CataKey) => (
    <CataField
      label={t(`descriptive.cata.${key}`, lang)}
      lang={lang}
      groups={cataGroups[key]}
      optionIndex={optionIndex}
      selected={value.cata[key]}
      max={CATA_LIMITS[key]}
      onChange={(ids) => setCata(key, ids)}
    />
  );

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        {slider("fragrance_aroma")}
        {field("fragrance_aroma")}
      </section>

      <section className="space-y-3 border-t border-neutral-100 pt-8">
        {slider("flavor_aftertaste")}
        {field("flavor_aftertaste")}
      </section>

      <section className="space-y-4 border-t border-neutral-100 pt-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {slider("acidity")}
          {slider("sweetness")}
        </div>
        {field("main_tastes")}
      </section>

      <section className="space-y-3 border-t border-neutral-100 pt-8">
        {slider("mouthfeel")}
        {field("mouthfeel")}
      </section>

      <section className="border-t border-neutral-100 pt-8">
        <label className="mb-2 block text-sm font-medium text-neutral-900">
          {t("descriptive.notes_label", lang)}
        </label>
        <textarea
          value={value.notes}
          onChange={(e) => onChange({ ...value, notes: e.target.value })}
          placeholder={t("descriptive.notes_placeholder", lang)}
          rows={2}
          className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
        />
      </section>
    </div>
  );
}

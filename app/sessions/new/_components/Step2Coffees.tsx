"use client";

import { useMemo } from "react";
import { t, type Lang } from "@/lib/i18n";
import type { Process, Producer, Region, Variety } from "@/lib/reference";
import { ZONE_LABELS } from "@/lib/reference";
import { ProducerTypeahead } from "./ProducerTypeahead";
import { emptyCoffee, isCoffeeReady, type CoffeeDraft } from "./types";

const MAX_COFFEES = 8;

type Props = {
  lang: Lang;
  coffees: CoffeeDraft[];
  varieties: Variety[];
  processes: Process[];
  regions: Region[];
  producers: Producer[];
  onCoffeesChange: (next: CoffeeDraft[]) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function Step2Coffees({
  lang,
  coffees,
  varieties,
  processes,
  regions,
  producers,
  onCoffeesChange,
  onBack,
  onContinue,
}: Props) {
  const sortedVarieties = useMemo(
    () =>
      [...varieties].sort((a, b) => {
        if (a.mvp !== b.mvp) return a.mvp ? -1 : 1;
        return a.labels[lang].localeCompare(b.labels[lang]);
      }),
    [varieties, lang],
  );

  const sortedProcesses = useMemo(
    () =>
      [...processes].sort((a, b) => {
        if (a.mvp !== b.mvp) return a.mvp ? -1 : 1;
        return a.labels[lang].localeCompare(b.labels[lang]);
      }),
    [processes, lang],
  );

  const regionsByZone = useMemo(() => {
    const map = new Map<string, Region[]>();
    for (const r of regions) {
      if (!map.has(r.zone_id)) map.set(r.zone_id, []);
      map.get(r.zone_id)!.push(r);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.label[lang].localeCompare(b.label[lang]));
    }
    return map;
  }, [regions, lang]);

  function patch(localId: string, p: Partial<CoffeeDraft>) {
    onCoffeesChange(coffees.map((c) => (c.localId === localId ? { ...c, ...p } : c)));
  }

  function addCoffee() {
    if (coffees.length >= MAX_COFFEES) return;
    onCoffeesChange([...coffees, emptyCoffee()]);
  }

  function removeCoffee(localId: string) {
    if (coffees.length === 1) {
      onCoffeesChange([emptyCoffee()]);
      return;
    }
    onCoffeesChange(coffees.filter((c) => c.localId !== localId));
  }

  const canContinue = coffees.some(isCoffeeReady);

  return (
    <div className="mx-auto w-full max-w-[760px] px-6 py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-medium tracking-tight text-neutral-900">
          {t("setup.step2.title", lang)}
        </h1>
        <p className="mt-2 text-base text-neutral-500">
          {t("setup.step2.subtitle", lang)}
        </p>
      </div>

      <div className="space-y-4">
        {coffees.map((coffee, idx) => (
          <CoffeeCard
            key={coffee.localId}
            lang={lang}
            index={idx}
            coffee={coffee}
            varieties={sortedVarieties}
            processes={sortedProcesses}
            regionsByZone={regionsByZone}
            producers={producers}
            onPatch={(p) => patch(coffee.localId, p)}
            onRemove={() => removeCoffee(coffee.localId)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={addCoffee}
        disabled={coffees.length >= MAX_COFFEES}
        className={
          "mt-4 block h-12 w-full rounded-md border border-neutral-200 bg-white text-sm font-medium text-neutral-900 transition-colors " +
          (coffees.length >= MAX_COFFEES
            ? "cursor-not-allowed text-neutral-400"
            : "hover:bg-neutral-50")
        }
      >
        + {t("setup.step2.add_coffee", lang)}
      </button>
      {coffees.length >= MAX_COFFEES && (
        <p className="mt-2 text-center text-xs text-neutral-400">
          {t("setup.step2.max_reached", lang)}
        </p>
      )}

      <div className="sticky bottom-0 mt-12 flex items-center justify-between gap-3 border-t border-neutral-200 bg-white py-4">
        <button
          type="button"
          onClick={onBack}
          className="h-12 rounded-md px-5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          {t("common.back", lang)}
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className={
            "h-12 rounded-md px-6 text-sm font-medium transition-opacity " +
            (canContinue
              ? "bg-origen-orange text-white hover:opacity-90"
              : "bg-neutral-200 text-neutral-400")
          }
        >
          {t("setup.step2.generate_codes", lang)}
        </button>
      </div>
    </div>
  );
}

function CoffeeCard({
  lang,
  index,
  coffee,
  varieties,
  processes,
  regionsByZone,
  producers,
  onPatch,
  onRemove,
}: {
  lang: Lang;
  index: number;
  coffee: CoffeeDraft;
  varieties: Variety[];
  processes: Process[];
  regionsByZone: Map<string, Region[]>;
  producers: Producer[];
  onPatch: (p: Partial<CoffeeDraft>) => void;
  onRemove: () => void;
}) {
  function toggleVariety(id: string) {
    const has = coffee.varieties.includes(id);
    onPatch({
      varieties: has
        ? coffee.varieties.filter((v) => v !== id)
        : [...coffee.varieties, id],
    });
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.08em] text-neutral-500">
          {t("setup.step2.card_label", lang)} {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          aria-label={t("common.remove", lang)}
          className="text-neutral-400 hover:text-neutral-900"
          title={t("common.remove", lang)}
        >
          <TrashIcon />
        </button>
      </div>

      <FieldLabel
        label={t("setup.step2.producer_label", lang)}
        hint={t("common.required", lang)}
      />
      <ProducerTypeahead
        lang={lang}
        producers={producers}
        value={coffee.producer}
        onChange={(v) => onPatch({ producer: v })}
      />

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel
            label={t("setup.step2.variety_label", lang)}
            hint={t("common.required", lang)}
          />
          <VarietySelect
            lang={lang}
            varieties={varieties}
            selected={coffee.varieties}
            onToggle={toggleVariety}
          />
        </div>
        <div>
          <FieldLabel label={t("setup.step2.process_label", lang)} />
          <select
            value={coffee.process ?? ""}
            onChange={(e) => onPatch({ process: e.target.value || null })}
            className="block h-12 w-full rounded-md border border-neutral-200 bg-white px-3 text-base text-neutral-900 focus:border-neutral-900 focus:outline-none"
          >
            <option value="">{t("setup.step2.process_placeholder", lang)}</option>
            {processes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.labels[lang]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel label={t("setup.step2.region_label", lang)} />
          <select
            value={coffee.region_id ?? ""}
            onChange={(e) => onPatch({ region_id: e.target.value || null })}
            className="block h-12 w-full rounded-md border border-neutral-200 bg-white px-3 text-base text-neutral-900 focus:border-neutral-900 focus:outline-none"
          >
            <option value="">{t("setup.step2.region_placeholder", lang)}</option>
            {[...regionsByZone.entries()].map(([zoneId, list]) => (
              <optgroup
                key={zoneId}
                label={ZONE_LABELS[zoneId]?.[lang] ?? zoneId}
              >
                {list.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label[lang]}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel label={t("setup.step2.altitude_label", lang)} />
          <div className="flex h-12 items-center rounded-md border border-neutral-200 bg-white pl-3 pr-1 focus-within:border-neutral-900">
            <input
              type="number"
              inputMode="numeric"
              value={coffee.altitude}
              onChange={(e) => onPatch({ altitude: e.target.value })}
              placeholder="1650"
              className="w-full bg-transparent text-base text-neutral-900 placeholder-neutral-400 focus:outline-none"
            />
            <span className="px-2 text-xs text-neutral-400">
              {t("setup.step2.altitude_suffix", lang)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel
            label={t("setup.step2.lot_code_label", lang)}
            hint={t("common.optional", lang)}
          />
          <input
            type="text"
            value={coffee.lot_code}
            onChange={(e) => onPatch({ lot_code: e.target.value })}
            placeholder={t("setup.step2.lot_code_placeholder", lang)}
            className="block h-12 w-full rounded-md border border-neutral-200 bg-white px-3 text-base text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <FieldLabel
            label={t("setup.step2.notes_label", lang)}
            hint={t("common.optional", lang)}
          />
          <input
            type="text"
            value={coffee.notes}
            onChange={(e) => onPatch({ notes: e.target.value })}
            placeholder={t("setup.step2.notes_placeholder", lang)}
            className="block h-12 w-full rounded-md border border-neutral-200 bg-white px-3 text-base text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function VarietySelect({
  lang,
  varieties,
  selected,
  onToggle,
}: {
  lang: Lang;
  varieties: Variety[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 rounded-md border border-neutral-200 bg-white p-2">
      {varieties.map((v) => {
        const isOn = selected.includes(v.id);
        return (
          <button
            key={v.id}
            type="button"
            onClick={() => onToggle(v.id)}
            className={
              "rounded-full px-3 py-1.5 text-sm transition-colors " +
              (isOn
                ? "bg-neutral-900 text-white"
                : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100")
            }
            aria-pressed={isOn}
          >
            {v.labels[lang]}
          </button>
        );
      })}
    </div>
  );
}

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between">
      <span className="text-sm font-medium text-neutral-900">{label}</span>
      {hint && <span className="text-xs text-neutral-400">{hint}</span>}
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M2.5 4h11M6 4V2.5h4V4M4 4l.6 9a1 1 0 0 0 1 1h4.8a1 1 0 0 0 1-1L12 4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

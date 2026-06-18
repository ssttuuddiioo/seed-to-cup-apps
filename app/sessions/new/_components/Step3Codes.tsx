"use client";

import { t, type Lang } from "@/lib/i18n";

type Props = {
  lang: Lang;
  codes: string[];
  saving: boolean;
  error: string | null;
  onBack: () => void;
  onConfirm: () => void;
};

export function Step3Codes({ lang, codes, saving, error, onBack, onConfirm }: Props) {
  return (
    <div className="mx-auto w-full max-w-[760px] px-6 py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-medium tracking-tight text-neutral-900">
          {t("setup.step3.title", lang)}
        </h1>
        <p className="mt-2 text-base text-neutral-500">
          {t("setup.step3.subtitle", lang)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {codes.map((code) => (
          <div
            key={code}
            className="flex aspect-square flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white p-6"
          >
            <span className="text-7xl font-medium leading-none tracking-tight text-neutral-900">
              {code}
            </span>
            <span className="mt-3 text-xs text-neutral-400">
              {t("setup.step3.card_status", lang)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl bg-neutral-50 p-4">
        <div className="text-xs font-medium uppercase tracking-[0.08em] text-neutral-500">
          {t("setup.step3.reminder_title", lang)}
        </div>
        <p className="mt-1 text-sm text-neutral-700">
          {t("setup.step3.reminder_body", lang)}
        </p>
      </div>

      {error && (
        <p className="mt-6 text-sm text-neutral-700">{error}</p>
      )}

      <div className="sticky bottom-0 mt-10 flex items-center justify-between gap-3 border-t border-neutral-200 bg-white py-4">
        <button
          type="button"
          onClick={onBack}
          disabled={saving}
          className="h-12 rounded-md px-5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
        >
          {t("common.back", lang)}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={saving}
          className="h-12 rounded-md bg-origen-orange px-6 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 sm:min-w-[280px]"
        >
          {saving ? t("common.saving", lang) : t("setup.step3.confirm", lang)}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_LANG, t, type Lang } from "@/lib/i18n";
import { createSession, getOperator, setOperator } from "@/lib/fermentacion/store";
import { todayISO } from "@/lib/fermentacion/datetime";
import { FermHeader } from "../../_components/FermHeader";

export function NewSessionForm() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
  const [finca, setFinca] = useState("");
  const [fecha, setFecha] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Defaults filled after mount (device date + remembered operator) to keep SSR
  // markup stable.
  useEffect(() => {
    setFecha(todayISO());
    void getOperator().then((op) => op && setCreatedBy(op));
  }, []);

  const canSave = finca.trim().length > 0 && fecha.length > 0 && !saving;

  async function onSubmit() {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    try {
      if (createdBy.trim()) await setOperator(createdBy);
      const id = await createSession({
        finca,
        fecha,
        created_by: createdBy.trim() || null,
      });
      router.push(`/fermentacion/${id}`);
    } catch (err) {
      console.error(err);
      setError(t("fermentacion.new.save_error", lang));
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <FermHeader
        backHref="/fermentacion"
        backLabel={t("fermentacion.title", lang)}
        lang={lang}
        onLangChange={setLang}
      />

      <main className="mx-auto max-w-2xl px-6 pb-24 pt-8">
        <header className="mb-8">
          <h1 className="text-2xl font-medium tracking-tight text-neutral-900">
            {t("fermentacion.new.title", lang)}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t("fermentacion.new.subtitle", lang)}
          </p>
        </header>

        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-900">
              {t("fermentacion.new.finca", lang)}
            </span>
            <input
              type="text"
              value={finca}
              onChange={(e) => setFinca(e.target.value)}
              placeholder={t("fermentacion.new.finca_placeholder", lang)}
              className="block w-full rounded-md border border-neutral-200 bg-white px-3 py-3 text-base text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-900">
              {t("fermentacion.new.fecha", lang)}
            </span>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="block w-full rounded-md border border-neutral-200 bg-white px-3 py-3 text-base text-neutral-900 focus:border-neutral-900 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-900">
              {t("fermentacion.new.created_by", lang)}
              <span className="ml-2 text-xs font-normal text-neutral-400">
                {t("common.optional", lang)}
              </span>
            </span>
            <input
              type="text"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              placeholder={t("fermentacion.new.created_by_placeholder", lang)}
              className="block w-full rounded-md border border-neutral-200 bg-white px-3 py-3 text-base text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none"
            />
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSave}
          className={
            "mt-8 block h-12 w-full rounded-md text-sm font-medium transition-opacity " +
            (canSave
              ? "bg-origen-orange text-white hover:opacity-90"
              : "bg-neutral-200 text-neutral-400")
          }
        >
          {saving
            ? t("common.saving", lang)
            : t("fermentacion.new.create", lang)}
        </button>
      </main>
    </div>
  );
}

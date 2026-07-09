"use client";

import { useState } from "react";
import Link from "next/link";
import { DEFAULT_LANG, formatDate, plural, t, type Lang } from "@/lib/i18n";
import { useFermentacion } from "@/lib/fermentacion/store";
import { FermHeader } from "./FermHeader";
import { SyncStatus } from "./SyncStatus";

export function FermentacionList() {
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
  const { sessions, readings, pendingCount, online, hydrated } =
    useFermentacion();

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <FermHeader
        backHref="/"
        backLabel={t("fermentacion.back_home", lang)}
        lang={lang}
        onLangChange={setLang}
        right={
          <SyncStatus online={online} pendingCount={pendingCount} lang={lang} />
        }
      />

      <main className="mx-auto max-w-2xl px-6 pb-24 pt-8">
        <header className="mb-10">
          <h1 className="text-2xl font-medium tracking-tight text-neutral-900">
            {t("fermentacion.title", lang)}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t("fermentacion.subtitle", lang)}
          </p>
        </header>

        <section className="mb-10">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.08em] text-neutral-500">
            {t("fermentacion.sessions_heading", lang)}
          </h2>

          {!hydrated ? (
            <div className="rounded-lg border border-neutral-200 bg-white px-6 py-10 text-center text-sm text-neutral-400">
              {t("common.saving", lang)}
            </div>
          ) : sessions.length === 0 ? (
            <div className="rounded-lg border border-neutral-200 bg-white px-6 py-10 text-center text-sm text-neutral-500">
              {t("fermentacion.empty", lang)}
            </div>
          ) : (
            <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200">
              {sessions.map((s) => {
                const count = readings[s.id]?.length ?? 0;
                return (
                  <li key={s.id}>
                    <Link
                      href={`/fermentacion/${s.id}`}
                      className="block px-5 py-4 hover:bg-neutral-50"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <div className="min-w-0 truncate text-sm font-medium text-neutral-900">
                          {s.finca}
                        </div>
                        <div className="shrink-0 text-xs text-neutral-400">
                          {formatDate(s.fecha, lang)}
                        </div>
                      </div>
                      <div className="mt-1 truncate text-xs text-neutral-500">
                        {[
                          s.created_by,
                          plural("fermentacion.readings_count", count, lang),
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <Link
          href="/fermentacion/new"
          className="inline-block rounded-md bg-origen-orange px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-origen-orange focus:ring-offset-2"
        >
          {t("fermentacion.new_session", lang)}
        </Link>
      </main>
    </div>
  );
}

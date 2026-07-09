import Link from "next/link";
import { notFound } from "next/navigation";
import { t } from "@/lib/i18n";
import { fetchSessionResults } from "@/lib/results";

export const dynamic = "force-dynamic";

type Params = { id: string };

export default async function RevealPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const data = await fetchSessionResults(id, "es");
  if (!data) notFound();

  const lang = data.session.lang === "en" ? "en" : "es";

  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-12">
      <Link
        href={`/sessions/${id}`}
        className="text-xs text-neutral-500 hover:text-neutral-900"
      >
        ← {t("reveal.back_to_session", lang)}
      </Link>

      <header className="mt-6 mb-8">
        <h1 className="text-3xl font-medium tracking-tight text-neutral-900">
          {t("reveal.title", lang)}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          {t("reveal.subtitle", lang)}
        </p>
      </header>

      <ul className="space-y-4">
        {data.results.map((r, i) => (
          <li
            key={r.sampleId}
            className="rounded-xl border border-neutral-200 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <span>
                    {t("reveal.rank", lang)} {i + 1}
                  </span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-100 font-medium text-neutral-600">
                    {r.blindCode}
                  </span>
                </div>
                <div className="mt-1 truncate text-base font-medium text-neutral-900">
                  {r.coffee.producerName}
                </div>
                <div className="truncate text-sm text-neutral-500">
                  {[
                    r.coffee.finca,
                    r.coffee.varieties.join(", ") || null,
                    r.coffee.process,
                    r.coffee.region,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div className="tabular-nums text-3xl font-medium text-neutral-900">
                  {r.mean === null ? "–" : r.mean.toFixed(2)}
                </div>
                <div className="text-[11px] text-neutral-400">
                  {r.mean === null
                    ? t("reveal.no_scores", lang)
                    : t("reveal.cuppers_scored", lang, { count: r.cupperCount })}
                </div>
              </div>
            </div>

            {r.spread !== null && r.cupperCount > 1 && (
              <div className="mt-3 text-xs text-neutral-400">
                {t("reveal.spread", lang)}: {r.min?.toFixed(2)}–{r.max?.toFixed(2)}
              </div>
            )}

            {r.topDescriptors.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {r.topDescriptors.map((d) => (
                  <span
                    key={d.id}
                    className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600"
                  >
                    {d.label}
                    {d.count > 1 && (
                      <span className="ml-1 text-neutral-400">{d.count}</span>
                    )}
                  </span>
                ))}
              </div>
            )}

            <Link
              href={`/sessions/${id}/card/${r.sampleId}`}
              className="mt-4 inline-block text-sm font-medium text-origen-orange hover:opacity-80"
            >
              {t("reveal.view_card", lang)} →
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

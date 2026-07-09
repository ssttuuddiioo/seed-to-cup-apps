import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, plural, t, type Lang } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

type Params = { id: string };

type SessionRow = {
  id: string;
  title: string;
  location: string | null;
  lang: Lang;
  cuppers: string[];
  started_at: string;
};

type SampleRow = {
  id: string;
  blind_code: string;
};

export default async function SessionPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  const { data: session } = await supabase
    .from("sessions")
    .select("id, title, location, lang, cuppers, started_at")
    .eq("id", id)
    .maybeSingle<SessionRow>();

  if (!session) notFound();

  const { data: sampleRows } = await supabase
    .from("samples")
    .select("id, blind_code")
    .eq("session_id", id)
    .order("blind_code");

  const samples: SampleRow[] = sampleRows ?? [];
  const lang: Lang = session.lang === "en" ? "en" : "es";
  const cuppers = Array.isArray(session.cuppers) ? session.cuppers : [];

  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-16">
      <Link
        href="/"
        className="text-xs text-neutral-500 hover:text-neutral-900"
      >
        ← {t("session_detail.back_home", lang)}
      </Link>

      <header className="mt-6">
        <h1 className="text-3xl font-medium tracking-tight text-neutral-900">
          {session.title}
        </h1>
        <div className="mt-2 text-sm text-neutral-500">
          {[
            session.location,
            formatDate(session.started_at, lang),
            plural("home.coffees_count", samples.length, lang),
          ]
            .filter(Boolean)
            .join(" · ")}
        </div>
        {cuppers.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {cuppers.map((c) => (
              <span
                key={c}
                className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-900"
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </header>

      <section className="mt-10">
        <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-neutral-500">
          {t("stepper.codes", lang)}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {samples.map((s) => (
            <div
              key={s.id}
              className="flex aspect-square flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white p-4"
            >
              <span className="text-6xl font-medium leading-none tracking-tight text-neutral-900">
                {s.blind_code}
              </span>
              <span className="mt-3 text-xs text-neutral-400">
                {t("setup.step3.card_status", lang)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-xl bg-neutral-50 p-5">
        <div className="text-xs font-medium uppercase tracking-[0.08em] text-neutral-500">
          {t("session_detail.ready_state", lang)}
        </div>
        <p className="mt-1 text-sm text-neutral-700">
          {t("session_detail.ready_help", lang)}
        </p>
        {samples.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/sessions/${session.id}/evaluate`}
              className="inline-block rounded-md bg-origen-orange px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
            >
              {t("session_detail.start_cupping", lang)}
            </Link>
            <Link
              href={`/sessions/${session.id}/physical`}
              className="inline-block rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:border-neutral-900"
            >
              {t("session_detail.physical_cta", lang)}
            </Link>
            <Link
              href={`/sessions/${session.id}/reveal`}
              className="inline-block rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:border-neutral-900"
            >
              {t("session_detail.reveal_cta", lang)}
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

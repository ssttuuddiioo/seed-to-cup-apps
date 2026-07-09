import Link from "next/link";
import { formatDate, plural, t } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type SessionRow = {
  id: string;
  title: string;
  location: string | null;
  started_at: string;
  cuppers: string[];
  samples: { count: number }[];
};

async function getSessions(): Promise<SessionRow[]> {
  const { data } = await supabase
    .from("sessions")
    .select("id, title, location, started_at, cuppers, samples(count)")
    .order("started_at", { ascending: false })
    .limit(20);
  return (data as SessionRow[] | null) ?? [];
}

export default async function HomePage() {
  const sessions = await getSessions();

  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-16">
      <header className="mb-12">
        <h1 className="text-2xl font-medium tracking-tight text-neutral-900">
          {t("app.name")}
        </h1>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.08em] text-neutral-500">
          {t("home.sessions_heading")}
        </h2>

        {sessions.length === 0 ? (
          <div className="rounded-lg border border-neutral-200 bg-white px-6 py-10 text-center text-sm text-neutral-500">
            {t("home.empty_sessions")}
          </div>
        ) : (
          <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200">
            {sessions.map((s) => {
              const coffeeCount = s.samples?.[0]?.count ?? 0;
              const cupperCount = Array.isArray(s.cuppers) ? s.cuppers.length : 0;
              return (
                <li key={s.id}>
                  <Link
                    href={`/sessions/${s.id}`}
                    className="block px-5 py-4 hover:bg-neutral-50"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="min-w-0 truncate text-sm font-medium text-neutral-900">
                        {s.title}
                      </div>
                      <div className="shrink-0 text-xs text-neutral-400">
                        {formatDate(s.started_at)}
                      </div>
                    </div>
                    <div className="mt-1 truncate text-xs text-neutral-500">
                      {[
                        s.location,
                        plural("home.coffees_count", coffeeCount),
                        plural("home.cuppers_count", cupperCount),
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
        href="/sessions/new"
        className="inline-block rounded-md bg-origen-orange px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-origen-orange focus:ring-offset-2"
      >
        {t("home.cta_new_session")}
      </Link>

      <section className="mt-14">
        <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.08em] text-neutral-500">
          {t("home.tools_heading")}
        </h2>
        <Link
          href="/fermentacion"
          className="block rounded-xl border border-neutral-200 bg-white px-5 py-4 hover:bg-neutral-50"
        >
          <div className="text-sm font-medium text-neutral-900">
            {t("fermentacion.title")}
          </div>
          <div className="mt-1 text-xs text-neutral-500">
            {t("fermentacion.home_hint")}
          </div>
        </Link>
      </section>
    </main>
  );
}

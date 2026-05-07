import { t } from "@/lib/i18n";

type Session = {
  id: string;
  title: string;
  started_at: string;
};

async function getSessions(): Promise<Session[]> {
  return [];
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
            {sessions.map((s) => (
              <li key={s.id} className="px-5 py-4">
                <div className="text-sm font-medium text-neutral-900">{s.title}</div>
                <div className="text-xs text-neutral-500">{s.started_at}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button
        type="button"
        className="rounded-md bg-origen-orange px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-origen-orange focus:ring-offset-2"
      >
        {t("home.cta_new_session")}
      </button>
    </main>
  );
}

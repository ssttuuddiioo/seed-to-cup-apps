import { notFound } from "next/navigation";
import { fetchLexicon, fetchOrigenDescriptors } from "@/lib/reference";
import type { Lang } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { EvaluateFlow } from "./_components/EvaluateFlow";
import {
  buildCataGroups,
  buildOptionIndex,
  type CataKey,
} from "./_components/descriptive-types";

export const dynamic = "force-dynamic";

type Params = { id: string };

type SessionRow = {
  id: string;
  title: string;
  lang: Lang;
  cuppers: string[];
};

type SampleRow = { id: string; blind_code: string };

export default async function EvaluatePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;

  const [{ data: session }, { data: sampleRows }, lexicon, origen] =
    await Promise.all([
      supabase
        .from("sessions")
        .select("id, title, lang, cuppers")
        .eq("id", id)
        .maybeSingle<SessionRow>(),
      supabase
        .from("samples")
        .select("id, blind_code")
        .eq("session_id", id)
        .order("blind_code"),
      fetchLexicon(),
      fetchOrigenDescriptors(),
    ]);

  if (!session) notFound();

  const samples: SampleRow[] = sampleRows ?? [];
  const lang: Lang = session.lang === "en" ? "en" : "es";
  const cuppers = Array.isArray(session.cuppers) ? session.cuppers : [];

  // Pre-build the grouped CATA option pools once on the server.
  const cataKeys: CataKey[] = [
    "fragrance_aroma",
    "flavor_aftertaste",
    "main_tastes",
    "mouthfeel",
  ];
  const cataGroups = Object.fromEntries(
    cataKeys.map((k) => [k, buildCataGroups(k, lexicon, origen)]),
  ) as Record<CataKey, ReturnType<typeof buildCataGroups>>;
  const optionIndex = Object.fromEntries(
    buildOptionIndex(lexicon, origen),
  );

  return (
    <EvaluateFlow
      sessionId={session.id}
      sessionTitle={session.title}
      lang={lang}
      cuppers={cuppers}
      samples={samples}
      cataGroups={cataGroups}
      optionIndex={optionIndex}
    />
  );
}

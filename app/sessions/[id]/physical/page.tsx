import { notFound } from "next/navigation";
import type { Lang } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { PhysicalFlow } from "./_components/PhysicalFlow";

export const dynamic = "force-dynamic";

type Params = { id: string };

type SessionRow = { id: string; title: string; lang: Lang };
type SampleRow = { id: string; blind_code: string; physical: unknown };

export default async function PhysicalPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;

  const [{ data: session }, { data: sampleRows }] = await Promise.all([
    supabase
      .from("sessions")
      .select("id, title, lang")
      .eq("id", id)
      .maybeSingle<SessionRow>(),
    supabase
      .from("samples")
      .select("id, blind_code, physical")
      .eq("session_id", id)
      .order("blind_code"),
  ]);

  if (!session) notFound();

  const samples: SampleRow[] = sampleRows ?? [];
  if (samples.length === 0) notFound();

  const lang: Lang = session.lang === "en" ? "en" : "es";

  return (
    <PhysicalFlow
      sessionId={session.id}
      sessionTitle={session.title}
      lang={lang}
      samples={samples}
    />
  );
}

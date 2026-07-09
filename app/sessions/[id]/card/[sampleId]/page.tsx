import { notFound } from "next/navigation";
import { formatDate } from "@/lib/i18n";
import { fetchSessionResults } from "@/lib/results";
import { ProducerCard } from "./_components/ProducerCard";

export const dynamic = "force-dynamic";

type Params = { id: string; sampleId: string };

export default async function CardPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id, sampleId } = await params;
  const data = await fetchSessionResults(id, "es");
  if (!data) notFound();

  const lang = data.session.lang === "en" ? "en" : "es";
  const result = data.results.find((r) => r.sampleId === sampleId);
  if (!result) notFound();

  return (
    <ProducerCard
      lang={lang}
      sessionId={id}
      sessionTitle={data.session.title}
      dateLabel={formatDate(new Date(), lang)}
      result={result}
    />
  );
}

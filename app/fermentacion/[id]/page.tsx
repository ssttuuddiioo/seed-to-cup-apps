import { FermentacionDetail } from "./_components/FermentacionDetail";

export const dynamic = "force-dynamic";

export default async function FermentacionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FermentacionDetail sessionId={id} />;
}

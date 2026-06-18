import { fetchProcesses, fetchProducers, fetchRegions, fetchVarieties } from "@/lib/reference";
import { SessionWizard } from "./_components/SessionWizard";

export const dynamic = "force-dynamic";

export default async function NewSessionPage() {
  const [varieties, processes, regions, producers] = await Promise.all([
    fetchVarieties(),
    fetchProcesses(),
    fetchRegions(),
    fetchProducers(),
  ]);

  return (
    <SessionWizard
      varieties={varieties}
      processes={processes}
      regions={regions}
      initialProducers={producers}
    />
  );
}

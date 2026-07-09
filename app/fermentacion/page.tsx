import { FermentacionList } from "./_components/FermentacionList";

// Thin server shell. The Fermentación pages are local-first client islands
// (IndexedDB + background sync), so — unlike the RSC cupping pages — there is
// no server-side Supabase read here.
export const dynamic = "force-dynamic";

export default function FermentacionListPage() {
  return <FermentacionList />;
}

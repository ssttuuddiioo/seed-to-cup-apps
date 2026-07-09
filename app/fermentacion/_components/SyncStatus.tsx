"use client";

import { t, type Lang } from "@/lib/i18n";

type Props = {
  online: boolean;
  pendingCount: number;
  lang: Lang;
};

/** Small badge: connection state + count of unpushed local writes. */
export function SyncStatus({ online, pendingCount, lang }: Props) {
  const label = !online
    ? t("fermentacion.sync.offline", lang)
    : pendingCount > 0
      ? t("fermentacion.sync.pending", lang, { count: pendingCount })
      : t("fermentacion.sync.synced", lang);

  const dot = !online
    ? "bg-neutral-400"
    : pendingCount > 0
      ? "bg-origen-orange"
      : "bg-emerald-500";

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
      <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden />
      {label}
    </span>
  );
}

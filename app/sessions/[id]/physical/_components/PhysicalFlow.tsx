"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DEFAULT_LANG, t, type Lang } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { PhysicalForm } from "./PhysicalForm";
import {
  deserializePhysical,
  serializePhysical,
  type PhysicalValue,
} from "./physical-types";

type Sample = { id: string; blind_code: string; physical: unknown };

type Props = {
  sessionId: string;
  sessionTitle: string;
  lang: Lang;
  samples: Sample[];
};

export function PhysicalFlow({
  sessionId,
  sessionTitle,
  lang: sessionLang,
  samples,
}: Props) {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>(sessionLang ?? DEFAULT_LANG);
  const [sampleIndex, setSampleIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, PhysicalValue>>(() =>
    Object.fromEntries(
      samples.map((s) => [s.id, deserializePhysical(s.physical)]),
    ),
  );
  const [savedIds, setSavedIds] = useState<Set<string>>(
    () => new Set(samples.filter((s) => s.physical).map((s) => s.id)),
  );
  const [state, setState] = useState<{ saving: boolean; error: string | null }>(
    { saving: false, error: null },
  );

  const sample = samples[sampleIndex];
  const isLast = sampleIndex === samples.length - 1;

  async function saveCurrent(): Promise<boolean> {
    setState({ saving: true, error: null });
    try {
      const physical = serializePhysical(drafts[sample.id]);
      const { error } = await supabase
        .from("samples")
        .update({ physical })
        .eq("id", sample.id);
      if (error) throw error;
      setSavedIds((prev) => new Set(prev).add(sample.id));
      setState({ saving: false, error: null });
      return true;
    } catch (err) {
      console.error(err);
      setState({ saving: false, error: t("physical.save_error", lang) });
      return false;
    }
  }

  async function onSaveNext() {
    const ok = await saveCurrent();
    if (!ok) return;
    if (isLast) setDone(true);
    else setSampleIndex((i) => i + 1);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-white text-neutral-900">
        <Header
          sessionId={sessionId}
          sessionTitle={sessionTitle}
          lang={lang}
          onLangChange={setLang}
        />
        <main className="mx-auto max-w-2xl px-6 pb-24 pt-12">
          <h1 className="text-2xl font-medium tracking-tight">
            {t("physical.done_title", lang)}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            {t("physical.done_body", lang, { count: savedIds.size })}
          </p>
          <button
            type="button"
            onClick={() => router.push(`/sessions/${sessionId}`)}
            className="mt-8 rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white"
          >
            {t("physical.back_to_session", lang)}
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur">
        <Header
          sessionId={sessionId}
          sessionTitle={sessionTitle}
          lang={lang}
          onLangChange={setLang}
        />
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 border-b border-neutral-200 px-6 pb-3">
          <span className="text-xs font-medium uppercase tracking-[0.08em] text-neutral-400">
            {t("physical.title", lang)}
          </span>
          <div className="flex items-center gap-1.5">
            {samples.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSampleIndex(i)}
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
                  i === sampleIndex
                    ? "bg-neutral-900 text-white"
                    : savedIds.has(s.id)
                      ? "bg-neutral-200 text-neutral-700"
                      : "border border-neutral-300 text-neutral-500",
                ].join(" ")}
              >
                {s.blind_code}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-2xl px-6 pb-40 pt-8">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-[0.08em] text-neutral-400">
            {t("descriptive.sample_label", lang)}
          </div>
          <div className="text-5xl font-medium leading-none tracking-tight">
            {sample.blind_code}
          </div>
        </div>

        <PhysicalForm
          lang={lang}
          value={drafts[sample.id]}
          onChange={(next) =>
            setDrafts((prev) => ({ ...prev, [sample.id]: next }))
          }
        />
      </main>

      <footer className="fixed inset-x-0 bottom-0 border-t border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-6 py-4">
          <span className="text-xs text-neutral-400">
            {t("physical.progress", lang, {
              done: savedIds.size,
              total: samples.length,
            })}
          </span>
          <div className="flex items-center gap-3">
            {state.error && (
              <span className="text-xs text-red-600">{state.error}</span>
            )}
            <button
              type="button"
              onClick={onSaveNext}
              disabled={state.saving}
              className="rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {state.saving
                ? t("common.saving", lang)
                : isLast
                  ? t("physical.save_last", lang)
                  : t("physical.save_next", lang)}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Header({
  sessionId,
  sessionTitle,
  lang,
  onLangChange,
}: {
  sessionId: string;
  sessionTitle: string;
  lang: Lang;
  onLangChange: (l: Lang) => void;
}) {
  return (
    <header className="mx-auto flex max-w-2xl items-center justify-between px-6 py-3">
      <Link
        href={`/sessions/${sessionId}`}
        className="text-xs text-neutral-500 hover:text-neutral-900"
      >
        ← {sessionTitle}
      </Link>
      <div className="flex items-center gap-1 text-xs">
        {(["es", "en"] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => onLangChange(l)}
            className={
              l === lang
                ? "rounded px-2 py-1 font-medium text-neutral-900"
                : "rounded px-2 py-1 text-neutral-400"
            }
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </header>
  );
}

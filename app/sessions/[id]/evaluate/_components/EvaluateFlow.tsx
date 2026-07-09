"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DEFAULT_LANG, t, type Lang } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { DescriptiveForm } from "./DescriptiveForm";
import { AffectiveForm } from "./AffectiveForm";
import { ExtrinsicForm } from "./ExtrinsicForm";
import {
  emptyDescriptive,
  type CataGroup,
  type CataKey,
  type CataOption,
  type DescriptiveValue,
} from "./descriptive-types";
import {
  affectiveScore,
  emptyAffective,
  isAffectiveComplete,
  type AffectiveValue,
} from "./affective-types";
import { emptyExtrinsic, type ExtrinsicValue } from "./extrinsic-types";

type Sample = { id: string; blind_code: string };

type Props = {
  sessionId: string;
  sessionTitle: string;
  lang: Lang;
  cuppers: string[];
  samples: Sample[];
  cataGroups: Record<CataKey, CataGroup[]>;
  optionIndex: Record<string, CataOption>;
};

type Phase = "pick" | "form" | "done";
const STAGES = ["descriptive", "affective", "extrinsic"] as const;
type Stage = (typeof STAGES)[number];

type CupDraft = {
  descriptive: DescriptiveValue;
  affective: AffectiveValue;
  extrinsic: ExtrinsicValue;
};

function emptyCup(): CupDraft {
  return {
    descriptive: emptyDescriptive(),
    affective: emptyAffective(),
    extrinsic: emptyExtrinsic(),
  };
}

export function EvaluateFlow({
  sessionId,
  sessionTitle,
  lang: sessionLang,
  cuppers,
  samples,
  cataGroups,
  optionIndex,
}: Props) {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>(sessionLang ?? DEFAULT_LANG);

  const [phase, setPhase] = useState<Phase>("pick");
  const [cupper, setCupper] = useState<string | null>(null);
  const [sampleIndex, setSampleIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("descriptive");
  const [drafts, setDrafts] = useState<Record<string, CupDraft>>({});
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [state, setState] = useState<{ saving: boolean; error: string | null }>(
    { saving: false, error: null },
  );

  function draftFor(sampleId: string): CupDraft {
    return drafts[sampleId] ?? emptyCup();
  }
  function patch(sampleId: string, part: Partial<CupDraft>) {
    setDrafts((prev) => ({
      ...prev,
      [sampleId]: { ...draftFor(sampleId), ...part },
    }));
  }

  function startCupper(initials: string) {
    setCupper(initials);
    setSampleIndex(0);
    setStage("descriptive");
    setDrafts({});
    setSavedIds(new Set());
    setState({ saving: false, error: null });
    setPhase("form");
  }

  function gotoSample(i: number) {
    setSampleIndex(i);
    setStage("descriptive");
    setState((s) => ({ ...s, error: null }));
  }

  async function saveCurrent(): Promise<boolean> {
    if (!cupper) return false;
    const sample = samples[sampleIndex];
    const draft = draftFor(sample.id);
    setState({ saving: true, error: null });
    try {
      const row = {
        descriptive: draft.descriptive,
        affective: draft.affective,
        extrinsic: draft.extrinsic,
        score: affectiveScore(draft.affective),
      };
      const { data: existing } = await supabase
        .from("evaluations")
        .select("id")
        .eq("sample_id", sample.id)
        .eq("cupper_initials", cupper)
        .maybeSingle<{ id: string }>();

      if (existing) {
        const { error } = await supabase
          .from("evaluations")
          .update(row)
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("evaluations").insert({
          session_id: sessionId,
          sample_id: sample.id,
          cupper_initials: cupper,
          ...row,
        });
        if (error) throw error;
      }

      setSavedIds((prev) => new Set(prev).add(sample.id));
      setState({ saving: false, error: null });
      return true;
    } catch (err) {
      console.error(err);
      setState({ saving: false, error: t("descriptive.save_error", lang) });
      return false;
    }
  }

  function advanceStage() {
    const idx = STAGES.indexOf(stage);
    if (idx < STAGES.length - 1) {
      setStage(STAGES[idx + 1]);
    }
  }

  async function onPrimary() {
    if (stage !== "extrinsic") {
      advanceStage();
      return;
    }
    const ok = await saveCurrent();
    if (!ok) return;
    if (sampleIndex < samples.length - 1) gotoSample(sampleIndex + 1);
    else setPhase("done");
  }

  function onBack() {
    const idx = STAGES.indexOf(stage);
    if (idx > 0) setStage(STAGES[idx - 1]);
  }

  // ── Pick cupper ──────────────────────────────────────────────────────────
  if (phase === "pick") {
    return (
      <Shell lang={lang} onLangChange={setLang} sessionId={sessionId}>
        <h1 className="text-2xl font-medium tracking-tight text-neutral-900">
          {t("descriptive.pick_cupper_title", lang)}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          {t("descriptive.pick_cupper_subtitle", lang)}
        </p>
        {cuppers.length === 0 ? (
          <p className="mt-8 rounded-lg bg-neutral-50 px-5 py-6 text-sm text-neutral-500">
            {t("descriptive.no_cuppers", lang)}
          </p>
        ) : (
          <div className="mt-8 flex flex-wrap gap-3">
            {cuppers.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => startCupper(c)}
                className="rounded-xl border border-neutral-300 px-6 py-4 text-lg font-medium text-neutral-900 hover:border-neutral-900"
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </Shell>
    );
  }

  // ── Done ─────────────────────────────────────────────────────────────────
  if (phase === "done") {
    return (
      <Shell lang={lang} onLangChange={setLang} sessionId={sessionId}>
        <h1 className="text-2xl font-medium tracking-tight text-neutral-900">
          {t("descriptive.done_title", lang, { cupper: cupper ?? "" })}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          {t("descriptive.done_body", lang, { count: savedIds.size })}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setCupper(null);
              setPhase("pick");
            }}
            className="rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white"
          >
            {t("descriptive.another_cupper", lang)}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/sessions/${sessionId}`)}
            className="rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700"
          >
            {t("descriptive.back_to_session", lang)}
          </button>
        </div>
      </Shell>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  const sample = samples[sampleIndex];
  const isLastSample = sampleIndex === samples.length - 1;
  const draft = draftFor(sample.id);
  const affectiveReady = isAffectiveComplete(draft.affective);
  const primaryDisabled =
    state.saving || (stage === "affective" && !affectiveReady);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-3">
          <Link
            href={`/sessions/${sessionId}`}
            className="text-xs text-neutral-500 hover:text-neutral-900"
          >
            ← {sessionTitle}
          </Link>
          <LangToggle lang={lang} onChange={setLang} />
        </div>
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-6 pb-2">
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-900">
            {t("descriptive.cupper_label", lang)}: {cupper}
          </span>
          <div className="flex items-center gap-1.5">
            {samples.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => gotoSample(i)}
                aria-label={`${t("descriptive.sample_label", lang)} ${s.blind_code}`}
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
        <div className="mx-auto flex max-w-2xl gap-1 px-6 pb-3">
          {STAGES.map((s) => (
            <div
              key={s}
              className={[
                "flex-1 rounded-full px-2 py-1 text-center text-[11px] font-medium",
                s === stage
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-400",
              ].join(" ")}
            >
              {t(`descriptive.stages.${s}`, lang)}
            </div>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 pb-40 pt-8">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-[0.08em] text-neutral-400">
            {t("descriptive.sample_label", lang)}
          </div>
          <div className="text-5xl font-medium leading-none tracking-tight">
            {sample.blind_code}
          </div>
        </div>

        {stage === "descriptive" && (
          <DescriptiveForm
            lang={lang}
            value={draft.descriptive}
            cataGroups={cataGroups}
            optionIndex={optionIndex}
            onChange={(descriptive) => patch(sample.id, { descriptive })}
          />
        )}
        {stage === "affective" && (
          <AffectiveForm
            lang={lang}
            value={draft.affective}
            onChange={(affective) => patch(sample.id, { affective })}
          />
        )}
        {stage === "extrinsic" && (
          <ExtrinsicForm
            lang={lang}
            value={draft.extrinsic}
            onChange={(extrinsic) => patch(sample.id, { extrinsic })}
          />
        )}
      </main>

      <footer className="fixed inset-x-0 bottom-0 border-t border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-6 py-4">
          {stage === "descriptive" ? (
            <span className="text-xs text-neutral-400">
              {t("descriptive.progress", lang, {
                done: savedIds.size,
                total: samples.length,
              })}
            </span>
          ) : (
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-neutral-500 hover:text-neutral-900"
            >
              ← {t("common.back", lang)}
            </button>
          )}

          <div className="flex items-center gap-3">
            {stage === "affective" && !affectiveReady && (
              <span className="text-xs text-neutral-400">
                {t("descriptive.affective_locked", lang)}
              </span>
            )}
            {state.error && (
              <span className="text-xs text-red-600">{state.error}</span>
            )}
            <button
              type="button"
              onClick={onPrimary}
              disabled={primaryDisabled}
              className="rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
            >
              {state.saving
                ? t("common.saving", lang)
                : stage !== "extrinsic"
                  ? t("common.continue", lang)
                  : isLastSample
                    ? t("descriptive.save_last", lang)
                    : t("descriptive.save_next", lang)}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Shell({
  lang,
  onLangChange,
  sessionId,
  children,
}: {
  lang: Lang;
  onLangChange: (l: Lang) => void;
  sessionId: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-3">
          <Link
            href={`/sessions/${sessionId}`}
            className="text-xs text-neutral-500 hover:text-neutral-900"
          >
            ← {t("descriptive.back_to_session", lang)}
          </Link>
          <LangToggle lang={lang} onChange={onLangChange} />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-6 pb-24 pt-12">{children}</main>
    </div>
  );
}

function LangToggle({
  lang,
  onChange,
}: {
  lang: Lang;
  onChange: (l: Lang) => void;
}) {
  return (
    <div className="flex items-center gap-1 text-xs">
      {(["es", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
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
  );
}

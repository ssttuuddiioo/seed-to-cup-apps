"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_LANG, t, type Lang } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import type { Process, Producer, Region, Variety } from "@/lib/reference";
import { HeaderBar } from "./HeaderBar";
import { Stepper } from "./Stepper";
import { Step1Details } from "./Step1Details";
import { Step2Coffees } from "./Step2Coffees";
import { Step3Codes } from "./Step3Codes";
import { emptyCoffee, isCoffeeReady, type CoffeeDraft } from "./types";

type Props = {
  varieties: Variety[];
  processes: Process[];
  regions: Region[];
  initialProducers: Producer[];
};

export function SessionWizard({
  varieties,
  processes,
  regions,
  initialProducers,
}: Props) {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [cuppers, setCuppers] = useState<string[]>([]);
  const [coffees, setCoffees] = useState<CoffeeDraft[]>(() => [emptyCoffee()]);

  const [codeAssignment, setCodeAssignment] = useState<Map<string, string> | null>(
    null,
  );
  const [submission, setSubmission] = useState<{
    saving: boolean;
    error: string | null;
  }>({ saving: false, error: null });

  function gotoStep2() {
    setStep(2);
  }

  function gotoStep3() {
    const ready = coffees.filter(isCoffeeReady);
    if (ready.length === 0) return;
    setCodeAssignment(assignBlindCodes(ready));
    setStep(3);
  }

  const codesForDisplay = useMemo(() => {
    if (!codeAssignment) return [];
    return [...codeAssignment.values()].sort();
  }, [codeAssignment]);

  async function onConfirm() {
    if (!codeAssignment) return;
    setSubmission({ saving: true, error: null });
    try {
      const sessionId = await persistSession({
        title: title.trim(),
        location: location.trim() || null,
        lang,
        cuppers,
      });

      const readyCoffees = coffees.filter(isCoffeeReady);
      const coffeeIds = await persistCoffees(readyCoffees);

      await persistSamples({
        sessionId,
        rows: readyCoffees.map((c, i) => ({
          coffee_id: coffeeIds[i],
          blind_code: codeAssignment.get(c.localId)!,
          lot_code: c.lot_code.trim() || null,
          notes: c.notes.trim() || null,
        })),
      });

      router.push(`/sessions/${sessionId}`);
    } catch (err) {
      console.error(err);
      setSubmission({ saving: false, error: t("common.submit_error", lang) });
    }
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <HeaderBar lang={lang} onLangChange={setLang} />
      <div className="border-b border-neutral-200 px-6 py-4">
        <Stepper current={step} lang={lang} />
      </div>

      {step === 1 && (
        <Step1Details
          lang={lang}
          title={title}
          location={location}
          cuppers={cuppers}
          onLangChange={setLang}
          onTitleChange={setTitle}
          onLocationChange={setLocation}
          onCuppersChange={setCuppers}
          onContinue={gotoStep2}
        />
      )}

      {step === 2 && (
        <Step2Coffees
          lang={lang}
          coffees={coffees}
          varieties={varieties}
          processes={processes}
          regions={regions}
          producers={initialProducers}
          onCoffeesChange={setCoffees}
          onBack={() => setStep(1)}
          onContinue={gotoStep3}
        />
      )}

      {step === 3 && (
        <Step3Codes
          lang={lang}
          codes={codesForDisplay}
          saving={submission.saving}
          error={submission.error}
          onBack={() => setStep(2)}
          onConfirm={onConfirm}
        />
      )}
    </div>
  );
}

function assignBlindCodes(coffees: CoffeeDraft[]): Map<string, string> {
  const indexed = coffees.map((c, i) => ({ c, i }));
  for (let i = indexed.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  const out = new Map<string, string>();
  indexed.forEach((entry, idx) => {
    out.set(entry.c.localId, String.fromCharCode(65 + idx));
  });
  return out;
}

async function persistSession(input: {
  title: string;
  location: string | null;
  lang: Lang;
  cuppers: string[];
}): Promise<string> {
  const { data, error } = await supabase
    .from("sessions")
    .insert({
      title: input.title,
      location: input.location,
      lang: input.lang,
      cuppers: input.cuppers,
    })
    .select("id")
    .single();
  if (error || !data) throw error ?? new Error("session insert failed");
  return data.id as string;
}

async function persistCoffees(coffees: CoffeeDraft[]): Promise<string[]> {
  const producerIds: string[] = [];
  const newProducerCache = new Map<string, string>();

  for (const c of coffees) {
    if (!c.producer) throw new Error("coffee missing producer");
    if (c.producer.kind === "existing") {
      producerIds.push(c.producer.producer.id);
      continue;
    }
    const cacheKey =
      `${c.producer.name.trim().toLowerCase()}|${c.producer.finca.trim().toLowerCase()}`;
    const cached = newProducerCache.get(cacheKey);
    if (cached) {
      producerIds.push(cached);
      continue;
    }
    const { data, error } = await supabase
      .from("producers")
      .insert({
        name: c.producer.name.trim(),
        finca: c.producer.finca.trim() || null,
      })
      .select("id")
      .single();
    if (error || !data) throw error ?? new Error("producer insert failed");
    newProducerCache.set(cacheKey, data.id);
    producerIds.push(data.id);
  }

  const coffeeRows = coffees.map((c, i) => {
    const altitude = parseInt(c.altitude, 10);
    return {
      producer_id: producerIds[i],
      varieties: c.varieties,
      process: c.process,
      region_id: c.region_id,
      altitude_min: Number.isFinite(altitude) ? altitude : null,
      notes: c.notes.trim() || null,
    };
  });

  const { data, error } = await supabase
    .from("coffees")
    .insert(coffeeRows)
    .select("id");
  if (error || !data) throw error ?? new Error("coffee insert failed");
  if (data.length !== coffees.length) {
    throw new Error("coffee insert returned wrong row count");
  }
  return data.map((row: { id: string }) => row.id);
}

async function persistSamples(input: {
  sessionId: string;
  rows: Array<{
    coffee_id: string;
    blind_code: string;
    lot_code: string | null;
    notes: string | null;
  }>;
}): Promise<void> {
  const payload = input.rows.map((r) => ({
    session_id: input.sessionId,
    coffee_id: r.coffee_id,
    blind_code: r.blind_code,
    lot_code: r.lot_code,
    notes: r.notes,
  }));
  const { error } = await supabase.from("samples").insert(payload);
  if (error) throw error;
}

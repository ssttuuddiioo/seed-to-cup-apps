"use client";

import { t, type Lang } from "@/lib/i18n";

type Props = {
  current: 1 | 2 | 3;
  lang: Lang;
};

const STEPS: Array<{ n: 1 | 2 | 3; key: string }> = [
  { n: 1, key: "stepper.details" },
  { n: 2, key: "stepper.coffees" },
  { n: 3, key: "stepper.codes" },
];

export function Stepper({ current, lang }: Props) {
  return (
    <ol className="flex items-center justify-center gap-3 text-xs font-medium tracking-tight text-neutral-500">
      {STEPS.map((step, i) => {
        const state = step.n < current ? "done" : step.n === current ? "active" : "future";
        return (
          <li key={step.n} className="flex items-center gap-3">
            <span className="flex items-center gap-2">
              <span
                aria-hidden
                className={
                  "h-1.5 w-1.5 rounded-full " +
                  (state === "active"
                    ? "bg-origen-orange"
                    : state === "done"
                      ? "bg-neutral-900"
                      : "bg-neutral-300")
                }
              />
              <span
                className={
                  state === "active"
                    ? "text-origen-orange"
                    : state === "done"
                      ? "text-neutral-900"
                      : "text-neutral-400"
                }
              >
                {t(step.key, lang)}
              </span>
            </span>
            {i < STEPS.length - 1 && <span className="text-neutral-300">·</span>}
          </li>
        );
      })}
    </ol>
  );
}

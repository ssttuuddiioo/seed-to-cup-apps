"use client";

type Props = {
  label: string;
  value: number | null;
  onChange: (value: number) => void;
};

/** A 1–9 hedonic row of tappable points (SCA 104 §7.2 bubble scale). */
export function HedonicScale({ label, value, onChange }: Props) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-medium text-neutral-900">{label}</span>
        <span className="tabular-nums text-sm text-neutral-500">
          {value ?? "–"} <span className="text-neutral-300">/ 9</span>
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => {
          const on = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-label={`${label} ${n}`}
              className={[
                "h-9 flex-1 rounded-md text-sm font-medium transition-colors",
                on
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200",
              ].join(" ")}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

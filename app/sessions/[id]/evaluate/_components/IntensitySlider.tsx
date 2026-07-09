"use client";

type Props = {
  label: string;
  value: number; // 0–15
  onChange: (value: number) => void;
};

export function IntensitySlider({ label, value, onChange }: Props) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-neutral-900">{label}</span>
        <span className="tabular-nums text-sm text-neutral-500">
          {value} <span className="text-neutral-300">/ 15</span>
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={15}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-neutral-900"
      />
    </div>
  );
}

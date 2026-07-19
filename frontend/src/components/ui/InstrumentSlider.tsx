import { useCallback, useId } from "react";

type InstrumentSliderProps = {
  label: string;
  unit?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
};

/**
 * Precision range slider.
 * - 6px track: grey background, emerald gradient fill up to thumb.
 * - Thumb: white disc, subtle border + shadow; native thumb hidden.
 * - Value shown in JetBrains Mono, right-aligned fixed-width — no reflow as digits change.
 * - Focus state: soft emerald ring on the track wrapper.
 */
export function InstrumentSlider({ label, unit, min, max, step = 1, value, onChange }: InstrumentSliderProps) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value)),
    [onChange],
  );

  return (
    <div className="grid gap-2.5">
      {/* Label + value */}
      <div className="flex items-baseline justify-between">
        <label
          htmlFor={id}
          className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#64748B]"
        >
          {label}
        </label>
        <span className="font-mono-num w-16 text-right text-[15px] font-semibold text-[#0F172A]">
          {value}
          {unit && (
            <span className="ml-0.5 text-[11px] font-normal text-[#94A3B8]">{unit}</span>
          )}
        </span>
      </div>

      {/* Track area */}
      <div className="relative flex h-6 items-center rounded-full focus-within:ring-2 focus-within:ring-[rgba(5,150,105,0.35)] focus-within:ring-offset-1">
        {/* Grey background track */}
        <div className="absolute h-[6px] w-full rounded-full bg-[#E2E8F0]" />

        {/* Emerald fill */}
        <div
          aria-hidden
          className="pointer-events-none absolute h-[6px] rounded-full"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #059669 0%, #10B981 100%)",
          }}
        />

        {/* Accessible native input — invisible, sits on top */}
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="absolute inset-0 w-full cursor-pointer opacity-0"
          style={{ WebkitAppearance: "none" }}
        />

        {/* Visual thumb — pointer-events none so the native input handles interaction */}
        <div
          aria-hidden
          className="pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-[rgba(148,163,184,0.3)] bg-white shadow-[0_1px_4px_rgba(15,23,42,0.15)]"
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  );
}

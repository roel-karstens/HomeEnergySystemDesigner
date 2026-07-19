import { useEffect, useRef } from "react";

type ConfidenceRingProps = {
  /** Optimization confidence, 0–100 */
  value: number;
  /** Outer diameter in px */
  size?: number;
};

/**
 * Optimization-confidence dial.
 * SVG arc with an emerald gradient stroke; the arc animates in on mount.
 * This is the one deliberately bold element in the system — everything else
 * stays quiet around it.
 */
export function ConfidenceRing({ value, size = 96 }: ConfidenceRingProps) {
  const arcRef = useRef<SVGCircleElement>(null);

  const strokeWidth = 6;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (Math.min(Math.max(value, 0), 100) / 100) * circumference;

  // Animate stroke-dashoffset after mount (pure CSS/SVG, no animation library).
  useEffect(() => {
    const el = arcRef.current;
    if (!el) return;
    // Start fully hidden
    el.style.strokeDashoffset = String(circumference);
    el.style.transition = "none";
    // Force reflow so the starting state is applied before the transition begins
    el.getBoundingClientRect();
    // Animate to target
    el.style.transition = "stroke-dashoffset 700ms cubic-bezier(0.34,1.56,0.64,1)";
    el.style.strokeDashoffset = String(targetOffset);
  }, [circumference, targetOffset]);

  const cx = size / 2;
  const cy = size / 2;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Optimization confidence: ${value}%`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden
        style={{ transform: "rotate(-90deg)" }}
      >
        <defs>
          <linearGradient id="eos-ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>

        {/* Grey track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />

        {/* Emerald progress arc */}
        <circle
          ref={arcRef}
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="url(#eos-ring-grad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
      </svg>

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono-num leading-none text-[#0F172A]"
          style={{ fontSize: size >= 80 ? 18 : 13, fontWeight: 600 }}
        >
          {value}%
        </span>
        {size >= 80 && (
          <span className="mt-1 text-[10px] uppercase tracking-[0.06em] text-[#94A3B8]">confidence</span>
        )}
      </div>
    </div>
  );
}

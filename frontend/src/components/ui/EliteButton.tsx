import { ArrowRight } from "lucide-react";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type EliteButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "subtle";
};

/**
 * Primary action button — graphite gradient with an emerald arrow accent.
 * Rule: emerald never fills a button; it only appears as the arrow icon.
 *
 * "subtle" variant: translucent white fill for secondary actions.
 */
export function EliteButton({ children, variant = "primary", className = "", style, ...props }: EliteButtonProps) {
  const base =
    "group relative inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold " +
    "transition-all duration-[200ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] " +
    "hover:-translate-y-0.5 active:scale-[0.98] " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 " +
    "disabled:pointer-events-none disabled:opacity-50 ";

  if (variant === "subtle") {
    return (
      <button
        {...props}
        className={`${base} border border-[rgba(148,163,184,0.3)] bg-white/80 text-[#0F172A] ${className}`}
        style={style}
      >
        <span className="relative">{children}</span>
        <ArrowRight className="relative h-3.5 w-3.5 text-[#059669] transition-transform duration-[200ms] group-hover:translate-x-[3px]" />
      </button>
    );
  }

  return (
    <button
      {...props}
      className={`${base} overflow-hidden border border-white/[0.08] text-white shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] ${className}`}
      style={{ background: "linear-gradient(180deg, #3F3F46 0%, #18181B 100%)", ...style }}
    >
      {/* Emerald glow that appears on hover — radial, top-center */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(120px circle at 50% -20px, rgba(16,185,129,0.18), transparent)" }}
      />
      <span className="relative">{children}</span>
      <ArrowRight
        aria-hidden
        className="relative h-3.5 w-3.5 text-[#10B981] transition-transform duration-[200ms] group-hover:translate-x-[3px]"
      />
    </button>
  );
}

import { type CSSProperties, type ReactNode, useCallback, useRef } from "react";

type PremiumCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  title?: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  as?: "section" | "article" | "div";
};

/**
 * Glass-effect card with a cursor-tracked radial emerald glow.
 * The glow intensity is intentionally very subtle — it sells "glass" without
 * being decorative.
 */
export function PremiumCard({
  children,
  className = "",
  style,
  title,
  subtitle,
  rightSlot,
  as: Tag = "section",
}: PremiumCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const { left, top } = el.getBoundingClientRect();
    el.style.setProperty("--glow-x", `${e.clientX - left}px`);
    el.style.setProperty("--glow-y", `${e.clientY - top}px`);
  }, []);

  return (
    <Tag
      ref={cardRef as React.RefObject<HTMLElement & HTMLDivElement>}
      onMouseMove={handleMouseMove}
      className={[
        "group relative overflow-hidden rounded-2xl",
        "border border-[rgba(148,163,184,0.18)]",
        "bg-[rgba(255,255,255,0.82)] backdrop-blur-[12px]",
        "shadow-[0_16px_32px_-20px_rgba(15,23,42,0.12)]",
        "transition-all duration-[200ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]",
        "hover:-translate-y-0.5",
        className,
      ].join(" ")}
      style={style}
    >
      {/* Cursor-tracked emerald glow — only visible on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(360px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(5,150,105,0.07), transparent)",
        }}
      />

      {(title || subtitle || rightSlot) && (
        <header className="relative flex items-start justify-between gap-4 border-b border-[rgba(148,163,184,0.18)] px-6 py-4">
          <div>
            {title && (
              <h3 className="text-[15px] font-semibold text-[#0F172A]">{title}</h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-[12px] text-[#64748B]">{subtitle}</p>
            )}
          </div>
          {rightSlot && <div className="relative shrink-0">{rightSlot}</div>}
        </header>
      )}

      <div className="relative px-6 py-5">{children}</div>
    </Tag>
  );
}

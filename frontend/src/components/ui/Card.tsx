import { ReactNode } from "react";

type CardProps = {
  title?: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Card({ title, subtitle, rightSlot, children, className }: CardProps) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className ?? ""}`}>
      {(title || subtitle || rightSlot) && (
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          </div>
          {rightSlot}
        </header>
      )}
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

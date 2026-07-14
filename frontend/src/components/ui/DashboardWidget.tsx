import { ReactNode } from "react";

type DashboardWidgetProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function DashboardWidget({ title, children, className }: DashboardWidgetProps) {
  return (
    <article className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className ?? ""}`}>
      <h4 className="mb-3 text-sm font-semibold text-slate-700">{title}</h4>
      {children}
    </article>
  );
}

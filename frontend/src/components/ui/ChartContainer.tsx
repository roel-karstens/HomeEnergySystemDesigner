import { ReactNode } from "react";

type ChartContainerProps = {
  title: string;
  children: ReactNode;
};

export function ChartContainer({ title, children }: ChartContainerProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
      <h4 className="mb-3 text-sm font-semibold text-slate-700">{title}</h4>
      <div className="h-72 w-full">{children}</div>
    </div>
  );
}

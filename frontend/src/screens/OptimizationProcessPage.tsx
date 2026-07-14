import { CheckCircle2, Circle } from "lucide-react";
import { Card } from "../components/ui/Card";

const steps = [
  { label: "Modeling your energy usage", done: true },
  { label: "Simulating solar production", done: true },
  { label: "Evaluating battery strategies", done: true },
  { label: "Testing EV charging schedules", done: true },
  { label: "Calculating financial outcomes", done: false },
];

export function OptimizationProcessPage() {
  return (
    <Card title="We’re analyzing thousands of system combinations..." subtitle="Premium AI engine in progress">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:items-center">
        <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-full border-8 border-emerald-100 bg-emerald-50 text-center">
          <div>
            <p className="text-4xl font-semibold text-emerald-700">78%</p>
            <p className="mt-2 text-sm text-slate-600">Simulating 2,184 configurations</p>
          </div>
        </div>

        <ul className="grid gap-3">
          {steps.map((step) => (
            <li key={step.label} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
              {step.done ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <Circle className="h-5 w-5 text-slate-300" />}
              <span>{step.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

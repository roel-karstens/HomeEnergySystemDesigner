import { motion } from "framer-motion";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface OptimizationLoaderProps {
  onComplete: () => void;
}

const steps = [
  "Modeling your energy usage",
  "Simulating solar production",
  "Evaluating battery strategies",
  "Calculating financial outcomes...",
];

export function OptimizationLoader({ onComplete }: OptimizationLoaderProps) {
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((value) => {
        if (value >= 78) {
          clearInterval(timer);
          return 78;
        }
        return value + Math.random() * 7;
      });
    }, 380);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 78) {
      const timeout = setTimeout(onComplete, 1300);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [onComplete, progress]);

  const roundedProgress = Math.round(progress);
  const activeIndex = Math.min(steps.length - 1, Math.floor((roundedProgress / 78) * steps.length));

  const ringValue = useMemo(() => {
    const clamped = Math.min(roundedProgress, 78);
    return (clamped / 100) * 282.74;
  }, [roundedProgress]);

  return (
    <section className="grid min-h-[78vh] place-items-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_46px_-30px_rgba(15,23,42,0.35)] sm:p-8">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Optimizing your configuration</h2>
        <p className="mt-2 text-center text-sm text-slate-500 sm:text-base">Please hold while we evaluate performance and financial outcomes.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr] lg:items-center">
          <div className="relative mx-auto h-56 w-56">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 rounded-full bg-[conic-gradient(from_0deg,rgba(0,168,107,0.28),rgba(0,168,107,0.06),rgba(15,23,42,0.02),rgba(0,168,107,0.28))] blur-lg"
            />

            <svg className="relative h-full w-full" viewBox="0 0 100 100" role="img" aria-label="Analysis progress">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="4" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#00A86B"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${ringValue} 282.74`}
                transform="rotate(-90 50 50)"
                className="transition-all duration-300"
              />
            </svg>

            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <p className="text-5xl font-semibold tracking-tight text-slate-900">{Math.min(roundedProgress, 78)}%</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Computing</p>
              </div>
            </div>
          </div>

          <ul className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            {steps.map((step, idx) => {
              const done = idx < activeIndex;
              const active = idx === activeIndex;
              return (
                <li key={step} className="flex items-center gap-3 rounded-lg bg-white px-3 py-2.5 ring-1 ring-slate-100">
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#00A86B]" />
                  ) : active ? (
                    <LoaderCircle className="h-5 w-5 shrink-0 animate-spin text-[#00A86B]" />
                  ) : (
                    <span className="h-5 w-5 shrink-0 rounded-full border-2 border-slate-300" />
                  )}
                  <span className={`text-sm ${done || active ? "font-medium text-slate-900" : "text-slate-500"}`}>{step}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useMemo, useState } from "react";
import { PremiumCard } from "../ui/PremiumCard";

interface OptimizationLoaderProps {
  onComplete: () => void;
}

const phases = [
  {
    key: "validation",
    label: "Input validation",
    detail: "Checking field completeness, constraint consistency and lock semantics.",
    progressTarget: 18,
  },
  {
    key: "simulation",
    label: "Simulation baseline",
    detail: "Generating hourly home, solar and thermal demand traces for the selected property context.",
    progressTarget: 42,
  },
  {
    key: "feasibility",
    label: "Configuration sweep",
    detail: "Testing allowed system combinations within user-defined fixed, optimize and excluded rules.",
    progressTarget: 66,
  },
  {
    key: "economics",
    label: "Economic optimisation",
    detail: "Ranking feasible scenarios against tariff context, investment bounds and objective weighting.",
    progressTarget: 86,
  },
  {
    key: "recommendation",
    label: "Recommendation assembly",
    detail: "Consolidating the best scenario, tradeoffs, assumptions and validation notes into one result set.",
    progressTarget: 100,
  },
];

export function OptimizationLoader({ onComplete }: OptimizationLoaderProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    const activePhase = phases[phaseIndex];
    if (!activePhase) return undefined;

    let phaseTimeout: number | undefined;

    const timer = setInterval(() => {
      setProgress((value) => {
        const nextValue = Math.min(activePhase.progressTarget, value + (activePhase.progressTarget - value) * 0.18 + 1.2);

        if (nextValue >= activePhase.progressTarget - 0.5) {
          clearInterval(timer);
          if (phaseIndex < phases.length - 1) {
            phaseTimeout = window.setTimeout(() => setPhaseIndex((current) => current + 1), 360);
          } else {
            phaseTimeout = window.setTimeout(onComplete, 700);
          }
          return activePhase.progressTarget;
        }

        return nextValue;
      });
    }, 220);

    return () => {
      clearInterval(timer);
      if (phaseTimeout !== undefined) {
        window.clearTimeout(phaseTimeout);
      }
    };
  }, [onComplete, phaseIndex]);

  const roundedProgress = Math.round(progress);
  const activePhase = phases[Math.min(phaseIndex, phases.length - 1)];
  const completedCount = useMemo(() => phases.filter((phase) => roundedProgress >= phase.progressTarget).length, [roundedProgress]);

  return (
    <section className="grid min-h-[78vh] place-items-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-6xl space-y-6">
        <PremiumCard className="bg-[rgba(255,255,255,0.9)]">
          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">Engineering run</p>
              <h2 className="mt-3 text-[34px] font-semibold tracking-[-0.03em] text-[#0F172A]">Running optimisation workflow.</h2>
              <p className="mt-4 text-[15px] leading-7 text-[#64748B]">Results remain locked until validation, simulation and recommendation assembly complete.</p>
              <div className="mt-6 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#F8FAFC] p-4">
                <div className="flex items-center justify-between text-[12px] text-[#64748B]">
                  <span>Overall progress</span>
                  <span className="font-mono-num text-[#0F172A]">{roundedProgress}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
                  <div className="h-full rounded-full bg-[linear-gradient(90deg,#3F3F46_0%,#18181B_100%)] transition-all duration-300" style={{ width: `${roundedProgress}%` }} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-[12px] sm:grid-cols-3">
                  <PhaseMetric label="Phases completed" value={`${completedCount}/${phases.length}`} />
                  <PhaseMetric label="Scenario set" value="24" />
                  <PhaseMetric label="Assumption checks" value="9" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {phases.map((phase, index) => {
                const complete = roundedProgress >= phase.progressTarget;
                const active = phase.key === activePhase.key;
                return (
                  <div key={phase.key} className={["rounded-2xl border px-4 py-4 transition-all duration-300", complete ? "border-[rgba(15,23,42,0.14)] bg-white" : active ? "border-[rgba(5,150,105,0.22)] bg-[rgba(248,250,252,0.92)]" : "border-[rgba(148,163,184,0.18)] bg-[rgba(248,250,252,0.72)]"].join(" ")}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[14px] font-semibold text-[#0F172A]">{phase.label}</p>
                        <p className="mt-1 text-[13px] leading-6 text-[#64748B]">{phase.detail}</p>
                      </div>
                      <span className="font-mono-num text-[12px] uppercase tracking-[0.08em] text-[#94A3B8]">{complete ? "done" : active ? "active" : "queued"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </PremiumCard>
      </div>
    </section>
  );
}

function PhaseMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white px-3 py-3 shadow-[0_8px_18px_-18px_rgba(15,23,42,0.2)]">
      <p className="text-[10px] uppercase tracking-[0.08em] text-[#94A3B8]">{label}</p>
      <p className="font-mono-num mt-2 text-[16px] font-semibold text-[#0F172A]">{value}</p>
    </div>
  );
}

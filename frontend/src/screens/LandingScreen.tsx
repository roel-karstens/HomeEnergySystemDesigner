import { useMemo, useState } from "react";
import { AnalysisNotebook } from "../components/energyos/AnalysisNotebook";
import { DashboardOverview } from "../components/energyos/DashboardOverview";
import { HeroSection } from "../components/energyos/HeroSection";
import { OnboardingWizard } from "../components/energyos/OnboardingWizard";
import { OptimizationLoader } from "../components/energyos/OptimizationLoader";

interface LandingScreenProps {
  onNext: () => void;
}

export function LandingScreen({ onNext }: LandingScreenProps) {
  const [optimizationStarted, setOptimizationStarted] = useState(false);
  const [optimizationCompleted, setOptimizationCompleted] = useState(false);

  const sectionIds = useMemo(
    () => ({
      top: "journey-top",
      intake: "journey-intake",
      optimization: "journey-optimization",
      results: "journey-results",
      analysis: "journey-analysis",
    }),
    [],
  );

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleStart = () => {
    scrollTo(sectionIds.intake);
  };

  const handleIntakePrev = () => {
    scrollTo(sectionIds.top);
  };

  const handleIntakeNext = () => {
    setOptimizationStarted(true);
    setOptimizationCompleted(false);
    scrollTo(sectionIds.optimization);
  };

  const handleOptimizationComplete = () => {
    setOptimizationCompleted(true);
    scrollTo(sectionIds.results);
  };

  return (
    <div className="min-h-screen w-full snap-y snap-mandatory bg-white">
      <div id={sectionIds.top} className="w-full">
        <HeroSection onStart={handleStart} />

        <section id={sectionIds.intake} className="min-h-screen snap-start bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto w-full max-w-[1600px] space-y-8">
            <div className="reveal max-w-[760px]" style={{ animationDelay: "0ms" }}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">Home profile</p>
              <h2 className="mt-3 text-balance text-[32px] font-semibold leading-tight tracking-[-0.03em] text-[#0F172A] sm:text-[48px]">
                Build the model for your specific home.
              </h2>
              <p className="mt-5 text-[16px] leading-8 text-[#64748B]">
                We collect the minimum inputs needed to generate a reliable recommendation. You can adjust assumptions later.
              </p>
            </div>

            <div className="reveal" style={{ animationDelay: "70ms" }}>
              <OnboardingWizard onNext={handleIntakeNext} onPrev={handleIntakePrev} />
            </div>
          </div>
        </section>

        <section id={sectionIds.optimization} className="min-h-screen snap-start bg-[#F8FAFC] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto w-full max-w-[1600px] space-y-8">
            <div className="reveal max-w-[760px]" style={{ animationDelay: "0ms" }}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">Optimization</p>
              <h2 className="mt-3 text-balance text-[32px] font-semibold leading-tight tracking-[-0.03em] text-[#0F172A] sm:text-[48px]">
                Simulating your whole-home energy behavior.
              </h2>
              <p className="mt-5 text-[16px] leading-8 text-[#64748B]">
                We evaluate energy flows, timing, and financial outcomes to produce one coherent recommendation.
              </p>
            </div>

            <div className="reveal" style={{ animationDelay: "70ms" }}>
              {optimizationStarted ? (
                <OptimizationLoader onComplete={handleOptimizationComplete} />
              ) : (
                <div className="rounded-3xl border border-[rgba(148,163,184,0.18)] bg-white p-8 shadow-[0_16px_32px_-20px_rgba(15,23,42,0.12)]">
                  <p className="text-[15px] text-[#64748B]">Ready to run optimization.</p>
                  <button
                    type="button"
                    onClick={() => setOptimizationStarted(true)}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/[0.08] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.4)] transition-all duration-[200ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 active:scale-[0.98]"
                    style={{ background: "linear-gradient(180deg, #3F3F46 0%, #18181B 100%)" }}
                  >
                    Start optimization
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id={sectionIds.results} className="min-h-screen snap-start bg-[#F8FAFC]">
          <div className="reveal" style={{ animationDelay: "0ms" }}>
            {optimizationCompleted ? (
              <DashboardOverview onOpenAnalysis={() => scrollTo(sectionIds.analysis)} onBack={() => scrollTo(sectionIds.optimization)} />
            ) : (
              <LockedJourneyStage
                eyebrow="Results locked"
                title="Recommendations unlock after optimisation completes."
                description="The results dashboard stays inaccessible until validation, simulation and economic ranking have finished."
              />
            )}
          </div>
        </section>

        <section id={sectionIds.analysis} className="min-h-screen snap-start bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto w-full max-w-[1600px] space-y-8">
            {optimizationCompleted ? (
              <>
                <div className="reveal max-w-[760px]" style={{ animationDelay: "0ms" }}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">Deep analysis</p>
                  <h2 className="mt-3 text-balance text-[32px] font-semibold leading-tight tracking-[-0.03em] text-[#0F172A] sm:text-[48px]">
                    Validate the recommendation in detail.
                  </h2>
                  <p className="mt-5 text-[16px] leading-8 text-[#64748B]">
                    Inspect energy balance curves, dynamic pricing impact and model assumptions before making decisions.
                  </p>
                </div>

                <div className="reveal" style={{ animationDelay: "70ms" }}>
                  <AnalysisNotebook />
                </div>

                <div className="reveal flex justify-center" style={{ animationDelay: "140ms" }}>
                  <button
                    type="button"
                    onClick={() => onNext()}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.4)] transition-all duration-[200ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 active:scale-[0.98]"
                    style={{ background: "linear-gradient(180deg, #3F3F46 0%, #18181B 100%)" }}
                  >
                    Continue to interactive input workspace
                  </button>
                </div>
              </>
            ) : (
              <LockedJourneyStage
                eyebrow="Analysis locked"
                title="Detailed analysis follows the recommendation stage."
                description="We only expose traces, assumptions and sensitivity after the optimisation has produced a result set worth reviewing."
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function LockedJourneyStage({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1600px] items-center px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="w-full rounded-[32px] border border-[rgba(148,163,184,0.18)] bg-[rgba(255,255,255,0.82)] p-10 shadow-[0_16px_32px_-20px_rgba(15,23,42,0.12)] backdrop-blur-[12px] sm:p-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">{eyebrow}</p>
        <h2 className="mt-4 max-w-[14ch] text-balance text-[34px] font-semibold leading-tight tracking-[-0.03em] text-[#0F172A] sm:text-[52px]">{title}</h2>
        <p className="mt-5 max-w-[44rem] text-[16px] leading-8 text-[#64748B]">{description}</p>
      </div>
    </div>
  );
}

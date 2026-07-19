import { ArrowDown, Bolt, LineChart, ShieldCheck, Zap } from "lucide-react";
import { EliteButton } from "../ui/EliteButton";

interface HeroSectionProps {
  onStart: () => void;
}

const heroMetrics = [
  { value: "6", label: "intake stages" },
  { value: "4", label: "system classes" },
  { value: "3", label: "validation layers" },
];

const scenarioCards = [
  {
    title: "Savings-first",
    value: "€ 1,246",
    detail: "Highest annual savings with smart charging and battery arbitrage.",
  },
  {
    title: "Independence-first",
    value: "68%",
    detail: "Higher self-consumption and stronger outage resilience.",
  },
  {
    title: "Balanced",
    value: "5.6 yrs",
    detail: "Best overall payback with lower upfront complexity.",
  },
];

const heroImageSrc = `${import.meta.env.BASE_URL}images/aerial-view-modern-eco-house-solar-panels-roof-electric-car-parked-lush-green-garden-sunset-ev-actively-422831190.jpg`;
const dashboardImageSrc = `${import.meta.env.BASE_URL}images/energyos-ui-reference-collage.jpeg`;
const systemImageSrc = `${import.meta.env.BASE_URL}images/dashboard-energy-flow-isometric.jpeg`;

export function HeroSection({ onStart }: HeroSectionProps) {
  const scrollToStory = () => {
    document.getElementById("landing-story")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-white text-[#0F172A]">
      <section className="relative min-h-[100vh] snap-start overflow-hidden bg-[#0B0B0D] text-white">
        <img
          src={heroImageSrc}
          alt="Aerial view of a modern home with solar panels and an electric vehicle"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,13,0.22)_0%,rgba(11,11,13,0.46)_42%,rgba(11,11,13,0.84)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_18%,rgba(16,185,129,0.18),transparent_22%),radial-gradient(circle_at_18%_82%,rgba(255,255,255,0.08),transparent_26%)]" />

        <div className="relative mx-auto flex min-h-[100vh] w-full max-w-[1600px] flex-col justify-between px-5 pb-8 pt-6 sm:px-8 lg:px-12 lg:pb-10 lg:pt-8">
          <div className="reveal flex items-center justify-between" style={{ animationDelay: "0ms" }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/78 backdrop-blur-sm">
              <Bolt className="h-3.5 w-3.5 text-[#10B981]" />
              EnergyOS
            </div>
            <button
              type="button"
              onClick={scrollToStory}
              className="hidden items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.08em] text-white/70 backdrop-blur-sm transition-colors hover:text-white sm:inline-flex"
            >
              Explore
              <ArrowDown className="h-3.5 w-3.5 text-[#10B981]" />
            </button>
          </div>

          <div className="grid items-end gap-10 pb-4 lg:grid-cols-[minmax(0,760px)_1fr] lg:pb-8">
            <div className="reveal" style={{ animationDelay: "70ms" }}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/72">
                Whole-home energy intelligence
              </p>
              <h1 className="mt-4 max-w-[12ch] text-balance text-[42px] font-semibold leading-[0.95] tracking-[-0.04em] text-white sm:text-[68px] lg:text-[92px]">
                One decision for your whole home.
              </h1>
              <p className="mt-5 max-w-[34rem] text-[15px] leading-relaxed text-white/78 sm:text-[18px]">
                Model solar, battery, EV charging and heat pump behavior together, then see which setup actually wins before you spend.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <EliteButton onClick={onStart}>Start home analysis</EliteButton>
                <button
                  type="button"
                  onClick={scrollToStory}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/18 bg-white/8 px-5 py-2.5 text-[13px] font-semibold text-white/88 backdrop-blur-sm transition-all duration-[200ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  See how it works
                  <ArrowDown className="h-3.5 w-3.5 text-[#10B981]" />
                </button>
              </div>
            </div>

            <div className="reveal self-end justify-self-end" style={{ animationDelay: "140ms" }}>
              <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/12 bg-black/26 p-3 backdrop-blur-md sm:min-w-[380px]">
                {heroMetrics.map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/10 bg-white/7 px-3 py-3 text-center">
                    <p className="font-mono-num text-[18px] font-semibold text-white sm:text-[20px]">{item.value}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-white/58">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="landing-story" className="min-h-[100vh] snap-start bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto grid w-full max-w-[1600px] gap-10 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-16">
          <div className="reveal" style={{ animationDelay: "0ms" }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">Why this matters</p>
            <h2 className="mt-3 max-w-[12ch] text-balance text-[32px] font-semibold leading-tight tracking-[-0.03em] text-[#0F172A] sm:text-[46px]">
              Energy upgrades are still bought in fragments.
            </h2>
          </div>
          <div className="reveal grid gap-6 text-[16px] leading-8 text-[#475569]" style={{ animationDelay: "70ms" }}>
            <p>
              A battery is quoted without the EV. Solar is sized without the heat pump. Payback is shown without the actual timing of your usage. The homeowner gets product advice, not system advice.
            </p>
            <p>
              EnergyOS is built to answer the harder question: which configuration is technically and financially most logical for this specific home, given the way the household actually lives and consumes energy.
            </p>
          </div>
        </div>
      </section>

      <section className="min-h-[100vh] snap-start bg-[#F8FAFC] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <div className="mx-auto grid w-full max-w-[1600px] gap-5 lg:grid-cols-[1.12fr_0.88fr] lg:items-stretch">
          <div className="reveal relative min-h-[520px] overflow-hidden rounded-[28px] bg-[#0B0B0D]" style={{ animationDelay: "0ms" }}>
            <img
              src={systemImageSrc}
              alt="Whole-home energy system layout"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,13,0.18)_0%,rgba(11,11,13,0.68)_100%)]" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/62">Whole-home model</p>
              <p className="mt-2 max-w-[20ch] text-[28px] font-semibold leading-tight tracking-[-0.03em] text-white sm:text-[38px]">
                Solar, storage, charging and heating treated as one system.
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            <article className="reveal rounded-[28px] bg-white p-7 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.22)]" style={{ animationDelay: "70ms" }}>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8FAFC] text-[#059669]">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="mt-6 text-[24px] font-semibold tracking-[-0.03em] text-[#0F172A]">Set the goal first</h3>
              <p className="mt-3 text-[15px] leading-7 text-[#64748B]">
                Prioritize savings, self-consumption or balance. The recommendation changes because the objective changes.
              </p>
            </article>

            <article className="reveal rounded-[28px] bg-white p-7 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.22)]" style={{ animationDelay: "140ms" }}>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8FAFC] text-[#059669]">
                <LineChart className="h-5 w-5" />
              </div>
              <h3 className="mt-6 text-[24px] font-semibold tracking-[-0.03em] text-[#0F172A]">Simulate the timing</h3>
              <p className="mt-3 text-[15px] leading-7 text-[#64748B]">
                The value of a battery or EV charger depends on when production, consumption and tariffs interact throughout the day.
              </p>
            </article>

            <article className="reveal rounded-[28px] bg-white p-7 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.22)]" style={{ animationDelay: "210ms" }}>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8FAFC] text-[#059669]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-6 text-[24px] font-semibold tracking-[-0.03em] text-[#0F172A]">Explain the result</h3>
              <p className="mt-3 text-[15px] leading-7 text-[#64748B]">
                The output is not just a score. It shows why the system recommends this setup and where the tradeoffs really sit.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="min-h-[100vh] snap-start bg-[#0B0B0D] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto grid w-full max-w-[1600px] gap-10 lg:grid-cols-[minmax(0,460px)_1fr] lg:gap-16">
          <div className="reveal" style={{ animationDelay: "0ms" }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/55">Explainable advice</p>
            <h2 className="mt-3 max-w-[11ch] text-balance text-[32px] font-semibold leading-tight tracking-[-0.03em] sm:text-[48px]">
              See the system think before you trust the answer.
            </h2>
            <p className="mt-5 max-w-[34rem] text-[16px] leading-8 text-white/70">
              Recommendations feel credible when the reasoning is visible: energy flows, costs, assumptions, confidence and scenario tradeoffs all live in the same view.
            </p>
          </div>

          <div className="reveal overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-3 shadow-[0_22px_44px_-28px_rgba(0,0,0,0.58)] backdrop-blur-sm" style={{ animationDelay: "70ms" }}>
            <img
              src={dashboardImageSrc}
              alt="EnergyOS interface showing whole-home analysis"
              className="h-full w-full rounded-[22px] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="min-h-[100vh] snap-start bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="reveal max-w-[720px]" style={{ animationDelay: "0ms" }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">Scenario comparison</p>
            <h2 className="mt-3 text-balance text-[32px] font-semibold leading-tight tracking-[-0.03em] text-[#0F172A] sm:text-[48px]">
              Compare the tradeoffs before you commit.
            </h2>
            <p className="mt-5 text-[16px] leading-8 text-[#64748B]">
              Different households want different outcomes. The right answer is rarely the biggest system. It is the one that fits the objective best.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {scenarioCards.map((card, index) => (
              <article
                key={card.title}
                className="reveal rounded-[28px] border border-[rgba(148,163,184,0.18)] bg-[#F8FAFC] p-7 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.2)]"
                style={{ animationDelay: `${70 + index * 70}ms` }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">{card.title}</p>
                <p className="font-mono-num mt-6 text-[34px] font-semibold tracking-[-0.03em] text-[#0F172A]">{card.value}</p>
                <p className="mt-4 text-[15px] leading-7 text-[#64748B]">{card.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="min-h-[100vh] snap-start bg-[#F8FAFC] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto w-full max-w-[1200px] overflow-hidden rounded-[32px] bg-[#0B0B0D] px-6 py-12 text-white sm:px-10 lg:px-16 lg:py-16">
          <div className="reveal mx-auto max-w-[720px] text-center" style={{ animationDelay: "0ms" }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/56">Start with your home</p>
            <h2 className="mt-4 text-balance text-[32px] font-semibold leading-tight tracking-[-0.03em] sm:text-[50px]">
              Know the smartest energy upgrade before you spend.
            </h2>
            <p className="mt-5 text-[16px] leading-8 text-white/70">
              Build a full home profile, simulate the options and get one clear recommendation with the reasoning attached.
            </p>
            <div className="mt-8 flex justify-center">
              <EliteButton onClick={onStart}>Start home analysis</EliteButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

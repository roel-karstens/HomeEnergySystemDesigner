import { Bolt, CheckCircle2 } from "lucide-react";
import { EliteButton } from "../ui/EliteButton";

interface HeroSectionProps {
  onStart: () => void;
}

const heroBullets = [
  "AI-backed simulation for your specific home profile",
  "Transparent savings, payback, and risk metrics",
  "System advice across solar, battery, EV and heat pump",
  "Decision-ready report for homeowner and installer",
];

const stats = [
  { value: "10,000+", label: "Simulations" },
  { value: "42%", label: "Average savings" },
  { value: "4.8", label: "Star rating" },
  { value: "2-8 yrs", label: "Typical payback" },
];

const heroImageSrc = `${import.meta.env.BASE_URL}images/hero-house-ev.jpeg`;

export function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <section className="relative mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 sm:pt-8 md:pt-12 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_8%_12%,rgba(5,150,105,0.08),transparent_40%),radial-gradient(circle_at_88%_18%,rgba(15,23,42,0.05),transparent_46%)]" />

      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="reveal lg:col-span-6" style={{ animationDelay: "0ms" }}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(148,163,184,0.18)] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#64748B]">
            <Bolt className="h-3.5 w-3.5 text-[#059669]" />
            EnergyOS Premium
          </div>

          <h1 className="text-balance text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-5xl lg:text-6xl">
            The smartest way to invest in your home energy.
          </h1>

          <p className="mt-4 max-w-xl text-pretty text-[14px] leading-relaxed text-[#64748B] sm:mt-5 sm:text-[16px]">
            Transform complex energy choices into one clear recommendation with explainable technical and financial logic.
          </p>

          <ul className="mt-6 space-y-3 text-[14px] text-[#0F172A]">
            {heroBullets.map((line) => (
              <li key={line} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#059669]" />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <EliteButton onClick={onStart}>Start free analysis</EliteButton>
            <span className="text-[13px] text-[#94A3B8]">No credit card required</span>
          </div>
        </div>

        <div className="reveal lg:col-span-6" style={{ animationDelay: "70ms" }}>
          <div className="overflow-hidden rounded-3xl border border-[rgba(148,163,184,0.18)] bg-white p-3 shadow-[0_18px_46px_-26px_rgba(15,23,42,0.22)]">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#F8FAFC]">
              <img
                src={heroImageSrc}
                alt="Modern house with rooftop solar and electric vehicle"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white via-white/85 to-transparent sm:w-32" />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/75 to-transparent sm:h-24" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.35),transparent_42%)]" />
              <div className="absolute left-3 top-3 max-w-[70%] rounded-lg border border-white/70 bg-white/94 p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#94A3B8]">Premium home scenario</p>
                <p className="mt-1 text-[13px] font-semibold text-[#0F172A]">Solar-ready house with smart EV charging setup</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="reveal absolute bottom-5 left-4 right-4 mx-auto grid max-w-5xl grid-cols-2 gap-2 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white p-3 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.18)] sm:grid-cols-4 sm:gap-3 sm:p-4"
        style={{ animationDelay: "140ms" }}
      >
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-[rgba(148,163,184,0.12)] bg-[#F8FAFC] px-3 py-2 text-center"
          >
            <p className="font-mono-num text-[18px] font-semibold tracking-tight text-[#0F172A]">{item.value}</p>
            <p className="text-[12px] text-[#64748B]">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

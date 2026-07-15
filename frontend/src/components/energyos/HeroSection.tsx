import { motion, useReducedMotion } from "framer-motion";
import { Bolt, CheckCircle2 } from "lucide-react";

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
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 sm:pt-8 md:pt-12 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_8%_12%,rgba(0,168,107,0.15),transparent_40%),radial-gradient(circle_at_88%_18%,rgba(15,23,42,0.09),transparent_46%)]" />

      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-6"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)]">
            <Bolt className="h-3.5 w-3.5 text-[#00A86B]" />
            EnergyOS Premium
          </div>

          <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            The smartest way to invest in your home energy.
          </h1>

          <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-slate-600 sm:mt-5 sm:text-lg">
            Transform complex energy choices into one clear recommendation with explainable technical and financial logic.
          </p>

          <ul className="mt-6 space-y-3 text-sm text-slate-700 sm:text-base">
            {heroBullets.map((line) => (
              <li key={line} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#00A86B]" />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onStart}
              className="rounded-xl bg-[#00A86B] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#00925c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              Start Free Analysis -&gt;
            </button>
            <span className="text-sm text-slate-500">No credit card required</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="lg:col-span-6"
        >
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_18px_46px_-26px_rgba(15,23,42,0.33)]">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <motion.img
                src={heroImageSrc}
                alt="Modern house with rooftop solar and electric vehicle"
                className="h-full w-full object-cover"
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        scale: [1, 1.02, 1],
                        x: [0, -4, 0],
                        y: [0, 2, 0],
                      }
                }
                transition={
                  reduceMotion
                    ? undefined
                    : {
                        duration: 12,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                      }
                }
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white via-white/85 to-transparent sm:w-32" />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/75 to-transparent sm:h-24" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.35),transparent_42%)]" />
              <div className="absolute left-3 top-3 max-w-[70%] rounded-lg border border-white/70 bg-white/94 p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Premium home scenario</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">Solar-ready house with smart EV charging setup</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
        className="absolute bottom-5 left-4 right-4 mx-auto grid max-w-5xl grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.3)] sm:grid-cols-4 sm:gap-3 sm:p-4"
      >
        {stats.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.24 + index * 0.06 }}
            className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-center"
          >
            <p className="text-lg font-semibold tracking-tight text-slate-900">{item.value}</p>
            <p className="text-xs text-slate-500">{item.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

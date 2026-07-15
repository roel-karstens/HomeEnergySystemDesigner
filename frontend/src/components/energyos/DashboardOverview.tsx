import { motion, useReducedMotion } from "framer-motion";
import { Download, FileText, Settings, Share2 } from "lucide-react";
import type { ReactNode } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface DashboardOverviewProps {
  onOpenAnalysis: () => void;
}

type FlowSlice = {
  label: string;
  value: number;
  color: string;
};

type Kpi = {
  title: string;
  value: string;
  hint: string;
  valueClassName?: string;
};

const navItems = ["Overview", "Energy", "Financial", "Systems", "Analysis", "Report", "Settings"];

const kpis: Kpi[] = [
  { title: "Annual savings", value: "EUR 1,246", hint: "Compared to current setup", valueClassName: "text-[#00A86B]" },
  { title: "Total investment", value: "EUR 12,480", hint: "After incentives" },
  { title: "Payback period", value: "5.6 years", hint: "Badge: very good" },
  { title: "20-year ROI", value: "186%", hint: "Net present value" },
];

const flowSlices: FlowSlice[] = [
  { label: "Self-consumption", value: 42, color: "#00A86B" },
  { label: "Battery", value: 18, color: "#56C99A" },
  { label: "Grid import", value: 22, color: "#F97316" },
  { label: "Grid export", value: 18, color: "#94A3B8" },
];

const dashboardDiagramImageSrc = `${import.meta.env.BASE_URL}images/dashboard-energy-flow-isometric.jpeg`;

export function DashboardOverview({ onOpenAnalysis }: DashboardOverviewProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="grid min-h-[70vh] grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-2xl border border-slate-800 bg-[#09090B] p-4 text-slate-200 shadow-[0_12px_36px_-18px_rgba(0,0,0,0.55)]">
        <h2 className="px-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">EnergyOS</h2>
        <nav className="mt-4 space-y-1">
          {navItems.map((item) => {
            const active = item === "Overview";
            return (
              <button
                key={item}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  active
                    ? "bg-white/10 font-semibold text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
                type="button"
              >
                {item}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="space-y-5 sm:space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">System recommendation overview</h2>
            <p className="mt-1 text-sm text-slate-500">Integrated simulation output across solar, battery, EV and heat pump behavior.</p>
          </div>
          <div className="flex items-center gap-2">
            <ActionButton icon={<Share2 className="h-4 w-4" />} label="Share" />
            <ActionButton icon={<Download className="h-4 w-4" />} label="Export" />
            <ActionButton icon={<FileText className="h-4 w-4" />} label="Report" />
            <ActionButton icon={<Settings className="h-4 w-4" />} label="Settings" />
          </div>
        </header>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
          className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-4"
        >
          {kpis.map((kpi) => (
            <motion.article
              key={kpi.title}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_rgba(0,0,0,0.12)]"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{kpi.title}</p>
              <p className={`mt-3 text-3xl font-semibold tracking-tight text-slate-900 ${kpi.valueClassName ?? ""}`}>{kpi.value}</p>
              {kpi.title === "Payback period" ? (
                <div className="mt-3 inline-flex rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                  very good
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-500">{kpi.hint}</p>
              )}
            </motion.article>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] xl:col-span-7">
            <h3 className="text-lg font-semibold text-slate-900">System Configuration</h3>
            <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.2fr]">
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"><span className="font-semibold text-slate-900">16 Solar panels</span>, 6.4 Kwp</li>
                <li className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"><span className="font-semibold text-slate-900">5 kWh Battery</span>, LFP chemistry</li>
                <li className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"><span className="font-semibold text-slate-900">Smart EV charging</span>, 11 kW control</li>
                <li className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"><span className="font-semibold text-slate-900">Heat pump</span>, weather-compensated control</li>
              </ul>

              <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-3">
                <motion.img
                  src={dashboardDiagramImageSrc}
                  alt="Isometric home energy system flow diagram"
                  className="h-full w-full rounded-lg object-cover"
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          scale: [1, 1.018, 1],
                          x: [0, -2, 0],
                          y: [0, 2, 0],
                        }
                  }
                  transition={
                    reduceMotion
                      ? undefined
                      : {
                          duration: 13,
                          repeat: Infinity,
                          repeatType: "mirror",
                          ease: "easeInOut",
                        }
                  }
                />
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.2 }}
                  className="absolute bottom-5 right-5 rounded-full border border-emerald-200 bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700"
                >
                  Live flow model
                </motion.div>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] xl:col-span-5">
            <h3 className="text-lg font-semibold text-slate-900">Annual Energy Flow</h3>
            <div className="mt-2 h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={flowSlices} dataKey="value" nameKey="label" innerRadius={56} outerRadius={94} paddingAngle={2}>
                    {flowSlices.map((slice) => (
                      <Cell key={slice.label} fill={slice.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <ul className="space-y-2 text-sm">
              {flowSlices.map((slice) => (
                <li key={slice.label} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
                    {slice.label}
                  </span>
                  <span className="font-semibold text-slate-900">{slice.value}%</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onOpenAnalysis}
            className="rounded-xl bg-[#00A86B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#00925c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Open advanced analysis
          </button>
        </div>
      </div>
    </section>
  );
}

interface ActionButtonProps {
  icon: ReactNode;
  label: string;
}

function ActionButton({ icon, label }: ActionButtonProps) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
    >
      {icon}
      {label}
    </button>
  );
}

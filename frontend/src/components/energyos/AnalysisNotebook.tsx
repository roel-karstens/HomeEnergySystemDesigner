import { useState } from "react";
import { motion } from "framer-motion";
import { Area, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const tabs = ["Energy balance", "Cash flow", "Sensitivity", "Assumptions", "Validation"] as const;

type AnalysisTab = (typeof tabs)[number];

type ChartPoint = {
  time: string;
  solar: number;
  load: number;
  heatPump: number;
  ev: number;
  gridImport: number;
  gridExport: number;
  price: number;
};

const data: ChartPoint[] = [
  { time: "00:00", solar: 0, load: 2.8, heatPump: 1.5, ev: 0.2, gridImport: 2.1, gridExport: 0, price: 0.22 },
  { time: "03:00", solar: 0, load: 2.4, heatPump: 1.4, ev: 0.1, gridImport: 1.9, gridExport: 0, price: 0.19 },
  { time: "06:00", solar: 0.5, load: 2.6, heatPump: 1.2, ev: 0.3, gridImport: 1.2, gridExport: 0, price: 0.21 },
  { time: "09:00", solar: 2.8, load: 3.1, heatPump: 0.8, ev: 0.4, gridImport: 0.5, gridExport: 0.2, price: 0.26 },
  { time: "12:00", solar: 5.9, load: 3.4, heatPump: 0.6, ev: 0.5, gridImport: 0.1, gridExport: 2.4, price: 0.31 },
  { time: "15:00", solar: 5.1, load: 3.6, heatPump: 0.7, ev: 0.8, gridImport: 0.2, gridExport: 1.3, price: 0.29 },
  { time: "18:00", solar: 1.7, load: 4.4, heatPump: 1.2, ev: 1.4, gridImport: 2.1, gridExport: 0.1, price: 0.33 },
  { time: "21:00", solar: 0.1, load: 4.1, heatPump: 1.8, ev: 1.2, gridImport: 3.2, gridExport: 0, price: 0.28 },
  { time: "24:00", solar: 0, load: 3.3, heatPump: 1.6, ev: 0.6, gridImport: 2.7, gridExport: 0, price: 0.24 },
];

const totals = [
  { label: "Total consumption", value: "6,308 kWh" },
  { label: "Solar production", value: "5,120 kWh" },
  { label: "Self-consumption", value: "42%" },
  { label: "Grid import", value: "1,386 kWh" },
  { label: "Grid export", value: "1,134 kWh" },
];

export function AnalysisNotebook() {
  const [activeTab, setActiveTab] = useState<AnalysisTab>("Energy balance");

  return (
    <section className="mx-auto w-full max-w-7xl rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] sm:p-6 lg:p-8">
      <header className="mb-5">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Advanced Analysis Notebook</h2>
        <p className="mt-2 text-sm text-slate-500">High-resolution performance and financial traces for each optimization assumption.</p>
      </header>

      <div className="mb-6 flex gap-2 overflow-x-auto border-b border-slate-200 pb-3">
        {tabs.map((tab) => {
          const active = tab === activeTab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                active
                  ? "bg-[#00A86B] text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {[
            ["Solar", "#f59e0b"],
            ["Load", "#0f172a"],
            ["EV", "#3b82f6"],
            ["Heat pump", "#0ea5e9"],
            ["Grid import", "#ef4444"],
            ["Grid export", "#22c55e"],
            ["Price", "#111827"],
          ].map(([label, color]) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
              {label}
            </span>
          ))}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-2 sm:p-4">
          <div className="h-[300px] sm:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="energy" stroke="#64748b" tick={{ fontSize: 12 }} width={40} />
                <YAxis yAxisId="price" orientation="right" stroke="#64748b" tick={{ fontSize: 12 }} width={42} />
                <Tooltip
                  contentStyle={{ border: "1px solid #E2E8F0", borderRadius: 12, background: "#fff" }}
                  formatter={(value: number, name: string) => {
                    if (name.includes("price")) {
                      return [`EUR ${value.toFixed(2)}/kWh`, name];
                    }
                    return [`${value.toFixed(2)} kWh`, name];
                  }}
                  labelFormatter={(label) => `Time ${label}`}
                />

                <Area yAxisId="energy" type="monotone" dataKey="solar" stroke="#f59e0b" fill="#fde68a" fillOpacity={0.45} name="Solar production" />
                <Line yAxisId="energy" type="monotone" dataKey="load" stroke="#0f172a" strokeWidth={2.4} dot={false} name="Household load" />
                <Area yAxisId="energy" type="monotone" dataKey="ev" stackId="usage" stroke="#3b82f6" fill="#93c5fd" fillOpacity={0.33} name="EV charging" />
                <Area yAxisId="energy" type="monotone" dataKey="heatPump" stackId="usage" stroke="#0ea5e9" fill="#bae6fd" fillOpacity={0.36} name="Heat pump" />
                <Area yAxisId="energy" type="monotone" dataKey="gridImport" stroke="#ef4444" fill="#fecaca" fillOpacity={0.26} name="Grid import" />
                <Area yAxisId="energy" type="monotone" dataKey="gridExport" stroke="#22c55e" fill="#bbf7d0" fillOpacity={0.26} name="Grid export" />
                <Line yAxisId="price" type="monotone" dataKey="price" stroke="#111827" strokeWidth={1.4} dot={false} name="Dynamic price (EUR/kWh)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        className="mt-5 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-5"
      >
        {totals.map((item) => (
          <motion.article
            key={item.label}
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            className="rounded-xl border border-slate-200 bg-white px-2.5 py-3 text-center sm:px-3"
          >
            <p className="text-[11px] uppercase tracking-wide text-slate-500 sm:text-xs">{item.label}</p>
            <p className="mt-1 text-base font-semibold tracking-tight text-slate-900 sm:text-lg">{item.value}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

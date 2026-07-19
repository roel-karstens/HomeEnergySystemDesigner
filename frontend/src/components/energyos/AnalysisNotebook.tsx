import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PremiumCard } from "../ui/PremiumCard";

const tabs = ["Energy balance", "Cash flow", "Sensitivity", "Assumptions", "Validation"] as const;
type AnalysisTab = (typeof tabs)[number];

const energyTrace = [
  { time: "00:00", solar: 0, load: 2.8, price: 0.22, battery: 0.3 },
  { time: "03:00", solar: 0, load: 2.4, price: 0.19, battery: 0.2 },
  { time: "06:00", solar: 0.5, load: 2.6, price: 0.21, battery: 0.5 },
  { time: "09:00", solar: 2.8, load: 3.1, price: 0.26, battery: 0.8 },
  { time: "12:00", solar: 5.9, load: 3.4, price: 0.31, battery: 1.4 },
  { time: "15:00", solar: 5.1, load: 3.6, price: 0.29, battery: 1.2 },
  { time: "18:00", solar: 1.7, load: 4.4, price: 0.33, battery: 0.7 },
  { time: "21:00", solar: 0.1, load: 4.1, price: 0.28, battery: 0.4 },
  { time: "24:00", solar: 0, load: 3.3, price: 0.24, battery: 0.2 },
];

const cashFlowSeries = [
  { year: "0", savings: 0, cumulative: -12480 },
  { year: "1", savings: 1246, cumulative: -11234 },
  { year: "5", savings: 1420, cumulative: -6200 },
  { year: "10", savings: 1584, cumulative: 450 },
  { year: "15", savings: 1710, cumulative: 8120 },
  { year: "20", savings: 1860, cumulative: 18940 },
];

const sensitivitySeries = [
  { parameter: "Import tariff +20%", impact: 2140 },
  { parameter: "Battery cost -15%", impact: 980 },
  { parameter: "Lower solar yield", impact: -1160 },
  { parameter: "EV daytime charging", impact: 720 },
  { parameter: "Heat demand +10%", impact: -860 },
];

const assumptionGroups = [
  { title: "Weather and production", items: ["Reference weather year used for solar output.", "Panel degradation excluded from near-term ranking."] },
  { title: "Usage behaviour", items: ["Daytime occupancy inferred from daytime load share.", "EV connection availability uses a weekly home-parking estimate."] },
  { title: "Financial context", items: ["Export reimbursement treated as flat.", "Maintenance costs represented as a simplified annual reserve."] },
];

const validationLayers = [
  { label: "Input validation", status: "Passed", note: "Required fields, numerical ranges and tariff bounds are consistent." },
  { label: "Domain validation", status: "Passed", note: "Selected system freedoms are consistent with component states." },
  { label: "Simulation validation", status: "Passed with assumptions", note: "Envelope still uses label-based heating approximation." },
  { label: "Result validation", status: "Passed", note: "No negative-logic or infeasible recommendation states detected." },
  { label: "Optimizer quality control", status: "Passed", note: "24 valid scenarios ranked against the chosen balanced objective." },
];

const energyTotals = [
  { label: "Total consumption", value: "6,308 kWh" },
  { label: "Solar production", value: "5,120 kWh" },
  { label: "Grid import", value: "1,386 kWh" },
  { label: "Peak import hour", value: "18:00" },
];

export function AnalysisNotebook() {
  const [activeTab, setActiveTab] = useState<AnalysisTab>("Energy balance");

  return (
    <section className="mx-auto w-full max-w-[1600px] space-y-5">
      <PremiumCard className="bg-[rgba(255,255,255,0.9)]">
        <div className="flex flex-wrap items-start justify-between gap-5 border-b border-[rgba(148,163,184,0.18)] pb-6">
          <div className="max-w-[720px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">Engineering workspace</p>
            <h2 className="mt-3 text-[32px] font-semibold tracking-[-0.03em] text-[#0F172A]">Advanced analysis notebook</h2>
            <p className="mt-4 text-[15px] leading-8 text-[#64748B]">High-resolution traces, scenario economics and validation outputs for the recommended configuration.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const active = tab === activeTab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={[
                    "rounded-full px-3 py-2 text-[12px] font-semibold transition-all duration-[200ms]",
                    active
                      ? "bg-[linear-gradient(180deg,#3F3F46_0%,#18181B_100%)] text-white shadow-[0_14px_24px_-18px_rgba(15,23,42,0.45)]"
                      : "border border-[rgba(148,163,184,0.18)] bg-white text-[#64748B] hover:bg-[#F8FAFC]",
                  ].join(" ")}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">{renderTab(activeTab)}</div>
      </PremiumCard>
    </section>
  );
}

function renderTab(activeTab: AnalysisTab) {
  switch (activeTab) {
    case "Energy balance":
      return (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-3xl border border-[rgba(148,163,184,0.18)] bg-[#F8FAFC] p-4 sm:p-5">
              <div className="h-[320px] sm:h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={energyTrace}>
                    <defs>
                      <linearGradient id="nbSolar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.44} />
                        <stop offset="100%" stopColor="#10B981" stopOpacity={0.06} />
                      </linearGradient>
                      <linearGradient id="nbBattery" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.36} />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.18)" strokeDasharray="4 4" />
                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="energy" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={34} />
                    <YAxis yAxisId="price" orientation="right" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={36} />
                    <Tooltip contentStyle={{ background: "rgba(255,255,255,0.96)", border: "1px solid rgba(148,163,184,0.18)", borderRadius: 14, fontSize: 12 }} />
                    <Area yAxisId="energy" type="monotone" dataKey="solar" stroke="#059669" fill="url(#nbSolar)" strokeWidth={2.1} />
                    <Area yAxisId="energy" type="monotone" dataKey="battery" stroke="#7C3AED" fill="url(#nbBattery)" strokeWidth={2.1} />
                    <Line yAxisId="energy" type="monotone" dataKey="load" stroke="#0EA5E9" strokeWidth={2.8} dot={false} />
                    <Line yAxisId="price" type="monotone" dataKey="price" stroke="#4338CA" strokeDasharray="5 5" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid gap-3">
              {energyTotals.map((item) => (
                <div key={item.label} className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#F8FAFC] px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">{item.label}</p>
                  <p className="font-mono-num mt-3 text-[22px] font-semibold tracking-[-0.03em] text-[#0F172A]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case "Cash flow":
      return (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="rounded-3xl border border-[rgba(148,163,184,0.18)] bg-[#F8FAFC] p-4 sm:p-5">
            <div className="h-[320px] sm:h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowSeries}>
                  <defs>
                    <linearGradient id="nbCashBarFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.92} />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity={0.66} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.18)" strokeDasharray="4 4" />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={44} />
                  <Tooltip contentStyle={{ background: "rgba(255,255,255,0.96)", border: "1px solid rgba(148,163,184,0.18)", borderRadius: 14, fontSize: 12 }} formatter={(value: number) => [`EUR ${value.toLocaleString()}`, "Value"]} />
                  <Bar dataKey="cumulative" fill="url(#nbCashBarFill)" radius={[6, 6, 0, 0]} barSize={28} />
                  <Line type="monotone" dataKey="savings" stroke="#10B981" strokeWidth={2.4} dot={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid gap-3">
            <CashStat label="Simple payback" value="5.6 years" note="balanced objective" />
            <CashStat label="20-year ROI" value="186%" note="nominal cumulative view" />
            <CashStat label="Export sensitivity" value="Moderate" note="battery value grows as export price falls" />
          </div>
        </div>
      );
    case "Sensitivity":
      return (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-3xl border border-[rgba(148,163,184,0.18)] bg-[#F8FAFC] p-4 sm:p-5">
            <div className="h-[320px] sm:h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sensitivitySeries} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid horizontal={false} stroke="rgba(148,163,184,0.18)" strokeDasharray="4 4" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="parameter" type="category" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={120} />
                  <Tooltip contentStyle={{ background: "rgba(255,255,255,0.96)", border: "1px solid rgba(148,163,184,0.18)", borderRadius: 14, fontSize: 12 }} formatter={(value: number) => [`EUR ${value.toLocaleString()}`, "NPV delta"]} />
                  <Bar dataKey="impact" radius={[0, 6, 6, 0]}>
                    {sensitivitySeries.map((item) => (
                      <Cell key={item.parameter} fill={item.impact >= 0 ? "#8B5CF6" : "#60A5FA"} fillOpacity={item.impact >= 0 ? 0.88 : 0.56} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-3">
            <InfoCard title="Highest upside" value="Import tariff increase" note="Storage and smart charging create more value under higher grid prices." />
            <InfoCard title="Highest downside" value="Lower solar yield" note="Reduced generation weakens both self-consumption and export value." />
            <InfoCard title="Risk framing" value="Manageable" note="Recommendation remains positive across all tested single-parameter shocks." />
          </div>
        </div>
      );
    case "Assumptions":
      return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {assumptionGroups.map((group) => (
            <PremiumCard key={group.title} title={group.title} subtitle="Declared modelling assumption">
              <ul className="space-y-3 text-[14px] leading-7 text-[#64748B]">
                {group.items.map((item) => (
                  <li key={item} className="rounded-xl bg-[#F8FAFC] px-3 py-3 text-[#0F172A]">{item}</li>
                ))}
              </ul>
            </PremiumCard>
          ))}
        </div>
      );
    case "Validation":
      return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {validationLayers.map((layer) => (
            <PremiumCard key={layer.label} title={layer.label} subtitle={layer.status} className="bg-[rgba(248,250,252,0.82)]">
              <p className="text-[14px] leading-7 text-[#64748B]">{layer.note}</p>
            </PremiumCard>
          ))}
        </div>
      );
  }
}

function CashStat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#F8FAFC] px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">{label}</p>
      <p className="font-mono-num mt-3 text-[22px] font-semibold tracking-[-0.03em] text-[#0F172A]">{value}</p>
      <p className="mt-2 text-[13px] leading-6 text-[#64748B]">{note}</p>
    </div>
  );
}

function InfoCard({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#F8FAFC] px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">{title}</p>
      <p className="mt-3 text-[18px] font-semibold tracking-[-0.02em] text-[#0F172A]">{value}</p>
      <p className="mt-2 text-[13px] leading-6 text-[#64748B]">{note}</p>
    </div>
  );
}

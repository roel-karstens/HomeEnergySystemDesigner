import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronLeft, FileText, Share2 } from "lucide-react";
import { EliteButton } from "../ui/EliteButton";
import { PremiumCard } from "../ui/PremiumCard";

interface DashboardOverviewProps {
  onOpenAnalysis: () => void;
  onBack?: () => void;
}

type Kpi = {
  label: string;
  value: string;
  context: string;
};

type SystemCard = {
  label: string;
  value: string;
  detail: string;
};

const headlineKpis: Kpi[] = [
  { label: "Annual savings", value: "EUR 1,246", context: "versus current setup" },
  { label: "Total investment", value: "EUR 12,480", context: "after incentives" },
  { label: "Payback period", value: "5.6 years", context: "balanced objective" },
  { label: "Self-consumption", value: "68%", context: "with battery optimisation" },
];

const systemCards: SystemCard[] = [
  { label: "Solar", value: "6.4 kWp", detail: "16 panels, south-west roof" },
  { label: "Battery", value: "5 kWh", detail: "LFP storage sized for evening load-shift" },
  { label: "Heat pump", value: "Hybrid", detail: "retains resilience while lowering peak grid demand" },
  { label: "EV charging", value: "11 kW smart", detail: "solar-first daytime charging logic" },
];

const annualBalance = [
  { month: "Jan", solar: 180, load: 310, battery: 48 },
  { month: "Feb", solar: 240, load: 292, battery: 52 },
  { month: "Mar", solar: 372, load: 260, battery: 64 },
  { month: "Apr", solar: 492, load: 214, battery: 78 },
  { month: "May", solar: 566, load: 205, battery: 82 },
  { month: "Jun", solar: 610, load: 194, battery: 88 },
  { month: "Jul", solar: 588, load: 201, battery: 85 },
  { month: "Aug", solar: 534, load: 209, battery: 80 },
  { month: "Sep", solar: 402, load: 236, battery: 69 },
  { month: "Oct", solar: 284, load: 272, battery: 57 },
  { month: "Nov", solar: 194, load: 301, battery: 49 },
  { month: "Dec", solar: 152, load: 326, battery: 44 },
];

const cashFlow = [
  { year: "0", cumulative: -12480 },
  { year: "5", cumulative: -6200 },
  { year: "10", cumulative: 450 },
  { year: "15", cumulative: 8120 },
  { year: "20", cumulative: 18940 },
];

const energyFlows = [
  { label: "Self-consumption", value: 42, color: "#0EA5E9" },
  { label: "Battery dispatch", value: 18, color: "#8B5CF6" },
  { label: "Grid import", value: 24, color: "#475569" },
  { label: "Grid export", value: 16, color: "#10B981" },
];

const recommendationReasons = [
  "Battery optimisation clears the midday export surplus without oversizing storage.",
  "Hybrid heat pump keeps winter demand controllable while reducing annual gas exposure.",
  "Smart EV charging absorbs excess production during the lowest-cost charging window.",
];

const validationNotes = {
  blocking: "0 blockers",
  warnings: [
    "Envelope still uses label-based approximation.",
    "Tariff model assumes a flat export reimbursement.",
  ],
  assumptions: [
    "Weather year uses a standardised reference profile.",
    "EV weekday charging availability is assumed at home during midday twice a week.",
  ],
};

const scenarioSummary = [
  { name: "Savings-first", metric: "EUR 1,380/yr", tradeoff: "higher battery utilisation" },
  { name: "Balanced", metric: "5.6 yrs", tradeoff: "best payback / comfort ratio" },
  { name: "Independence", metric: "72% autonomy", tradeoff: "higher capex" },
];

export function DashboardOverview({ onOpenAnalysis, onBack }: DashboardOverviewProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[linear-gradient(180deg,#3F3F46_0%,#18181B_100%)] px-5 py-5 text-white shadow-[0_18px_32px_-24px_rgba(15,23,42,0.6)] sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-4">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/6 px-3 py-2 text-[13px] text-white/76 transition-colors hover:text-white"
            >
              <ChevronLeft className="h-4 w-4 text-[#10B981]" />
              Back
            </button>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/55">
              Recommendation ready
            </p>
            <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.03em] text-white sm:text-[30px]">
              Balanced whole-home recommendation
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip label="Inputs validated" />
            <StatusChip label="2 assumptions" />
            <StatusChip label="24 scenarios tested" />
          </div>
          <div className="flex items-center gap-2">
            <GhostAction icon={<Share2 className="h-4 w-4" />} label="Share" />
            <GhostAction icon={<FileText className="h-4 w-4" />} label="Report" />
            <EliteButton onClick={onOpenAnalysis}>Open advanced analysis</EliteButton>
          </div>
        </div>
      </header>

      <main className="px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5">
          <PremiumCard className="reveal" style={{ animationDelay: "0ms" }}>
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_0.85fr]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">
                  Recommended package
                </p>
                <h3 className="mt-3 max-w-[18ch] text-balance text-[32px] font-semibold leading-tight tracking-[-0.03em] text-[#0F172A] sm:text-[40px]">
                  Add a modest battery, keep the hybrid heat pump, and coordinate charging around solar.
                </h3>
                <p className="mt-5 max-w-[60ch] text-[15px] leading-8 text-[#64748B]">
                  This configuration wins because it captures midday surplus, reduces peak import costs and avoids overspending on hardware that would sit idle through much of the year.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <SummaryMetric label="Model completeness" value="High" detail="all core inputs present" />
                  <SummaryMetric label="Constraint mode" value="Controlled" detail="optimizer respected explicit locks" />
                  <SummaryMetric label="Decision objective" value="Balanced" detail="cost, autonomy and comfort weighted" />
                </div>
              </div>

              <div className="grid gap-3">
                {recommendationReasons.map((reason) => (
                  <div
                    key={reason}
                    className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#F8FAFC] px-4 py-4 text-[14px] leading-7 text-[#0F172A]"
                  >
                    {reason}
                  </div>
                ))}
              </div>
            </div>
          </PremiumCard>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {headlineKpis.map((kpi, index) => (
              <PremiumCard key={kpi.label} as="article" className="reveal" style={{ animationDelay: `${70 + index * 40}ms` }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">{kpi.label}</p>
                <p className="font-mono-num mt-4 text-[28px] font-semibold tracking-[-0.03em] text-[#0F172A]">{kpi.value}</p>
                <p className="mt-3 text-[13px] leading-6 text-[#64748B]">{kpi.context}</p>
              </PremiumCard>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-4">
            {systemCards.map((item, index) => (
              <PremiumCard key={item.label} className="reveal" style={{ animationDelay: `${210 + index * 40}ms` }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">{item.label}</p>
                <p className="font-mono-num mt-4 text-[24px] font-semibold tracking-[-0.03em] text-[#0F172A]">{item.value}</p>
                <p className="mt-3 text-[13px] leading-6 text-[#64748B]">{item.detail}</p>
              </PremiumCard>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.2fr)_0.8fr]">
            <PremiumCard
              title="Monthly energy balance"
              subtitle="Solar, household load and battery contribution"
              className="reveal"
              style={{ animationDelay: "330ms" }}
            >
              <div className="h-[280px] sm:h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={annualBalance}>
                    <defs>
                      <linearGradient id="solarFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.42} />
                        <stop offset="100%" stopColor="#10B981" stopOpacity={0.06} />
                      </linearGradient>
                      <linearGradient id="batteryFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.36} />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="loadBarFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.72} />
                        <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0.28} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.18)" strokeDasharray="4 4" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={34} />
                    <Tooltip contentStyle={{ background: "rgba(255,255,255,0.96)", border: "1px solid rgba(148,163,184,0.18)", borderRadius: 14, fontSize: 12 }} />
                    <Area type="monotone" dataKey="solar" stroke="#059669" fill="url(#solarFill)" strokeWidth={2.2} />
                    <Area type="monotone" dataKey="battery" stroke="#7C3AED" fill="url(#batteryFill)" strokeWidth={2.1} />
                    <Bar dataKey="load" fill="url(#loadBarFill)" radius={[4, 4, 0, 0]} barSize={12} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </PremiumCard>

            <PremiumCard title="Energy routing" subtitle="Annual flow split" className="reveal" style={{ animationDelay: "400ms" }}>
              <div className="grid gap-5 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
                <div className="mx-auto h-[180px] w-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={energyFlows} dataKey="value" nameKey="label" innerRadius={48} outerRadius={74} paddingAngle={2} strokeWidth={0}>
                        {energyFlows.map((slice) => (
                          <Cell key={slice.label} fill={slice.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="space-y-2">
                  {energyFlows.map((slice) => (
                    <li key={slice.label} className="flex items-center justify-between rounded-xl bg-[#F8FAFC] px-3 py-2.5 text-[13px]">
                      <span className="flex items-center gap-2 text-[#64748B]">
                        <span className="h-2 w-2 rounded-full" style={{ background: slice.color }} />
                        {slice.label}
                      </span>
                      <span className="font-mono-num font-semibold text-[#0F172A]">{slice.value}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </PremiumCard>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
            <PremiumCard title="20-year cash flow" subtitle="Cumulative view including upfront investment" className="reveal" style={{ animationDelay: "470ms" }}>
              <div className="h-[280px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cashFlow}>
                    <defs>
                      <linearGradient id="cashFlowBarFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity={0.68} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.18)" strokeDasharray="4 4" />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={48} />
                    <Tooltip contentStyle={{ background: "rgba(255,255,255,0.96)", border: "1px solid rgba(148,163,184,0.18)", borderRadius: 14, fontSize: 12 }} formatter={(value: number) => [`EUR ${value.toLocaleString()}`, "Cumulative"]} />
                    <Bar dataKey="cumulative" fill="url(#cashFlowBarFill)" radius={[6, 6, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </PremiumCard>

            <PremiumCard title="Validation output" subtitle={validationNotes.blocking} className="reveal" style={{ animationDelay: "540ms" }}>
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">Warnings</p>
                  <ul className="mt-3 space-y-2">
                    {validationNotes.warnings.map((item) => (
                      <li key={item} className="rounded-xl bg-[#F8FAFC] px-3 py-3 text-[13px] leading-6 text-[#0F172A]">{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">Assumptions</p>
                  <ul className="mt-3 space-y-2">
                    {validationNotes.assumptions.map((item) => (
                      <li key={item} className="rounded-xl bg-[#F8FAFC] px-3 py-3 text-[13px] leading-6 text-[#0F172A]">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </PremiumCard>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <PremiumCard title="Scenario comparison" subtitle="Why balanced wins here" className="reveal" style={{ animationDelay: "610ms" }}>
              <div className="grid gap-3 lg:grid-cols-3">
                {scenarioSummary.map((scenario) => (
                  <div key={scenario.name} className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#F8FAFC] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">{scenario.name}</p>
                    <p className="font-mono-num mt-4 text-[22px] font-semibold tracking-[-0.03em] text-[#0F172A]">{scenario.metric}</p>
                    <p className="mt-3 text-[13px] leading-6 text-[#64748B]">{scenario.tradeoff}</p>
                  </div>
                ))}
              </div>
            </PremiumCard>

            <PremiumCard title="Next action" subtitle="Move into the detailed engineering workspace" className="reveal" style={{ animationDelay: "680ms" }}>
              <div className="flex h-full flex-col justify-between gap-6">
                <p className="max-w-[56ch] text-[15px] leading-8 text-[#64748B]">
                  Continue into advanced analysis to inspect the hourly traces, tariff sensitivity and validation detail that support this recommendation.
                </p>
                <div className="flex justify-start">
                  <EliteButton onClick={onOpenAnalysis}>Open advanced analysis</EliteButton>
                </div>
              </div>
            </PremiumCard>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatusChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/14 bg-white/8 px-3 py-1.5 text-[11px] uppercase tracking-[0.08em] text-white/74">
      {label}
    </span>
  );
}

function GhostAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/6 px-3 py-2 text-[12px] text-white/78 transition-colors hover:text-white"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function SummaryMetric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#F8FAFC] px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">{label}</p>
      <p className="font-mono-num mt-3 text-[20px] font-semibold text-[#0F172A]">{value}</p>
      <p className="mt-2 text-[13px] leading-6 text-[#64748B]">{detail}</p>
    </div>
  );
}

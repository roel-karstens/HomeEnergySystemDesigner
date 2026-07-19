import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  BarChart2,
  ChevronLeft,
  Download,
  FileText,
  LayoutDashboard,
  Settings,
  Share2,
  TrendingUp,
  Zap,
} from "lucide-react";
import { ConfidenceRing } from "../ui/ConfidenceRing";
import { EliteButton } from "../ui/EliteButton";
import { PremiumCard } from "../ui/PremiumCard";
import { SidebarNav } from "../ui/SidebarNav";

interface DashboardOverviewProps {
  onOpenAnalysis: () => void;
  onBack?: () => void;
}

type Kpi = {
  title: string;
  value: string;
  hint: string;
  badge?: string;
  accent?: boolean;
  suffix?: string;
};

type FlowSlice = {
  label: string;
  value: number;
  color: string;
};

type MonthSeries = {
  month: string;
  solar: number;
  consumption: number;
};

const navItems = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "energy", label: "Energy", icon: Zap },
  { key: "financial", label: "Financial", icon: TrendingUp },
  { key: "systems", label: "Systems", icon: BarChart2 },
  { key: "settings", label: "Settings", icon: Settings },
];

const kpis: Kpi[] = [
  { title: "Annual savings", value: "1,246", hint: "vs. current setup", accent: true },
  { title: "Total investment", value: "12,480", hint: "After incentives" },
  { title: "Payback period", value: "5.6", hint: "years", badge: "very good" },
  { title: "20-year ROI", value: "186", hint: "%", suffix: "%" },
];

const flowSlices: FlowSlice[] = [
  { label: "Self-consumption", value: 42, color: "#059669" },
  { label: "Battery", value: 18, color: "#10B981" },
  { label: "Grid import", value: 22, color: "#64748B" },
  { label: "Grid export", value: 18, color: "#94A3B8" },
];

const monthlyData: MonthSeries[] = [
  { month: "Jan", solar: 180, consumption: 310 },
  { month: "Feb", solar: 240, consumption: 290 },
  { month: "Mar", solar: 370, consumption: 260 },
  { month: "Apr", solar: 490, consumption: 210 },
  { month: "May", solar: 560, consumption: 200 },
  { month: "Jun", solar: 610, consumption: 190 },
  { month: "Jul", solar: 590, consumption: 200 },
  { month: "Aug", solar: 530, consumption: 205 },
  { month: "Sep", solar: 400, consumption: 230 },
  { month: "Oct", solar: 280, consumption: 270 },
  { month: "Nov", solar: 190, consumption: 300 },
  { month: "Dec", solar: 150, consumption: 325 },
];

const dashboardDiagramImageSrc = `${import.meta.env.BASE_URL}images/dashboard-energy-flow-isometric.jpeg`;

export function DashboardOverview({ onOpenAnalysis, onBack }: DashboardOverviewProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("overview");

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Summary bar */}
      <header
        className="reveal relative z-40 flex shrink-0 items-center gap-5 px-6"
        style={{
          height: 84,
          background: "linear-gradient(180deg, #3F3F46 0%, #18181B 100%)",
          animationDelay: "70ms",
        }}
      >
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[13px] text-[#A1A1AA] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669]"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
        )}

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#10B981]" />
          <span className="text-[11px] uppercase tracking-[0.07em] text-[#A1A1AA]">System optimised</span>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-[0.05em] text-[#52525B]">Projected savings</span>
          <span className="font-mono-num text-[22px] font-semibold leading-tight text-white">\u20ac 1,246</span>
        </div>

        <div className="hidden flex-col sm:flex">
          <span className="text-[11px] uppercase tracking-[0.05em] text-[#52525B]">Grid dependence</span>
          <span className="font-mono-num text-[15px] font-semibold leading-tight text-[#10B981]">\u221238%</span>
        </div>

        <div className="flex-1" />

        <ConfidenceRing value={82} size={64} />

        <EliteButton onClick={onOpenAnalysis}>Open analysis</EliteButton>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <SidebarNav
          items={navItems}
          activeKey={activeNav}
          onSelect={setActiveNav}
          open={sidebarOpen}
          onToggle={() => setSidebarOpen((v) => !v)}
          heading="EnergyOS"
        />

        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] p-5">
          <div className="mx-auto max-w-6xl space-y-5">

            <div
              className="reveal flex flex-wrap items-center justify-between gap-3"
              style={{ animationDelay: "140ms" }}
            >
              <div>
                <h2 className="text-[22px] font-semibold tracking-tight text-[#0F172A]">
                  System recommendation
                </h2>
                <p className="mt-0.5 text-[12px] text-[#64748B]">
                  Integrated simulation across solar, battery, EV and heat pump.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ActionIconButton icon={<Share2 className="h-4 w-4" />} label="Share" />
                <ActionIconButton icon={<Download className="h-4 w-4" />} label="Export" />
                <ActionIconButton icon={<FileText className="h-4 w-4" />} label="Report" />
              </div>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
              {kpis.map((kpi, i) => (
                <PremiumCard
                  key={kpi.title}
                  as="article"
                  className="reveal"
                  style={{ animationDelay: `${210 + i * 70}ms` }}
                >
                  <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#64748B]">
                    {kpi.title}
                  </p>
                  <p
                    className={`font-mono-num mt-3 text-[28px] font-semibold leading-none ${
                      kpi.accent ? "text-[#059669]" : "text-[#0F172A]"
                    }`}
                  >
                    {kpi.accent && (
                      <span className="mr-0.5 text-[16px] font-normal text-[#94A3B8]">\u20ac </span>
                    )}
                    {kpi.value}
                    {kpi.suffix && (
                      <span className="ml-0.5 text-[16px] font-normal text-[#94A3B8]">{kpi.suffix}</span>
                    )}
                  </p>
                  {kpi.badge ? (
                    <div className="mt-3 inline-flex rounded-full border border-[rgba(5,150,105,0.2)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#059669]">
                      {kpi.badge}
                    </div>
                  ) : !kpi.suffix ? (
                    <p className="mt-3 text-[12px] text-[#64748B]">{kpi.hint}</p>
                  ) : null}
                </PremiumCard>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1.3fr]">
              <PremiumCard
                title="Monthly energy balance"
                subtitle="Solar production vs consumption (kWh)"
                className="reveal"
                style={{ animationDelay: "490ms" }}
              >
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} barSize={6} barGap={3}>
                      <CartesianGrid
                        vertical={false}
                        stroke="rgba(148,163,184,0.18)"
                        strokeDasharray="4 4"
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 10, fill: "#94A3B8" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "#94A3B8" }}
                        axisLine={false}
                        tickLine={false}
                        width={32}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "rgba(255,255,255,0.92)",
                          border: "1px solid rgba(148,163,184,0.18)",
                          borderRadius: 10,
                          fontSize: 12,
                        }}
                        cursor={{ fill: "rgba(148,163,184,0.06)" }}
                      />
                      <Bar dataKey="solar" radius={[3, 3, 0, 0]} name="Solar">
                        {monthlyData.map((_, idx) => (
                          <Cell key={idx} fill="#059669" />
                        ))}
                      </Bar>
                      <Bar dataKey="consumption" radius={[3, 3, 0, 0]} name="Consumption">
                        {monthlyData.map((_, idx) => (
                          <Cell key={idx} fill="#E2E8F0" />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 flex items-center gap-4 text-[12px] text-[#64748B]">
                  <LegendDot color="#059669" label="Solar production" />
                  <LegendDot color="#E2E8F0" label="Consumption" />
                </div>
              </PremiumCard>

              <PremiumCard
                title="Annual energy flow"
                className="reveal"
                style={{ animationDelay: "560ms" }}
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_160px]">
                  <div className="space-y-2">
                    {[
                      { label: "16 Solar panels", detail: "6.4 kWp" },
                      { label: "5 kWh Battery", detail: "LFP chemistry" },
                      { label: "Smart EV charging", detail: "11 kW control" },
                      { label: "Heat pump", detail: "Weather-compensated" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-xl border border-[rgba(148,163,184,0.18)] bg-[#F8FAFC] px-3 py-2 text-[12px]"
                      >
                        <span className="font-semibold text-[#0F172A]">{item.label}</span>
                        <span className="text-[#64748B]">{item.detail}</span>
                      </div>
                    ))}

                    <ul className="mt-3 space-y-1.5">
                      {flowSlices.map((slice) => (
                        <li key={slice.label} className="flex items-center justify-between text-[12px]">
                          <span className="flex items-center gap-2 text-[#64748B]">
                            <span className="h-2 w-2 rounded-full" style={{ background: slice.color }} />
                            {slice.label}
                          </span>
                          <span className="font-mono-num font-semibold text-[#0F172A]">{slice.value}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="h-[160px] w-[160px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={flowSlices}
                            dataKey="value"
                            nameKey="label"
                            innerRadius={46}
                            outerRadius={72}
                            paddingAngle={2}
                            strokeWidth={0}
                          >
                            {flowSlices.map((slice) => (
                              <Cell key={slice.label} fill={slice.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </PremiumCard>
            </div>

            {/* System diagram */}
            <PremiumCard
              title="System layout"
              subtitle="Isometric energy flow diagram"
              className="reveal"
              style={{ animationDelay: "630ms" }}
              rightSlot={
                <span className="rounded-full border border-[rgba(5,150,105,0.2)] px-2 py-0.5 text-[11px] font-semibold text-[#059669]">
                  Live model
                </span>
              }
            >
              <div className="overflow-hidden rounded-xl border border-[rgba(148,163,184,0.18)] bg-[#F8FAFC]">
                <img
                  src={dashboardDiagramImageSrc}
                  alt="Isometric home energy system flow diagram"
                  className="max-h-[260px] w-full object-cover"
                />
              </div>
            </PremiumCard>

            <div className="reveal flex justify-end pb-2" style={{ animationDelay: "700ms" }}>
              <EliteButton onClick={onOpenAnalysis}>Open advanced analysis</EliteButton>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ActionIconButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      title={label}
      className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(148,163,184,0.18)] bg-white px-3 py-1.5 text-[12px] font-medium text-[#64748B] transition-colors hover:text-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669]"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

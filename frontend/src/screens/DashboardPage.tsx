import { Download, Share2 } from "lucide-react";
import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";
import { Card } from "../components/ui/Card";
import { DashboardWidget } from "../components/ui/DashboardWidget";
import { KpiCard } from "../components/ui/KpiCard";
import { SidebarNav } from "../components/ui/SidebarNav";
import { energyFlow, kpis } from "../data/mockData";

const sidebar = ["Overview", "Energy", "Financial", "Systems", "Analysis", "What if", "Report", "Settings"];
const pieColors = ["#00A86B", "#4FD39A", "#94A3B8", "#CBD5E1"];

export function DashboardPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <SidebarNav items={sidebar} activeItem="Overview" />

      <div className="grid gap-6">
        <Card
          title="Your Optimal System"
          subtitle="Recommendation generated from multi-domain simulation"
          rightSlot={
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Recommended</span>
              <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600"><Share2 className="mr-1 inline h-4 w-4" />Share</button>
              <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600"><Download className="mr-1 inline h-4 w-4" />Download Report</button>
            </div>
          }
        >
          <div className="grid gap-4 md:grid-cols-4">
            {kpis.map((item) => (
              <KpiCard key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <DashboardWidget title="System configuration">
            <ul className="grid gap-3 text-sm text-slate-700">
              <li><span className="font-semibold text-slate-900">Solar panels</span> • 16 panels • 6.4 kWp</li>
              <li><span className="font-semibold text-slate-900">Battery</span> • 5 kWh • Lithium iron phosphate</li>
              <li><span className="font-semibold text-slate-900">Smart EV charging</span> • 11 kW charger</li>
              <li><span className="font-semibold text-slate-900">Air source heat pump</span> • 5 kW</li>
            </ul>
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <p className="font-semibold text-slate-900">Energy flow diagram</p>
              <p className="mt-2 text-slate-600">Solar -&gt; Home, Solar -&gt; Battery, Battery -&gt; EV, Grid &lt;-&gt; Home</p>
            </div>
          </DashboardWidget>

          <DashboardWidget title="Energy flow split">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={energyFlow} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95}>
                  {energyFlow.map((entry) => (
                    <Cell key={entry.name} fill={pieColors[energyFlow.indexOf(entry)]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <ul className="mt-2 grid gap-1 text-sm text-slate-600">
              {energyFlow.map((entry) => (
                <li key={entry.name} className="flex items-center justify-between">
                  <span>{entry.name}</span>
                  <span className="font-semibold text-slate-800">{entry.value}%</span>
                </li>
              ))}
            </ul>
          </DashboardWidget>
        </div>

        <Card className="border-emerald-200 bg-emerald-50/70" title="Recommendation">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="max-w-3xl text-slate-700">
              This system provides the best balance between investment, savings and energy independence.
            </p>
            <button className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">Why this?</button>
          </div>
        </Card>
      </div>
    </div>
  );
}

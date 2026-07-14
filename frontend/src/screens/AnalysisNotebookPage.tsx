import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "../components/ui/Card";
import { ChartContainer } from "../components/ui/ChartContainer";
import { KpiCard } from "../components/ui/KpiCard";
import { hourlySeries, notebookKpis } from "../data/mockData";

const tabs = ["Energy balance", "Cash flow", "Sensitivity", "Assumptions", "Validation"];

export function AnalysisNotebookPage() {
  return (
    <div className="grid gap-6">
      <Card title="Analysis Notebook" subtitle="Transparent model outputs and validation metrics">
        <div className="mb-4 flex flex-wrap gap-2">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                index === 0 ? "bg-emerald-600 text-white" : "border border-slate-200 bg-white text-slate-600"
              }`}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>

        <ChartContainer title="Hourly energy balance">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlySeries}>
              <XAxis dataKey="hour" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip />
              <Line type="monotone" dataKey="solar" stroke="#00A86B" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="load" stroke="#0F172A" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="heatPump" stroke="#334155" dot={false} />
              <Line type="monotone" dataKey="ev" stroke="#475569" dot={false} />
              <Line type="monotone" dataKey="batteryCharge" stroke="#22C55E" strokeDasharray="4 4" dot={false} />
              <Line type="monotone" dataKey="batteryDischarge" stroke="#16A34A" strokeDasharray="4 4" dot={false} />
              <Line type="monotone" dataKey="gridImport" stroke="#7C3AED" dot={false} />
              <Line type="monotone" dataKey="gridExport" stroke="#A855F7" dot={false} />
              <Line type="monotone" dataKey="price" stroke="#F59E0B" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-5 grid gap-3 md:grid-cols-5">
          {notebookKpis.map((kpi) => (
            <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} />
          ))}
        </div>
      </Card>

      <Card title="Validation" subtitle="Physical and financial consistency checks">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Energy balance error</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">0.03%</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm text-emerald-700">Status</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-800">All constraints satisfied</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

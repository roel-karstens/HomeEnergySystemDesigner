import { ChevronLeft, ChevronDown } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AnalysisScreenProps {
  onPrev: () => void;
}

const notebookData = [
  { h: "00", solar: 0.3, load: 3.2, heat: 1.8, ev: 0.9, import: 2.2 },
  { h: "04", solar: 0.1, load: 2.9, heat: 2.0, ev: 0.5, import: 2.0 },
  { h: "08", solar: 2.7, load: 3.4, heat: 1.2, ev: 0.7, import: 1.1 },
  { h: "12", solar: 6.2, load: 3.7, heat: 1.0, ev: 0.8, import: 0.2 },
  { h: "16", solar: 5.1, load: 4.2, heat: 1.2, ev: 1.6, import: 0.6 },
  { h: "20", solar: 0.6, load: 4.9, heat: 2.3, ev: 2.1, import: 3.3 },
];

export function AnalysisScreen({ onPrev }: AnalysisScreenProps) {
  return (
    <div className="h-screen w-full flex flex-col bg-white overflow-y-auto md:overflow-hidden">
      {/* Back button */}
      <div className="flex-shrink-0 border-b border-slate-100 px-4 py-3 sm:px-6 md:px-8">
        <button onClick={onPrev} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition">
          <ChevronLeft className="h-4 w-4" />
          Back to Results
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex px-4 py-6 sm:px-6 md:px-8 overflow-y-auto md:overflow-hidden">
        <div className="w-full max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 mb-3">
              📊 Deep Dive
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Analysis Notebook</h2>
            <p className="text-slate-600">Explore detailed hourly breakdowns, assumptions, and validation results.</p>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-4 border-b border-slate-200 overflow-x-auto">
            {["Energy Balance", "Cash Flow", "Sensitivity", "Assumptions", "Validation"].map((tab, idx) => (
              <button
                key={tab}
                className={`py-2 px-1 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  idx === 0 ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Energy balance chart section */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-6 mb-6">
            <h3 className="text-lg font-bold tracking-tight mb-4">Hourly Energy Balance</h3>
            <div className="bg-white rounded-lg border border-slate-200 p-3">
              <div className="h-56 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={notebookData}>
                    <XAxis dataKey="h" stroke="#94a3b8" style={{ fontSize: "12px" }} />
                    <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} label={{ value: "kWh", angle: -90, position: "insideLeft" }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                      formatter={(value: number) => value.toFixed(2)}
                    />
                    <Area type="monotone" dataKey="solar" stroke="#22c55e" fill="#86efac" fillOpacity={0.3} name="Solar" />
                    <Area type="monotone" dataKey="load" stroke="#111827" fill="#d1d5db" fillOpacity={0.2} name="Load" />
                    <Area type="monotone" dataKey="heat" stroke="#8b5cf6" fill="#c4b5fd" fillOpacity={0.2} name="Heat Pump" />
                    <Area type="monotone" dataKey="ev" stroke="#2563eb" fill="#93c5fd" fillOpacity={0.2} name="EV" />
                    <Area type="monotone" dataKey="import" stroke="#f97316" fill="#fdba74" fillOpacity={0.2} name="Grid Import" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 grid gap-2 sm:grid-cols-5">
              {[
                { color: "bg-emerald-400", label: "Solar Production" },
                { color: "bg-slate-400", label: "Load" },
                { color: "bg-purple-300", label: "Heat Pump" },
                { color: "bg-blue-300", label: "EV Charging" },
                { color: "bg-orange-300", label: "Grid Import" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm">
                  <div className={`h-3 w-3 rounded ${color}`} />
                  <span className="text-slate-700">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* KPI metrics grid */}
          <div className="grid gap-3 sm:gap-4 mb-6 grid-cols-2 sm:grid-cols-5">
            {[
              { label: "Total Consumption", value: "6,308 kWh", icon: "⚡" },
              { label: "Solar Production", value: "5,120 kWh", icon: "☀️" },
              { label: "Self-Consumption", value: "42%", icon: "♻️" },
              { label: "Grid Import", value: "1,386 kWh", icon: "📥" },
              { label: "Grid Export", value: "1,134 kWh", icon: "📤" },
            ].map(({ label, value, icon }) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-white px-3 py-3 sm:p-4">
                <div className="text-xl sm:text-2xl mb-1">{icon}</div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mb-1">{label}</p>
                <p className="text-lg sm:text-xl font-bold text-slate-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Validation status */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-2">✓ Validation Passed</h3>
                <div className="space-y-1 text-sm text-slate-700">
                  <p>Energy balance error: &lt; 0.03%</p>
                  <p>All physical constraints satisfied</p>
                  <p>Battery cycles within healthy range</p>
                </div>
              </div>
              <button className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-emerald-200 hover:bg-emerald-50 transition flex-shrink-0">
                Details
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Additional sections */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {/* Assumptions */}
            <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                📋 Key Assumptions
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-emerald-600 flex-shrink-0">•</span>
                  <span>Solar panels facing South-West at 35° tilt</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-emerald-600 flex-shrink-0">•</span>
                  <span>Electricity price: €0.33/kWh (fixed contract)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-emerald-600 flex-shrink-0">•</span>
                  <span>Battery: 2,000 cycle lifespan (10 years)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-emerald-600 flex-shrink-0">•</span>
                  <span>Heat pump COP: 4.2 average year-round</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-emerald-600 flex-shrink-0">•</span>
                  <span>EV: 40 km/day, 5 days/week, 85% charging efficiency</span>
                </li>
              </ul>
            </div>

            {/* Sensitivities */}
            <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                📈 Sensitivity Analysis
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  { factor: "20% More Solar Panels", impact: "+€340 annual savings", trend: "↑" },
                  { factor: "Electricity Price +10%", impact: "+€510 annual savings", trend: "↑" },
                  { factor: "20% Higher Heat Demand", impact: "-€180 annual savings", trend: "↓" },
                  { factor: "Dynamic Contract", impact: "+€220 annual savings", trend: "↑" },
                ].map(({ factor, impact, trend }) => (
                  <div key={factor} className="flex items-start justify-between border-b border-slate-100 pb-2 last:border-0">
                    <span className="text-slate-700">{factor}</span>
                    <span className={`font-semibold whitespace-nowrap ml-2 ${trend === "↑" ? "text-emerald-600" : "text-orange-600"}`}>
                      {impact} {trend}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Export section */}
          <div className="mt-6 text-center">
            <button className="rounded-lg bg-emerald-600 px-6 py-3 text-base font-semibold text-white hover:bg-emerald-700 transition shadow-lg hover:shadow-xl">
              📥 Export Full Report as PDF
            </button>
            <p className="text-sm text-slate-500 mt-2">Includes all calculations, assumptions, and visualizations</p>
          </div>
        </div>
      </div>
    </div>
  );
}

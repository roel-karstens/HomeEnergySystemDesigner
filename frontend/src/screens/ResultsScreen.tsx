import { ChevronLeft, Download, Share2 } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface ResultsScreenProps {
  onNext: () => void;
  onPrev: () => void;
}

const donutData = [
  { name: "Self-consumption", value: 42, color: "#3B82F6" },
  { name: "Battery", value: 18, color: "#22C55E" },
  { name: "Grid import", value: 22, color: "#94A3B8" },
  { name: "Grid export", value: 18, color: "#F97316" },
];

export function ResultsScreen({ onNext, onPrev }: ResultsScreenProps) {
  return (
    <div className="h-screen w-full flex flex-col bg-white overflow-y-auto md:overflow-hidden">
      {/* Back button */}
      <div className="flex-shrink-0 border-b border-slate-100 px-4 py-3 sm:px-6 md:px-8 flex items-center justify-between">
        <button onClick={onPrev} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition">
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs sm:text-sm text-slate-600 hover:bg-slate-50 transition">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-700 transition">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Report</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center px-4 py-6 sm:px-6 md:px-8 overflow-y-auto md:overflow-hidden">
        <div className="w-full max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 mb-3">
              Recommended
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Your Optimal System</h2>
            <p className="text-slate-600">The perfect balance of investment, savings and energy independence for your home.</p>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-3 sm:gap-4 mb-6 grid-cols-2 sm:grid-cols-4">
            {[
              { label: "Annual Savings", value: "€1,246", icon: "💰" },
              { label: "Total Investment", value: "€12,480", icon: "💵" },
              { label: "Payback Period", value: "5.6 years", icon: "⏱️" },
              { label: "20-year ROI", value: "186%", icon: "📈" },
            ].map(({ label, value, icon }) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-white p-3 sm:p-4 hover:shadow-md transition">
                <p className="text-xs sm:text-sm text-slate-500 font-medium mb-2">{label}</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">{value}</p>
              </div>
            ))}
          </div>

          {/* System config & chart grid */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* System configuration - spans 2 on desktop */}
            <div className="md:col-span-2 rounded-lg border border-slate-200 bg-white p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-4">System Configuration</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-xl mt-0.5">☀️</span>
                      <div>
                        <p className="font-semibold text-slate-900">Solar PV System</p>
                        <p className="text-sm text-slate-600">16 panels • 6.4 kWp</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xl mt-0.5">🔋</span>
                      <div>
                        <p className="font-semibold text-slate-900">Battery Storage</p>
                        <p className="text-sm text-slate-600">5 kWh • LiFePO₄</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xl mt-0.5">⚡</span>
                      <div>
                        <p className="font-semibold text-slate-900">EV Charger</p>
                        <p className="text-sm text-slate-600">11 kW • Smart charging</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xl mt-0.5">🌡️</span>
                      <div>
                        <p className="font-semibold text-slate-900">Heat Pump</p>
                        <p className="text-sm text-slate-600">5 kW • Air source</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Energy flows */}
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <p className="font-semibold text-slate-900 text-sm">Energy Flow Logic</p>
                  <div className="space-y-2 text-sm text-slate-700">
                    <div className="flex items-center justify-between">
                      <span>Solar Production</span>
                      <span className="text-emerald-600 font-semibold">→ Home</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Excess Solar</span>
                      <span className="text-emerald-600 font-semibold">→ Battery</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Battery</span>
                      <span className="text-emerald-600 font-semibold">→ Peak Hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>EV Charging</span>
                      <span className="text-emerald-600 font-semibold">→ Solar First</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 mt-2 flex items-center justify-between">
                      <span>Grid</span>
                      <span className="text-slate-600 font-semibold">↔ Backup</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Energy flow donut chart */}
            <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-4">Annual Energy Flow</h3>
              <div className="h-40 sm:h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={65} startAngle={90} endAngle={450}>
                      {donutData.map((slice) => (
                        <Cell key={slice.name} fill={slice.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {donutData.map((slice) => (
                  <div key={slice.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: slice.color }} />
                      <span className="text-slate-700">{slice.name}</span>
                    </div>
                    <span className="font-semibold text-slate-900">{slice.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info banner */}
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
            <p className="text-amber-950">
              This system provides the best balance between investment, savings and energy independence. 
              <button className="ml-2 font-semibold text-amber-700 hover:text-amber-900 underline">Why this?</button>
            </p>
          </div>

          {/* Next button */}
          <button
            onClick={onNext}
            className="mt-6 w-full rounded-lg bg-emerald-600 px-6 py-3 text-base font-semibold text-white hover:bg-emerald-700 transition shadow-lg hover:shadow-xl"
          >
            View Deep Dive Analysis
          </button>
        </div>
      </div>
    </div>
  );
}

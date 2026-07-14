import { ChevronLeft, Home } from "lucide-react";

interface InputScreenProps {
  onNext: () => void;
  onPrev: () => void;
}

export function InputScreen({ onNext, onPrev }: InputScreenProps) {
  return (
    <div className="h-screen w-full flex flex-col bg-white overflow-y-auto md:overflow-hidden">
      {/* Back button */}
      <div className="flex-shrink-0 border-b border-slate-100 px-4 py-3 sm:px-6 md:px-8">
        <button onClick={onPrev} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition">
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center px-4 py-6 sm:px-6 md:px-8">
        <div className="w-full max-w-4xl mx-auto grid gap-8 md:grid-cols-2 md:gap-12">
          {/* Left: Form */}
          <div className="order-2 md:order-1">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 mb-4">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                  2
                </span>
                Profile
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Tell us about your home</h2>
              <p className="text-slate-600">This helps us create a more accurate analysis tailored to your specific situation.</p>
            </div>

            <div className="space-y-3">
              {[
                { label: "Home type", value: "Detached house" },
                { label: "Year built", value: "2018" },
                { label: "Living area", value: "150 m²" },
                { label: "Energy label", value: "A+ (Excellent)" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 hover:bg-slate-100 transition cursor-pointer">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
                  <p className="text-base font-semibold text-slate-900 mt-1">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Next steps</p>
              <ol className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-emerald-600 text-xs font-bold text-emerald-600 flex-shrink-0">
                    ✓
                  </span>
                  Your home profile
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-300 text-xs font-bold text-slate-400 flex-shrink-0">
                    3
                  </span>
                  Analysis & recommendations
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-300 text-xs font-bold text-slate-400 flex-shrink-0">
                    4
                  </span>
                  Detailed financial report
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-300 text-xs font-bold text-slate-400 flex-shrink-0">
                    5
                  </span>
                  Deep dive analysis
                </li>
              </ol>
            </div>

            <button
              onClick={onNext}
              className="mt-8 w-full rounded-lg bg-emerald-600 px-6 py-3 text-base font-semibold text-white hover:bg-emerald-700 transition shadow-lg hover:shadow-xl"
            >
              Continue to Analysis
            </button>
          </div>

          {/* Right: Visualization */}
          <div className="order-1 md:order-2">
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-50 p-4 space-y-3">
              <div className="grid h-48 sm:h-56 place-items-center rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
                <div className="text-center">
                  <p className="text-6xl mb-3">⌂</p>
                  <p className="text-sm text-slate-300">Detached modern house</p>
                  <p className="text-xs text-slate-400 mt-1">South-facing roof • 150 m² • A+ label</p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Property details</p>
                {[
                  { icon: "📐", text: "Roof area: 42 m²" },
                  { icon: "🧭", text: "Orientation: South-West" },
                  { icon: "🪟", text: "Windows: Triple glazing" },
                  { icon: "🔥", text: "Heating: Floor heating" },
                  { icon: "💨", text: "Ventilation: Mechanical with recovery" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-slate-700">
                    <span className="text-lg">{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

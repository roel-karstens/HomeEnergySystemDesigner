import { Bolt, CheckCircle2, Gauge, Home } from "lucide-react";

interface LandingScreenProps {
  onNext: () => void;
}

export function LandingScreen({ onNext }: LandingScreenProps) {
  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-b from-white to-slate-50 overflow-y-auto md:overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-slate-100 px-4 py-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-2">
          <Bolt className="h-6 w-6 text-emerald-600" />
          <div>
            <p className="text-lg font-semibold">HomeEnergy</p>
            <p className="text-xs text-slate-500">Optimizer</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center px-4 py-6 sm:px-6 md:px-8 md:py-0">
        <div className="w-full max-w-5xl mx-auto grid gap-8 md:grid-cols-2 md:gap-12 items-center">
          {/* Left: Text content */}
          <div className="space-y-6 order-2 md:order-1">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 mb-4">
                <Gauge className="h-3.5 w-3.5 text-emerald-600" />
                AI-powered • 10,000+ simulations in seconds
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
                The <span className="text-emerald-600">smartest</span> way to invest in your home energy.
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              We simulate thousands of combinations of solar panels, batteries, EV charging, heat pumps and electricity prices to find the system that saves you the most money.
            </p>

            <ul className="space-y-3 text-sm sm:text-base text-slate-700">
              {[
                "Lower energy bills",
                "Higher return on investment",
                "Future-proof your home",
                "Understand every decision",
              ].map((line) => (
                <li key={line} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-3 pt-4">
              <button
                onClick={onNext}
                className="w-full sm:w-auto rounded-lg bg-emerald-600 px-6 py-3 text-base font-semibold text-white hover:bg-emerald-700 transition shadow-lg hover:shadow-xl"
              >
                Start Free Analysis
              </button>
              <p className="text-sm text-slate-500">No credit card required • Takes 2 minutes</p>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="order-1 md:order-2">
            <div className="relative rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 p-6 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(16,185,129,0.15),transparent_55%)]" />
              <div className="relative rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Home className="h-4 w-4 text-emerald-600" />
                  Smart home system
                </div>
                <div className="grid h-48 sm:h-56 place-items-center rounded-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-center text-slate-200">
                  <div>
                    <p className="text-6xl">☀️</p>
                    <p className="mt-2 text-xs sm:text-sm font-medium">Solar • EV • Battery • Heat Pump</p>
                  </div>
                </div>
              </div>

              {/* Stats overlay */}
              <div className="absolute bottom-4 left-4 right-4 grid grid-cols-4 gap-1 sm:gap-2 rounded-lg border border-slate-200 bg-white/95 p-2 sm:p-3 backdrop-blur text-center">
                {[
                  ["10,000+", "sims"],
                  ["42%", "savings"],
                  ["4.8", "rating"],
                  ["4-8y", "payback"],
                ].map((item) => (
                  <div key={item[0]}>
                    <p className="text-sm sm:text-base font-bold text-emerald-700">{item[0]}</p>
                    <p className="text-xs text-slate-500">{item[1]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint for mobile */}
      <div className="md:hidden flex-shrink-0 text-center pb-6">
        <p className="text-xs text-slate-500">Scroll or tap next to continue</p>
      </div>
    </div>
  );
}

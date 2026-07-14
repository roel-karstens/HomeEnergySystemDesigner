import { CheckCircle2 } from "lucide-react";
import { landingStats } from "../data/mockData";

export function LandingPage() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xl font-semibold text-slate-900">Home Energy System Optimizer</div>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-slate-900">How it works</a>
          <a href="#" className="hover:text-slate-900">Features</a>
          <a href="#" className="hover:text-slate-900">Pricing</a>
          <a href="#" className="hover:text-slate-900">About</a>
        </nav>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h1 className="text-5xl font-semibold leading-tight tracking-tight text-slate-900">
            The <span className="text-emerald-600">smartest</span> way to invest in your home energy.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-600">
            We simulate thousands of combinations of solar panels, batteries, EV charging, heat pumps and
            electricity prices to find the system that saves you the most money.
          </p>

          <ul className="mt-6 grid gap-3 text-slate-700">
            {["Lower energy bills", "Higher return on investment", "Future-proof your home", "Understand every decision"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button type="button" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
              Start Free Analysis
            </button>
            <p className="text-sm text-slate-500">No credit card required • Takes 2 minutes</p>
          </div>
        </div>

        <div className="relative">
          <img src="/house-hero.jpeg" alt="Modern house with solar, EV charger, battery and heat pump" className="h-[420px] w-full rounded-2xl object-cover" />
          <article className="absolute -bottom-6 left-6 right-6 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
            <div className="grid grid-cols-2 gap-3">
              {landingStats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</p>
                  <p className="text-lg font-semibold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { EliteButton } from "../ui/EliteButton";
import { InstrumentSlider } from "../ui/InstrumentSlider";
import { PremiumCard } from "../ui/PremiumCard";

interface OnboardingWizardProps {
  onNext: () => void;
  onPrev: () => void;
}

type StepKey = "property" | "usage" | "systems" | "freedom" | "goals" | "validation";
type SystemMode = "fixed" | "optimize" | "excluded";
type Objective = "financial" | "balanced" | "independence";

type WizardState = {
  propertyType: string;
  buildYear: string;
  floorArea: string;
  energyLabel: string;
  roofOrientation: string;
  annualElectricity: string;
  dayUsageShare: number;
  heatingProfile: string;
  evDistance: number;
  solarState: SystemMode;
  batteryState: SystemMode;
  heatPumpState: SystemMode;
  evChargingState: SystemMode;
  solarFreedom: SystemMode;
  batteryFreedom: SystemMode;
  heatPumpFreedom: SystemMode;
  evFreedom: SystemMode;
  objective: Objective;
  budgetBand: string;
  importPrice: number;
  exportPrice: number;
};

type StepDefinition = {
  key: StepKey;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  helpTitle: string;
  helpBody: string;
  usedBy: string[];
};

type ValidationState = {
  blocking: string[];
  warnings: string[];
  assumptions: string[];
};

const steps: StepDefinition[] = [
  {
    key: "property",
    label: "Property",
    eyebrow: "Step 1",
    title: "Capture the fixed building context.",
    description: "These inputs anchor roof potential, heat demand assumptions and the baseline technical envelope.",
    helpTitle: "Why this matters",
    helpBody: "Woningdata is fixed in the model. It constrains what the optimizer can recommend later.",
    usedBy: ["solar sizing", "heat demand", "validation checks"],
  },
  {
    key: "usage",
    label: "Energy Usage",
    eyebrow: "Step 2",
    title: "Model how the household actually consumes energy.",
    description: "The timing of usage is as important as the total. Battery and EV value depend on it.",
    helpTitle: "What we derive",
    helpBody: "We use annual electricity, daytime share and heating profile to shape the household energy profile.",
    usedBy: ["self-consumption", "battery economics", "grid import/export"],
  },
  {
    key: "systems",
    label: "Existing Systems",
    eyebrow: "Step 3",
    title: "Describe the systems already in place.",
    description: "Existing assets change the baseline and determine which recommendation paths remain relevant.",
    helpTitle: "System semantics",
    helpBody: "A system can exist today without being fixed forever. The next step determines optimization freedom.",
    usedBy: ["baseline simulation", "replacement logic", "recommendation framing"],
  },
  {
    key: "freedom",
    label: "Optimization Freedom",
    eyebrow: "Step 4",
    title: "Define what the optimizer may and may not change.",
    description: "This follows the product rule exactly: only components marked optimize may vary.",
    helpTitle: "Optimizer rule",
    helpBody: "Every component is either fixed, optimize or excluded. The engine must stay within those explicit locks.",
    usedBy: ["scenario generation", "constraint handling", "feasibility filtering"],
  },
  {
    key: "goals",
    label: "Goals & Financials",
    eyebrow: "Step 5",
    title: "Choose the objective and financial context.",
    description: "The best system for savings is not always the best system for independence or payback.",
    helpTitle: "Decision mode",
    helpBody: "Objective and tariff context determine how the optimizer scores otherwise valid configurations.",
    usedBy: ["economic optimisation", "ranking", "explainability"],
  },
  {
    key: "validation",
    label: "Validation",
    eyebrow: "Step 6",
    title: "Review assumptions, warnings and readiness.",
    description: "Analysis starts only when input quality is clear and blockers have been surfaced explicitly.",
    helpTitle: "Validation layers",
    helpBody: "We separate blocking errors, warnings and assumptions so trust is earned before the simulation starts.",
    usedBy: ["input validation", "simulation readiness", "result trust"],
  },
];

const propertyTypes = ["Detached", "Semi-detached", "Terraced", "Apartment"];
const buildYears = ["Before 1950", "1950-1979", "1980-1999", "2000-2015", "2016+"];
const energyLabels = ["A++++", "A+++", "A++", "A+", "A", "B", "C"];
const roofOrientations = ["South", "South-West", "South-East", "East-West", "Mixed"];
const heatingProfiles = ["Gas boiler", "Hybrid heat pump", "All-electric heat pump", "District heat"];
const budgetBands = ["No hard cap", "Below EUR 10k", "EUR 10k - EUR 20k", "EUR 20k - EUR 35k", "Above EUR 35k"];
const systemModeLabels: Record<SystemMode, string> = { fixed: "Fixed", optimize: "Optimize", excluded: "Excluded" };

const initialState: WizardState = {
  propertyType: "Detached",
  buildYear: "2000-2015",
  floorArea: "150",
  energyLabel: "A+",
  roofOrientation: "South-West",
  annualElectricity: "4300",
  dayUsageShare: 46,
  heatingProfile: "Hybrid heat pump",
  evDistance: 12000,
  solarState: "fixed",
  batteryState: "excluded",
  heatPumpState: "fixed",
  evChargingState: "fixed",
  solarFreedom: "fixed",
  batteryFreedom: "optimize",
  heatPumpFreedom: "optimize",
  evFreedom: "fixed",
  objective: "balanced",
  budgetBand: "EUR 10k - EUR 20k",
  importPrice: 0.32,
  exportPrice: 0.11,
};

export function OnboardingWizard({ onNext, onPrev }: OnboardingWizardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [state, setState] = useState<WizardState>(initialState);

  const activeStep = steps[activeIndex];
  const validation = useMemo(() => buildValidation(state), [state]);
  const readinessScore = useMemo(() => {
    const filled = [state.floorArea, state.annualElectricity, state.objective, state.budgetBand].filter(Boolean).length;
    return Math.min(100, 55 + filled * 10 - validation.blocking.length * 12 - validation.warnings.length * 3);
  }, [state, validation]);

  const goNext = () => {
    if (activeIndex < steps.length - 1) {
      setActiveIndex((value) => value + 1);
      return;
    }

    if (validation.blocking.length === 0) {
      onNext();
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <PremiumCard className="reveal" style={{ animationDelay: "0ms" }}>
        <div className="flex flex-wrap items-start justify-between gap-5 border-b border-[rgba(148,163,184,0.18)] pb-6">
          <div className="max-w-[640px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">{activeStep.eyebrow}</p>
            <h3 className="mt-3 text-[28px] font-semibold tracking-[-0.03em] text-[#0F172A]">{activeStep.title}</h3>
            <p className="mt-3 text-[15px] leading-7 text-[#64748B]">{activeStep.description}</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[rgba(148,163,184,0.18)] bg-[#F8FAFC] px-3 py-2 text-[11px] uppercase tracking-[0.08em] text-[#64748B]">
            <span className="font-mono-num text-[#0F172A]">{activeIndex + 1}</span>
            <span>of</span>
            <span className="font-mono-num text-[#0F172A]">{steps.length}</span>
          </div>
        </div>

        <ol className="mt-6 grid gap-2 md:grid-cols-3 xl:grid-cols-6">
          {steps.map((step, index) => {
            const active = index === activeIndex;
            const complete = index < activeIndex;

            return (
              <li key={step.key}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={[
                    "flex w-full flex-col rounded-2xl border px-4 py-3 text-left transition-all duration-[200ms]",
                    active
                      ? "border-[rgba(5,150,105,0.22)] bg-[rgba(248,250,252,0.9)] shadow-[0_12px_24px_-18px_rgba(15,23,42,0.18)]"
                      : "border-[rgba(148,163,184,0.18)] bg-white hover:bg-[#F8FAFC]",
                  ].join(" ")}
                >
                  <span className="text-[10px] uppercase tracking-[0.08em] text-[#94A3B8]">{complete ? "Ready" : step.eyebrow}</span>
                  <span className="mt-2 text-[14px] font-semibold text-[#0F172A]">{step.label}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {renderStep(activeStep.key, state, setState, validation)}
            </motion.div>
          </AnimatePresence>

          <aside className="grid gap-4 self-start">
            <PremiumCard title={activeStep.helpTitle} subtitle="Context for the current step" className="bg-[rgba(248,250,252,0.82)]">
              <p className="text-[14px] leading-7 text-[#64748B]">{activeStep.helpBody}</p>
              <div className="mt-4 border-t border-[rgba(148,163,184,0.18)] pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">Used by</p>
                <ul className="mt-3 space-y-2 text-[13px] text-[#0F172A]">
                  {activeStep.usedBy.map((item) => (
                    <li key={item} className="rounded-xl bg-white px-3 py-2 shadow-[0_8px_18px_-18px_rgba(15,23,42,0.25)]">{item}</li>
                  ))}
                </ul>
              </div>
            </PremiumCard>

            <PremiumCard title="Analysis readiness" subtitle="Current input quality">
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-[12px] text-[#64748B]">
                    <span>Input completeness</span>
                    <span className="font-mono-num text-[#0F172A]">{readinessScore}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
                    <div className="h-full rounded-full bg-[linear-gradient(90deg,#3F3F46_0%,#18181B_100%)]" style={{ width: `${readinessScore}%` }} />
                  </div>
                </div>
                <StatusLine label="Blocking errors" value={String(validation.blocking.length)} />
                <StatusLine label="Warnings" value={String(validation.warnings.length)} />
                <StatusLine label="Assumptions" value={String(validation.assumptions.length)} />
              </div>
            </PremiumCard>
          </aside>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(148,163,184,0.18)] pt-6">
          <button
            type="button"
            onClick={activeIndex === 0 ? onPrev : () => setActiveIndex((value) => Math.max(0, value - 1))}
            className="inline-flex items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.22)] px-4 py-2.5 text-[13px] font-semibold text-[#0F172A] transition-all duration-[200ms] hover:-translate-y-0.5 hover:bg-[#F8FAFC]"
          >
            <ChevronLeft className="h-4 w-4 text-[#059669]" />
            {activeIndex === 0 ? "Back to story" : "Previous step"}
          </button>
          <div className="flex items-center gap-3">
            {validation.blocking.length > 0 && activeStep.key === "validation" && <p className="text-[13px] text-[#64748B]">Resolve blocking inputs before starting the analysis.</p>}
            <EliteButton onClick={goNext} disabled={activeStep.key === "validation" && validation.blocking.length > 0}>
              {activeIndex === steps.length - 1 ? "Run optimization" : "Continue"}
            </EliteButton>
          </div>
        </div>
      </PremiumCard>
    </div>
  );
}

function renderStep(
  key: StepKey,
  state: WizardState,
  setState: React.Dispatch<React.SetStateAction<WizardState>>,
  validation: ValidationState,
) {
  switch (key) {
    case "property":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField label="Property type" value={state.propertyType} options={propertyTypes} onChange={(value) => setState((current) => ({ ...current, propertyType: value }))} />
          <SelectField label="Build year" value={state.buildYear} options={buildYears} onChange={(value) => setState((current) => ({ ...current, buildYear: value }))} />
          <TextField label="Floor area" value={state.floorArea} suffix="m2" onChange={(value) => setState((current) => ({ ...current, floorArea: value.replace(/[^0-9]/g, "") }))} />
          <SelectField label="Energy label" value={state.energyLabel} options={energyLabels} onChange={(value) => setState((current) => ({ ...current, energyLabel: value }))} />
          <SelectField label="Roof orientation" value={state.roofOrientation} options={roofOrientations} onChange={(value) => setState((current) => ({ ...current, roofOrientation: value }))} />
          <MetricHint title="Envelope assumption" value={`${state.energyLabel} / ${state.buildYear}`} note="Used as a proxy until richer envelope inputs are added." />
        </div>
      );
    case "usage":
      return (
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField label="Annual electricity consumption" value={state.annualElectricity} suffix="kWh" onChange={(value) => setState((current) => ({ ...current, annualElectricity: value.replace(/[^0-9]/g, "") }))} />
            <SelectField label="Heating profile" value={state.heatingProfile} options={heatingProfiles} onChange={(value) => setState((current) => ({ ...current, heatingProfile: value }))} />
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <InstrumentSlider label="Daytime consumption share" min={20} max={80} value={state.dayUsageShare} unit="%" onChange={(value) => setState((current) => ({ ...current, dayUsageShare: value }))} />
            <InstrumentSlider label="Annual EV distance" min={0} max={30000} step={500} value={state.evDistance} unit="km" onChange={(value) => setState((current) => ({ ...current, evDistance: value }))} />
          </div>
        </div>
      );
    case "systems":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <ModeField label="Solar PV present" value={state.solarState} onChange={(value) => setState((current) => ({ ...current, solarState: value }))} />
          <ModeField label="Battery present" value={state.batteryState} onChange={(value) => setState((current) => ({ ...current, batteryState: value }))} />
          <ModeField label="Heat pump present" value={state.heatPumpState} onChange={(value) => setState((current) => ({ ...current, heatPumpState: value }))} />
          <ModeField label="EV charging present" value={state.evChargingState} onChange={(value) => setState((current) => ({ ...current, evChargingState: value }))} />
        </div>
      );
    case "freedom":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <ModeField label="Solar freedom" value={state.solarFreedom} onChange={(value) => setState((current) => ({ ...current, solarFreedom: value }))} />
          <ModeField label="Battery freedom" value={state.batteryFreedom} onChange={(value) => setState((current) => ({ ...current, batteryFreedom: value }))} />
          <ModeField label="Heat pump freedom" value={state.heatPumpFreedom} onChange={(value) => setState((current) => ({ ...current, heatPumpFreedom: value }))} />
          <ModeField label="EV charging freedom" value={state.evFreedom} onChange={(value) => setState((current) => ({ ...current, evFreedom: value }))} />
        </div>
      );
    case "goals":
      return (
        <div className="grid gap-6">
          <div className="grid gap-3 lg:grid-cols-3">
            {([
              ["financial", "Lowest total cost"],
              ["balanced", "Balanced outcome"],
              ["independence", "Higher self-consumption"],
            ] as Array<[Objective, string]>).map(([objective, copy]) => {
              const active = state.objective === objective;
              return (
                <button
                  key={objective}
                  type="button"
                  onClick={() => setState((current) => ({ ...current, objective }))}
                  className={[
                    "rounded-2xl border px-5 py-5 text-left transition-all duration-[200ms]",
                    active
                      ? "border-[rgba(5,150,105,0.22)] bg-[#F8FAFC] shadow-[0_16px_28px_-24px_rgba(15,23,42,0.24)]"
                      : "border-[rgba(148,163,184,0.18)] bg-white hover:bg-[#F8FAFC]",
                  ].join(" ")}
                >
                  <p className="text-[11px] uppercase tracking-[0.08em] text-[#94A3B8]">Objective</p>
                  <p className="mt-3 text-[16px] font-semibold text-[#0F172A]">{toTitle(objective)}</p>
                  <p className="mt-2 text-[14px] leading-6 text-[#64748B]">{copy}</p>
                </button>
              );
            })}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <SelectField label="Budget band" value={state.budgetBand} options={budgetBands} onChange={(value) => setState((current) => ({ ...current, budgetBand: value }))} />
            <SliderField label="Import price" value={state.importPrice} min={0.18} max={0.6} step={0.01} unit="EUR" onChange={(value) => setState((current) => ({ ...current, importPrice: value }))} />
            <SliderField label="Export price" value={state.exportPrice} min={0.04} max={0.24} step={0.01} unit="EUR" onChange={(value) => setState((current) => ({ ...current, exportPrice: value }))} />
          </div>
        </div>
      );
    case "validation":
      return (
        <div className="grid gap-4 lg:grid-cols-3">
          <ValidationCard title="Blocking errors" items={validation.blocking} emptyText="No blocking issues. Analysis can proceed." />
          <ValidationCard title="Warnings" items={validation.warnings} emptyText="No important warnings." />
          <ValidationCard title="Assumptions" items={validation.assumptions} emptyText="No notable assumptions." />
        </div>
      );
  }
}

function buildValidation(state: WizardState): ValidationState {
  const blocking: string[] = [];
  const warnings: string[] = [];
  const assumptions: string[] = [];

  if (!state.floorArea || Number(state.floorArea) < 40) {
    blocking.push("Floor area is missing or too low for a reliable building model.");
  }
  if (!state.annualElectricity || Number(state.annualElectricity) < 1000) {
    blocking.push("Annual electricity consumption is incomplete for the energy profile.");
  }
  if (state.solarFreedom === "excluded" && state.batteryFreedom === "excluded" && state.heatPumpFreedom === "excluded") {
    warnings.push("All major upgrade paths are excluded, so the optimizer has limited room to improve the system.");
  }
  if (state.evDistance === 0) {
    assumptions.push("EV demand is assumed to be absent from the baseline household profile.");
  }
  if (state.energyLabel === "A" || state.energyLabel === "B" || state.energyLabel === "C") {
    assumptions.push("Heat demand is approximated from label and build-year proxies rather than detailed envelope inputs.");
  }
  if (state.exportPrice < 0.08) {
    warnings.push("Low export compensation increases the importance of self-consumption and storage strategies.");
  }

  return { blocking, warnings, assumptions };
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="text-[12px] font-medium uppercase tracking-[0.06em] text-[#64748B]">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-12 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white px-4 text-[14px] text-[#0F172A] shadow-[0_10px_22px_-22px_rgba(15,23,42,0.28)] outline-none transition-all duration-[200ms] focus:border-[rgba(5,150,105,0.28)]">
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function TextField({ label, value, suffix, onChange }: { label: string; value: string; suffix?: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="text-[12px] font-medium uppercase tracking-[0.06em] text-[#64748B]">{label}</span>
      <div className="relative">
        <input value={value} onChange={(event) => onChange(event.target.value)} className="h-12 w-full rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white px-4 pr-16 text-[14px] text-[#0F172A] shadow-[0_10px_22px_-22px_rgba(15,23,42,0.28)] outline-none transition-all duration-[200ms] focus:border-[rgba(5,150,105,0.28)]" />
        {suffix && <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[12px] text-[#94A3B8]">{suffix}</span>}
      </div>
    </label>
  );
}

function MetricHint({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#F8FAFC] p-4">
      <p className="text-[11px] uppercase tracking-[0.08em] text-[#94A3B8]">{title}</p>
      <p className="font-mono-num mt-3 text-[22px] font-semibold tracking-[-0.03em] text-[#0F172A]">{value}</p>
      <p className="mt-2 text-[13px] leading-6 text-[#64748B]">{note}</p>
    </div>
  );
}

function SliderField({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (value: number) => void }) {
  return (
    <div className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#F8FAFC] px-4 py-4">
      <InstrumentSlider label={label} min={min} max={max} step={step} value={Number(value.toFixed(2))} onChange={onChange} />
      <p className="mt-2 text-[12px] text-[#94A3B8]">{unit} per kWh</p>
    </div>
  );
}

function ModeField({ label, value, onChange }: { label: string; value: SystemMode; onChange: (value: SystemMode) => void }) {
  return (
    <div className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white p-4 shadow-[0_10px_22px_-22px_rgba(15,23,42,0.28)]">
      <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[#64748B]">{label}</p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {(["fixed", "optimize", "excluded"] as SystemMode[]).map((mode) => {
          const active = value === mode;
          return (
            <button key={mode} type="button" onClick={() => onChange(mode)} className={["rounded-xl px-3 py-3 text-[12px] font-semibold transition-all duration-[200ms]", active ? "bg-[linear-gradient(180deg,#3F3F46_0%,#18181B_100%)] text-white" : "border border-[rgba(148,163,184,0.18)] bg-[#F8FAFC] text-[#64748B]"].join(" ")}>
              {systemModeLabels[mode]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatusLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#F8FAFC] px-3 py-2.5 text-[13px]">
      <span className="text-[#64748B]">{label}</span>
      <span className="font-mono-num font-semibold text-[#0F172A]">{value}</span>
    </div>
  );
}

function ValidationCard({ title, items, emptyText }: { title: string; items: string[]; emptyText: string }) {
  return (
    <PremiumCard title={title} subtitle="Validation output" className="h-full bg-[rgba(248,250,252,0.82)]">
      {items.length === 0 ? (
        <p className="text-[14px] leading-7 text-[#64748B]">{emptyText}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item} className="rounded-xl bg-white px-3 py-3 text-[13px] leading-6 text-[#0F172A] shadow-[0_10px_22px_-22px_rgba(15,23,42,0.25)]">{item}</li>
          ))}
        </ul>
      )}
    </PremiumCard>
  );
}

function toTitle(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

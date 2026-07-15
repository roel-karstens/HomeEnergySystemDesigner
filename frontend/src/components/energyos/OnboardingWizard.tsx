import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Home, Target, Zap } from "lucide-react";
import { useMemo, useState } from "react";

interface OnboardingWizardProps {
  onNext: () => void;
  onPrev: () => void;
}

type Step = {
  key: string;
  label: string;
  icon: typeof Home;
};

type HomeType = "Detached house" | "Semi-detached" | "Terraced" | "Apartment";
type BuildYear = "Before 1950" | "1950-1979" | "1980-1999" | "2000-2015" | "2016+";
type EnergyLabel = "A++++" | "A+++" | "A++" | "A+" | "A" | "B" | "C";

const steps: Step[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "energy", label: "Energy", icon: Zap },
  { key: "goals", label: "Goals", icon: Target },
  { key: "review", label: "Review", icon: Check },
];

const homeTypes: HomeType[] = ["Detached house", "Semi-detached", "Terraced", "Apartment"];
const buildYears: BuildYear[] = ["Before 1950", "1950-1979", "1980-1999", "2000-2015", "2016+"];
const energyLabels: EnergyLabel[] = ["A++++", "A+++", "A++", "A+", "A", "B", "C"];
const onboardingImageSrc = `${import.meta.env.BASE_URL}images/onboarding-house-cutaway.jpeg`;

export function OnboardingWizard({ onNext, onPrev }: OnboardingWizardProps) {
  const reduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const [homeType, setHomeType] = useState<HomeType>("Detached house");
  const [yearBuilt, setYearBuilt] = useState<BuildYear>("2000-2015");
  const [livingArea, setLivingArea] = useState("150");
  const [energyLabel, setEnergyLabel] = useState<EnergyLabel>("A+");

  const stepTitle = useMemo(() => {
    if (activeStep === 0) return "Tell us about your home";
    if (activeStep === 1) return "Describe your current energy profile";
    if (activeStep === 2) return "Set your optimization priorities";
    return "Review and confirm your profile";
  }, [activeStep]);

  return (
    <section className="w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] sm:p-6 lg:p-8">
      <header className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Step {activeStep + 1} of 4</span>
          <span className="text-xs font-medium text-slate-500">EnergyOS intake wizard</span>
        </div>

        <ol className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;
            const Icon = step.icon;

            return (
              <li key={step.key}>
                <button
                  type="button"
                  onClick={() => setActiveStep(index)}
                  className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                    isActive
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                      isCompleted
                        ? "bg-emerald-600 text-white"
                        : isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                      <Icon className="h-3.5 w-3.5" />
                      Step
                    </span>
                    <span className="block truncate text-sm font-semibold text-slate-900">{step.label}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-7"
          >
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{stepTitle}</h2>
            <p className="mt-2 text-sm text-slate-500">
              High-quality input data improves simulation confidence and narrows recommendation uncertainty.
            </p>

            <form className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
              <label className="group block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Home type</span>
                <select
                  value={homeType}
                  onChange={(event) => setHomeType(event.target.value as HomeType)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 transition-all duration-200 hover:border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  {homeTypes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="group block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Year built</span>
                <select
                  value={yearBuilt}
                  onChange={(event) => setYearBuilt(event.target.value as BuildYear)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 transition-all duration-200 hover:border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  {buildYears.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="group block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Living area</span>
                <div className="relative">
                  <input
                    value={livingArea}
                    onChange={(event) => setLivingArea(event.target.value.replace(/[^0-9]/g, ""))}
                    inputMode="numeric"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-16 text-sm text-slate-900 transition-all duration-200 hover:border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    aria-label="Living area in square meters"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-slate-500">m2</span>
                </div>
              </label>

              <label className="group block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Energy label</span>
                <select
                  value={energyLabel}
                  onChange={(event) => setEnergyLabel(event.target.value as EnergyLabel)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 transition-all duration-200 hover:border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  {energyLabels.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </form>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={onPrev}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveStep((value) => Math.max(0, value - 1))}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  Previous Step
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (activeStep < steps.length - 1) {
                      setActiveStep((value) => value + 1);
                      return;
                    }
                    onNext();
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#00A86B] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#00925c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  {activeStep < steps.length - 1 ? "Next Step" : "Continue to Optimization"}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_16px_40px_-18px_rgba(0,0,0,0.35)] lg:col-span-5">
          <div className="h-full rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="relative h-72 overflow-hidden rounded-xl border border-slate-200">
              <motion.img
                src={onboardingImageSrc}
                alt="Cross section view of a modern smart energy home"
                className="h-full w-full object-cover"
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        scale: [1, 1.025, 1],
                        x: [0, 3, 0],
                        y: [0, -2, 0],
                      }
                }
                transition={
                  reduceMotion
                    ? undefined
                    : {
                        duration: 14,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                      }
                }
              />

              <InfoBadge className="left-3 top-4" label="Roof area" value="42 m2" />
              <InfoBadge className="right-3 top-14" label="Orientation" value="South-West" />
              <InfoBadge className="left-5 bottom-20" label="Insulation" value="Good" />
              <InfoBadge className="right-5 bottom-6" label="Heating" value="Floor heating" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface InfoBadgeProps {
  label: string;
  value: string;
  className: string;
}

function InfoBadge({ label, value, className }: InfoBadgeProps) {
  return (
    <div className={`absolute rounded-lg border border-white/60 bg-white/85 px-3 py-2 text-slate-900 shadow-sm backdrop-blur-md ${className}`}>
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="text-xs font-semibold">{value}</p>
    </div>
  );
}

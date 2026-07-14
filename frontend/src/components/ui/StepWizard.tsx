type StepWizardProps = {
  steps: string[];
  activeStep: number;
};

export function StepWizard({ steps, activeStep }: StepWizardProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-4">
      {steps.map((step, index) => {
        const current = index === activeStep;
        const done = index < activeStep;
        return (
          <div
            key={step}
            className={`rounded-xl border px-3 py-2 text-sm font-medium ${
              current
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : done
                  ? "border-emerald-200 bg-white text-emerald-600"
                  : "border-slate-200 bg-white text-slate-500"
            }`}
          >
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-current text-xs">
              {index + 1}
            </span>
            {step}
          </div>
        );
      })}
    </div>
  );
}

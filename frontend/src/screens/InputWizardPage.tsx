import { Card } from "../components/ui/Card";
import { InputField } from "../components/ui/InputField";
import { StepWizard } from "../components/ui/StepWizard";

export function InputWizardPage() {
  return (
    <div className="grid gap-6">
      <StepWizard steps={["Home", "Energy", "Goals", "Review"]} activeStep={0} />

      <Card title="Tell us about your home" subtitle="Provide the core property data for accurate optimization.">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Home type" value="Detached house" />
            <InputField label="Year built" value="2026" />
            <InputField label="Living area" value="150 m2" />
            <InputField label="Energy label" value="A++++" />
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <img src="/house-hero.jpeg" alt="House overview" className="h-52 w-full rounded-xl object-cover" />
            <div className="mt-3 rounded-xl bg-white p-3">
              <p className="text-sm font-semibold text-slate-900">Home profile overlay</p>
              <ul className="mt-2 grid gap-1 text-sm text-slate-600">
                <li>Roof area: 42 m2</li>
                <li>Orientation: South-West</li>
                <li>Insulation: Excellent</li>
                <li>Windows: Triple glazing</li>
                <li>Heating: Floor heating</li>
              </ul>
            </div>
          </aside>
        </div>

        <div className="mt-5 flex justify-end">
          <button className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Next</button>
        </div>
      </Card>
    </div>
  );
}

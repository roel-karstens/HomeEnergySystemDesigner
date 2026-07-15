import { OnboardingWizard } from "../components/energyos/OnboardingWizard";

interface InputScreenProps {
  onNext: () => void;
  onPrev: () => void;
}

export function InputScreen({ onNext, onPrev }: InputScreenProps) {
  return (
    <div className="h-screen w-full overflow-y-auto bg-[#F8FAFC] px-4 py-5 sm:px-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <OnboardingWizard onNext={onNext} onPrev={onPrev} />
      </div>
    </div>
  );
}

import { OptimizationLoader } from "../components/energyos/OptimizationLoader";

interface LoadingScreenProps {
  onNext: () => void;
}

export function LoadingScreen({ onNext }: LoadingScreenProps) {
  return (
    <div className="h-screen w-full overflow-y-auto bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl">
        <OptimizationLoader onComplete={onNext} />
      </div>
    </div>
  );
}

import { DashboardOverview } from "../components/energyos/DashboardOverview";

interface ResultsScreenProps {
  onNext: () => void;
  onPrev: () => void;
}

export function ResultsScreen({ onNext, onPrev }: ResultsScreenProps) {
  return (
    <div className="h-screen w-full overflow-hidden">
      <DashboardOverview onOpenAnalysis={onNext} onBack={onPrev} />
    </div>
  );
}

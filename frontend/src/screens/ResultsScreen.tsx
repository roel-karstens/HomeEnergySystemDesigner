import { ChevronLeft } from "lucide-react";
import { DashboardOverview } from "../components/energyos/DashboardOverview";

interface ResultsScreenProps {
  onNext: () => void;
  onPrev: () => void;
}

export function ResultsScreen({ onNext, onPrev }: ResultsScreenProps) {
  return (
    <div className="h-screen w-full flex flex-col overflow-y-auto bg-[#F8FAFC]">
      {/* Back button */}
      <div className="flex-shrink-0 border-b border-slate-100 px-4 py-3 sm:px-6 md:px-8 flex items-center justify-between">
        <button onClick={onPrev} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition">
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 py-6 sm:px-6 md:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <DashboardOverview onOpenAnalysis={onNext} />
        </div>
      </div>
    </div>
  );
}

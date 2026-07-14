import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { LandingScreen } from "./screens/LandingScreen";
import { InputScreen } from "./screens/InputScreen";
import { LoadingScreen } from "./screens/LoadingScreen";
import { ResultsScreen } from "./screens/ResultsScreen";
import { AnalysisScreen } from "./screens/AnalysisScreen";

type ScreenId = "landing" | "input" | "loading" | "results" | "analysis";

const screenOrder: ScreenId[] = ["landing", "input", "loading", "results", "analysis"];

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>("landing");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentIndex = screenOrder.indexOf(currentScreen);

  const goToScreen = async (screenId: ScreenId) => {
    setIsTransitioning(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    setCurrentScreen(screenId);
    setIsTransitioning(false);
  };

  const handleNext = () => {
    if (currentIndex < screenOrder.length - 1) {
      goToScreen(screenOrder[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0 && currentScreen !== "loading") {
      goToScreen(screenOrder[currentIndex - 1]);
    }
  };

  return (
    <main className="min-h-screen w-full bg-white text-slate-900 overflow-hidden">
      {/* Screen content with smooth fade transition */}
      <div className={`transition-opacity duration-200 h-screen w-full ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
        {currentScreen === "landing" && <LandingScreen onNext={handleNext} />}
        {currentScreen === "input" && <InputScreen onNext={handleNext} onPrev={handlePrev} />}
        {currentScreen === "loading" && <LoadingScreen onNext={handleNext} />}
        {currentScreen === "results" && <ResultsScreen onNext={handleNext} onPrev={handlePrev} />}
        {currentScreen === "analysis" && <AnalysisScreen onPrev={handlePrev} />}
      </div>

      {/* Progress indicator & navigation - fixed bottom */}
      <div className="fixed bottom-6 left-4 right-4 z-50 flex items-center justify-between md:left-6 md:right-6">
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {screenOrder.map((id, idx) => (
            <div
              key={id}
              className={`h-1 transition-all duration-300 ${
                idx < currentIndex ? "w-6 bg-emerald-600" : idx === currentIndex ? "w-6 bg-emerald-400" : "w-1 bg-slate-300"
              }`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        {currentScreen !== "loading" && (
          <button
            onClick={handleNext}
            disabled={currentIndex >= screenOrder.length - 1}
            className="rounded-full bg-emerald-600 p-2.5 hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg"
            aria-label="Next screen"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </main>
  );
}

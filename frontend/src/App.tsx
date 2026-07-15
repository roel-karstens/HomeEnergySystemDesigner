import { Suspense, lazy, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const LandingScreen = lazy(() => import("./screens/LandingScreen").then((module) => ({ default: module.LandingScreen })));
const InputScreen = lazy(() => import("./screens/InputScreen").then((module) => ({ default: module.InputScreen })));
const LoadingScreen = lazy(() => import("./screens/LoadingScreen").then((module) => ({ default: module.LoadingScreen })));
const ResultsScreen = lazy(() => import("./screens/ResultsScreen").then((module) => ({ default: module.ResultsScreen })));
const AnalysisScreen = lazy(() => import("./screens/AnalysisScreen").then((module) => ({ default: module.AnalysisScreen })));

type ScreenId = "landing" | "input" | "loading" | "results" | "analysis";

const screenOrder: ScreenId[] = ["landing", "input", "loading", "results", "analysis"];

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>("landing");

  const currentIndex = screenOrder.indexOf(currentScreen);

  const goToScreen = (screenId: ScreenId) => {
    setCurrentScreen(screenId);
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
    <main className="min-h-screen w-full overflow-hidden text-slate-900">
      <Suspense fallback={<ScreenFallback />}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="h-screen w-full"
          >
            {currentScreen === "landing" && <LandingScreen onNext={handleNext} />}
            {currentScreen === "input" && <InputScreen onNext={handleNext} onPrev={handlePrev} />}
            {currentScreen === "loading" && <LoadingScreen onNext={handleNext} />}
            {currentScreen === "results" && <ResultsScreen onNext={handleNext} onPrev={handlePrev} />}
            {currentScreen === "analysis" && <AnalysisScreen onPrev={handlePrev} />}
          </motion.div>
        </AnimatePresence>
      </Suspense>

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

function ScreenFallback() {
  return (
    <div className="grid h-screen w-full place-items-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)]">
        <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
        <div className="mt-4 h-8 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-100" />
        <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}

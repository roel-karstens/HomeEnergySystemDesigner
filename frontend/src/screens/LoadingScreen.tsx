import { CheckCircle2, Loader } from "lucide-react";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onNext: () => void;
}

export function LoadingScreen({ onNext }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) {
          clearInterval(interval);
          return 95;
        }
        return p + Math.random() * 15;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 95) {
      const timeout = setTimeout(() => {
        setProgress(100);
        setIsComplete(true);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  useEffect(() => {
    if (isComplete) {
      const timeout = setTimeout(onNext, 1500);
      return () => clearTimeout(timeout);
    }
  }, [isComplete, onNext]);

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-b from-white to-slate-50 items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Animated heading */}
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {isComplete ? "All set! 🎉" : "Analyzing thousands of combinations..."}
          </h2>
          <p className="text-slate-600 text-base">
            {isComplete ? "We found your optimal system" : "This usually takes less than 30 seconds."}
          </p>
        </div>

        {/* Large circular progress */}
        <div className="flex justify-center">
          <div className="relative h-48 w-48 sm:h-56 sm:w-56">
            {/* Background circle */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="3" />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={isComplete ? "#10b981" : "#3b82f6"}
                strokeWidth="3"
                strokeDasharray={`${progress * 2.827} 282.7`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                className="transition-all duration-300"
              />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className={`text-4xl sm:text-5xl font-bold ${isComplete ? "text-emerald-600" : "text-blue-600"}`}>
                  {Math.round(progress)}%
                </p>
                {!isComplete && <p className="text-xs text-slate-500 mt-2">processing</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Status list */}
        <div className="space-y-2 text-left bg-slate-50 rounded-lg p-4 border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Simulation steps</p>
          {[
            "Modeling your energy usage",
            "Simulating solar production",
            "Evaluating battery strategies",
            "Testing EV charging schedules",
            "Calculating financial outcomes",
          ].map((step, idx) => {
            const isDone = idx < Math.ceil(progress / 20);
            return (
              <div key={step} className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <div className={`h-4 w-4 rounded-full border-2 flex-shrink-0 ${idx === Math.ceil(progress / 20) ? "border-blue-500 animate-pulse" : "border-slate-200"}`} />
                )}
                <span className={`text-sm ${isDone ? "text-slate-700 font-medium" : idx === Math.ceil(progress / 20) ? "text-slate-900 font-semibold" : "text-slate-500"}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Hidden button - auto-advances */}
        {isComplete && (
          <div className="pt-4 text-sm text-slate-600">
            <Loader className="h-4 w-4 inline animate-spin mr-2" />
            Loading results...
          </div>
        )}
      </div>
    </div>
  );
}

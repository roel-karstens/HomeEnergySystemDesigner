import { HeroSection } from "../components/energyos/HeroSection";

interface LandingScreenProps {
  onNext: () => void;
}

export function LandingScreen({ onNext }: LandingScreenProps) {
  return (
    <div className="min-h-screen w-full overflow-y-auto bg-white">
      <div className="w-full">
        <HeroSection onStart={onNext} />
      </div>
    </div>
  );
}

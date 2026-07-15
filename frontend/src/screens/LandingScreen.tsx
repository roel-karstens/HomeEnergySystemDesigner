import { HeroSection } from "../components/energyos/HeroSection";

interface LandingScreenProps {
  onNext: () => void;
}

export function LandingScreen({ onNext }: LandingScreenProps) {
  return (
    <div className="h-screen w-full overflow-y-auto bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl">
        <HeroSection onStart={onNext} />
      </div>
    </div>
  );
}

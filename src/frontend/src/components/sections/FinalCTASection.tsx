import { useInView } from "../../lib/useInView";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { Button } from "../primitives/Button";

interface FinalCTASectionProps {
  onStartMindVault?: () => void;
  onSubscriptionPlans?: () => void;
}

export default function FinalCTASection({
  onStartMindVault,
  onSubscriptionPlans,
}: FinalCTASectionProps) {
  const { ref, isInView } = useInView({ threshold: 0.5 });
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      ref={ref}
      className={`relative py-32 px-4 overflow-hidden transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{
        background:
          "linear-gradient(135deg, oklch(0.18 0.12 320) 0%, oklch(0.14 0.10 290) 50%, oklch(0.16 0.10 310) 100%)",
      }}
      aria-label="Final call to action"
    >
      {/* Pulse glow */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at center, oklch(0.68 0.22 28 / 0.25) 0%, oklch(0.65 0.28 335 / 0.15) 40%, transparent 70%)",
          animation: prefersReducedMotion
            ? "none"
            : "pulse-glow 4s ease-in-out infinite",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
          style={{ color: "oklch(0.97 0.005 240)" }}
        >
          You don't need to reach a breaking point to ask for help.
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button variant="primary" size="lg" onClick={onStartMindVault}>
            Start MindVault
          </Button>
          <Button variant="secondary" size="lg" onClick={onSubscriptionPlans}>
            Subscription plans
          </Button>
        </div>
      </div>
    </section>
  );
}

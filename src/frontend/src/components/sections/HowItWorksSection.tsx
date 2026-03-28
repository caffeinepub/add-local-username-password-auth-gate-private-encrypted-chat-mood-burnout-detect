import { useInView } from "@/lib/useInView";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { Brain, MessageSquare, UserCheck } from "lucide-react";
import ConversationPreview from "../primitives/ConversationPreview";
import ProgressIndicator from "../primitives/ProgressIndicator";

const steps = [
  {
    icon: MessageSquare,
    title: "Share Your Thoughts",
    description:
      "Express yourself freely in a secure, encrypted space. No judgment, just support.",
    color: "oklch(0.72 0.2 185)",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description:
      "Our AI analyzes patterns and provides immediate insights and reassurance.",
    color: "oklch(0.68 0.28 290)",
  },
  {
    icon: UserCheck,
    title: "Professional Support",
    description:
      "Connect with licensed therapists when you need human guidance.",
    color: "oklch(0.68 0.22 28)",
  },
];

export default function HowItWorksSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="how-it-works-section"
      ref={ref}
      className="py-24 px-4"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.13 0.07 270) 0%, oklch(0.18 0.09 255) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="font-semibold mb-2 uppercase tracking-wide text-sm"
            style={{ color: "oklch(0.72 0.2 185)" }}
          >
            How It Works
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "oklch(0.97 0.005 240)" }}
          >
            Three Simple Steps to Better Mental Health
          </h2>
          <p
            className="text-lg max-w-3xl mx-auto"
            style={{ color: "oklch(0.78 0.06 270)" }}
          >
            MindVault makes it easy to get the support you need, when you need
            it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Steps */}
          <div className="space-y-8">
            <ProgressIndicator currentStep={1} totalSteps={3} />

            {steps.map((step, index) => {
              const Icon = step.icon;
              const delay = prefersReducedMotion ? 0 : index * 150;

              return (
                <div
                  key={step.title}
                  className="flex items-start gap-4 group"
                  style={{
                    opacity: isInView ? 1 : 0,
                    transform: isInView ? "translateX(0)" : "translateX(-20px)",
                    transition: prefersReducedMotion
                      ? "none"
                      : `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
                  }}
                >
                  <div
                    className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: `${step.color}25` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: step.color }} />
                  </div>
                  <div>
                    <h3
                      className="text-xl font-semibold mb-2"
                      style={{ color: "oklch(0.97 0.005 240)" }}
                    >
                      <span style={{ color: step.color }}>{index + 1}. </span>
                      {step.title}
                    </h3>
                    <p style={{ color: "oklch(0.78 0.06 270)" }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Conversation preview */}
          <div
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateX(0)" : "translateX(20px)",
              transition: prefersReducedMotion
                ? "none"
                : "opacity 0.8s ease-out 300ms, transform 0.8s ease-out 300ms",
            }}
          >
            <ConversationPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

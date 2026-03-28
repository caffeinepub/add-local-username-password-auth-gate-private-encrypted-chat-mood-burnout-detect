import { useInView } from "@/lib/useInView";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { Brain, Clock, Heart, Lock, Shield, Users } from "lucide-react";
import GlassCard from "../primitives/GlassCard";

const accentColors = [
  "oklch(0.72 0.2 185)", // teal
  "oklch(0.68 0.22 28)", // coral
  "oklch(0.65 0.28 335)", // magenta
  "oklch(0.78 0.18 70)", // amber
  "oklch(0.65 0.28 255)", // electric blue
  "oklch(0.68 0.28 290)", // vivid purple
];

const features = [
  {
    icon: Shield,
    title: "Complete Privacy",
    description:
      "Your conversations are encrypted and never shared. Anonymous by default.",
  },
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description:
      "Military-grade encryption ensures your data stays private and secure.",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description:
      "Get immediate feedback and mood analysis powered by advanced AI.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Access support whenever you need it, day or night.",
  },
  {
    icon: Users,
    title: "Professional Therapists",
    description:
      "Connect with licensed professionals when you need human support.",
  },
  {
    icon: Heart,
    title: "Compassionate Care",
    description:
      "Receive empathetic, judgment-free support tailored to your needs.",
  },
];

export default function FeaturesGridSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="features-section"
      ref={ref}
      className="py-24 px-4"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.12 0.04 260) 0%, oklch(0.14 0.05 275) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="font-semibold mb-2 uppercase tracking-wide text-sm"
            style={{ color: "oklch(0.65 0.28 255)" }}
          >
            Features
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "oklch(0.97 0.005 240)" }}
          >
            Everything You Need for Mental Wellness
          </h2>
          <p
            className="text-lg max-w-3xl mx-auto"
            style={{ color: "oklch(0.75 0.06 270)" }}
          >
            MindVault combines cutting-edge technology with human expertise to
            provide comprehensive mental health support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const delay = prefersReducedMotion ? 0 : index * 100;
            const color = accentColors[index];

            return (
              <GlassCard
                key={feature.title}
                className="p-6 hover:shadow-lg transition-shadow"
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? "translateY(0)" : "translateY(20px)",
                  transition: prefersReducedMotion
                    ? "none"
                    : `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
                  borderTop: `3px solid ${color}`,
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ background: `${color}20` }}
                  >
                    <Icon className="w-8 h-8" style={{ color }} />
                  </div>
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ color: "oklch(0.97 0.005 240)" }}
                  >
                    {feature.title}
                  </h3>
                  <p style={{ color: "oklch(0.75 0.06 270)" }}>
                    {feature.description}
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

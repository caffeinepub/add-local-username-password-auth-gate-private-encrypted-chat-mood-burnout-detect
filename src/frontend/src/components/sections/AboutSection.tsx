import { useInView } from "@/lib/useInView";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import {
  AlertTriangle,
  Brain,
  HeartHandshake,
  Lock,
  Shield,
  Users,
} from "lucide-react";
import GlassCard from "../primitives/GlassCard";

const cardAccents = [
  "oklch(0.65 0.28 255)", // electric blue
  "oklch(0.72 0.2 185)", // teal
  "oklch(0.68 0.22 28)", // coral
  "oklch(0.65 0.28 335)", // magenta
  "oklch(0.68 0.28 290)", // vivid purple
  "oklch(0.78 0.18 70)", // amber
];

const aboutBlocks = [
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your data is encrypted end-to-end. We never sell or share your personal information.",
  },
  {
    icon: Users,
    title: "Human-in-the-Loop Safety",
    description:
      "AI assists, but licensed therapists review and guide your care journey.",
  },
  {
    icon: HeartHandshake,
    title: "Blended Care Model",
    description:
      "Combine AI-powered insights with professional human support for the best outcomes.",
  },
  {
    icon: AlertTriangle,
    title: "Responsible Escalation",
    description:
      "High-risk situations are flagged and escalated to qualified professionals immediately.",
  },
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description:
      "Your conversations are encrypted on your device before being stored.",
  },
  {
    icon: Brain,
    title: "Self-Awareness Tools",
    description:
      "Track your mood patterns and gain insights into your mental health journey.",
  },
];

export default function AboutSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="about-section"
      ref={ref}
      className="py-24 px-4"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.12 0.04 260) 0%, oklch(0.15 0.07 280) 50%, oklch(0.12 0.04 260) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="font-semibold mb-2 uppercase tracking-wide text-sm"
            style={{ color: "oklch(0.68 0.28 290)" }}
          >
            About MindVault
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.65 0.28 255), oklch(0.68 0.28 290))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Your Mental Health, Your Control
          </h2>
          <p
            className="text-lg max-w-3xl mx-auto"
            style={{ color: "oklch(0.75 0.06 270)" }}
          >
            MindVault combines cutting-edge AI technology with human expertise
            to provide safe, private, and effective mental health support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aboutBlocks.map((block, index) => {
            const Icon = block.icon;
            const delay = prefersReducedMotion ? 0 : index * 100;
            const color = cardAccents[index];

            return (
              <GlassCard
                key={block.title}
                className="p-6"
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? "translateY(0)" : "translateY(20px)",
                  transition: prefersReducedMotion
                    ? "none"
                    : `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
                  borderLeft: `3px solid ${color}`,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ background: `${color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{
                        background: `linear-gradient(135deg, ${color}, oklch(0.65 0.28 335))`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {block.title}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: "oklch(0.80 0.05 270)" }}
                    >
                      {block.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

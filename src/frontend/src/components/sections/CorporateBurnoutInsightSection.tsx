import { useInView } from "../../lib/useInView";
import Callout from "../primitives/Callout";
import Section from "../primitives/Section";

export default function CorporateBurnoutInsightSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <Section
      ref={ref}
      className={`transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{
        background:
          "linear-gradient(135deg, oklch(0.15 0.07 50) 0%, oklch(0.12 0.06 30) 100%)",
      }}
      aria-label="Corporate burnout insight"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Section header with forced white text */}
        <div className="text-center mb-16 space-y-4">
          <p
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: "#ffffff" }}
          >
            Understanding Burnout
          </p>
          <h2 className="section-headline" style={{ color: "#ffffff" }}>
            Why anonymity matters in corporate environments
          </h2>
        </div>

        <div className="prose prose-lg max-w-none space-y-6">
          <p
            className="leading-relaxed"
            style={{ color: "oklch(0.92 0.03 70)" }}
          >
            Burnout isn't just feeling tired. It's a state of emotional,
            physical, and mental exhaustion caused by prolonged stress. In
            corporate environments, it manifests as cynicism toward work,
            reduced productivity, and a sense of ineffectiveness—even when
            you're working harder than ever.
          </p>

          <p
            className="leading-relaxed"
            style={{ color: "oklch(0.92 0.03 70)" }}
          >
            The corporate world often rewards pushing through discomfort and
            maintaining a facade of constant capability. This culture makes it
            difficult to acknowledge when you're struggling, let alone seek
            help. The fear of appearing weak, uncommitted, or unable to handle
            pressure keeps many people silent about their mental health.
          </p>

          <Callout>
            73% of employees fear judgment when seeking mental health support
          </Callout>

          <p
            className="leading-relaxed"
            style={{ color: "oklch(0.92 0.03 70)" }}
          >
            Anonymity removes the barrier of judgment. When you don't have to
            worry about your manager, colleagues, or HR knowing you're seeking
            support, you can be honest about what you're experiencing. This
            honesty is the first step toward meaningful change.
          </p>

          <p
            className="leading-relaxed"
            style={{ color: "oklch(0.92 0.03 70)" }}
          >
            Early AI detection helps identify patterns you might not recognize
            yourself. Subtle changes in how you describe your work, sleep, or
            relationships can signal emerging burnout. By catching these
            patterns early, MindVault helps you address issues before they
            become crises— giving you tools and resources when they're most
            effective.
          </p>
        </div>
      </div>
    </Section>
  );
}

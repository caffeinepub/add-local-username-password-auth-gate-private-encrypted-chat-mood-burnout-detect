import { useInView } from "../../lib/useInView";
import Section from "../primitives/Section";

export default function CoreEmotionalQuestionSection() {
  const { ref, isInView } = useInView({ threshold: 0.3 });

  return (
    <Section
      ref={ref}
      className={`transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{
        background:
          "linear-gradient(135deg, oklch(0.16 0.09 280) 0%, oklch(0.20 0.12 300) 50%, oklch(0.16 0.09 270) 100%)",
      }}
      aria-label="Core emotional question"
    >
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
          style={{ color: "oklch(0.97 0.005 240)" }}
        >
          What happens when your mind needs help — but you don't want to be
          seen?
        </h2>

        <p
          className="text-xl leading-relaxed"
          style={{ color: "oklch(0.72 0.2 185)" }}
        >
          MindVault listens first. Without judgment. Without identity. Without
          pressure.
        </p>
      </div>
    </Section>
  );
}

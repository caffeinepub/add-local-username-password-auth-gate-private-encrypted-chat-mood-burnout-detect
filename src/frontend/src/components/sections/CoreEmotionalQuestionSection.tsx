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
      aria-label="Core emotional question"
    >
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="section-headline text-foreground">
          What happens when your mind needs help — but you don't want to be
          seen?
        </h2>

        <p className="section-body text-muted-foreground text-xl leading-relaxed">
          MindVault listens first. Without judgment. Without identity. Without
          pressure.
        </p>
      </div>
    </Section>
  );
}

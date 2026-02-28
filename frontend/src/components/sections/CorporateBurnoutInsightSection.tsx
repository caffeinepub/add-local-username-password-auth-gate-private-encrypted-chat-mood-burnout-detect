import { useInView } from '../../lib/useInView';
import Section from '../primitives/Section';
import Callout from '../primitives/Callout';

export default function CorporateBurnoutInsightSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <Section
      ref={ref}
      eyebrow="Understanding Burnout"
      title="Why anonymity matters in corporate environments"
      className={`transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      aria-label="Corporate burnout insight"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-black leading-relaxed">
            Burnout isn't just feeling tired. It's a state of emotional, physical, and mental exhaustion 
            caused by prolonged stress. In corporate environments, it manifests as cynicism toward work, 
            reduced productivity, and a sense of ineffectiveness—even when you're working harder than ever.
          </p>

          <p className="text-black leading-relaxed">
            The corporate world often rewards pushing through discomfort and maintaining a facade of 
            constant capability. This culture makes it difficult to acknowledge when you're struggling, 
            let alone seek help. The fear of appearing weak, uncommitted, or unable to handle pressure 
            keeps many people silent about their mental health.
          </p>

          <Callout>
            73% of employees fear judgment when seeking mental health support
          </Callout>

          <p className="text-black leading-relaxed">
            Anonymity removes the barrier of judgment. When you don't have to worry about your manager, 
            colleagues, or HR knowing you're seeking support, you can be honest about what you're 
            experiencing. This honesty is the first step toward meaningful change.
          </p>

          <p className="text-black leading-relaxed">
            Early AI detection helps identify patterns you might not recognize yourself. Subtle changes 
            in how you describe your work, sleep, or relationships can signal emerging burnout. By 
            catching these patterns early, MindVault helps you address issues before they become crises—
            giving you tools and resources when they're most effective.
          </p>
        </div>
      </div>
    </Section>
  );
}

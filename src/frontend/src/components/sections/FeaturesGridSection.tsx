import { Heart, UserX, Stethoscope, Flame, AlertTriangle, Wind } from 'lucide-react';
import { useInView } from '../../lib/useInView';
import Section from '../primitives/Section';
import GlassCard from '../primitives/GlassCard';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';

const features = [
  {
    icon: Heart,
    title: 'AI Emotional Companion',
    description: 'A compassionate AI that listens without judgment, available whenever you need support.'
  },
  {
    icon: UserX,
    title: 'Complete Anonymity',
    description: 'No names, no emails, no identity required. Your privacy is absolute and protected.'
  },
  {
    icon: Stethoscope,
    title: 'Licensed Therapist Access',
    description: 'Connect with qualified mental health professionals when you are ready for human support.'
  },
  {
    icon: Flame,
    title: 'Burnout Detection',
    description: 'Early identification of burnout patterns helps you address issues before they escalate.'
  },
  {
    icon: AlertTriangle,
    title: 'Crisis-Aware Escalation',
    description: 'Intelligent recognition of urgent situations with immediate pathways to appropriate care.'
  },
  {
    icon: Wind,
    title: 'Self-Regulation Tools',
    description: 'Guided breathing, grounding exercises, and coping strategies available on demand.'
  }
];

export default function FeaturesGridSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Section
      ref={ref}
      eyebrow="Features"
      title="Support designed for your wellbeing"
      description="Every feature built with privacy, safety, and care in mind"
      aria-label="Features"
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const delay = prefersReducedMotion ? 0 : index * 100;
          
          return (
            <div
              key={feature.title}
              className={`transition-all duration-500 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${delay}ms` }}
            >
              <GlassCard className="p-6 h-full space-y-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/20 text-accent">
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                
                <h3 className="text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </GlassCard>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

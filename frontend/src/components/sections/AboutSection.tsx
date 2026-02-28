import { Shield, Users, HeartHandshake, AlertTriangle, Lock, Brain } from 'lucide-react';
import { useInView } from '@/lib/useInView';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import GlassCard from '../primitives/GlassCard';

const aboutBlocks = [
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data is encrypted end-to-end. We never sell or share your personal information.',
  },
  {
    icon: Users,
    title: 'Human-in-the-Loop Safety',
    description: 'AI assists, but licensed therapists review and guide your care journey.',
  },
  {
    icon: HeartHandshake,
    title: 'Blended Care Model',
    description: 'Combine AI-powered insights with professional human support for the best outcomes.',
  },
  {
    icon: AlertTriangle,
    title: 'Responsible Escalation',
    description: 'High-risk situations are flagged and escalated to qualified professionals immediately.',
  },
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'Your conversations are encrypted on your device before being stored.',
  },
  {
    icon: Brain,
    title: 'Self-Awareness Tools',
    description: 'Track your mood patterns and gain insights into your mental health journey.',
  },
];

export default function AboutSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="about-section"
      ref={ref}
      className="py-24 px-4 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold mb-2 uppercase tracking-wide text-sm">About MindVault</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your Mental Health, Your Control
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            MindVault combines cutting-edge AI technology with human expertise to provide safe, 
            private, and effective mental health support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aboutBlocks.map((block, index) => {
            const Icon = block.icon;
            const delay = prefersReducedMotion ? 0 : index * 100;
            
            return (
              <GlassCard
                key={block.title}
                className="p-6"
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? 'translateY(0)' : 'translateY(20px)',
                  transition: prefersReducedMotion 
                    ? 'none' 
                    : `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {block.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
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

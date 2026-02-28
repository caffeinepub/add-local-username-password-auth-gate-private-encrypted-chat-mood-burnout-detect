import { Shield, Lock, Brain, Clock, Users, Heart } from 'lucide-react';
import { useInView } from '@/lib/useInView';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import GlassCard from '../primitives/GlassCard';

const features = [
  {
    icon: Shield,
    title: 'Complete Privacy',
    description: 'Your conversations are encrypted and never shared. Anonymous by default.',
  },
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'Military-grade encryption ensures your data stays private and secure.',
  },
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Get immediate feedback and mood analysis powered by advanced AI.',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Access support whenever you need it, day or night.',
  },
  {
    icon: Users,
    title: 'Professional Therapists',
    description: 'Connect with licensed professionals when you need human support.',
  },
  {
    icon: Heart,
    title: 'Compassionate Care',
    description: 'Receive empathetic, judgment-free support tailored to your needs.',
  },
];

export default function FeaturesGridSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="features-section"
      ref={ref}
      className="py-24 px-4 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold mb-2 uppercase tracking-wide text-sm">Features</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need for Mental Wellness
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            MindVault combines cutting-edge technology with human expertise to provide comprehensive mental health support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const delay = prefersReducedMotion ? 0 : index * 100;
            
            return (
              <GlassCard
                key={feature.title}
                className="p-6 hover:shadow-lg transition-shadow"
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? 'translateY(0)' : 'translateY(20px)',
                  transition: prefersReducedMotion 
                    ? 'none' 
                    : `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
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

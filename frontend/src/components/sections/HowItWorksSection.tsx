import { MessageSquare, Brain, UserCheck } from 'lucide-react';
import { useInView } from '@/lib/useInView';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import ProgressIndicator from '../primitives/ProgressIndicator';
import ConversationPreview from '../primitives/ConversationPreview';

const steps = [
  {
    icon: MessageSquare,
    title: 'Share Your Thoughts',
    description: 'Express yourself freely in a secure, encrypted space. No judgment, just support.',
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    description: 'Our AI analyzes patterns and provides immediate insights and reassurance.',
  },
  {
    icon: UserCheck,
    title: 'Professional Support',
    description: 'Connect with licensed therapists when you need human guidance.',
  },
];

export default function HowItWorksSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="how-it-works-section"
      ref={ref}
      className="py-24 px-4 bg-muted/30"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold mb-2 uppercase tracking-wide text-sm">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Three Simple Steps to Better Mental Health
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            MindVault makes it easy to get the support you need, when you need it.
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
                    transform: isInView ? 'translateX(0)' : 'translateX(-20px)',
                    transition: prefersReducedMotion 
                      ? 'none' 
                      : `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
                  }}
                >
                  <div className="shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {index + 1}. {step.title}
                    </h3>
                    <p className="text-muted-foreground">
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
              transform: isInView ? 'translateX(0)' : 'translateX(20px)',
              transition: prefersReducedMotion 
                ? 'none' 
                : 'opacity 0.8s ease-out 300ms, transform 0.8s ease-out 300ms',
            }}
          >
            <ConversationPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

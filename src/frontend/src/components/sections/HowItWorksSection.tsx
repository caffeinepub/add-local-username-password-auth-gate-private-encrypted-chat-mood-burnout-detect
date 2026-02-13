import { useState } from 'react';
import { Shield, Brain, Users } from 'lucide-react';
import { useInView } from '../../lib/useInView';
import Section from '../primitives/Section';
import ProgressIndicator from '../primitives/ProgressIndicator';
import ConversationPreview from '../primitives/ConversationPreview';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';

const steps = [
  {
    id: 1,
    icon: Shield,
    title: 'Anonymous Entry',
    description: 'Share what is on your mind without revealing who you are. No accounts, no tracking, no judgment.',
    preview: {
      user: "I have been feeling overwhelmed at work lately...",
      ai: "I hear you. It sounds like you are carrying a lot right now. Would you like to tell me more about what has been happening?"
    }
  },
  {
    id: 2,
    icon: Brain,
    title: 'AI Emotional Triage',
    description: 'Our AI companion listens and understands the emotional weight of what you are experiencing.',
    preview: {
      user: "I cannot sleep, and I feel anxious all the time.",
      ai: "Those feelings are valid. Let us explore what might be contributing to this together. Have you noticed any patterns or triggers?"
    }
  },
  {
    id: 3,
    icon: Users,
    title: 'AI Support or Therapist Connection',
    description: 'Get immediate AI-guided support tools, or connect with a licensed therapist when you are ready.',
    preview: {
      user: "I think I need to talk to someone professional.",
      ai: "That is a courageous step. I can connect you with a licensed therapist who specializes in what you are experiencing. Would you like to see available options?"
    }
  }
];

export default function HowItWorksSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Section
      id="how-it-works"
      ref={ref}
      eyebrow="How MindVault Works"
      title="Three steps to support"
      description="A gentle path from anonymity to care"
      aria-label="How MindVault works"
    >
      <ProgressIndicator currentStep={activeStep || 1} totalSteps={3} />

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const delay = prefersReducedMotion ? 0 : index * 150;
          
          return (
            <div
              key={step.id}
              className={`transition-all duration-500 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${delay}ms` }}
              onMouseEnter={() => setActiveStep(step.id)}
              onMouseLeave={() => setActiveStep(null)}
              onFocus={() => setActiveStep(step.id)}
              onBlur={() => setActiveStep(null)}
              tabIndex={0}
              role="article"
              aria-label={`Step ${step.id}: ${step.title}`}
            >
              <div className="glass-card p-8 h-full space-y-4 cursor-pointer">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 text-accent mx-auto">
                  <Icon className="w-8 h-8" aria-hidden="true" />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground text-center">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground text-center leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conversation preview */}
      {activeStep && (
        <ConversationPreview
          preview={steps.find(s => s.id === activeStep)?.preview}
        />
      )}
    </Section>
  );
}

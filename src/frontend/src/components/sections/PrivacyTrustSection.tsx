import { ShieldCheck, Lock, Ban, Scale } from 'lucide-react';
import { useInView } from '../../lib/useInView';
import Section from '../primitives/Section';

const privacyPoints = [
  {
    icon: ShieldCheck,
    text: 'No identity storage'
  },
  {
    icon: Lock,
    text: 'End-to-end encryption'
  },
  {
    icon: Ban,
    text: 'No ads, no data resale'
  },
  {
    icon: Scale,
    text: 'Ethical AI boundaries'
  }
];

export default function PrivacyTrustSection() {
  const { ref, isInView } = useInView({ threshold: 0.3 });

  return (
    <Section
      ref={ref}
      eyebrow="Privacy & Trust"
      title="Your privacy is our foundation"
      description="Built on principles of anonymity and ethical care"
      className={`transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      aria-label="Privacy and trust"
    >
      <div className="max-w-4xl mx-auto">
        <ul className="grid sm:grid-cols-2 gap-6 mb-12" role="list">
          {privacyPoints.map((point) => {
            const Icon = point.icon;
            return (
              <li key={point.text} className="flex items-start gap-4">
                <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-accent/20 text-accent">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-lg text-foreground pt-1.5">{point.text}</span>
              </li>
            );
          })}
        </ul>

        <div className="flex justify-center">
          <img
            src="/assets/generated/mindvault-trust-badge.dim_512x512.png"
            alt="MindVault privacy commitment badge - illustrative representation of our dedication to user privacy and ethical AI practices"
            className="w-32 h-32 object-contain opacity-80"
          />
        </div>
      </div>
    </Section>
  );
}

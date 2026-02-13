import { useEffect, useRef } from 'react';
import { Button } from '../primitives/Button';
import NeuralParticlesOverlay from '../visual/NeuralParticlesOverlay';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';

interface HeroSectionProps {
  onStartAnonymously?: () => void;
}

export default function HeroSection({ onStartAnonymously }: HeroSectionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion || !heroRef.current) return;

    const hero = heroRef.current;
    hero.style.setProperty('--gradient-animation', 'gradient-shift 20s ease-in-out infinite');
  }, [prefersReducedMotion]);

  const handleHowItWorks = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    howItWorksSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20"
      aria-label="Hero section"
    >
      {/* Animated gradient background - Light theme */}
      <div
        className="absolute inset-0 opacity-40 z-0"
        style={{
          background: 'linear-gradient(135deg, oklch(98% 0.02 260) 0%, oklch(96% 0.03 280) 50%, oklch(97% 0.02 240) 100%)',
          backgroundSize: '200% 200%',
          animation: prefersReducedMotion ? 'none' : 'var(--gradient-animation, none)',
        }}
        aria-hidden="true"
      />

      {/* Background orbs - Reduced opacity for light theme */}
      <div className="absolute inset-0 pointer-events-none z-5" aria-hidden="true">
        <img
          src="/assets/generated/mindvault-orbs.dim_1200x800.png"
          alt=""
          className="absolute top-1/4 left-1/4 w-96 h-64 object-contain opacity-10 blur-3xl"
        />
      </div>

      {/* Content with enhanced readability */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 hero-content-readable">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-foreground mb-6">
          MINDVAULT
        </h1>
        
        <h2 className="hero-headline text-foreground">
          You deserve care too
        </h2>
        
        <p className="hero-subtext text-muted-foreground max-w-2xl mx-auto">
          Anonymous AI support that listens, understands, and connects you to real help.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button variant="primary" size="lg" onClick={onStartAnonymously}>
            Start Anonymously
          </Button>
          <Button variant="secondary" size="lg" onClick={handleHowItWorks}>
            How It Works
          </Button>
        </div>
      </div>

      {/* Neural particles overlay - Now above content with subtle blend */}
      <NeuralParticlesOverlay />
    </section>
  );
}

import { useInView } from '../../lib/useInView';
import { Button } from '../primitives/Button';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';

interface FinalCTASectionProps {
  onStartMindVault?: () => void;
}

export default function FinalCTASection({ onStartMindVault }: FinalCTASectionProps) {
  const { ref, isInView } = useInView({ threshold: 0.5 });
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      ref={ref}
      className={`relative py-32 px-4 overflow-hidden transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      aria-label="Final call to action"
    >
      {/* Gradient emphasis background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at center, rgba(34, 211, 238, 0.15) 0%, transparent 70%)',
          animation: prefersReducedMotion ? 'none' : 'pulse-glow 4s ease-in-out infinite',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <h2 className="section-headline text-foreground">
          You don't need to reach a breaking point to ask for help.
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button variant="primary" size="lg" onClick={onStartMindVault}>
            Start MindVault
          </Button>
          <Button variant="secondary" size="lg">
            For Organizations
          </Button>
        </div>
      </div>
    </section>
  );
}

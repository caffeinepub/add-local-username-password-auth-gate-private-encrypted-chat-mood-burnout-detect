import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';

export interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  
  return (
    <div className="flex justify-center items-center gap-2 mb-8" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps} aria-label={`Step ${currentStep} of ${totalSteps}`}>
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={`h-1.5 rounded-full transition-all ${
            prefersReducedMotion ? '' : 'duration-500'
          } ${
            step === currentStep
              ? 'w-12 bg-accent'
              : step < currentStep
              ? 'w-8 bg-accent/50'
              : 'w-8 bg-muted'
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
